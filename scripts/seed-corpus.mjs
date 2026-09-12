#!/usr/bin/env node
/**
 * One-time (or re-runnable) migration: pushes every dataset in public/data
 * and every clip in public/audio into the Supabase project described by
 * supabase/schema.sql.
 *
 * Requires the SERVICE ROLE key (not the anon key) because it bypasses RLS
 * on purpose — this is the one piece of tooling in the whole project that's
 * allowed to write to the corpus tables and the audio bucket. Never put the
 * service role key in a .env file that ships to the browser (it must NOT be
 * prefixed with VITE_) or commit it anywhere.
 *
 * Usage:
 *   SUPABASE_URL=https://xxxx.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
 *   node scripts/seed-corpus.mjs
 *
 *   # skip the audio upload (546 files — slower) if you only changed text data:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-corpus.mjs --skip-audio
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "public", "data");
const AUDIO_DIR = path.join(ROOT, "public", "audio");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SKIP_AUDIO = process.argv.includes("--skip-audio");

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (from Project Settings -> API) before running this script."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const BATCH_SIZE = 500;

function readJson(relativePath) {
  return JSON.parse(readFileSync(path.join(DATA_DIR, relativePath), "utf-8"));
}

async function replaceTable(table, rows, label) {
  process.stdout.write(`  ${label}: clearing…`);
  // `id` exists on every corpus table, so this always matches every row.
  const { error: delErr } = await supabase.from(table).delete().not("id", "is", null);
  if (delErr) throw new Error(`delete ${table} failed: ${delErr.message}`);

  process.stdout.write(`\r  ${label}: inserting ${rows.length} rows…`);
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from(table).insert(batch);
    if (error) throw new Error(`insert into ${table} failed at row ${i}: ${error.message}`);
  }
  console.log(`\r  ${label}: ${rows.length} rows ✔                     `);
}

async function seedDictionary() {
  const { entries } = readJson("library/dictionary.json");
  const rows = entries.map((e) => ({
    id: String(e.id),
    english: e.english,
    nuer: e.nuer,
    part_of_speech: e.partOfSpeech,
    alternatives: e.alternatives ?? [],
    examples: e.examples ?? [],
    source: e.source,
  }));
  await replaceTable("nuer_dictionary", rows, "dictionary");
}

async function seedTopicTable(table, file, label) {
  const { entries } = readJson(file);
  const rows = entries.map((e) => ({
    topic_number: e.topic_number,
    topic_title: e.topic_title,
    category: e.category,
    row_number: e.row_number,
    nuer: e.nuer,
    english: e.english,
    source: e.source,
    license: e.license,
    url: e.url,
  }));
  await replaceTable(table, rows, label);
}

async function seedExamples() {
  const { examples } = readJson("library/examples.json");
  const rows = examples.map((e) => ({
    nuer: e.nuer,
    english: e.english,
    category: e.category,
    pattern: e.pattern,
  }));
  await replaceTable("nuer_examples", rows, "examples");
}

async function seedPhrasebook() {
  const entries = readJson("phrasebook.json"); // top-level array, not wrapped
  const rows = entries.map((e) => ({
    id: e.id,
    nuer: e.nuer,
    ipa: e.ipa,
    part_of_speech: e.part_of_speech,
    plural_info: e.plural_info,
    senses: e.senses ?? [],
    sense_info: e.sense_info,
    examples: e.examples ?? [],
    audio_files: e.audio_files ?? [],
    dialect: e.dialect,
  }));
  await replaceTable("nuer_phrasebook", rows, "phrasebook");
}

async function seedDinka() {
  const { entries } = readJson("dinka/dictionary.json");
  const rows = entries.map((e) => ({
    id: String(e.id),
    dinka: e.dinka,
    english: e.english,
    part_of_speech: e.partOfSpeech,
    dialect_tags: e.dialectTags ?? [],
    example: e.example,
  }));
  await replaceTable("dinka_dictionary", rows, "dinka dictionary");
}

async function seedGrammarGuide() {
  const content = readFileSync(path.join(DATA_DIR, "library", "grammar-guide.md"), "utf-8");
  const { error } = await supabase
    .from("content_pages")
    .upsert({ key: "grammar-guide", content, updated_at: new Date().toISOString() });
  if (error) throw new Error(`content_pages upsert failed: ${error.message}`);
  console.log("  grammar guide: ✔");
}

async function seedAudio() {
  const files = readdirSync(AUDIO_DIR).filter((f) => f.toLowerCase().endsWith(".mp3"));
  console.log(`  uploading ${files.length} audio clips (skipping ones already in the bucket)…`);

  const { data: existing } = await supabase.storage.from("phrasebook-audio").list("", { limit: 1000 });
  const already = new Set((existing || []).map((f) => f.name));

  let uploaded = 0;
  let skipped = 0;
  const CONCURRENCY = 8;
  let cursor = 0;

  async function worker() {
    for (;;) {
      const i = cursor++;
      if (i >= files.length) return;
      const file = files[i];
      if (already.has(file)) {
        skipped++;
        continue;
      }
      const body = readFileSync(path.join(AUDIO_DIR, file));
      const { error } = await supabase.storage
        .from("phrasebook-audio")
        .upload(file, body, { contentType: "audio/mpeg", upsert: false });
      if (error) {
        console.warn(`    ! ${file}: ${error.message}`);
      } else {
        uploaded++;
      }
      if ((uploaded + skipped) % 50 === 0) {
        process.stdout.write(`\r  ...${uploaded} uploaded, ${skipped} already present`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  console.log(`\r  audio: ${uploaded} uploaded, ${skipped} already present, ${files.length} total ✔`);
}

async function main() {
  console.log("Seeding corpus tables…");
  await seedDictionary();
  await seedTopicTable("nuer_vocabulary", "library/vocabulary.json", "vocabulary");
  await seedTopicTable("nuer_structures", "library/structures.json", "structures");
  await seedTopicTable("nuer_conversation", "library/conversation.json", "conversation");
  await seedTopicTable("nuer_grammar", "library/grammar.json", "grammar");
  await seedExamples();
  await seedPhrasebook();
  await seedDinka();
  await seedGrammarGuide();

  if (SKIP_AUDIO) {
    console.log("Skipping audio upload (--skip-audio passed).");
  } else {
    console.log("Uploading phrasebook audio to Storage…");
    await seedAudio();
  }

  console.log(
    "\nDone. Set VITE_SUPABASE_CORPUS=true in your env and redeploy to start serving the Library from Supabase."
  );
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});
