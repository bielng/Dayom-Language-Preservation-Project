// supabase/functions/submit-contribution/index.ts
//
// The ONLY way a row ever lands in `translation_contributions`. The browser
// never talks to that table directly (see supabase/schema.sql — anon has no
// grants on it at all). Instead it calls this function with the public anon
// key, which is fine, because everything that matters happens in here on
// the server: validation, sanitization, a honeypot + timing check, and a
// per-IP rate limit — all before writing with the service_role key, which
// never leaves this server-side runtime.
//
// Deploy with:
//   supabase functions deploy submit-contribution
//
// Local test:
//   supabase functions serve submit-contribution
//
// Env vars (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected
// automatically by the Supabase platform for every Edge Function — you do
// not set them yourself). Set ALLOWED_ORIGIN yourself:
//   supabase secrets set ALLOWED_ORIGIN=https://dayom.org

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
// Comma-separated list of allowed origins, e.g.
// "https://dayom.org,https://www.dayom.org". Falls back to "*" only if
// unset, so local development isn't blocked — set this in production.
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGIN") || "*")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const MAX_LEN = {
  englishText: 2000,
  nuerText: 2000,
  dialect: 200,
  notes: 2000,
  autoTranslation: 2000,
  contributorName: 200,
  contributorEmail: 320,
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const RATE_LIMIT_PER_HOUR = 20;
const MIN_FILL_TIME_MS = 1500; // faster than this and it's almost certainly a bot

function corsHeaders(origin: string | null) {
  const allow =
    ALLOWED_ORIGINS.includes("*") || (origin && ALLOWED_ORIGINS.includes(origin))
      ? origin || "*"
      : ALLOWED_ORIGINS[0] || "null";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

// Strip control characters and collapse the kind of markup that has no
// business in a translation pair. React already escapes everything it
// renders, but sanitizing here means the *stored* data is clean too, for
// any future consumer (an export, a training pipeline, an admin tool) that
// might not be as careful.
function clean(value: unknown, maxLen: number): string | null {
  if (typeof value !== "string") return null;
  const stripped = value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "") // control chars
    .replace(/<[^>]*>/g, "") // strip any HTML tags outright
    .trim();
  if (!stripped) return null;
  return stripped.slice(0, maxLen);
}

function getClientIp(req: Request): string | null {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip");
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, origin);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400, origin);
  }

  // --- Bot defenses (checked before touching the database) -----------------
  // Honeypot: a hidden field real users never see or fill. Any value here
  // means a bot filled every field it found in the DOM.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    // Return a generic success so the bot doesn't learn its submission was
    // rejected and adapt — but don't write anything.
    return json({ ok: true, id: null }, 200, origin);
  }
  // Timing: a form that's submitted faster than a human could plausibly
  // read it and type a sentence is almost certainly scripted.
  const formOpenedAt = Number(body.formOpenedAt);
  if (Number.isFinite(formOpenedAt) && Date.now() - formOpenedAt < MIN_FILL_TIME_MS) {
    return json({ error: "Please take a moment before submitting." }, 400, origin);
  }

  // --- Validation + sanitization -------------------------------------------
  const englishText = clean(body.englishText, MAX_LEN.englishText);
  const nuerText = clean(body.nuerText, MAX_LEN.nuerText);
  const dialect = clean(body.dialect, MAX_LEN.dialect);
  const notes = clean(body.notes, MAX_LEN.notes);
  const autoTranslation = body.isCorrection ? clean(body.autoTranslation, MAX_LEN.autoTranslation) : null;
  const contributorEmailRaw = clean(body.contributorEmail, MAX_LEN.contributorEmail);
  const creditContributor = Boolean(body.creditContributor);
  const contributorName = creditContributor ? clean(body.contributorName, MAX_LEN.contributorName) : null;
  const isNativeSpeaker = body.isNativeSpeaker === true;
  const isCorrection = body.isCorrection === true;

  if (!englishText || englishText.length < 3) {
    return json({ error: "English sentence is missing or too short." }, 400, origin);
  }
  if (!nuerText) {
    return json({ error: "Nuer translation is missing." }, 400, origin);
  }
  if (!isNativeSpeaker) {
    return json(
      { error: "This form is for native Nuer speakers — please check that box to submit." },
      400,
      origin
    );
  }
  if (contributorEmailRaw && !EMAIL_RE.test(contributorEmailRaw)) {
    return json({ error: "That email address doesn't look right." }, 400, origin);
  }

  // --- Rate limiting (defense in depth — the DB trigger enforces the same
  // limit atomically; this check just lets us return a clean 429 message) --
  const ip = getClientIp(req);
  if (ip) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await admin
      .from("translation_contributions")
      .select("id", { count: "exact", head: true })
      .eq("ip_address", ip)
      .gte("created_at", oneHourAgo);

    if (!countError && (count ?? 0) >= RATE_LIMIT_PER_HOUR) {
      return json(
        { error: "You've submitted a lot of pairs in the last hour — please try again later." },
        429,
        origin
      );
    }
  }

  const userAgent = clean(req.headers.get("user-agent"), 500);

  const { data, error } = await admin
    .from("translation_contributions")
    .insert({
      english_text: englishText,
      nuer_text: nuerText,
      dialect,
      notes,
      is_correction: isCorrection,
      auto_translation: autoTranslation,
      contributor_name: contributorName,
      contributor_email: contributorEmailRaw,
      is_native_speaker: isNativeSpeaker,
      credit_contributor: creditContributor,
      ip_address: ip,
      user_agent: userAgent,
    })
    .select("id")
    .single();

  if (error) {
    // Rate-limit trigger fires as a Postgres exception with our custom
    // message — surface it as a 429 rather than a generic 500.
    const status = error.message?.includes("Rate limit exceeded") ? 429 : 500;
    return json({ error: status === 429 ? error.message : "Couldn't save that — please try again." }, status, origin);
  }

  return json({ ok: true, id: data?.id }, 200, origin);
});
