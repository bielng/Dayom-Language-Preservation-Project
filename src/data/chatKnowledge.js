// Unified knowledge base for the Dayom AI Chat Assistant.
//
// Instead of a small hardcoded phrase list, this merges every static
// dataset already shipped under /public/data into one searchable index:
//   - Nuer Dictionary        (/data/library/dictionary.json)
//   - Nuer Vocabulary        (/data/library/vocabulary.json)
//   - Nuer Conversation      (/data/library/conversation.json)
//   - Nuer Grammar           (/data/library/grammar.json)
//   - Nuer Structures        (/data/library/structures.json)
//   - Curated Examples       (/data/library/examples.json)
//   - Nuer Phrasebook        (/data/phrasebook.json)
//   - Dinka Dictionary       (/data/dinka/dictionary.json)
// That's ~16,000 combined entries. Everything is fetched once, cached in
// memory, and searched entirely client-side — no external LLM call, which
// keeps the "verified local sources" promise shown in the Chat UI true.

const SOURCES = [
  {
    url: "/data/library/dictionary.json",
    label: "Nuer Dictionary",
    normalize: (raw) =>
      (raw.entries || []).map((e) => ({
        english: e.english || "",
        nus: e.nuer || null,
        din: null,
        category: e.partOfSpeech || null,
        source: "Nuer Dictionary",
        example: null,
      })),
  },
  {
    url: "/data/library/vocabulary.json",
    label: "Nuer Vocabulary",
    normalize: (raw) =>
      (raw.entries || []).map((e) => ({
        english: e.english || "",
        nus: e.nuer || null,
        din: null,
        category: e.topic_title || null,
        source: "Nuer Vocabulary",
        example: null,
      })),
  },
  {
    url: "/data/library/conversation.json",
    label: "Nuer Conversation",
    normalize: (raw) =>
      (raw.entries || []).map((e) => ({
        english: e.english || "",
        nus: e.nuer || null,
        din: null,
        category: e.topic_title || null,
        source: "Nuer Conversation",
        example: null,
      })),
  },
  {
    url: "/data/library/grammar.json",
    label: "Nuer Grammar",
    normalize: (raw) =>
      (raw.entries || []).map((e) => ({
        english: e.english || "",
        nus: e.nuer || null,
        din: null,
        category: e.topic_title || null,
        source: "Nuer Grammar",
        example: null,
      })),
  },
  {
    url: "/data/library/structures.json",
    label: "Nuer Structures",
    normalize: (raw) =>
      (raw.entries || []).map((e) => ({
        english: e.english || "",
        nus: e.nuer || null,
        din: null,
        category: e.topic_title || null,
        source: "Nuer Structures",
        example: null,
      })),
  },
  {
    url: "/data/library/examples.json",
    label: "Curated Examples",
    normalize: (raw) =>
      (raw.examples || []).map((e) => ({
        english: e.english || "",
        nus: e.nuer || null,
        din: null,
        category: e.category || null,
        source: "Curated Examples",
        example: null,
      })),
  },
  {
    url: "/data/phrasebook.json",
    label: "Nuer Phrasebook",
    normalize: (raw) =>
      (Array.isArray(raw) ? raw : []).map((e) => ({
        english: (e.senses || []).join("; "),
        nus: e.nuer || null,
        din: null,
        category: e.part_of_speech || null,
        source: "Nuer Phrasebook",
        example: e.examples?.[0]
          ? { native: e.examples[0].nuer, english: e.examples[0].english }
          : null,
      })),
  },
  {
    url: "/data/dinka/dictionary.json",
    label: "Dinka Dictionary",
    normalize: (raw) =>
      (raw.entries || []).map((e) => ({
        english: e.english || "",
        nus: null,
        din: e.dinka || null,
        category:
          e.partOfSpeech && e.partOfSpeech !== "unknown"
            ? e.partOfSpeech
            : null,
        source: "Dinka Dictionary",
        example: null,
      })),
  },
];

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
]);

