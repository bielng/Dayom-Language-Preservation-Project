/**
 * Corpus loader + phrase index for dataset-backed translation.
 *
 * Every translation comes from the JSON datasets in /public/data. There is no
 * network translation provider: the unofficial Google endpoint sends no CORS
 * header (and rate-limits), and MyMemory has no real Nuer/Dinka model.
 */

const FETCH_TIMEOUT_MS = 15000;

// Preference order when several datasets record the same source phrase.
const KIND_RANK = { curated: 0, sentence: 1, word: 2 };

function pair(en, native, kind) {
  if (!en || !native) return null;
  const e = String(en).trim();
  const n = String(native).trim();
  if (!e || !n) return null;
  return { en: e, native: n, kind };
}

// ── Nuer sources ──────────────────────────────────────────────────────
const NUER_SOURCES = [
  {
    url: "/data/library/examples.json",
    label: "Curated Examples",
    pairs: (raw) =>
      (raw.examples || []).map((e) => pair(e.english, e.nuer, "curated")),
  },
  {
    url: "/data/library/conversation.json",
    label: "Conversation",
    pairs: (raw) =>
      (raw.entries || []).map((e) => pair(e.english, e.nuer, "sentence")),
  },
  {
    url: "/data/library/structures.json",
    label: "Structures",
    pairs: (raw) =>
      (raw.entries || []).map((e) => pair(e.english, e.nuer, "sentence")),
  },
  {
    url: "/data/library/grammar.json",
    label: "Grammar",
    pairs: (raw) =>
      (raw.entries || []).map((e) => pair(e.english, e.nuer, "sentence")),
  },
  {
    url: "/data/library/vocabulary.json",
    label: "Vocabulary",
    pairs: (raw) =>
      (raw.entries || []).map((e) => pair(e.english, e.nuer, "word")),
  },
  {
    url: "/data/library/dictionary.json",
    label: "Dictionary",
    pairs: (raw) =>
      (raw.entries || []).flatMap((e) => [
        pair(e.english, e.nuer, "word"),
        ...(e.alternatives || []).map((a) => pair(e.english, a, "word")),
      ]),
  },
  {
    url: "/data/phrasebook.json",
    label: "Phrasebook",
    pairs: (raw) =>
      (Array.isArray(raw) ? raw : []).flatMap((e) => [
        ...(e.senses || []).map((s) => pair(s, e.nuer, "word")),
        ...(e.examples || []).map((x) => pair(x.english, x.nuer, "sentence")),
      ]),
  },
];

// ── Dinka gloss cleaning ──────────────────────────────────────────────
// The Dinka dictionary was extracted from a wrapped print source, so some
// "entries" are line-continuation fragments. These heuristics drop them.
const DIALECT_CODE = /^(NE[pbd]?|NW[rnj]?|SW[mrtj]?|SCa?|SA|SE b?|SEb?)\b\.?\s*/;
const POS_ABBR =
  /^(v\.pref|v\.t|v\.i|n\.pr|adj|adv|pron|prep|conj|num|interj|excl|pref|suff|part|aux|id|vb|vt|vi|v|n)\.\s*/i;
const GLOSS_CUT = /\[|\]|\bSyn:|\bSee:|\bNote:|\bGram:|\bCf\./;
const ARTIFACT_STARTS = new Set([
  "the", "a", "an", "and", "or", "of", "for", "with", "between", "from", "to",
  "in", "on", "plural", "marker", "auxiliary", "subject", "pronoun", "thus",
  "unlike", "historical", "declarative", "narrative", "beginning", "before",
  "apart", "setting", "tense", "words", "comes",
]);

// Headwords that are plainly English line-wrap debris, not Dinka words.
const ARTIFACT_HEADWORDS = new Set([
  "in", "of", "for", "to", "the", "a", "an", "and", "or", "with", "from", "on",
  "at", "by", "is", "are", "was", "were", "be", "been", "it", "he", "she",
  "they", "we", "you", "i", "that", "this", "but", "if", "when", "while",
  "because", "thus", "comes", "words", "tense", "marker", "plural", "subject",
  "declarative", "historical", "auxiliary", "between", "before", "beginning",
  "apart", "setting", "narrative", "normal", "unlike", "out", "set", "us",
  "not", "no", "all", "one", "two", "so", "as", "has", "have", "had", "do",
  "does", "did", "will", "would", "can", "could", "there", "their", "them",
  "which", "who", "what", "where", "how", "why", "very", "more", "most",
]);

function cleanDinkaGloss(rawGloss) {
  if (!rawGloss) return [];
  let g = String(rawGloss).trim();
  if (GLOSS_CUT.test(g)) g = g.split(GLOSS_CUT)[0].trim();
  g = g.replace(/^Sg:\s*\S+\.?\s*/i, "");
  for (let i = 0; i < 4; i++) {
    const before = g;
    g = g.replace(DIALECT_CODE, "").replace(POS_ABBR, "");
    if (g === before) break;
  }
  g = g.replace(/\(\s*pi\s*\)/gi, "").replace(/\.\s*$/, "").trim();
  if (!g || g.length > 50) return [];

  const first = g.toLowerCase().split(/\s+/)[0].replace(/[^a-z]/g, "");
  if (ARTIFACT_STARTS.has(first)) return [];

  return g
    .split(/[;,]/)
    .map((s) => s.trim())
    .filter((s) => s && s.split(/\s+/).length <= 6);
}

