// Nuer and Dinka text-to-speech — both run on the same provider: Meta's MMS
// (Massively Multilingual Speech) project. Meta trains one VITS checkpoint
// per language, so "one service" here means one call path (the Hugging Face
// Inference API) parameterised by model id, rather than two different custom
// backends with different reliability characteristics.
//
//   nus (Nuer)  -> facebook/mms-tts-nus
//   din (Dinka) -> facebook/mms-tts-din
//
// Docs: https://huggingface.co/facebook/mms-tts

const HF_INFERENCE_BASE = "https://api-inference.huggingface.co/models";

const MMS_MODELS = {
  nus: "facebook/mms-tts-nus",
  din: "facebook/mms-tts-din",
};

// Optional — set VITE_HF_TOKEN in the environment to raise the free-tier
// rate limit. The Inference API works unauthenticated too, just with a
// lower ceiling and a higher chance of a cold-start wait on first use.
const HF_TOKEN = import.meta.env?.VITE_HF_TOKEN;

let audioCtx = null;

async function callMmsModel(lang, text) {
  const model = MMS_MODELS[lang];
  if (!model) throw new Error(`Unsupported TTS language: ${lang}`);

  const headers = { "Content-Type": "application/json" };
  if (HF_TOKEN) headers.Authorization = `Bearer ${HF_TOKEN}`;

  const response = await fetch(`${HF_INFERENCE_BASE}/${model}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ inputs: text }),
  });

  if (!response.ok) {
    // HF returns 503 with an estimated_time while a cold model spins up.
    if (response.status === 503) {
      let wait = 20;
      try {
        const body = await response.json();
        if (body?.estimated_time) wait = Math.ceil(body.estimated_time);
      } catch {
        /* ignore parse failure, use default wait */
      }
      throw new Error(`MMS ${lang} model is warming up — try again in about ${wait}s.`);
    }
    throw new Error(`Meta MMS request failed (${response.status}).`);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

/**
 * Synthesize speech from text using Meta's MMS models — the single, unified
 * backend for both Nuer and Dinka.
 * @param {string} text - Text to speak.
 * @param {string} lang - 'nus' | 'din'
 * @returns {Promise<string>} Playable (object URL) audio.
 */
export async function synthesizeSpeech(text, lang = "nus") {
  if (!MMS_MODELS[lang]) throw new Error(`Unsupported TTS language: ${lang}`);
  return callMmsModel(lang, text);
}

/**
 * Browser-native speech synthesis for any language.
 * Best for English; limited voice quality for Nuer/Dinka. Kept only as a
 * last-resort fallback if Meta MMS is unreachable.
 * @param {string} text - Text to speak.
 * @param {string} lang - BCP-47 language tag.
 */
export function speakWithBrowser(text, lang = "en-US") {
  return new Promise((resolve, reject) => {
    if (!("speechSynthesis" in window)) {
      reject(new Error("Browser does not support speech synthesis."));
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.onend = resolve;
    utterance.onerror = reject;
    window.speechSynthesis.speak(utterance);
  });
}

// Kept for API-parity with earlier versions of this module; unused now that
// output plays directly from the object URL returned above.
export function _closeAudioContext() {
  audioCtx?.close();
  audioCtx = null;
}
