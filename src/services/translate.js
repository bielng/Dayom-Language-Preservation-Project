/**
 * Translation for English ↔ Nuer (Thok Naath) ↔ Dinka (Thuɔŋjäŋ).
 *
 * Order of resort:
 *   1. an exact verified pair from the corpus — ground truth, instant, free
 *   2. the fine-tuned Nuer model (Gradio Space) — grammatical, covers new text
 *   3. dataset assembly — phrase-by-phrase, works offline and for Dinka, which
 *      has no fine-tuned model yet
 *
 * No general-purpose provider is used. The unofficial Google endpoint sends no
 * Access-Control-Allow-Origin header (so the browser rejects every response)
 * and rate-limits, and MyMemory has no real Nuer/Dinka model.
 *
 * Dataset assembly, per sentence:
 *   a. exact match on the sentence
 *   b. greedy longest-phrase assembly (8 words → 1) over the phrase index
 *   c. proper nouns and unrecorded words are preserved verbatim, never invented
 */

import { loadCorpus, normEn, normNative } from "./corpus.js";
import { modelSupports, translateWithModel } from "./nuerModel.js";

const LANG_NAMES = {
  nus: "Nuer (Thok Naath)",
  din: "Dinka (Thuɔŋjäŋ)",
  en: "English",
};

export function getLangName(code) {
  return LANG_NAMES[code] || code;
}

// Place and person names stay as written unless the corpus records a form.
const KNOWN_NAMES = new Set([
  "kenya", "sudan", "south sudan", "juba", "sudd", "africa", "ethiopia",
  "uganda", "nairobi", "malakal", "bentiu", "bor", "nile", "egypt", "gambella",
  "khartoum", "america", "europe", "england", "unity", "jonglei",
]);

// Neither Nuer nor Dinka has articles, so an unmatched English article is
// dropped rather than left as an English word inside the output.
const EN_DROP = new Set(["the", "a", "an"]);