const DINKA_SOURCES = [
  {
    url: "/data/dinka/dictionary.json",
    label: "Dinka Dictionary",
    pairs: (raw) =>
      (raw.entries || []).flatMap((e) => {
        const head = String(e.dinka || "").trim().toLowerCase();
        if (!head || head.length < 2 || ARTIFACT_HEADWORDS.has(head)) return [];
        if (/^[a-z-]+$/.test(head) && /-$/.test(head)) return []; // affixes
        return cleanDinkaGloss(e.english).map((g) => pair(g, e.dinka, "word"));
      }),
  },
];

// ── Normalization ─────────────────────────────────────────────────────
/** Normalize English: fold case, drop accents and punctuation. */
export function normEn(s = "") {
  return String(s)
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}'\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Normalize Nuer/Dinka: fold case but KEEP combining marks (they are phonemic). */
export function normNative(s = "") {
  return String(s)
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^\p{L}\p{M}\p{N}'\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const wordCount = (s) => (s ? s.split(" ").filter(Boolean).length : 0);

/** Split "Jäli̱ kɛ mal/Ja̱lɛ kɛ mal." into its recorded variants. */
function variants(text) {
  return String(text)
    .split("/")
    .map((v) => v.trim())
    .filter(Boolean);
}

/**
 * Drop terminal punctuation from a stored translation. Sentence entries are
 * also reused as mid-sentence phrases, and the caller re-attaches whatever
 * punctuation the input actually had.
 */
function stripTerminal(text) {
  return String(text).replace(/[.!?…]+$/u, "").trim() || String(text).trim();
}

// ── Index building ────────────────────────────────────────────────────
const MAX_SPAN = 8;

function push(map, key, value) {
  if (!key) return;
  const bucket = map.get(key);
  if (bucket) bucket.push(value);
  else map.set(key, [value]);
}

function sortBucket(bucket) {
  // Every candidate in a bucket answers the same source phrase, so the tightest
  // rendering wins first: a one-word gloss beats a full sentence that merely
  // happens to be filed under the same headword ("water" → "Pi̱w", not "Ɛ Pi̱w?").
  bucket.sort(
    (a, b) =>
      wordCount(a.normTarget) - wordCount(b.normTarget) ||
      KIND_RANK[a.kind] - KIND_RANK[b.kind] ||
      a.target.length - b.target.length,
  );
  const seen = new Set();
  return bucket.filter((v) => {
    if (seen.has(v.normTarget)) return false;
    seen.add(v.normTarget);
    return true;
  });
}

function buildIndex(entries) {
  const enToNative = new Map();
  const nativeToEn = new Map();
  let maxEnSpan = 1;
  let maxNativeSpan = 1;

  for (const entry of entries) {
    const { en, native, kind, label } = entry;

    // English keys: word-level glosses can hold several senses ("Ocean/Sea").
    const enKeys =
      kind === "word"
        ? [...new Set(variants(en).flatMap((v) => v.split(/[;,]/)))]
            .map(normEn)
            .filter(Boolean)
        : [normEn(en)].filter(Boolean);

    const nativeVariants = variants(native).map(stripTerminal);
    const enTarget = stripTerminal(en);

    for (const key of enKeys) {
      const span = wordCount(key);
      if (span > MAX_SPAN) continue;
      maxEnSpan = Math.max(maxEnSpan, span);
      for (const v of nativeVariants) {
        push(enToNative, key, {
          target: v,
          normTarget: normNative(v),
          kind,
          label,
        });
      }
    }

    for (const v of nativeVariants) {
      const key = normNative(v);
      const span = wordCount(key);
      if (!key || span > MAX_SPAN) continue;
      maxNativeSpan = Math.max(maxNativeSpan, span);
      push(nativeToEn, key, {
        target: enTarget,
        normTarget: normEn(enTarget),
        kind,
        label,
      });
    }
  }

  for (const [k, v] of enToNative) enToNative.set(k, sortBucket(v));
  for (const [k, v] of nativeToEn) nativeToEn.set(k, sortBucket(v));

  return {
    enToNative,
    nativeToEn,
    maxEnSpan: Math.min(maxEnSpan, MAX_SPAN),
    maxNativeSpan: Math.min(maxNativeSpan, MAX_SPAN),
    pairCount: entries.length,
    sources: [...new Set(entries.map((e) => e.label))],
  };
}

// ── Loading ───────────────────────────────────────────────────────────
async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

const corpusCache = new Map(); // lang → Promise<index>

async function loadSources(sources) {
  const groups = await Promise.all(
    sources.map(async (src) => {
      try {
        const raw = await fetchJson(src.url);
        return src
          .pairs(raw)
          .filter(Boolean)
          .map((p) => ({ ...p, label: src.label }));
      } catch (err) {
        console.warn("[corpus] skipped", src.url, err.message);
        return [];
      }
    }),
  );
  const entries = groups.flat();
  if (!entries.length) {
    throw new Error("No translation datasets could be loaded.");
  }
  return buildIndex(entries);
}

/**
 * Load and index the corpus for one language. Cached and de-duplicated:
 * concurrent callers share one request set, repeat calls are instant.
 * @param {"nus"|"din"} lang
 */
export function loadCorpus(lang) {
  if (lang !== "nus" && lang !== "din") {
    throw new Error(`Unsupported corpus language: ${lang}`);
  }
  if (!corpusCache.has(lang)) {
    const sources = lang === "nus" ? NUER_SOURCES : DINKA_SOURCES;
    const promise = loadSources(sources).catch((err) => {
      corpusCache.delete(lang); // allow a retry after a failed load
      throw err;
    });
    corpusCache.set(lang, promise);
  }
  return corpusCache.get(lang);
}

export async function getCorpusStats(lang) {
  const index = await loadCorpus(lang);
  return {
    pairCount: index.pairCount,
    sources: index.sources,
    enPhrases: index.enToNative.size,
    nativePhrases: index.nativeToEn.size,
  };
}
