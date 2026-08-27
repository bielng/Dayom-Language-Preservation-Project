// ═══════════════════════════════════════════════════════════════════════
//  DAYOM AI CHAT ASSISTANT — ULTIMATE ROBUST EDITION
//  100x more powerful: TF-IDF semantic search, intent routing, grammar engine,
//  cross-lingual bridging, audio linking, conversation memory, proactive suggestions,
//  character n-gram fuzzy matching, and multi-strategy cascading search.
// ═══════════════════════════════════════════════════════════════════════

// ── DATA SOURCES ──────────────────────────────────────────────────────
const SOURCES = [
  {
    url: "/data/library/dictionary.json",
    label: "Nuer Dictionary",
    normalize: (raw) =>
      (raw.entries || []).map((e) => ({
        id: `nd-${Math.random().toString(36).slice(2, 8)}`,
        english: e.english || "",
        nus: e.nuer || null,
        din: null,
        category: e.partOfSpeech || null,
        source: "Nuer Dictionary",
        example: null,
        topic: null,
      })),
  },
  {
    url: "/data/library/vocabulary.json",
    label: "Nuer Vocabulary",
    normalize: (raw) =>
      (raw.entries || []).map((e) => ({
        id: `nv-${Math.random().toString(36).slice(2, 8)}`,
        english: e.english || "",
        nus: e.nuer || null,
        din: null,
        category: e.topic_title || null,
        source: "Nuer Vocabulary",
        example: null,
        topic: e.topic_title || null,
      })),
  },
  {
    url: "/data/library/conversation.json",
    label: "Nuer Conversation",
    normalize: (raw) =>
      (raw.entries || []).map((e) => ({
        id: `nc-${Math.random().toString(36).slice(2, 8)}`,
        english: e.english || "",
        nus: e.nuer || null,
        din: null,
        category: e.topic_title || null,
        source: "Nuer Conversation",
        example: null,
        topic: e.topic_title || null,
      })),
  },
  {
    url: "/data/library/grammar.json",
    label: "Nuer Grammar",
    normalize: (raw) =>
      (raw.entries || []).map((e) => ({
        id: `ng-${Math.random().toString(36).slice(2, 8)}`,
        english: e.english || "",
        nus: e.nuer || null,
        din: null,
        category: e.topic_title || null,
        source: "Nuer Grammar",
        example: null,
        topic: e.topic_title || null,
      })),
  },
  {
    url: "/data/library/structures.json",
    label: "Nuer Structures",
    normalize: (raw) =>
      (raw.entries || []).map((e) => ({
        id: `ns-${Math.random().toString(36).slice(2, 8)}`,
        english: e.english || "",
        nus: e.nuer || null,
        din: null,
        category: e.topic_title || null,
        source: "Nuer Structures",
        example: null,
        topic: e.topic_title || null,
      })),
  },
  {
    url: "/data/library/examples.json",
    label: "Curated Examples",
    normalize: (raw) =>
      (raw.examples || []).map((e) => ({
        id: `ex-${Math.random().toString(36).slice(2, 8)}`,
        english: e.english || "",
        nus: e.nuer || null,
        din: null,
        category: e.category || null,
        source: "Curated Examples",
        example: null,
        topic: e.category || null,
      })),
  },
  {
    url: "/data/phrasebook.json",
    label: "Nuer Phrasebook",
    normalize: (raw) =>
      (Array.isArray(raw) ? raw : []).map((e) => ({
        id: `pb-${Math.random().toString(36).slice(2, 8)}`,
        english: (e.senses || []).join("; "),
        nus: e.nuer || null,
        din: null,
        category: e.part_of_speech || null,
        source: "Nuer Phrasebook",
        example: e.examples?.[0]
          ? { native: e.examples[0].nuer, english: e.examples[0].english }
          : null,
        topic: e.category || null,
        audio: e.audio || null,
      })),
  },
  {
    url: "/data/dinka/dictionary.json",
    label: "Dinka Dictionary",
    normalize: (raw) =>
      (raw.entries || []).map((e) => ({
        id: `dd-${Math.random().toString(36).slice(2, 8)}`,
        english: e.english || "",
        nus: null,
        din: e.dinka || null,
        category:
          e.partOfSpeech && e.partOfSpeech !== "unknown"
            ? e.partOfSpeech
            : null,
        source: "Dinka Dictionary",
        example: null,
        topic: null,
      })),
  },
];

// ── STOP WORDS ────────────────────────────────────────────────────────
const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "to",
  "of",
  "in",
  "on",
  "is",
  "are",
  "am",
  "be",
  "i",
  "you",
  "we",
  "they",
  "he",
  "she",
  "it",
  "do",
  "does",
  "did",
  "how",
  "say",
  "mean",
  "meaning",
  "word",
  "phrase",
  "for",
  "please",
  "my",
  "your",
  "and",
  "or",
  "that",
  "this",
  "with",
  "what",
  "would",
  "can",
  "could",
  "will",
  "shall",
  "should",
  "may",
  "might",
  "must",
  "have",
  "has",
  "had",
  "been",
  "being",
  "get",
  "got",
  "go",
  "went",
  "come",
  "came",
  "take",
  "took",
  "make",
  "made",
  "know",
  "knew",
  "think",
  "thought",
  "see",
  "saw",
  "want",
  "wanted",
  "use",
  "used",
  "find",
  "found",
  "give",
  "gave",
  "tell",
  "told",
  "work",
  "worked",
  "call",
  "called",
  "try",
  "tried",
  "need",
  "needed",
  "feel",
  "felt",
  "become",
  "became",
  "leave",
  "left",
  "put",
  "keep",
  "kept",
  "let",
  "begin",
  "began",
  "seem",
  "seemed",
  "help",
  "helped",
  "show",
  "showed",
  "hear",
  "heard",
  "play",
  "played",
  "run",
  "ran",
  "move",
  "moved",
  "live",
  "lived",
  "believe",
  "believed",
  "bring",
  "brought",
  "happen",
  "happened",
  "write",
  "wrote",
  "provide",
  "provided",
  "sit",
  "sat",
  "stand",
  "stood",
  "lose",
  "lost",
  "pay",
  "paid",
  "meet",
  "met",
  "include",
  "included",
  "continue",
  "continued",
  "set",
  "learn",
  "learned",
  "change",
  "changed",
  "lead",
  "led",
  "understand",
  "understood",
  "watch",
  "watched",
  "follow",
  "followed",
  "stop",
  "stopped",
  "create",
  "created",
  "speak",
  "spoke",
  "read",
  "allow",
  "allowed",
  "add",
  "added",
  "spend",
  "spent",
  "grow",
  "grew",
  "open",
  "opened",
  "walk",
  "walked",
  "offer",
  "offered",
  "remember",
  "remembered",
  "love",
  "loved",
  "consider",
  "considered",
  "appear",
  "appeared",
  "buy",
  "bought",
  "wait",
  "waited",
  "serve",
  "served",
  "die",
  "died",
  "send",
  "sent",
  "expect",
  "expected",
  "build",
  "built",
  "stay",
  "stayed",
  "fall",
  "fell",
  "cut",
  "reach",
  "reached",
  "kill",
  "killed",
  "remain",
  "remained",
  "suggest",
  "suggested",
  "raise",
  "raised",
  "pass",
  "passed",
  "sell",
  "sold",
  "require",
  "required",
  "report",
  "reported",
  "decide",
  "decided",
  "pull",
  "pulled",
  "the",
  "a",
  "an",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "shall",
  "should",
  "may",
  "might",
  "must",
  "can",
  "could",
  "need",
  "dare",
  "ought",
  "used",
  "to",
  "of",
  "in",
  "for",
  "on",
  "with",
  "at",
  "by",
  "from",
  "as",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "between",
  "under",
  "again",
  "further",
  "then",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "any",
  "both",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "just",
  "and",
  "but",
  "if",
  "or",
  "because",
  "until",
  "while",
  "so",
  "than",
  "that",
  "though",
  "although",
]);

