import { TTS } from "../config/site.js";

/**
 * Nuer + Dinka text-to-speech, both on Meta's MMS (Massively Multilingual
 * Speech) checkpoints — facebook/mms-tts-nus and facebook/mms-tts-din —
 * called directly on the Hugging Face Inference API. One provider, one
 * code path, no Google/browser SpeechSynthesis fallback for either
 * language.
 */

const HF_INFERENCE_URL = "https://api-inference.huggingface.co/models";

// A hung request should fail loudly rather than spin forever.
const REQUEST_TIMEOUT_MS = 20_000;

// Cold checkpoints return a 503 with an estimated load time instead of
// audio. Auto-retry a couple of times (short, capped waits) before making
// the user click again.
const MAX_COLD_START_RETRIES = 2;
const MAX_COLD_START_WAIT_MS = 8_000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestMMS(model, text) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(`${HF_INFERENCE_URL}/${model}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: text }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(
        `MMS voice model timed out after ${REQUEST_TIMEOUT_MS / 1000}s — try again.`,
        { cause: err },
      );
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function callMMS(model, text, attempt = 0) {
  const res = await requestMMS(model, text);

  if (!res.ok) {
    if (res.status === 503) {
      let waitMs = 3000;
      try {
        const body = await res.json();
        if (body?.estimated_time) {
          waitMs = Math.min(
            Math.ceil(body.estimated_time * 1000),
            MAX_COLD_START_WAIT_MS,
          );
        }
      } catch {
        // no JSON body to read — keep the default wait
      }

      if (attempt < MAX_COLD_START_RETRIES) {
        await sleep(waitMs);
        return callMMS(model, text, attempt + 1);
      }

      throw new Error(
        `Meta MMS voice model is still warming up after ${attempt + 1} tries — try again in a moment.`,
      );
    }

    let detail = "";
    try {
      const body = await res.json();
      detail = body?.error ? ` (${body.error})` : "";
    } catch {
      // response wasn't JSON — nothing extra to add
    }
    throw new Error(`MMS TTS request failed: ${res.status}${detail}`);
  }

  const audioBlob = await res.blob();
  if (!audioBlob.size) throw new Error("No audio returned from the MMS model.");
  return URL.createObjectURL(audioBlob);
}

/**
 * Browser SpeechSynthesis, used ONLY for English playback (StudioTranslate's
 * "listen" button when the target language is English). Nuer and Dinka
 * never touch this path — they always go through callMMS above.
 */
export function speakEnglish(text) {
  return new Promise((resolve, reject) => {
    if (!("speechSynthesis" in window)) {
      reject(new Error("Browser does not support speech synthesis."));
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.onend = resolve;
    utterance.onerror = (e) => reject(new Error(`Speech error: ${e.error}`));
    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Synthesize speech from text using Meta's MMS models (Nuer/Dinka only).
 * Retries automatically on a cold-model 503 and times out a hung request —
 * callers only ever see a resolved audio URL or a final, user-facing Error.
 * @param {string} text
 * @param {string} lang - 'nus' (Nuer) | 'din' (Dinka)
 * @returns {Promise<string>} an object URL for the synthesized audio
 */
export async function synthesizeSpeech(text, lang = "nus") {
  if (!text || !text.trim()) throw new Error("No text provided.");

  const model = TTS.models[lang];
  if (!model) throw new Error(`Unsupported TTS language: ${lang}`);

  return callMMS(model, text.trim());
}

export function isTTSSupported(lang) {
  return Object.prototype.hasOwnProperty.call(TTS.models, lang);
}
