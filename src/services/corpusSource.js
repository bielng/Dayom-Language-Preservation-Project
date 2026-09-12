/**
 * Sources the Library / Dinka Library / Phrasebook datasets from Supabase
 * instead of the static JSON files in public/data, when
 * `isSupabaseCorpusEnabled` is true (see services/supabase.js).
 *
 * Every page component (DictionaryBrowser, PhraseTable, ExamplesBrowser,
 * GrammarGuide, PhrasebookPage, DinkaDictionaryBrowser) reads its data
 * through utils/useJsonData.js by URL, expecting a specific object shape —
 * the exact shape the original JSON files had. This module's only job is
 * to reproduce that same shape from a Supabase query, so none of those
 * components need to change. See utils/useJsonData.js for the integration
 * point.
 *
 * Tables are public-read/no-write per supabase/schema.sql — this module
 * only ever runs `.select()`.
 */
import { supabase } from "./supabase.js";

// Supabase returns at most 1000 rows per request by default; page through
// larger tables (dinka_dictionary has ~9,200 rows) rather than truncating.
const PAGE_SIZE = 1000;

async function fetchAllRows(table, orderBy) {
  const rows = [];
  let from = 0;
  for (;;) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order(orderBy, { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`Supabase query failed for ${table}: ${error.message}`);
    rows.push(...data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  return rows;
}

// Static reference lookup carried over verbatim from the original
// dinka/dictionary.json — 18 fixed dialect-code labels, not corpus content,
// so it isn't worth a round trip to its own table.
const DINKA_DIALECT_MAP = {
  NE: "Abialang, Ageer (Paloc), Dongjol, Ngok (Sobat), Thoi, Rut, Luac (Upper Nile)",
  NEp: "Padang",
  NEb: "Abialang, Ageer",
  NEd: "Dongjol, Ngok (Sobat), Thoi, Rut, Luac (Upper Nile)",
  NW: "Ruweng, Pan Aru, Alor, Ngok (Abyei)",
  NWr: "Ruweng, Pan Aru, Alor",
  NWn: "Ngok (Abyei)",
  NWj: "Ciec",
  SW: "Malual, Rek, Twic Mayardit, Luac (Tonj East)",
  SWm: "Malual",
  SWr: "Rek",
  SWt: "Twic Mayardit",
  SWj: "Luac (Tonj East)",
  SC: "Gok, Agar, Ciec",
  SCa: "Gok, Agar, Ciec",
  SA: "Aliap",
  SE: "Bor, Twic East, Nyarweng, Ɣɔl",
  SEb: "Bor, Twic East, Nyarweng, Ɣɔl",
};

const EXAMPLES_DESCRIPTION =
  "Curated Thok Nath ↔ English sentence pairs for few-shot prompting in Naath AI";

// A "topic" style table (vocabulary/structures/conversation/grammar) shares
// the same column set and the same { metadata: { totalEntries }, entries }
// wrapper shape.
function toTopicShape(rows) {
  return {
    metadata: { totalEntries: rows.length },
    entries: rows.map((r) => ({
      topic_number: r.topic_number,
      topic_title: r.topic_title,
      category: r.category,
      row_number: r.row_number,
      nuer: r.nuer,
      english: r.english,
      source: r.source,
      license: r.license,
      url: r.url,
    })),
  };
}

const LOADERS = {
  "/data/library/dictionary.json": async () => {
    const rows = await fetchAllRows("nuer_dictionary", "id");
    return {
      metadata: { totalEntries: rows.length },
      entries: rows.map((r) => ({
        id: r.id,
        english: r.english,
        nuer: r.nuer,
        partOfSpeech: r.part_of_speech,
        alternatives: r.alternatives ?? [],
        examples: r.examples ?? [],
        source: r.source,
      })),
    };
  },

  "/data/library/vocabulary.json": async () => toTopicShape(await fetchAllRows("nuer_vocabulary", "id")),
  "/data/library/structures.json": async () => toTopicShape(await fetchAllRows("nuer_structures", "id")),
  "/data/library/conversation.json": async () => toTopicShape(await fetchAllRows("nuer_conversation", "id")),
  "/data/library/grammar.json": async () => toTopicShape(await fetchAllRows("nuer_grammar", "id")),

  "/data/library/examples.json": async () => {
    const rows = await fetchAllRows("nuer_examples", "id");
    return {
      meta: { description: EXAMPLES_DESCRIPTION, total_examples: rows.length },
      examples: rows.map((r) => ({
        nuer: r.nuer,
        english: r.english,
        category: r.category,
        pattern: r.pattern,
      })),
    };
  },

  "/data/phrasebook.json": async () => {
    const rows = await fetchAllRows("nuer_phrasebook", "id");
    return rows.map((r) => ({
      id: r.id,
      nuer: r.nuer,
      ipa: r.ipa,
      part_of_speech: r.part_of_speech,
      plural_info: r.plural_info,
      senses: r.senses ?? [],
      sense_info: r.sense_info,
      examples: r.examples ?? [],
      audio_files: r.audio_files ?? [],
      dialect: r.dialect,
    }));
  },

  "/data/dinka/dictionary.json": async () => {
    const rows = await fetchAllRows("dinka_dictionary", "id");
    return {
      metadata: { totalEntries: rows.length },
      dialectMap: DINKA_DIALECT_MAP,
      entries: rows.map((r) => ({
        id: r.id,
        dinka: r.dinka,
        english: r.english,
        partOfSpeech: r.part_of_speech,
        dialectTags: r.dialect_tags ?? [],
        example: r.example,
      })),
    };
  },

  "/data/library/grammar-guide.md": async () => {
    const { data, error } = await supabase
      .from("content_pages")
      .select("content")
      .eq("key", "grammar-guide")
      .single();
    if (error) throw new Error(`Supabase query failed for content_pages: ${error.message}`);
    return data?.content ?? "";
  },
};

export function isKnownCorpusUrl(url) {
  return url in LOADERS;
}

export async function fetchCorpusFromSupabase(url) {
  const loader = LOADERS[url];
  if (!loader) throw new Error(`No Supabase mapping registered for ${url}`);
  return loader();
}
