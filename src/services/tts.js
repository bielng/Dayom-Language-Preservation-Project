import { Client } from "@gradio/client";

// Hugging Face Space endpoints
const NUER_TTS_SPACE = "dayomtechnologies/Text_To_Speech_Thok_Naath";
const DINKA_TTS_SPACE = "Alaak/Dinka_Text_To_Speech";

let nuerClientPromise = null;
let dinkaClientPromise = null;

function getNuerClient() {
  if (!nuerClientPromise) nuerClientPromise = Client.connect(NUER_TTS_SPACE);
  return nuerClientPromise;
}

function getDinkaClient() {
  if (!dinkaClientPromise) dinkaClientPromise = Client.connect(DINKA_TTS_SPACE);
  return dinkaClientPromise;
}

async function callGradioSpace(clientPromise, text, seed = 42) {
  const client = await clientPromise;
  const result = await client.predict("/synthesize", { text, seed });
  const audioData = result?.data?.[0];
  const url = audioData?.url || audioData?.path;
  if (!url) throw new Error("No audio returned from TTS model.");
  return url;
}

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
 * Synthesize speech from text.
 * @param {string} text
 * @param {string} lang  - 'nus' | 'din' | 'en'
 * @param {number} seed  - Nuer/Dinka Gradio seed (default 42)
 * @returns {Promise<string|null>} Audio URL for nus/din; null for en
 */
export async function synthesizeSpeech(text, lang = "nus", seed = 42) {
  if (!text || !text.trim()) throw new Error("No text provided.");

  switch (lang) {
    case "nus":
      return callGradioSpace(getNuerClient(), text.trim(), seed);
    case "din":
      return callGradioSpace(getDinkaClient(), text.trim(), seed);
    case "en":
      await speakEnglish(text.trim());
      return null;
    default:
      throw new Error(`Unsupported TTS language: ${lang}`);
  }
}

export function isTTSSupported(lang) {
  return ["nus", "din", "en"].includes(lang);
}