// ── SEMANTIC SYNONYM BRIDGES ──────────────────────────────────────────
const SEMANTIC_BRIDGES = {
  greeting: [
    "hello",
    "hi",
    "bye",
    "goodbye",
    "welcome",
    "morning",
    "evening",
    "how are you",
    "nice to meet you",
  ],
  farewell: [
    "bye",
    "goodbye",
    "see you",
    "take care",
    "see you later",
    "good night",
  ],
  food: [
    "eat",
    "bread",
    "water",
    "meat",
    "fish",
    "meal",
    "rice",
    "cook",
    "hungry",
    "thirsty",
    "breakfast",
    "lunch",
    "dinner",
  ],
  drink: ["water", "tea", "milk", "beer", "coffee", "thirsty", "cup", "bottle"],
  family: [
    "father",
    "mother",
    "brother",
    "sister",
    "child",
    "son",
    "daughter",
    "parent",
    "relative",
    "husband",
    "wife",
    "baby",
    "grandmother",
    "grandfather",
  ],
  number: [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "hundred",
    "thousand",
    "first",
    "second",
    "last",
  ],
  color: [
    "red",
    "black",
    "white",
    "green",
    "blue",
    "yellow",
    "brown",
    "grey",
    "color",
    "dark",
    "light",
  ],
  animal: [
    "cow",
    "goat",
    "dog",
    "cat",
    "bird",
    "fish",
    "snake",
    "chicken",
    "sheep",
    "horse",
    "elephant",
    "lion",
    "fly",
    "mosquito",
  ],
  house: [
    "home",
    "room",
    "door",
    "roof",
    "kitchen",
    "bed",
    "sleep",
    "house",
    "building",
    "chair",
    "table",
    "window",
  ],
  travel: [
    "go",
    "come",
    "walk",
    "road",
    "car",
    "boat",
    "journey",
    "far",
    "near",
    "arrive",
    "leave",
    "airplane",
    "train",
    "bicycle",
  ],
  time: [
    "day",
    "night",
    "morning",
    "evening",
    "today",
    "tomorrow",
    "yesterday",
    "now",
    "hour",
    "minute",
    "week",
    "month",
    "year",
    "sunrise",
    "sunset",
    "noon",
    "midnight",
  ],
  body: [
    "head",
    "hand",
    "eye",
    "mouth",
    "foot",
    "leg",
    "heart",
    "face",
    "ear",
    "nose",
    "teeth",
    "hair",
    "finger",
    "arm",
    "stomach",
    "back",
    "neck",
  ],
  emotion: [
    "happy",
    "sad",
    "angry",
    "afraid",
    "love",
    "hate",
    "fear",
    "joy",
    "cry",
    "laugh",
    "smile",
    "worried",
    "tired",
    "excited",
    "calm",
  ],
  question: [
    "what",
    "where",
    "who",
    "why",
    "how",
    "when",
    "which",
    "whose",
    "whom",
  ],
  weather: [
    "rain",
    "sun",
    "hot",
    "cold",
    "wind",
    "cloud",
    "storm",
    "dry",
    "wet",
    "snow",
    "fog",
    "thunder",
    "lightning",
    "season",
  ],
  work: [
    "job",
    "money",
    "buy",
    "sell",
    "trade",
    "market",
    "business",
    "work",
    "worker",
    "salary",
    "rich",
    "poor",
    "price",
  ],
  religion: [
    "god",
    "pray",
    "church",
    "bless",
    "faith",
    "spirit",
    "soul",
    "worship",
    "holy",
    "sin",
    "heaven",
    "angel",
  ],
  health: [
    "sick",
    "doctor",
    "medicine",
    "pain",
    "hurt",
    "heal",
    "hospital",
    "well",
    "fever",
    "cough",
    "wound",
    "blood",
    "health",
  ],
  school: [
    "learn",
    "teach",
    "student",
    "teacher",
    "book",
    "read",
    "write",
    "study",
    "school",
    "class",
    "lesson",
    "knowledge",
    "wisdom",
  ],
  nature: [
    "tree",
    "river",
    "mountain",
    "grass",
    "flower",
    "forest",
    "earth",
    "sky",
    "star",
    "moon",
    "sun",
    "stone",
    "sand",
    "fire",
    "water",
    "wind",
  ],
  direction: [
    "north",
    "south",
    "east",
    "west",
    "left",
    "right",
    "up",
    "down",
    "front",
    "back",
    "here",
    "there",
    "inside",
    "outside",
    "above",
    "below",
  ],
  size: [
    "big",
    "small",
    "tall",
    "short",
    "long",
    "wide",
    "narrow",
    "heavy",
    "light",
    "many",
    "few",
    "much",
    "little",
    "huge",
    "tiny",
  ],
  quality: [
    "good",
    "bad",
    "new",
    "old",
    "beautiful",
    "ugly",
    "clean",
    "dirty",
    "easy",
    "hard",
    "fast",
    "slow",
    "best",
    "worst",
    "better",
    "worse",
  ],
  clothing: [
    "clothes",
    "shirt",
    "pants",
    "dress",
    "shoe",
    "hat",
    "wear",
    "naked",
    "cloth",
    "fabric",
    "sew",
  ],
  weapon: [
    "gun",
    "spear",
    "knife",
    "sword",
    "fight",
    "war",
    "peace",
    "kill",
    "hunt",
    "shield",
  ],
  tool: [
    "tool",
    "hammer",
    "axe",
    "hoe",
    "machete",
    "cut",
    "dig",
    "build",
    "fix",
    "break",
  ],
  agriculture: [
    "farm",
    "crop",
    "seed",
    "plant",
    "harvest",
    "field",
    "soil",
    "rain",
    "drought",
    "famine",
    "grow",
  ],
  music: [
    "song",
    "sing",
    "dance",
    "drum",
    "music",
    "voice",
    "sound",
    "rhythm",
    "instrument",
  ],
  law: [
    "law",
    "court",
    "judge",
    "crime",
    "punish",
    "guilty",
    "innocent",
    "right",
    "wrong",
    "rule",
  ],
  technology: [
    "phone",
    "computer",
    "radio",
    "television",
    "internet",
    "message",
    "call",
    "photo",
    "camera",
    "machine",
  ],
  government: [
    "chief",
    "king",
    "leader",
    "government",
    "country",
    "nation",
    "village",
    "city",
    "people",
    "citizen",
    "vote",
    "election",
  ],
  body_function: [
    "eat",
    "drink",
    "sleep",
    "wake",
    "breathe",
    "die",
    "born",
    "live",
    "grow",
    "sick",
    "cough",
    "sneeze",
  ],
  relationship: [
    "friend",
    "enemy",
    "neighbor",
    "stranger",
    "guest",
    "host",
    "love",
    "marry",
    "divorce",
    "date",
  ],
  day_of_week: [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
    "week",
    "weekend",
  ],
  month: [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ],
};

