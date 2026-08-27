/**
 * Client for the fine-tuned Nuer chat assistant.
 *
 * Space: dayomtechnologies/Thok_Naath_Chatbot_Via_Pivot_Pipeline
 * Model: dayomtechnologies/llama32-3b-nuer-lora
 *
 * The Space runs on ZeroGPU. Raw HTTP calls to /gradio_api/call/chat return
 * `event: error` because they never acquire a GPU token, but @gradio/client
 * negotiates one automatically — so this must go through the client, not fetch.
 *
 * The reply is a pivot pipeline: the Nuer answer is the visible text, and the
 * English user message and English answer ride along in HTML comments:
 *
 *   Rɛy Nuer, deri jɛ lar i̱ "…"<!--EN_USER:…--><!--EN_BOT:…-->
 *
 * Note: /chat takes only `message`. There is no history parameter, so each
 * turn is independent — the model does not see earlier messages.
 */

import { Client } from "@gradio/client";
import { MT } from "../config/site.js";

const SPACE = MT.chat.space;

const CONNECT_TIMEOUT_MS = 30_000;
const PREDICT_TIMEOUT_MS = 90_000; // ZeroGPU queues behind other users

let clientPromise = null;

function withTimeout(promise, ms, message) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), ms);
    }),
  ]).finally(() => clearTimeout(timer));
}

function getClient() {
  if (!clientPromise) {
    clientPromise = withTimeout(
      Client.connect(SPACE),
      CONNECT_TIMEOUT_MS,
      "Timed out connecting to the Nuer chat model.",
    ).catch((err) => {
      clientPromise = null; // let the next attempt reconnect
      throw err;
    });
  }
  return clientPromise;
}

/** Wake the Space early so the first message does not pay the cold start. */
export function warmChat() {
  getClient().catch(() => {});
}

const EN_USER_RE = /<!--\s*EN_USER:([\s\S]*?)-->/;
const EN_BOT_RE = /<!--\s*EN_BOT:([\s\S]*?)-->/;

function parseReply(raw) {
  const text = typeof raw === "string" ? raw : (raw?.text ?? String(raw ?? ""));
  return {
    nuer: text.replace(/<!--[\s\S]*?-->/g, "").trim(),
    englishQuestion: text.match(EN_USER_RE)?.[1]?.trim() || null,
    english: text.match(EN_BOT_RE)?.[1]?.trim() || null,
  };
}

/**
 * Ask the fine-tuned assistant.
 * @param {string} message
 * @returns {Promise<{nuer: string, english: string|null,
 *   englishQuestion: string|null}>}
 * @throws if the Space is unreachable or returns nothing usable
 */
export async function askNuerModel(message) {
  const client = await getClient();
  const result = await withTimeout(
    client.predict("/chat", { message: message.trim() }),
    PREDICT_TIMEOUT_MS,
    "The Nuer chat model took too long to respond.",
  );

  const parsed = parseReply(result?.data?.[0]);
  if (!parsed.nuer && !parsed.english) {
    throw new Error("The Nuer chat model returned an empty reply.");
  }
  return parsed;
}
