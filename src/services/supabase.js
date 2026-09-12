/**
 * Supabase client for the crowdsourced English–Nuer contribution form.
 *
 * Configuration comes from Vite env vars so no secret ever lives in source:
 *   VITE_SUPABASE_URL       — Project URL (Project Settings → API)
 *   VITE_SUPABASE_ANON_KEY  — Public "anon" key (safe for the browser; the
 *                             database's Row Level Security policy is what
 *                             actually limits it to insert-only — see
 *                             supabase/schema.sql)
 *
 * If either var is missing (e.g. a local checkout before setup, or a preview
 * deploy without secrets configured) `supabase` is null and the form shows a
 * "not configured yet" notice instead of throwing at import time.
 *
 * See docs/CONTRIBUTE_DATA_SETUP.md for the one-time Supabase project setup.
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    })
  : null;

/**
 * Separate, explicit opt-in for sourcing the Library/Dinka Library/
 * Phrasebook datasets and audio from Supabase instead of the static files
 * in public/data and public/audio.
 *
 * This is intentionally independent of `isSupabaseConfigured`: a deploy can
 * have the contribution form wired up (URL + anon key set) without having
 * run scripts/seed-corpus.mjs yet. Only flip VITE_SUPABASE_CORPUS=true once
 * the corpus tables and the phrasebook-audio storage bucket are actually
 * populated — otherwise every Library page would render empty.
 */
export const isSupabaseCorpusEnabled =
  isSupabaseConfigured && import.meta.env.VITE_SUPABASE_CORPUS === "true";