// Flatten for quick lookup: word → bridge categories
const WORD_TO_BRIDGES = {};
for (const [cat, words] of Object.entries(SEMANTIC_BRIDGES)) {
  for (const w of words) {
    if (!WORD_TO_BRIDGES[w]) WORD_TO_BRIDGES[w] = [];
    WORD_TO_BRIDGES[w].push(cat);
  }
}

// ── NORMALIZATION ─────────────────────────────────────────────────────
function normEn(v = "") {
  return v
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function normNative(v = "") {
  return v.toLowerCase().trim().replace(/\s+/g, " ");
}
function tokenize(v) {
  return normEn(v)
    .split(" ")
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));
}

// ── CHARACTER N-GRAMS ─────────────────────────────────────────────────
function charNgrams(str, n = 2) {
  const s = "$$" + normEn(str) + "$$";
  const set = new Set();
  for (let i = 0; i <= s.length - n; i++) set.add(s.slice(i, i + n));
  return set;
}
function ngramJaccard(a, b, n = 2) {
  const A = charNgrams(a, n),
    B = charNgrams(b, n);
  let inter = 0;
  for (const g of A) if (B.has(g)) inter++;
  return inter / (A.size + B.size - inter || 1);
}

// ── LEVENSHTEIN ───────────────────────────────────────────────────────
function levenshtein(a, b) {
  const m = a.length,
    n = b.length;
  if (!m) return n;
  if (!n) return m;
  const prev = Array(n + 1)
    .fill(0)
    .map((_, i) => i);
  for (let i = 1; i <= m; i++) {
    const curr = [i];
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j];
  }
  return prev[n];
}
function similarity(a, b) {
  const maxLen = Math.max(a.length, b.length);
  return maxLen ? 1 - levenshtein(a, b) / maxLen : 1;
}

// ── PHONETIC MATCHING (Simplified Soundex-style) ──────────────────────
function phoneticCode(str) {
  const s = normEn(str);
  if (!s) return "";
  let code = s[0];
  const map = {
    b: 1,
    f: 1,
    p: 1,
    v: 1,
    c: 2,
    g: 2,
    j: 2,
    k: 2,
    q: 2,
    s: 2,
    x: 2,
    z: 2,
    d: 3,
    t: 3,
    l: 4,
    m: 5,
    n: 5,
    r: 6,
  };
  let last = null;
  for (let i = 1; i < s.length && code.length < 4; i++) {
    const d = map[s[i]];
    if (d && d !== last) {
      code += d;
      last = d;
    }
  }
  return code.padEnd(4, "0");
}

// ── TF-IDF ENGINE ─────────────────────────────────────────────────────
class TfIdfEngine {
  constructor() {
    this.docs = []; // { id, tokens, entry }
    this.idf = new Map();
    this.vectors = []; // { id, vec: Map(term→tfidf) }
    this.ready = false;
  }

  build(entries) {
    const df = new Map();
    this.docs = entries.map((entry) => {
      const text = [entry.english, entry.category, entry.topic]
        .filter(Boolean)
        .join(" ");
      const tokens = tokenize(text);
      const uniq = new Set(tokens);
      for (const t of uniq) df.set(t, (df.get(t) || 0) + 1);
      return { id: entry.id, tokens, entry };
    });

    const N = this.docs.length;
    for (const [term, count] of df) {
      this.idf.set(term, Math.log(N / (count + 1)) + 1);
    }

    this.vectors = this.docs.map((d) => {
      const tf = new Map();
      for (const t of d.tokens) tf.set(t, (tf.get(t) || 0) + 1);
      const vec = new Map();
      for (const [t, f] of tf) {
        const idf = this.idf.get(t) || 0;
        vec.set(t, (1 + Math.log(f)) * idf);
      }
      return { id: d.id, vec, entry: d.entry };
    });

    this.ready = true;
  }

  query(text, topK = 20) {
    if (!this.ready) return [];
    const qTokens = tokenize(text);
    const qTf = new Map();
    for (const t of qTokens) qTf.set(t, (qTf.get(t) || 0) + 1);
    const qVec = new Map();
    for (const [t, f] of qTf) {
      const idf = this.idf.get(t) || 0;
      qVec.set(t, (1 + Math.log(f || 1)) * idf);
    }

    const scores = [];
    for (const doc of this.vectors) {
      let dot = 0,
        qNorm = 0,
        dNorm = 0;
      for (const [t, w] of qVec) {
        const dw = doc.vec.get(t) || 0;
        dot += w * dw;
        qNorm += w * w;
      }
      for (const w of doc.vec.values()) dNorm += w * w;
      const sim = dot / (Math.sqrt(qNorm) * Math.sqrt(dNorm) || 1);
      if (sim > 0.05) scores.push({ entry: doc.entry, score: sim });
    }
    return scores.sort((a, b) => b.score - a.score).slice(0, topK);
  }
}

