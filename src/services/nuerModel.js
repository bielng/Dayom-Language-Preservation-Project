/**
 * Client for the fine-tuned Nuer translation model.
 *
 * Served as a public Gradio Space (dayomtechnologies/English_to_Nuer_Translator,
 * wrapping the NLLB-600M English↔Nuer checkpoint), so the browser calls it
 * directly with no API key — the same arrangement as speech synthesis in tts.js.
 *
 * The Space runs on cpu-basic and sleeps when idle, so the first call after a
 * quiet period pays a cold start. Callers are expected to fall back to the
 * dataset pipeline when this throws.
 */

import { Client } from "@gradio/client";
import { MT } from "../config/site.js";

const SPACE = MT.spaces.nus;

const CONNECT_TIMEOUT_MS = 30_000;
// The Space queues under load, so the same sentence has been observed at 4s and
// at 19s. This is a per-sentence budget, not a whole-request one.
const PREDICT_TIMEOUT_MS = 75_000;

const DIRECTION_LABELS = {
  "en-to-nus": "English to Nuer",
  "nus-to-en": "Nuer to English",
};

/** Directions the fine-tuned model covers. */
export function modelSupports(direction) {
  return Object.hasOwn(DIRECTION_LABELS, direction);
}

let clientPromise = null;

function getClient() {
  if (!clientPromise) {
    clientPromise = withTimeout(
      Client.connect(SPACE),
      CONNECT_TIMEOUT_MS,
      "Timed out connecting to the Nuer translation model.",
    ).catch((err) => {
      clientPromise = null; // let the next attempt reconnect
      throw err;
    });
  }
  return clientPromise;
}

function withTimeout(promise, ms, message) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), ms);
    }),
  ]).finally(() => clearTimeout(timer));
}

/**
 * Open the connection early so an idle Space wakes while the user is still
 * typing. Safe to call repeatedly; failures are deliberately swallowed because
 * this is only an optimization.
 */
export function warmModel() {
  getClient().catch(() => {});
}

/**
 * Translate through the fine-tuned model.
 * @param {string} text
 * @param {"en-to-nus"|"nus-to-en"} direction
 * @returns {Promise<string>} the model's translation
 * @throws if the Space is unreachable, asleep, or returns nothing usable
 */
export async function translateWithModel(text, direction) {
  const label = DIRECTION_LABELS[direction];
  if (!label) throw new Error(`Model does not cover direction: ${direction}`);

  const client = await getClient();
  const result = await withTimeout(
    client.predict("/translate", { text: text.trim(), direction: label }),
    PREDICT_TIMEOUT_MS,
    "The Nuer translation model took too long to respond.",
  );

  const output = result?.data?.[0];
  if (typeof output !== "string" || !output.trim()) {
    throw new Error("The Nuer translation model returned an empty result.");
  }
  return output.trim();
}
