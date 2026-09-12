import { supabase, isSupabaseCorpusEnabled } from "./supabase.js";

const AUDIO_BUCKET = "phrasebook-audio";

/**
 * @param {string} path e.g. "audio/ID1_nom_sg_02.mp3" (as stored in
 *   phrasebook entries' audio_files array)
 * @returns {string} a playable URL — either a Supabase Storage public URL
 *   or the original static /public/audio path.
 */
export function resolveAudioUrl(path) {
  if (!path) return "";
  if (isSupabaseCorpusEnabled) {
    // Stored objects are uploaded without the leading "audio/" segment
    // (see scripts/seed-corpus.mjs), since the bucket itself is the
    // audio/ directory.
    const objectPath = path.replace(/^audio\//, "");
    const { data } = supabase.storage.from(AUDIO_BUCKET).getPublicUrl(objectPath);
    return data.publicUrl;
  }
  return `/${path}`;
}