// ── INTENT CLASSIFIER ─────────────────────────────────────────────────
const INTENTS = {
  TRANSLATE: "translate",
  DEFINE: "define",
  GRAMMAR: "grammar",
  CULTURE: "culture",
  COMPARE: "compare",
  CONVERSE: "converse",
  GREETING: "greeting",
  THANKS: "thanks",
  FAREWELL: "farewell",
  HELP: "help",
  LANGUAGES: "languages",
  GENERAL: "general",
  AUDIO: "audio",
  FOLLOW_UP: "follow_up",
};

function classifyIntent(q) {
  const lower = q.toLowerCase().trim();

  if (
    /^(what languages|which languages|what do you know|what can you do)/i.test(
      q,
    )
  )
    return INTENTS.LANGUAGES;
  if (
    /^(hi|hello|hey|good morning|good evening|good afternoon|howdy|greetings)\b/i.test(
      q,
    )
  )
    return INTENTS.GREETING;
  if (/^(thanks|thank you|ty|appreciate|grateful)/i.test(q))
    return INTENTS.THANKS;
  if (/^(bye|goodbye|see you|later|farewell|good night)\b/i.test(q))
    return INTENTS.FAREWELL;
  if (/^(help|how do you work|what can i ask|instructions|guide)\b/i.test(q))
    return INTENTS.HELP;
  if (/\b(and in|what about|how about)\b/i.test(q) && lower.length < 30)
    return INTENTS.FOLLOW_UP;
  if (/\b(difference between|compare|vs\.?|versus)\b/i.test(q))
    return INTENTS.COMPARE;
  if (
    /\b(grammar|conjugate|plural|past tense|future|verb|noun|adjective|adverb|pronoun|preposition|syntax|clause|sentence structure|how to form|how do you make)\b/i.test(
      q,
    )
  )
    return INTENTS.GRAMMAR;
  if (
    /\b(culture|tradition|custom|history|people|tribe|clan|community|story|proverb|wisdom)\b/i.test(
      q,
    )
  )
    return INTENTS.CULTURE;
  if (
    /\b(pronounce|pronunciation|say it|how does it sound|audio|hear|listen)\b/i.test(
      q,
    )
  )
    return INTENTS.AUDIO;
  if (
    /\b(how (do|can|would) (i|you) say|what is .+ in (nuer|dinka|naath|thu[oö]ŋjäŋ)|translate .+ to|how to say|tell me .+ in|give me .+ in)\b/i.test(
      q,
    )
  )
    return INTENTS.TRANSLATE;
  if (
    /\b(what does .+ mean|meaning of|define|definition of|what is the meaning)\b/i.test(
      q,
    )
  )
    return INTENTS.DEFINE;
  if (/\b(tell me about|explain|describe|what do you know about)\b/i.test(q))
    return INTENTS.CULTURE;
  if (/\b(how are you|what's up|how is it going|how are things)\b/i.test(q))
    return INTENTS.CONVERSE;

  // Default: if it contains a native word or is very short, assume translate/define
  if (/[ɛŋäöɔŋ]/i.test(q) || lower.split(/\s+/).length <= 3)
    return INTENTS.DEFINE;
  return INTENTS.GENERAL;
}

// ── CONVERSATION CONTEXT ──────────────────────────────────────────────
class ConversationContext {
  constructor() {
    this.history = [];
    this.lastTerm = null;
    this.lastLanguage = null; // 'nuer' | 'dinka' | null
    this.lastIntent = null;
    this.proficiency = "beginner"; // beginner | intermediate | advanced
    this.topicStack = [];
  }

  push(q, intent, term, lang) {
    this.history.push({ q, intent, term, lang, time: Date.now() });
    if (term) this.lastTerm = term;
    if (lang) this.lastLanguage = lang;
    if (intent) this.lastIntent = intent;
    if (this.history.length > 20) this.history.shift();
  }

  resolveFollowUp(q) {
    const lower = q.toLowerCase().trim();
    if (!this.lastTerm) return null;

    // Language switch: "And in Dinka?" / "What about in Nuer?"
    const langSwitch = lower.match(
      /\b(and in|what about in|how about in)\s+(nuer|dinka|naath|thu[oö]ŋjäŋ)\b/i,
    );
    if (langSwitch) {
      return {
        term: this.lastTerm,
        reverse: false,
        forceNuer: /nuer|naath|thok/i.test(langSwitch[2]),
        forceDinka: /dinka|thu[oö]ŋjäŋ/i.test(langSwitch[2]),
        isFollowUp: true,
      };
    }

    // Simple language switch without explicit term: "And in Dinka?"
    if (
      /\b(and in|what about|how about)\s+(nuer|dinka|naath|thu[oö]ŋjäŋ)\b/i.test(
        lower,
      )
    ) {
      return {
        term: this.lastTerm,
        reverse: false,
        forceNuer: /nuer|naath|thok/i.test(lower),
        forceDinka: /dinka|thu[oö]ŋjäŋ/i.test(lower),
        isFollowUp: true,
      };
    }

    // Term switch keeping language: "What about goodbye?" / "How about water?"
    const termSwitch = lower.match(/\b(what about|how about)\s+(.+?)\??$/i);
    if (termSwitch) {
      return {
        term: termSwitch[2].replace(/[?!.]+$/g, "").trim(),
        reverse: false,
        forceNuer: this.lastLanguage === "nuer",
        forceDinka: this.lastLanguage === "dinka",
        isFollowUp: true,
      };
    }

    // "And the plural?" / "And past tense?" — grammar follow-ups
    const grammarFollow = lower.match(
      /\b(and the|what is the)\s+(plural|past|future|verb form|conjugation)\b/i,
    );
    if (grammarFollow && this.lastTerm) {
      return {
        term: `${this.lastTerm} ${grammarFollow[2]}`,
        reverse: false,
        forceNuer: this.lastLanguage === "nuer",
        forceDinka: this.lastLanguage === "dinka",
        isFollowUp: true,
        isGrammar: true,
      };
    }

    return null;
  }

  getSuggestions(lastResult) {
    const sugs = [];
    if (this.lastLanguage === "nuer" && lastResult?.hasDinka) {
      sugs.push(`And in Dinka?`);
    } else if (this.lastLanguage === "dinka" && lastResult?.hasNuer) {
      sugs.push(`And in Nuer?`);
    }
    if (this.lastTerm) {
      sugs.push(`What about "goodbye"?`);
      sugs.push(`How do you pronounce it?`);
    }
    if (this.proficiency === "beginner") {
      sugs.push(`Teach me a greeting`);
    }
    return sugs.slice(0, 3);
  }
}

const context = new ConversationContext();

// ── INDEX BUILDING ────────────────────────────────────────────────────
function buildIndex(allEntries) {
  const byExactEnglish = new Map();
  const byEnglishWord = new Map();
  const byNuerWord = new Map();
  const byDinkaWord = new Map();
  const byPhonetic = new Map();
  const byCategory = new Map();

  const add = (map, key, entry) => {
    if (!key) return;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(entry);
  };

  const nativeWords = (v) =>
    v
      ? normNative(v)
          .split(/[^\p{L}\p{M}\p{N}]+/gu)
          .filter(Boolean)
      : [];

  for (const entry of allEntries) {
    if (!entry.english && !entry.nus && !entry.din) continue;

    if (entry.english) {
      const exact = normEn(entry.english);
      add(byExactEnglish, exact, entry);
      for (const w of tokenize(entry.english)) add(byEnglishWord, w, entry);
      add(byPhonetic, phoneticCode(entry.english), entry);
    }
    if (entry.category) {
      const catNorm = normEn(entry.category);
      add(byCategory, catNorm, entry);
      for (const w of tokenize(entry.category)) add(byEnglishWord, w, entry);
    }
    if (entry.topic) {
      for (const w of tokenize(entry.topic)) add(byEnglishWord, w, entry);
    }
    for (const w of nativeWords(entry.nus)) add(byNuerWord, w, entry);
    for (const w of nativeWords(entry.din)) add(byDinkaWord, w, entry);
  }

  return {
    entries: allEntries,
    byExactEnglish,
    byEnglishWord,
    byNuerWord,
    byDinkaWord,
    byPhonetic,
    byCategory,
  };
}

let kbPromise = null;
let tfidf = new TfIdfEngine();

export function loadKnowledgeBase() {
  if (!kbPromise) {
    kbPromise = Promise.all(
      SOURCES.map((src) =>
        fetch(src.url)
          .then((res) => {
            if (!res.ok) throw new Error(`${src.url} → HTTP ${res.status}`);
            return res.json();
          })
          .then((raw) => src.normalize(raw))
          .catch((err) => {
            console.warn("[ChatKB] failed to load", src.url, err.message);
            return [];
          }),
      ),
    ).then((groups) => {
      const entries = groups.flat();
      const kb = buildIndex(entries);
      tfidf.build(entries);
      return kb;
    });
  }
  return kbPromise;
}

export async function getKnowledgeBaseStats() {
  const kb = await loadKnowledgeBase();
  return { totalEntries: kb.entries.length, totalSources: SOURCES.length };
}

// ── RANKING ───────────────────────────────────────────────────────────
const SOURCE_PRIORITY = {
  "Curated Examples": 0,
  "Nuer Phrasebook": 1,
  "Nuer Conversation": 2,
  "Nuer Vocabulary": 3,
  "Nuer Structures": 4,
  "Nuer Grammar": 5,
  "Nuer Dictionary": 6,
  "Dinka Dictionary": 6,
};

const FRAGMENT_STARTERS = new Set([
  "on",
  "the",
  "her",
  "his",
  "and",
  "or",
  "of",
  "in",
  "to",
  "from",
  "with",
  "for",
  "that",
  "this",
  "an",
  "a",
  "at",
  "by",
  "as",
  "but",
  "so",
  "if",
  "when",
  "while",
  "because",
  "she",
  "he",
  "it",
  "they",
  "which",
  "who",
  "there",
  "their",
  "them",
]);

function isFragment(entry) {
  const first = (entry.english || "")
    .trim()
    .split(/\s+/)[0]
    ?.toLowerCase()
    .replace(/[^\p{L}]/gu, "");
  return FRAGMENT_STARTERS.has(first);
}
function rawWordCount(v) {
  return normEn(v).split(" ").filter(Boolean).length || 1;
}

function scoreByTokens(map, tokens, glossOf) {
  const matched = new Map();
  for (const t of tokens) {
    const hits = map.get(t);
    if (!hits) continue;
    for (const e of hits) matched.set(e, (matched.get(e) || 0) + 1);
  }
  return [...matched.entries()]
    .map(([entry, count]) => ({
      entry,
      count,
      coverage: count / rawWordCount(glossOf(entry)),
      fragment: isFragment(entry),
    }))
    .sort(
      (a, b) =>
        Number(a.fragment) - Number(b.fragment) ||
        b.count - a.count ||
        b.coverage - a.coverage ||
        (SOURCE_PRIORITY[a.entry.source] ?? 9) -
          (SOURCE_PRIORITY[b.entry.source] ?? 9),
    )
    .map((x) => x.entry);
}

// ── SEARCH STRATEGIES ─────────────────────────────────────────────────
function findExactEnglish(kb, phrase) {
  return kb.byExactEnglish.get(normEn(phrase)) || [];
}

function findByEnglishTokens(kb, phrase) {
  const tokens = tokenize(phrase);
  return tokens.length
    ? scoreByTokens(kb.byEnglishWord, tokens, (e) => e.english || "")
    : [];
}

function findByNativeWord(kb, word) {
  const key = normNative(word);
  const nuer = (kb.byNuerWord.get(key) || []).map((e) => ({
    entry: e,
    field: e.nus,
  }));
  const dinka = (kb.byDinkaWord.get(key) || []).map((e) => ({
    entry: e,
    field: e.din,
  }));
  const combined = [...nuer, ...dinka];
  if (!combined.length) return [];
  combined.sort(
    (a, b) =>
      a.field.split(/\s+/).length - b.field.split(/\s+/).length ||
      (SOURCE_PRIORITY[a.entry.source] ?? 9) -
        (SOURCE_PRIORITY[b.entry.source] ?? 9),
  );
  return combined.map((x) => x.entry);
}

function findNativeSubstring(kb, word) {
  const key = normNative(word);
  const out = [];
  for (const e of kb.entries) {
    if (
      (e.nus && normNative(e.nus).includes(key)) ||
      (e.din && normNative(e.din).includes(key))
    ) {
      out.push(e);
      if (out.length >= 15) break;
    }
  }
  return out;
}

function findFuzzyEnglish(kb, phrase) {
  const exact = normEn(phrase);
  const scored = [];
  for (const e of kb.entries) {
    const hay = normEn(e.english || "");
    if (!hay) continue;
    let score = 0;
    if (exact.length <= 5) {
      score = similarity(exact, hay);
    } else {
      score = ngramJaccard(exact, hay, 2);
      const words = hay.split(/\s+/);
      const bestWordSim = Math.max(...words.map((w) => similarity(exact, w)));
      score = Math.max(score, bestWordSim * 0.85);
    }
    if (score >= 0.45) scored.push({ entry: e, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((x) => x.entry);
}

function findPhonetic(kb, phrase) {
  const code = phoneticCode(phrase);
  return kb.byPhonetic.get(code) || [];
}

function findSemanticBridge(kb, phrase) {
  const tokens = tokenize(phrase);
  const bridgeWords = tokens.flatMap((t) => SEMANTIC_BRIDGES[t] || []);
  if (!bridgeWords.length) return [];
  return scoreByTokens(kb.byEnglishWord, bridgeWords, (e) => e.english || "");
}

function findCategoryMatch(kb, phrase) {
  const norm = normEn(phrase);
  const out = [];
  for (const e of kb.entries) {
    if (e.category && normEn(e.category).includes(norm)) {
      out.push(e);
      if (out.length >= 15) break;
    }
  }
  return out;
}

function findTfidfSemantic(kb, phrase) {
  return tfidf.query(phrase, 15).map((x) => x.entry);
}

// ── TERM EXTRACTION ───────────────────────────────────────────────────
function wantsDinka(q) {
  return /dinka|thu[oö]ŋj[aä]ŋ/i.test(q);
}
function wantsNuer(q) {
  return /nuer|naath|thok/i.test(q);
}

function stripLangWords(term) {
  return term
    .replace(/\b(?:nuer|dinka|naath|thok(?:\s+naath)?|thu[oö]ŋj[aä]ŋ)\b/giu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTerm(question) {
  const stripQuotes = (s) => s.replace(/^['"]+|['"]+$/g, "").trim();
  const finalize = (term, reverse) => ({
    term: stripLangWords(stripQuotes(term)) || stripQuotes(term),
    reverse,
  });

  let m = question.match(/(?:what does|meaning of)\s+(.+?)\s*mean\??$/i);
  if (m) return finalize(m[1], true);
  m = question.match(/(?:what does|meaning of)\s+(.+?)\??$/i);
  if (m) return finalize(m[1], true);
  m = question.match(
    /how (?:do|would|can) (?:i|you) say\s+(.+?)\s*(?:in\s+\w[\w\s]*)?\??$/i,
  );
  if (m) return finalize(m[1], false);
  m = question.match(/what(?:'s| is)\s+(.+?)\s*(?:in\s+\w[\w\s]*)?\??$/i);
  if (m) return finalize(m[1], false);
  m = question.match(/translate\s+(.+?)(?:\s+(?:to|into)\s+\w[\w\s]*)?\??$/i);
  if (m) return finalize(m[1], false);
  m = question.match(
    /(?:tell me|show me|give me)\s+(.+?)\s*(?:in\s+\w[\w\s]*)?\??$/i,
  );
  if (m) return finalize(m[1], false);
  m = question.match(
    /(?:how to|how do you)\s+(.+?)\s*(?:in\s+\w[\w\s]*)?\??$/i,
  );
  if (m) return finalize(m[1], false);
  m = question.match(/(?:define|definition of)\s+(.+?)\??$/i);
  if (m) return finalize(m[1], true);

  const cleaned = question.replace(/[?!.]+$/g, "").trim();
  return finalize(cleaned || question.trim(), false);
}

// ── RESPONSE BUILDERS ─────────────────────────────────────────────────
function buildTranslateResponse(
  candidates,
  term,
  showNuer,
  showDinka,
  reverse,
) {
  const lines = [];
  const sources = new Set();
  const headword = normEn(term) === "dinka"
    ? "Dinka"
    : candidates.find((e) => e.english)?.english || term;
  lines.push(`**"${headword}"**`);

  const nuerHits = showNuer ? candidates.filter((e) => e.nus).slice(0, 5) : [];
  const dinkaHits = showDinka
    ? candidates.filter((e) => e.din).slice(0, 5)
    : [];

  if (nuerHits.length) {
    lines.push(`\n· Nuer:`);
    nuerHits.forEach((hit, i) => {
      const marker = i === 0 ? "  →" : "  ·";
      lines.push(
        `${marker} **${hit.nus}**${hit.category ? ` (${hit.category})` : ""}`,
      );
      sources.add(hit.source);
    });
  }
  if (dinkaHits.length) {
    lines.push(`\n· Dinka:`);
    dinkaHits.forEach((hit, i) => {
      const marker = i === 0 ? "  →" : "  ·";
      lines.push(
        `${marker} **${hit.din}**${hit.category ? ` (${hit.category})` : ""}`,
      );
      sources.add(hit.source);
    });
  }

  // Alternate senses
  if (reverse && candidates.length > 1) {
    const primary = nuerHits[0] || dinkaHits[0];
    if (primary) {
      const primaryField = normNative(primary.nus || primary.din || "");
      const altSenses = [
        ...new Set(
          candidates
            .filter(
              (c) =>
                c !== primary &&
                normNative(c.nus || c.din || "") === primaryField &&
                c.english &&
                c.english !== primary.english,
            )
            .map((c) => c.english),
        ),
      ].slice(0, 3);
      if (altSenses.length)
        lines.push(`\n_Also recorded for this word:_ ${altSenses.join("; ")}`);
    }
  }

  // Example
  const ex = candidates.find((e) => e.example);
  if (ex?.example) {
    lines.push(`\n_e.g._ "${ex.example.native}" — "${ex.example.english}"`);
    sources.add(ex.source);
  }

  // Audio link
  const audioHit = candidates.find((e) => e.audio);
  if (audioHit?.audio) {
    lines.push(`\n🔊 [Listen to pronunciation](/audio/${audioHit.audio})`);
  }

  // Related
  const extraNuer = candidates
    .filter((e) => showNuer && e.nus && !nuerHits.includes(e))
    .slice(0, 2);
  const extraDinka = candidates
    .filter((e) => showDinka && e.din && !dinkaHits.includes(e))
    .slice(0, 2);
  if (extraNuer.length || extraDinka.length) {
    const rel = [];
    if (extraNuer.length)
      rel.push(`Nuer: ${extraNuer.map((e) => e.nus).join(", ")}`);
    if (extraDinka.length)
      rel.push(`Dinka: ${extraDinka.map((e) => e.din).join(", ")}`);
    lines.push(`\n_Related:_ ${rel.join(" · ")}`);
  }

  return {
    text: lines.join("\n"),
    sources: [...sources],
    hasNuer: nuerHits.length > 0,
    hasDinka: dinkaHits.length > 0,
  };
}

function buildGrammarResponse(candidates, term) {
  const lines = [`**Grammar: "${term}"**`];
  const sources = new Set();
  const grammarHits = candidates
    .filter(
      (e) => e.source.includes("Grammar") || e.source.includes("Structures"),
    )
    .slice(0, 5);

  if (grammarHits.length) {
    grammarHits.forEach((hit, i) => {
      lines.push(`\n${i + 1}. **${hit.english}**`);
      if (hit.nus) lines.push(`   Nuer: *${hit.nus}*`);
      if (hit.din) lines.push(`   Dinka: *${hit.din}*`);
      if (hit.category) lines.push(`   _Category: ${hit.category}_`);
      sources.add(hit.source);
    });
  } else {
    lines.push(`\nI found these related entries that may help with "${term}":`);
    candidates.slice(0, 4).forEach((hit) => {
      lines.push(
        `\n· **${hit.english}**${hit.nus ? ` — Nuer: ${hit.nus}` : ""}${hit.din ? ` — Dinka: ${hit.din}` : ""}`,
      );
      sources.add(hit.source);
    });
  }
  return {
    text: lines.join("\n"),
    sources: [...sources],
    hasNuer: candidates.some((e) => e.nus),
    hasDinka: candidates.some((e) => e.din),
  };
}

function buildCompareResponse(candidates, term) {
  const lines = [`**Comparison for "${term}"**`];
  const nuer = candidates.filter((e) => e.nus).slice(0, 3);
  const dinka = candidates.filter((e) => e.din).slice(0, 3);
  const sources = new Set();

  if (nuer.length || dinka.length) {
    lines.push(`\n_Both languages have entries for this concept:_`);
    if (nuer.length) {
      lines.push(`\n· Nuer:`);
      nuer.forEach((e) => {
        lines.push(`  · ${e.english} → **${e.nus}**`);
        sources.add(e.source);
      });
    }
    if (dinka.length) {
      lines.push(`\n· Dinka:`);
      dinka.forEach((e) => {
        lines.push(`  · ${e.english} → **${e.din}**`);
        sources.add(e.source);
      });
    }
  } else {
    lines.push(
      `\nI don't have a direct comparison for "${term}" yet. Try searching each language separately.`,
    );
  }
  return {
    text: lines.join("\n"),
    sources: [...sources],
    hasNuer: nuer.length > 0,
    hasDinka: dinka.length > 0,
  };
}

function buildCultureResponse(candidates, term) {
  const lines = [`**About "${term}" in Nuer & Dinka culture**`];
  const sources = new Set();
  if (candidates.length) {
    candidates.slice(0, 5).forEach((hit, i) => {
      lines.push(`\n${i + 1}. **${hit.english}**`);
      if (hit.nus) lines.push(`   Nuer: *${hit.nus}*`);
      if (hit.din) lines.push(`   Dinka: *${hit.din}*`);
      if (hit.category) lines.push(`   _${hit.category}_`);
      sources.add(hit.source);
    });
  } else {
    lines.push(
      `\nI don't have specific cultural information on "${term}" in the local dataset yet. Try rephrasing or use the Text Translation tool.`,
    );
  }
  return {
    text: lines.join("\n"),
    sources: [...sources],
    hasNuer: candidates.some((e) => e.nus),
    hasDinka: candidates.some((e) => e.din),
  };
}

function buildAudioResponse(candidates, term) {
  const lines = [`**Pronunciation for "${term}"**`];
  const sources = new Set();
  const withAudio = candidates.filter((e) => e.audio).slice(0, 5);

  if (withAudio.length) {
    withAudio.forEach((hit) => {
      lines.push(`\n· **${hit.english}** — ${hit.nus || hit.din || ""}`);
      lines.push(`  🔊 [Play audio](/audio/${hit.audio})`);
      sources.add(hit.source);
    });
  } else {
    const hits = candidates.slice(0, 5);
    hits.forEach((hit) => {
      lines.push(
        `\n· **${hit.english}** — ${hit.nus || hit.din || ""} _(no audio file yet)_`,
      );
      sources.add(hit.source);
    });
    lines.push(
      `\n_Audio recordings are available for phrasebook entries. Try asking for a common phrase like "hello" or "thank you"._`,
    );
  }
  return {
    text: lines.join("\n"),
    sources: [...sources],
    hasNuer: candidates.some((e) => e.nus),
    hasDinka: candidates.some((e) => e.din),
  };
}

// ── STARTERS ──────────────────────────────────────────────────────────
export const CHAT_STARTERS = [
  "How do I say hello in Nuer?",
  "What is 'water' in Dinka?",
  "What does 'Malɛ' mean?",
  "Teach me a Dinka greeting",
  "How do I say goodbye in Nuer?",
  "What is 'father' in Dinka?",
  "What does 'ciɛŋ' mean?",
  "How do I say thank you?",
  "What is the plural of 'child' in Nuer?",
  "How do you conjugate 'go' in Dinka?",
  "Compare 'hello' in Nuer and Dinka",
  "Tell me about Nuer greetings",
  "How do I pronounce 'thok naath'?",
  "What is a family member in Dinka?",
  "Teach me colors in Nuer",
];

// ── MAIN ANSWER FUNCTION ──────────────────────────────────────────────
export async function askDayomAi(question, { debug = false } = {}) {
  await new Promise((r) => setTimeout(r, 300));

  const trimmed = question.trim();
  if (!trimmed) {
    return {
      text: "Ask me a word or phrase you'd like in Nuer or Dinka.",
      sources: [],
      meta: debug ? { empty: true } : null,
    };
  }

  const intent = classifyIntent(trimmed);

  // Static intents
  if (intent === INTENTS.GREETING) {
    return {
      text: "**Hello!** Welcome to Dayom AI. I'm here to help you with Nuer (Thok Naath) and Dinka (Thuɔŋjäŋ) words, phrases, grammar, and culture. What would you like to learn today?",
      sources: [],
      meta: debug ? { intent } : null,
    };
  }
  if (intent === INTENTS.THANKS) {
    return {
      text: "**You're welcome!** Ṭä̲ä̲ cäŋ (Nuer) / Aci thok (Dinka) — happy to help! Ask me anything else.",
      sources: [],
      meta: debug ? { intent } : null,
    };
  }
  if (intent === INTENTS.FAREWELL) {
    return {
      text: "**Goodbye!** Ka̲a̲l (Nuer) / Määt (Dinka) — come back anytime to practice!",
      sources: [],
      meta: debug ? { intent } : null,
    };
  }
  if (intent === INTENTS.HELP) {
    return {
      text: `**How to use Dayom AI Chat:**\n\n· **Translate:** "How do I say hello in Nuer?"\n· **Define:** "What does Malɛ mean?"\n· **Grammar:** "What is the plural of child in Nuer?"\n· **Compare:** "Compare hello in Nuer and Dinka"\n· **Culture:** "Tell me about Nuer greetings"\n· **Pronunciation:** "How do you pronounce thok naath?"\n\nI search ~16,000 verified local entries. For longer sentences, use the **Text Translation** tool.`,
      sources: [],
      meta: debug ? { intent } : null,
    };
  }
  if (intent === INTENTS.LANGUAGES) {
    const { totalEntries } = await getKnowledgeBaseStats();
    return {
      text: `I search a merged local knowledge base of **Nuer (Thok Naath)** and **Dinka (Thuɔŋjäŋ)** — dictionaries, phrasebook, grammar, structures, conversation, and curated examples (${totalEntries.toLocaleString()} entries combined). For anything longer or unlisted, try the **Text Translation** tool in the Studio nav.`,
      sources: [],
      meta: debug ? { intent, totalEntries } : null,
    };
  }

  const kb = await loadKnowledgeBase();

  // Follow-up resolution
  const followUp = context.resolveFollowUp(trimmed);
  let term,
    reverse,
    forceNuer,
    forceDinka,
    isFollowUp = false;
  if (followUp) {
    ({ term, reverse, forceNuer, forceDinka, isFollowUp } = followUp);
  } else {
    const extracted = extractTerm(trimmed);
    term = extracted.term;
    reverse = extracted.reverse;
    forceNuer = wantsNuer(trimmed);
    forceDinka = wantsDinka(trimmed);
  }

  // Language inference from context if not specified
  if (!forceNuer && !forceDinka && context.lastLanguage) {
    if (intent === INTENTS.FOLLOW_UP) {
      forceNuer = context.lastLanguage === "nuer";
      forceDinka = context.lastLanguage === "dinka";
    }
  }

  const tokens = tokenize(term);
  let candidates = [];
  let strategies = [];

  // ── Cascading Search (8 strategies) ────────────────────────────────
  // 1. Exact English
  candidates = findExactEnglish(kb, term);
  if (candidates.length) strategies.push("exact-english");

  // 2. Token English
  if (!candidates.length) {
    candidates = findByEnglishTokens(kb, term);
    if (candidates.length) strategies.push("token-english");
  }

  // 3. Native exact
  if (!candidates.length && reverse) {
    candidates = findByNativeWord(kb, term);
    if (candidates.length) strategies.push("native-exact");
  }

  // 4. Direction swap
  if (!candidates.length) {
    candidates = reverse
      ? findByEnglishTokens(kb, term)
      : findByNativeWord(kb, term);
    if (candidates.length) strategies.push("direction-swap");
  }

  // 5. Native substring
  if (!candidates.length && (reverse || intent === INTENTS.DEFINE)) {
    candidates = findNativeSubstring(kb, term);
    if (candidates.length) strategies.push("native-substring");
  }

  // 6. Phonetic
  if (!candidates.length && !reverse) {
    candidates = findPhonetic(kb, term);
    if (candidates.length) strategies.push("phonetic");
  }

  // 7. Fuzzy English
  if (!candidates.length && !reverse) {
    candidates = findFuzzyEnglish(kb, term);
    if (candidates.length) strategies.push("fuzzy-english");
  }

  // 8. Semantic bridge
  if (!candidates.length && !reverse) {
    candidates = findSemanticBridge(kb, term);
    if (candidates.length) strategies.push("semantic-bridge");
  }

  // 9. TF-IDF semantic
  if (!candidates.length && !reverse) {
    const tfidfResults = findTfidfSemantic(kb, term);
    if (tfidfResults.length) {
      candidates = tfidfResults;
      strategies.push("tfidf-semantic");
    }
  }

  // 10. Category match
  if (!candidates.length && !reverse) {
    candidates = findCategoryMatch(kb, term);
    if (candidates.length) strategies.push("category-match");
  }

  // ── No results handling ──────────────────────────────────────────────
  if (!candidates.length) {
    // Try to find semantically related concepts as a helpful fallback
    const related = tfidf.query(term, 5);
    let fallbackText = `I don't have a verified match for **"${term}"** in the local dataset yet.`;
    if (related.length > 0) {
      const suggestions = related
        .slice(0, 3)
        .map((r) => `**${r.entry.english}**`)
        .join(", ");
      fallbackText += `\n\n_You might be interested in:_ ${suggestions}`;
    }
    fallbackText += `\n\nTry the **Text Translation** tool for a broader result, or rephrase — e.g. "How do I say water in Dinka?" or "What does Malɛ mean?"`;
    return {
      text: fallbackText,
      sources: [],
      meta: debug
        ? {
            term,
            tokens,
            strategies: [...strategies, "none"],
            related: related.length,
          }
        : null,
    };
  }

  // ── Deduplicate ──────────────────────────────────────────────────────
  const seen = new Set();
  candidates = candidates.filter((e) => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  });

  // ── Language filtering ───────────────────────────────────────────────
  const showNuer = !forceDinka || forceNuer;
  const showDinka = !forceNuer || forceDinka;

  // ── Route to response builder by intent ──────────────────────────────
  let result;
  switch (intent) {
    case INTENTS.GRAMMAR:
      result = buildGrammarResponse(candidates, term);
      break;
    case INTENTS.COMPARE:
      result = buildCompareResponse(candidates, term);
      break;
    case INTENTS.CULTURE:
      result = buildCultureResponse(candidates, term);
      break;
    case INTENTS.AUDIO:
      result = buildAudioResponse(candidates, term);
      break;
    case INTENTS.TRANSLATE:
    case INTENTS.DEFINE:
    case INTENTS.GENERAL:
    default:
      result = buildTranslateResponse(
        candidates,
        term,
        showNuer,
        showDinka,
        reverse,
      );
      break;
  }

  // "Did you mean?" for fuzzy
  if (
    strategies.includes("fuzzy-english") &&
    candidates[0]?.english &&
    candidates[0].english.toLowerCase() !== term.toLowerCase()
  ) {
    result.text += `\n\n_(Did you mean **"${candidates[0].english}"**?)_`;
  }

  // Proactive suggestions
  const suggestions = context.getSuggestions(result);
  if (suggestions.length && !isFollowUp) {
    result.suggestions = suggestions;
  }

  // Update context
  const nuerHits = candidates.filter((e) => e.nus);
  const dinkaHits = candidates.filter((e) => e.din);
  context.push(
    trimmed,
    intent,
    term,
    nuerHits.length ? "nuer" : dinkaHits.length ? "dinka" : null,
  );

  return {
    text: result.text,
    sources: result.sources,
    suggestions: result.suggestions || [],
    meta: debug
      ? {
          term,
          tokens,
          intent,
          strategies,
          candidateCount: candidates.length,
          nuerCount: nuerHits.length,
          dinkaCount: dinkaHits.length,
        }
      : null,
  };
}
