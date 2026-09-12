/**
 * Data layer for the crowdsourced English → Nuer pair contribution form
 * (ContributeDataPage). Two responsibilities:
 *
 *   1. previewAutoTranslation() — run the site's own English→Nuer engine
 *      (the same one Studio's translator uses, see services/translate.js)
 *      so a contributor can see today's automatic output and correct it,
 *      the same way they could paste in Google Translate's output and
 *      flag it as wrong.
 *   2. submitContribution() — send one submission to the `submit-contribution`
 *      Edge Function, which validates, sanitizes, rate-limits, and writes
 *      it with the service_role key. The browser's anon key has NO direct
 *      write access to the translation_contributions table at all (see
 *      supabase/schema.sql) — this function call is the only path in.
 */
import { supabase, isSupabaseConfigured } from "./supabase.js";
import { translateText } from "./translate.js";

/**
 * Best-effort preview of what the current automatic translator produces for
 * an English sentence, so a contributor can judge whether it's good enough
 * or needs correcting. Never throws — a failure just means no preview.
 * @param {string} englishText
 * @returns {Promise<{ text: string, engine: string } | null>}
 */
export async function previewAutoTranslation(englishText) {
  const text = String(englishText || "").trim();
  if (!text) return null;
  try {
    const result = await translateText(text, "en-to-nus");
    if (!result?.text?.trim()) return null;
    return { text: result.text, engine: result.engine || "auto" };
  } catch {
    return null;
  }
}

/**
 * @param {{
 *   englishText: string,
 *   nuerText: string,
 *   isCorrection: boolean,
 *   autoTranslation: string,
 *   dialect: string,
 *   notes: string,
 *   contributorName: string,
 *   contributorEmail: string,
 *   isNativeSpeaker: boolean,
 *   creditContributor: boolean,
 *   formOpenedAt: number,   // Date.now() from when the form was rendered —
 *                           // used server-side as a simple bot-timing check
 *   website: string,        // honeypot field — must stay empty; a real
 *                           // visitor never sees or fills this input
 * }} pair
 */
export async function submitContribution(pair) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      "Submissions aren't connected yet — this deploy is missing its Supabase configuration."
    );
  }

  const { data, error } = await supabase.functions.invoke("submit-contribution", {
    body: {
      englishText: pair.englishText.trim(),
      nuerText: pair.nuerText.trim(),
      isCorrection: Boolean(pair.isCorrection),
      autoTranslation: pair.autoTranslation?.trim() || "",
      dialect: pair.dialect?.trim() || "",
      notes: pair.notes?.trim() || "",
      contributorName: pair.contributorName?.trim() || "",
      contributorEmail: pair.contributorEmail?.trim() || "",
      isNativeSpeaker: Boolean(pair.isNativeSpeaker),
      creditContributor: Boolean(pair.creditContributor),
      formOpenedAt: pair.formOpenedAt,
      website: pair.website || "",
    },
  });

  if (error) {
    // supabase-js surfaces a generic "Edge Function returned a non-2xx
    // status code" here; the real message is on the response body when the
    // function returned valid JSON with an `error` field.
    const message = data?.error || error.message || "Something went wrong sending that.";
    throw new Error(message);
  }
  if (data?.error) {
    throw new Error(data.error);
  }

  return data;
}
