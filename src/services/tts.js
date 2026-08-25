// Nuer and Dinka text-to-speech — powered by Meta's MMS (Massively Multilingual Speech)
// Models: facebook/mms-tts-nus (Nuer) and facebook/mms-tts-din (Dinka)
// Backend: Hugging Face Inference API
//
// No Google. No browser fallback. Strictly Meta MMS.

const HF_INFERENCE_BASE = "https://api-inference.huggingface.co/models";

const MMS_MODELS = {
  nus: "facebook/mms-tts-nus",
  din: "facebook/mms-tts-din",
};

// Optional — set VITE_HF_TOKEN in .env to raise rate limits
const HF_TOKEN = import.meta.env?.VITE_HF_TOKEN;

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
    if (response.status === 503) {
      let wait = 20;
      try {
        const body = await response.json();
        if (body?.estimated_time) wait = Math.ceil(body.estimated_time);
      } catch { /* ignore */ }
      throw new Error(`MMS ${lang} model is warming up — try again in about ${wait}s.`);
    }
    throw new Error(`Meta MMS request failed (${response.status}).`);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

/**
 * Synthesize speech using Meta's MMS models.
 * @param {string} text - Text to speak.
 * @param {string} lang - 'nus' (Nuer) | 'din' (Dinka)
 * @returns {Promise<string>} Object URL for playable audio.
 */
export async function synthesizeSpeech(text, lang = "nus") {
  if (!MMS_MODELS[lang]) throw new Error(`Unsupported TTS language: ${lang}`);
  return callMmsModel(lang, text);
}