// Informal English the datasets never record in contracted form.
const CONTRACTIONS = [
  [/\bwanna\b/gi, "want to"],
  [/\bgonna\b/gi, "going to"],
  [/\bgotta\b/gi, "got to"],
  [/\blemme\b/gi, "let me"],
  [/\bgimme\b/gi, "give me"],
  [/\bcan'?t\b/gi, "cannot"],
  [/\bwon'?t\b/gi, "will not"],
  [/\bn'?t\b/gi, " not"],
  [/\b(i)'m\b/gi, "$1 am"],
  [/\b(\w+)'re\b/gi, "$1 are"],
  [/\b(\w+)'ve\b/gi, "$1 have"],
  [/\b(\w+)'ll\b/gi, "$1 will"],
  [/\b(\w+)'d\b/gi, "$1 would"],
];

function expandContractions(text) {
  return CONTRACTIONS.reduce((acc, [re, to]) => acc.replace(re, to), text);
}

/**
 * Conservative English back-formations, tried only when a word has no direct
 * corpus entry ("herding" → "herd", "wetlands" → "wetland", "biggest" → "big").
 */
function enLemmas(w) {
  const out = [];
  const add = (s) => {
    if (s && s.length > 1 && s !== w && !out.includes(s)) out.push(s);
  };
  const undouble = (b) => (/(.)\1$/.test(b) ? b.slice(0, -1) : null);

  if (w.endsWith("ies") && w.length > 4) add(w.slice(0, -3) + "y");
  if (w.endsWith("es") && w.length > 3) {
    add(w.slice(0, -2));
    add(w.slice(0, -1));
  }
  if (w.endsWith("s") && !w.endsWith("ss") && w.length > 3) add(w.slice(0, -1));
  if (w.endsWith("ied") && w.length > 4) add(w.slice(0, -3) + "y");
  if (w.endsWith("ed") && w.length > 3) {
    const b = w.slice(0, -2);
    add(b);
    add(w.slice(0, -1));
    add(undouble(b));
  }
  if (w.endsWith("ing") && w.length > 4) {
    const b = w.slice(0, -3);
    add(b);
    add(b + "e");
    add(undouble(b));
  }
  if (w.endsWith("est") && w.length > 4) {
    const b = w.slice(0, -3);
    add(b);
    add(b + "e");
    add(undouble(b));
  }
  if (w.endsWith("er") && w.length > 3) {
    const b = w.slice(0, -2);
    add(b);
    add(b + "e");
    add(undouble(b));
  }
  if (w.endsWith("ly") && w.length > 3) add(w.slice(0, -2));
  if (w.endsWith("ness") && w.length > 5) add(w.slice(0, -4));
  if (w.endsWith("ation") && w.length > 6) {
    add(w.slice(0, -5) + "e");
    add(w.slice(0, -5) + "ate");
  } else if (w.endsWith("tion") && w.length > 5) {
    add(w.slice(0, -4) + "t");
    add(w.slice(0, -4) + "te");
  }
  return out;
}

/**
 * Nuer and Dinka mark person and number with suffixes, while the datasets are
 * keyed on bare headwords. When an inflected form has no entry, fall back to
 * its longest stem ("cieŋä" → "cieŋ"). The stem must retain most of the word,
 * so unrelated short headwords cannot be reached.
 */
function nativeStems(word) {
  const out = [];
  const chars = [...word];
  const floor = Math.max(3, Math.ceil(chars.length * 0.6));
  for (let len = chars.length - 1; len >= floor; len--) {
    // Never end a stem on an orphaned combining mark.
    const stem = chars.slice(0, len).join("").replace(/\p{M}+$/gu, "");
    if (stem.length >= 3 && stem !== word && !out.includes(stem)) out.push(stem);
  }
  return out;
}

const WORD_RE = /[\p{L}\p{M}\p{N}'’-]+/gu;

/** Split a sentence into words plus the exact separator that follows each. */
function tokenize(sentence) {
  const items = [];
  let prefix = "";
  let lastEnd = 0;
  let m;
  WORD_RE.lastIndex = 0;
  while ((m = WORD_RE.exec(sentence)) !== null) {
    const gap = sentence.slice(lastEnd, m.index);
    if (items.length === 0) prefix = gap;
    else items[items.length - 1].after = gap;
    items.push({ word: m[0], after: "" });
    lastEnd = m.index + m[0].length;
  }
  if (items.length) items[items.length - 1].after = sentence.slice(lastEnd);
  else prefix = sentence;
  return { prefix, items };
}

function splitSentences(paragraph) {
  return paragraph.match(/[^.!?…]+[.!?…]*\s*/gu) || (paragraph ? [paragraph] : []);
}

/**
 * Words that must never be looked up: numbers, acronyms, and known places.
 * These outrank any corpus entry.
 */
function isHardPreserved(word, norm) {
  if (/^\p{N}[\p{N}\p{P}]*$/u.test(word)) return true; // numbers, dates
  if (KNOWN_NAMES.has(norm(word))) return true;
  if (word.length > 1 && /^\p{Lu}+$/u.test(word)) return true; // acronyms
  return false;
}

/**
 * A capitalized mid-sentence word *might* be a personal name. How much that
 * signal is worth depends on the direction:
 *
 *  - Nuer/Dinka source: strong. Capitalization there marks names, so "Yar" in
 *    "cɔl Yar" is preserved rather than glossed as "Split".
 *  - English source: worthless. The dataset glosses are themselves Title-cased
 *    ("Wealth", "Brother"), so "Hello, Brother" must still translate Brother.
 *
 * So English input consults the corpus first and only falls back to preserving
 * the word when nothing is recorded for it.
 */
function looksLikeName(word, isFirst) {
  return word.length > 1 && /^\p{Lu}/u.test(word) && !isFirst;
}

function capitalizeLike(output, sourceWord) {
  if (!output || !/^\p{Lu}/u.test(sourceWord)) return output;
  return output[0].toLocaleUpperCase() + output.slice(1);
}

/**
 * Greedy longest-phrase assembly over one sentence.
 * @returns {{text: string, matched: number, translatable: number,
 *            unresolved: string[], labels: Set<string>, exact: boolean}}
 */
function composeSentence(sentence, cfg) {
  const { index, maxSpan, norm, drop, lemmas, capitalMarksName } = cfg;
  const labels = new Set();
  const empty = {
    text: sentence,
    matched: 0,
    translatable: 0,
    unresolved: [],
    approximate: [],
    labels,
    exact: false,
  };

  const trimmed = sentence.trim();
  const trailing = sentence.slice(trimmed.length);
  if (!trimmed) return empty;

  // Whole-sentence exact match. Terminal punctuation is carried over from the
  // input, since stored translations are indexed without it.
  const [, core, punct] = trimmed.match(/^(.*?)([.!?…]*)$/su);
  const exactHit = index.get(norm(core))?.[0];
  if (exactHit) {
    labels.add(exactHit.label);
    const words = core.match(WORD_RE) || [];
    return {
      text: capitalizeLike(exactHit.target, words[0] || "") + punct + trailing,
      matched: words.length,
      translatable: words.length,
      unresolved: [],
      approximate: [],
      labels,
      exact: true,
    };
  }

  const { prefix, items } = tokenize(sentence);
  if (!items.length) return empty;

  // Hard: never looked up. Soft: looked up first, preserved only if unrecorded.
  const preserved = items.map(
    (it, idx) =>
      isHardPreserved(it.word, norm) ||
      (capitalMarksName && looksLikeName(it.word, idx === 0)),
  );
  const softPreserved = items.map(
    (it, idx) => !capitalMarksName && looksLikeName(it.word, idx === 0),
  );

  const out = [prefix];
  const unresolved = [];
  const approximate = [];
  let matched = 0;
  let translatable = 0;
  let i = 0;

  while (i < items.length) {
    if (preserved[i]) {
      out.push(items[i].word + items[i].after);
      i += 1;
      continue;
    }

    let hit = null;
    let span = 0;

    const limit = Math.min(maxSpan, items.length - i);
    for (let n = limit; n >= 1; n--) {
      let usable = true;
      for (let k = i; k < i + n; k++) {
        // A phrase may not swallow a name, and may only run across whitespace
        // so that commas stay as boundaries.
        if (preserved[k] || (k < i + n - 1 && !/^\s*$/.test(items[k].after))) {
          usable = false;
          break;
        }
      }
      if (!usable) continue;

      const key = items
        .slice(i, i + n)
        .map((it) => norm(it.word))
        .join(" ");
      const bucket = key && index.get(key);
      if (bucket && bucket.length) {
        hit = bucket[0];
        span = n;
        break;
      }
    }

    // No direct entry: retry the single word through its back-formations.
    let viaLemma = null;
    if (!hit && lemmas) {
      for (const candidate of lemmas(norm(items[i].word))) {
        const bucket = index.get(candidate);
        if (bucket && bucket.length) {
          hit = bucket[0];
          span = 1;
          viaLemma = candidate;
          break;
        }
      }
    }

    if (hit) {
      labels.add(hit.label);
      const last = items[i + span - 1];
      out.push(capitalizeLike(hit.target, items[i].word) + last.after);
      matched += span;
      translatable += span;
      if (viaLemma) approximate.push(items[i].word);
      i += span;
      continue;
    }

    const item = items[i];
    if (softPreserved[i]) {
      // Capitalized, and the corpus has nothing for it — treat it as a name.
      out.push(item.word + item.after);
      i += 1;
      continue;
    }
    if (drop.has(norm(item.word))) {
      // Dropped, and excluded from the coverage denominator on purpose.
      const tail = item.after.replace(/^\s+/, "");
      if (tail) out.push(tail);
    } else {
      out.push(item.word + item.after);
      unresolved.push(item.word);
      translatable += 1;
    }
    i += 1;
  }

  return {
    text: out.join(""),
    matched,
    translatable,
    unresolved,
    approximate,
    labels,
    exact: false,
  };
}

async function configFor(source, target) {
  if (source === "en") {
    const index = await loadCorpus(target);
    return {
      index: index.enToNative,
      maxSpan: index.maxEnSpan,
      norm: normEn,
      drop: EN_DROP,
      lemmas: enLemmas,
      capitalMarksName: false, // English glosses are Title-cased; see looksLikeName
      pairCount: index.pairCount,
    };
  }
  const index = await loadCorpus(source);
  return {
    index: index.nativeToEn,
    maxSpan: index.maxNativeSpan,
    norm: normNative,
    drop: new Set(),
    lemmas: nativeStems,
    capitalMarksName: true,
    pairCount: index.pairCount,
  };
}

const DIRECTIONS = {
  "en-to-nus": ["en", "nus"],
  "nus-to-en": ["nus", "en"],
  "en-to-din": ["en", "din"],
  "din-to-en": ["din", "en"],
  "nus-to-din": ["nus", "din"],
  "din-to-nus": ["din", "nus"],
};

const EMPTY_RESULT = {
  text: "",
  engine: "corpus",
  method: "verified",
  coverage: 0,
  unresolved: [],
  approximate: [],
  sources: [],
  pivot: false,
  pairCount: 0,
  modelError: null,
  mixed: false,
};

/** Break text into translatable sentences, keeping the exact whitespace. */
function segment(text) {
  const out = [];
  const paragraphs = text.split(/\n/);
  paragraphs.forEach((paragraph, pIdx) => {
    if (pIdx > 0) out.push({ literal: "\n" });
    if (!paragraph.trim()) {
      out.push({ literal: paragraph });
      return;
    }
    for (const sentence of splitSentences(paragraph)) {
      const trimmed = sentence.trim();
      if (!trimmed) {
        out.push({ literal: sentence });
        continue;
      }
      const lead = sentence.slice(0, sentence.indexOf(trimmed[0]));
      out.push({
        core: trimmed,
        lead,
        tail: sentence.slice(lead.length + trimmed.length),
      });
    }
  });
  return out;
}

/** Exact verified pair for one sentence, or null. */
function verifiedPair(core, cfg) {
  const [, body, punct] = core.match(/^(.*?)([.!?…]*)$/su);
  const hit = cfg.index.get(cfg.norm(body))?.[0];
  return hit ? { text: hit.target + punct, label: hit.label } : null;
}

/**
 * Translate sentence by sentence, choosing the best available engine for each.
 *
 * Per sentence: verified pair → fine-tuned model → dataset assembly. Going
 * sentence by sentence matters on cpu-basic, where a two-sentence paragraph
 * measured ~58s as one call versus a few seconds each, and where the Space
 * queues under load. It also means one slow or failed sentence degrades only
 * itself instead of discarding the whole translation.
 */
async function translateSegments(input, direction, cfg, useModel) {
  const pieces = [];
  const labels = new Set();
  const unresolved = [];
  const approximate = [];
  let matched = 0;
  let translatable = 0;
  let modelSentences = 0;
  let corpusSentences = 0;
  let modelError = null;

  for (const seg of segment(input)) {
    if (seg.literal !== undefined) {
      pieces.push(seg.literal);
      continue;
    }

    const verified = verifiedPair(seg.core, cfg);
    if (verified) {
      labels.add(verified.label);
      const words = (seg.core.match(WORD_RE) || []).length;
      matched += words;
      translatable += words;
      pieces.push(seg.lead + verified.text + seg.tail);
      continue;
    }

    if (useModel && modelError === null) {
      try {
        const out = await translateWithModel(seg.core, direction);
        labels.add("Fine-tuned Nuer model");
        const words = (seg.core.match(WORD_RE) || []).length;
        matched += words;
        translatable += words;
        modelSentences += 1;
        pieces.push(seg.lead + out + seg.tail);
        continue;
      } catch (err) {
        // Record once, then stop retrying — if the Space is asleep or queued,
        // every later sentence would pay the same timeout again.
        console.warn("[translate] model unavailable:", err.message);
        modelError = err.message;
      }
    }

    const r = composeSentence(seg.core, cfg);
    r.labels.forEach((l) => labels.add(l));
    unresolved.push(...r.unresolved);
    approximate.push(...r.approximate);
    matched += r.matched;
    translatable += r.translatable;
    corpusSentences += 1;
    pieces.push(seg.lead + r.text + seg.tail);
  }

  return {
    text: pieces.join(""),
    coverage: translatable ? matched / translatable : 1,
    unresolved: [...new Set(unresolved)],
    approximate: [...new Set(approximate)],
    labels: [...labels],
    modelSentences,
    corpusSentences,
    modelError,
  };
}

/**
 * Translate text.
 * @param {string} text
 * @param {string} direction one of the keys of DIRECTIONS
 * @returns {Promise<{text: string, engine: "corpus"|"model",
 *   method: "verified"|"assembled"|"generated", coverage: number,
 *   unresolved: string[], approximate: string[], sources: string[],
 *   pivot: boolean, pairCount: number, modelError: string|null}>}
 */
export async function translateText(text, direction) {
  const pair = DIRECTIONS[direction];
  if (!pair) throw new Error(`Invalid direction: ${direction}`);

  const raw = String(text || "");
  if (!raw.trim()) return { ...EMPTY_RESULT };

  const [source, target] = pair;
  const input = source === "en" ? expandContractions(raw) : raw;

  // Nuer ↔ Dinka has no direct corpus or model, so it pivots through English.
  if (source !== "en" && target !== "en") {
    const toEn = await translateText(input, `${source}-to-en`);
    const toTarget = await translateText(toEn.text, `en-to-${target}`);
    return {
      ...toTarget,
      coverage: toEn.coverage * toTarget.coverage,
      unresolved: [...new Set([...toEn.unresolved, ...toTarget.unresolved])],
      approximate: [
        ...new Set([...toEn.approximate, ...toTarget.approximate]),
      ],
      sources: [...new Set([...toEn.sources, ...toTarget.sources])],
      pivot: true,
      modelError: toEn.modelError || toTarget.modelError,
    };
  }

  const cfg = await configFor(source, target);
  const r = await translateSegments(
    input,
    direction,
    cfg,
    modelSupports(direction),
  );

  const engine = r.modelSentences > 0 ? "model" : "corpus";
  const method =
    r.modelSentences > 0
      ? "generated"
      : r.corpusSentences > 0
        ? "assembled"
        : "verified";

  return {
    text: r.text,
    engine,
    method,
    coverage: r.coverage,
    unresolved: r.unresolved,
    approximate: r.approximate,
    sources: r.labels,
    pivot: false,
    pairCount: cfg.pairCount,
    modelError: r.modelError,
    // Set when the model handled part of the text and the corpus the rest.
    mixed: r.modelSentences > 0 && r.corpusSentences > 0,
  };
}
