// Small, self-contained Nuer & Dinka phrase base for the Chat Assistant demo.
// This mirrors the retrieval-style approach used across Dayom Lab's tools:
// only return attested phrases from the bundled list, and say so when there's no match.

const ENTRIES = [
  { en: "hello", nus: "Malɛ!", din: "Maloŋ!", topic: "greetings" },
  { en: "how are you", nus: "Tëë di̱ kɛ ji̱?", din: "Cïï yïn nɔŋ?", topic: "greetings" },
  { en: "good morning", nus: "Ci̱ baak kɛ mal!", din: "Ee akölic apuruou!", topic: "greetings" },
  { en: "thank you", nus: "Ɛlɔ̱ɔ̱ŋ", din: "Yin lëk apath", topic: "courtesy" },
  { en: "yes", nus: "Ɛɛ", din: "Ee", topic: "basics" },
  { en: "no", nus: "Cha̱", din: "Acïn", topic: "basics" },
  { en: "water", nus: "Pi̱i̱", din: "Piu", topic: "vocabulary" },
  { en: "woman", nus: "Ci̱ek", din: "Tik", topic: "vocabulary" },
  { en: "man", nus: "Wut", din: "Mony", topic: "vocabulary" },
  { en: "child", nus: "Gaat", din: "Meth", topic: "vocabulary" },
  { en: "cattle", nus: "Ɣök", din: "Wëëŋ", topic: "vocabulary" },
  { en: "food", nus: "Miëth", din: "Cam", topic: "vocabulary" },
  { en: "sun", nus: "Chäŋ", din: "Akol", topic: "vocabulary" },
  { en: "house", nus: "Dhöl", din: "Baai", topic: "vocabulary" },
  { en: "friend", nus: "Mat", din: "Mëth", topic: "vocabulary" },
  { en: "what is your name", nus: "Ŋa ri̱n?", din: "Ee rin de yin?", topic: "conversation" },
  { en: "i am fine", nus: "Ɣän cë piɛ̈th", din: "Ye pial", topic: "conversation" },
  { en: "goodbye", nus: "Bä lɔc", din: "Cool", topic: "greetings" },
];

export const CHAT_STARTERS = [
  "How do I say hello in Nuer?",
  "What is 'water' in Dinka?",
  "Teach me a Nuer greeting",
  "What languages do you support?",
];

function normalise(value = "") {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findEntry(question) {
  const q = normalise(question);
  return ENTRIES.find((entry) => q.includes(normalise(entry.en)));
}

function wantsDinka(question) {
  return /dinka|thu[oö]ŋj[aä]ŋ/i.test(question);
}
function wantsNuer(question) {
  return /nuer|naath|thok/i.test(question);
}

export async function askDayomAi(question) {
  await new Promise((resolve) => setTimeout(resolve, 350)); // small delay so the UI feels alive

  const trimmed = question.trim();
  if (!trimmed) {
    return { text: "Ask me a word or phrase you'd like in Nuer or Dinka.", sources: [] };
  }

  if (/^(what languages|which languages)/i.test(trimmed)) {
    return {
      text: "I currently cover a small starter set of **Nuer (Thok Naath)** and **Dinka (Thuɔŋjäŋ)** words and phrases. For anything longer, try the **Text Translation** tool in the Studio nav.",
      sources: [],
    };
  }

  const entry = findEntry(trimmed);
  if (entry) {
    if (wantsDinka(trimmed) && !wantsNuer(trimmed)) {
      return { text: `**"${entry.en}"** in Dinka is **"${entry.din}"**.`, sources: [entry.topic] };
    }
    if (wantsNuer(trimmed) && !wantsDinka(trimmed)) {
      return { text: `**"${entry.en}"** in Nuer is **"${entry.nus}"**.`, sources: [entry.topic] };
    }
    return {
      text: `**"${entry.en}"**\n· Nuer: **${entry.nus}**\n· Dinka: **${entry.din}**`,
      sources: [entry.topic],
    };
  }

  return {
    text: "I don't have a verified phrase for that in my local knowledge base yet. Try the **Text Translation** tool for a broader translation, or ask me about a common word like \"water\", \"hello\", or \"thank you\".",
    sources: [],
  };
}