// English text gets deep-normalized (lowercased, accents stripped) since
// that's safe for search. Nuer/Dinka text is only lowercased + trimmed —
// tone and vowel-quality diacritics are phonemic in these orthographies,
// so stripping them would merge words that mean different things.
function normaliseEnglish(value = "") {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normaliseNative(value = "") {
  return value.toLowerCase().trim().replace(/\s+/g, " ");
}

function tokenize(value) {
  return normaliseEnglish(value)
    .split(" ")
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w))
    .flatMap((w) => (SYNONYMS[w] ? [w, ...SYNONYMS[w]] : [w]));
}

// The dataset uses one specific spelling per concept (e.g. "Bye." rather
// than "goodbye"); this expands a query word to also try the dataset's
// preferred form, without touching how entries themselves are indexed.
const SYNONYMS = {
  goodbye: ["bye"],
  hi: ["hello"],
  thanks: ["thank"],
  yeah: ["yes"],
  yep: ["yes"],
  nope: ["no"],
  father: ["dad"],
  mother: ["mom", "mum"],
};

function buildIndex(allEntries) {
  const byExactEnglish = new Map();
  const byEnglishWord = new Map();
  const byNuerWord = new Map();
  const byDinkaWord = new Map();

  const addToMap = (map, key, entry) => {
    if (!key) return;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(entry);
  };

  const nativeWords = (value) =>
    value
      ? normaliseNative(value)
          .split(/[^\p{L}\p{M}\p{N}]+/gu)
          .filter(Boolean)
      : [];

  for (const entry of allEntries) {
    if (!entry.english && !entry.nus && !entry.din) continue;

    if (entry.english) {
      const exact = normaliseEnglish(entry.english);
      addToMap(byExactEnglish, exact, entry);
      for (const w of tokenize(entry.english))
        addToMap(byEnglishWord, w, entry);
    }
    if (entry.category) {
      for (const w of tokenize(entry.category))
        addToMap(byEnglishWord, w, entry);
    }
    // Word-level (not substring) indexing for native text — a query for
    // "malɛ" should match the word "malɛ", not land inside "maalɛ" or
    // inside an unrelated long example sentence that happens to contain it.
    for (const w of nativeWords(entry.nus)) addToMap(byNuerWord, w, entry);
    for (const w of nativeWords(entry.din)) addToMap(byDinkaWord, w, entry);
  }

  return {
    entries: allEntries,
    byExactEnglish,
    byEnglishWord,
    byNuerWord,
    byDinkaWord,
  };
}

let kbPromise = null;

/** Fetches + merges every source once, caching the promise for reuse. */
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
    ).then((groups) => buildIndex(groups.flat()));
  }
  return kbPromise;
}

/** Lets the UI show entry/source counts once loaded, without re-fetching. */
export async function getKnowledgeBaseStats() {
  const kb = await loadKnowledgeBase();
  return { totalEntries: kb.entries.length, totalSources: SOURCES.length };
}

// Curated, phrase-level sources are cleaner than raw dictionary text
// (which is often a whole definitional clause, not a clean headword), so
// they break ties when match count and coverage are similar.
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

// Some raw-scanned dictionary entries are mid-sentence fragments left
// over from splitting a longer definition (e.g. "on the child),"), not
// genuine standalone glosses. Push those to the back of the ranking.
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
]);

function isFragment(entry) {
  const firstWord = (entry.english || "")
    .trim()
    .split(/\s+/)[0]
    ?.toLowerCase()
    .replace(/[^\p{L}]/gu, "");
  return FRAGMENT_STARTERS.has(firstWord);
}

function rawWordCount(value) {
  return normaliseEnglish(value).split(" ").filter(Boolean).length || 1;
}

