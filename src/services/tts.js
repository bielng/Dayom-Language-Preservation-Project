import { Client } from "@gradio/client";
import { TTS } from "../config/site.js";

/* ────────────────  CONFIG  ──────────────── */
const HF_INFERENCE_URL = "https://api-inference.huggingface.co/models";

const NUER_SPACE =
  TTS.spaces?.nus || "dayomtechnologies/Text_To_Speech_Thok_Naath";
const DINKA_SPACE =
  TTS.spaces?.din || "dayomtechnologies/Text_To_Speech_Thok_Naath";

const REQUEST_TIMEOUT_MS = 25_000; // Gradio Spaces can be slow to wake
const INFERENCE_TIMEOUT_MS = 20_000;

let nuerClientPromise = null;
let dinkaClientPromise = null;

/* ────────────────  HELPERS  ──────────────── */
function getNuerClient() {
  if (!nuerClientPromise) nuerClientPromise = Client.connect(NUER_SPACE);
  return nuerClientPromise;
}
function getDinkaClient() {
  if (!dinkaClientPromise) dinkaClientPromise = Client.connect(DINKA_SPACE);
  return dinkaClientPromise;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithTimeout(url, opts, ms) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } finally {
    clearTimeout(id);
  }
}

/* ────────────────  INFERENCE API FALLBACK  ──────────────── */
// Used only when the Gradio Space fails completely.
async function inferenceTTS(text, modelId) {
  console.log("[TTS] Fallback to Inference API:", modelId);
  const res = await fetchWithTimeout(
    `${HF_INFERENCE_URL}/${modelId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: text }),
    },
    INFERENCE_TIMEOUT_MS,
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Inference API ${res.status}: ${body.slice(0, 200)}`);
  }
  const blob = await res.blob();
  if (!blob.size) throw new Error("Inference API returned empty audio.");
  return URL.createObjectURL(blob);
}

/* ────────────────  GRADIO SPACE TTS  ──────────────── */
async function spaceTTS(text, lang) {
  const client =
    lang === "nus" ? await getNuerClient() : await getDinkaClient();
  console.log("[TTS] Calling Gradio Space /synthesize for", lang);

  const result = await client.predict("/synthesize", {
    text: text.trim(),
    seed: 42,
  });

  console.log("[TTS] Gradio raw result:", result);

  // Gradio client v2 returns data in result.data as an array.
  // Each output can be: string URL, {url, path, name}, or a FileBlob.
  const outputs = result?.data ?? [];
  console.log("[TTS] Gradio outputs array:", outputs);

  // Try every known shape until we find a playable URL
  for (const item of outputs) {
    if (!item) continue;

    // Shape 1: plain string URL
    if (typeof item === "string" && item.startsWith("http")) {
      console.log("[TTS] Found string URL:", item);
      return item;
    }

    // Shape 2: object with url / path / name
    if (typeof item === "object") {
      const url = item.url || item.path || item.name;
      if (url) {
        console.log("[TTS] Found object URL:", url);
        return url;
      }
    }
  }

  throw new Error("Gradio Space returned audio in an unrecognized format.");
}

/* ────────────────  PUBLIC API  ──────────────── */

/**
 * Browser-native speech synthesis — English ONLY.
 */
export function speakEnglish(text) {
  return new Promise((resolve, reject) => {
    if (!("speechSynthesis" in window)) {
      reject(new Error("Browser does not support speech synthesis."));
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.9;
    u.onend = resolve;
    u.onerror = (e) => reject(new Error(`Speech error: ${e.error}`));
    window.speechSynthesis.speak(u);
  });
}

/**
 * Synthesize Nuer or Dinka speech.
 *  1. Try the fine-tuned HF Space (best quality)
 *  2. If that fails, fall back to the raw HF Inference API (robotic but works)
 *  3. If BOTH fail, throw a clear error.
 */
export async function synthesizeSpeech(text, lang = "nus") {
  if (!text || !text.trim()) throw new Error("No text provided.");
  const clean = text.trim();

  // ── Nuer ──
  if (lang === "nus") {
    try {
      return await spaceTTS(clean, "nus");
    } catch (spaceErr) {
      console.warn("[TTS] Nuer Space failed:", spaceErr.message);
      try {
        return await inferenceTTS(clean, TTS.models.nus);
      } catch (infErr) {
        console.warn("[TTS] Nuer Inference fallback failed:", infErr.message);
        throw new Error(
          "Nuer voice is unavailable right now. The model may be waking up — try again in 20 seconds.",
        );
      }
    }
  }

  // ── Dinka ──
  if (lang === "din") {
    try {
      return await spaceTTS(clean, "din");
    } catch (spaceErr) {
      console.warn("[TTS] Dinka Space failed:", spaceErr.message);
      // Dinka Space is a placeholder pointing to Nuer — if it fails,
      // try the base MMS model via Inference API as fallback.
      try {
        return await inferenceTTS(clean, TTS.models.din);
      } catch (infErr) {
        console.warn("[TTS] Dinka Inference fallback failed:", infErr.message);
        throw new Error(
          "Dinka voice is not available yet. A dedicated model is coming soon.",
        );
      }
    }
  }

  throw new Error(`Unsupported TTS language: ${lang}`);
}

export function isTTSSupported(lang) {
  return lang === "nus" || lang === "din" || lang === "en";
}