function scoreByTokens(map, tokens, glossOf) {
  const matched = new Map();
  for (const t of tokens) {
    const hits = map.get(t);
    if (!hits) continue;
    for (const entry of hits) matched.set(entry, (matched.get(entry) || 0) + 1);
  }
  // Rank by: not a dangling fragment, then how many query words matched,
  // then how much of the entry's own gloss those words cover — this keeps
  // a concise, precise entry ("friend") ahead of a long unrelated
  // definition that just happens to mention the query word once in
  // passing — then by source quality on a near-tie. Coverage uses the raw
  // word count (including short abbreviations like "n"/"adj"), so a junk
  // headword like "Fine 2 n" doesn't get an inflated score just because
  // its noise words were too short to index.
  return [...matched.entries()]
    .map(([entry, count]) => {
      const totalWords = rawWordCount(glossOf(entry));
      return {
        entry,
        count,
        coverage: count / totalWords,
        fragment: isFragment(entry),
      };
    })
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

function substringScan(entries, needle, field) {
  if (!needle) return [];
  const out = [];
  for (const e of entries) {
    const hay = field === "english" ? normaliseEnglish(e.english || "") : "";
    if (hay.includes(needle)) {
      out.push(e);
      if (out.length >= 25) break;
    }
  }
  return out;
}

function findByEnglish(kb, phrase) {
  const exact = normaliseEnglish(phrase);
  const exactMatches = kb.byExactEnglish.get(exact) || [];

  const tokens = tokenize(phrase);
  const tokenMatches = tokens.length
    ? scoreByTokens(kb.byEnglishWord, tokens, (e) => e.english || "")
    : [];

  // Exact whole-phrase matches are the most precise, so they lead — but
  // an exact match existing for one language shouldn't hide a good
  // token-level match in a different language the person asked for.
  const seen = new Set();
  const merged = [];
  for (const e of [...exactMatches, ...tokenMatches]) {
    if (!seen.has(e)) {
      seen.add(e);
      merged.push(e);
    }
  }
  if (merged.length) return merged;
  return substringScan(kb.entries, exact, "english");
}

function findByNativeWord(kb, word) {
  const key = normaliseNative(word);
  const nuerHits = (kb.byNuerWord.get(key) || []).map((entry) => ({
    entry,
    field: entry.nus,
  }));
  const dinkaHits = (kb.byDinkaWord.get(key) || []).map((entry) => ({
    entry,
    field: entry.din,
  }));
  const combined = [...nuerHits, ...dinkaHits];
  if (!combined.length) return [];

  // Prefer concise headword-style entries over long illustrative
  // sentences that happen to contain this word among many others, then
  // by source quality on a near-tie.
  combined.sort(
    (a, b) =>
      a.field.split(/\s+/).length - b.field.split(/\s+/).length ||
      (SOURCE_PRIORITY[a.entry.source] ?? 9) -
        (SOURCE_PRIORITY[b.entry.source] ?? 9),
  );
  return combined.map((x) => x.entry);
}

function wantsDinka(q) {
  return /dinka|thu[oö]ŋj[aä]ŋ/i.test(q);
}
function wantsNuer(q) {
  return /nuer|naath|thok/i.test(q);
}

// Pulls the core term out of common question shapes so search isn't
// thrown off by filler words like "how do I say ... in Nuer?". Language
// names are stripped unconditionally afterward — they're already used as
// routing signals (wantsNuer/wantsDinka) and should never themselves be
// treated as the thing being searched for.
function stripLanguageWords(term) {
  return term
    .replace(/\b(?:nuer|dinka|naath|thok(?:\s+naath)?|thu[oö]ŋj[aä]ŋ)\b/giu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTerm(question) {
  const stripQuotes = (s) => s.replace(/^['"]+|['"]+$/g, "").trim();
  const finalize = (term, reverse) => ({
    term: stripLanguageWords(stripQuotes(term)) || stripQuotes(term),
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

  const cleaned = question.replace(/[?!.]+$/g, "").trim();
  return finalize(cleaned || question.trim(), false);
}

export const CHAT_STARTERS = [
  "How do I say hello in Nuer?",
  "What is 'water' in Dinka?",
  "What does 'Malɛ' mean?",
  "Teach me a Dinka greeting",
];

export async function askDayomAi(question) {
  await new Promise((resolve) => setTimeout(resolve, 350)); // small delay so the UI feels alive

  const trimmed = question.trim();
  if (!trimmed) {
    return {
      text: "Ask me a word or phrase you'd like in Nuer or Dinka.",
      sources: [],
    };
  }

  if (/^(what languages|which languages)/i.test(trimmed)) {
    const { totalEntries } = await getKnowledgeBaseStats();
    return {
      text: `I search a merged local knowledge base of **Nuer (Thok Naath)** and **Dinka (Thuɔŋjäŋ)** — dictionaries, phrasebook, grammar, and curated example sentences (${totalEntries.toLocaleString()} entries combined). For anything longer or unlisted, try the **Text Translation** tool in the Studio nav.`,
      sources: [],
    };
  }

  const kb = await loadKnowledgeBase();
  const dinka = wantsDinka(trimmed);
  const nuer = wantsNuer(trimmed);
  const { term, reverse } = extractTerm(trimmed);

  let candidates = reverse
    ? findByNativeWord(kb, term)
    : findByEnglish(kb, term);
  if (!candidates.length) {
    candidates = reverse ? findByEnglish(kb, term) : findByNativeWord(kb, term);
  }

  if (!candidates.length) {
    return {
      text: `I don't have a verified match for **"${term}"** in the local dataset yet. Try the **Text Translation** tool for a broader result, or rephrase — e.g. "How do I say water in Dinka?" or "What does Malɛ mean?"`,
      sources: [],
    };
  }

  // Only mentioning one language narrows the answer to that language;
  // mentioning both (or neither) shows whatever's available for both.
  const showNuer = !dinka || nuer;
  const showDinka = !nuer || dinka;
  const nuerHit = showNuer ? candidates.find((e) => e.nus) : null;
  const dinkaHit = showDinka ? candidates.find((e) => e.din) : null;

  if (!nuerHit && !dinkaHit) {
    return {
      text: `I found matches for **"${term}"** but not yet in the language you asked for. Try the **Text Translation** tool for a broader result.`,
      sources: [...new Set(candidates.slice(0, 3).map((c) => c.source))],
    };
  }

  const lines = [];
  const sources = new Set();
  const headword = nuerHit?.english || dinkaHit?.english || term;
  lines.push(`**"${headword}"**`);
  if (nuerHit) {
    lines.push(`· Nuer: **${nuerHit.nus}**`);
    sources.add(nuerHit.source);
  }
  if (dinkaHit) {
    lines.push(`· Dinka: **${dinkaHit.din}**`);
    sources.add(dinkaHit.source);
  }

  // The raw dictionaries sometimes record the same native word under
  // several distinct headword entries (genuine homonyms). For a reverse
  // lookup, surface those alternates rather than silently picking one.
  if (reverse) {
    const primary = nuerHit || dinkaHit;
    const primaryField = normaliseNative(primary.nus || primary.din || "");
    const altSenses = [
      ...new Set(
        candidates
          .filter(
            (c) =>
              c !== primary &&
              normaliseNative(c.nus || c.din || "") === primaryField &&
              c.english &&
              c.english !== primary.english,
          )
          .map((c) => c.english),
      ),
    ].slice(0, 2);
    if (altSenses.length) {
      lines.push(`\n_Also recorded for this word:_ ${altSenses.join("; ")}`);
    }
  }

  const exampleHit = candidates.find((e) => e.example);
  if (exampleHit?.example) {
    lines.push(
      `\n_e.g._ "${exampleHit.example.native}" — "${exampleHit.example.english}"`,
    );
    sources.add(exampleHit.source);
  }

  return { text: lines.join("\n"), sources: [...sources] };
}
