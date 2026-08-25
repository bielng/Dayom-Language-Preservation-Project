import express from "express";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "public", "data");
const DIST_DIR = path.join(ROOT, "dist");

const PORT = globalThis.process?.env?.PORT || 8787;

const app = express();
app.use(express.json());

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

const jsonCache = new Map();

function readJson(relativePath) {
  if (jsonCache.has(relativePath)) return jsonCache.get(relativePath);
  const fullPath = path.join(DATA_DIR, relativePath);
  if (!fs.existsSync(fullPath)) return null;
  const parsed = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
  jsonCache.set(relativePath, parsed);
  return parsed;
}

function paginate(list, req) {
  const limit = Math.min(parseInt(req.query.limit, 10) || 200, 1000);
  const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
  return {
    total: list.length,
    limit,
    offset,
    items: list.slice(offset, offset + limit),
  };
}

function searchEntries(entries, q, fields) {
  if (!q) return entries;
  const needle = q.trim().toLowerCase();
  if (!needle) return entries;
  return entries.filter((entry) =>
    fields.some((f) => String(entry[f] ?? "").toLowerCase().includes(needle))
  );
}

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "dayom-lab-api", time: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// Nuer library — dictionary, vocabulary, structures, conversation, grammar, examples
// ---------------------------------------------------------------------------

const LIBRARY_FILES = {
  dictionary: "library/dictionary.json",
  vocabulary: "library/vocabulary.json",
  structures: "library/structures.json",
  conversation: "library/conversation.json",
  grammar: "library/grammar.json",
  examples: "library/examples.json",
};

app.get("/api/library/:section", (req, res) => {
  const file = LIBRARY_FILES[req.params.section];
  if (!file) return res.status(404).json({ error: "Unknown library section" });

  const data = readJson(file);
  if (!data) return res.status(404).json({ error: "Data file not found" });

  const entries = Array.isArray(data.entries) ? data.entries : Array.isArray(data) ? data : [];
  const filtered = searchEntries(entries, req.query.q, ["nuer", "english", "topic_title"]);
  res.json({ metadata: data.metadata ?? null, ...paginate(filtered, req) });
});

app.get("/api/library/:section/random", (req, res) => {
  const file = LIBRARY_FILES[req.params.section];
  if (!file) return res.status(404).json({ error: "Unknown library section" });

  const data = readJson(file);
  const entries = Array.isArray(data?.entries) ? data.entries : Array.isArray(data) ? data : [];
  if (!entries.length) return res.status(404).json({ error: "No entries available" });

  res.json(entries[Math.floor(Math.random() * entries.length)]);
});

// ---------------------------------------------------------------------------
// Dinka dictionary
// ---------------------------------------------------------------------------

app.get("/api/dinka/dictionary", (req, res) => {
  const data = readJson("dinka/dictionary.json");
  if (!data) return res.status(404).json({ error: "Data file not found" });

  const entries = Array.isArray(data.entries) ? data.entries : Array.isArray(data) ? data : [];
  const filtered = searchEntries(entries, req.query.q, ["dinka", "english"]);
  res.json({ metadata: data.metadata ?? null, ...paginate(filtered, req) });
});

// ---------------------------------------------------------------------------
// Phrasebook
// ---------------------------------------------------------------------------

app.get("/api/phrasebook", (req, res) => {
  const data = readJson("phrasebook.json");
  if (!data) return res.status(404).json({ error: "Data file not found" });
  const entries = Array.isArray(data.entries) ? data.entries : Array.isArray(data) ? data : [];
  const filtered = searchEntries(entries, req.query.q, ["nuer", "english"]);
  res.json({ metadata: data.metadata ?? null, ...paginate(filtered, req) });
});

// ---------------------------------------------------------------------------
// Translate proxy (server-side call to Google's unofficial endpoint, so the
// browser never has to make a cross-origin request and a key-based provider
// can be swapped in later without touching the frontend contract).
// ---------------------------------------------------------------------------

const LANG_PAIRS = {
  "en-to-nus": ["en", "nus"],
  "nus-to-en": ["nus", "en"],
  "en-to-din": ["en", "din"],
  "din-to-en": ["din", "en"],
  "nus-to-din": ["nus", "din"],
  "din-to-nus": ["din", "nus"],
};

app.post("/api/translate", async (req, res) => {
  const { text, direction } = req.body || {};
  const pair = LANG_PAIRS[direction];
  if (!text || !pair) {
    return res.status(400).json({ error: "Provide 'text' and a valid 'direction'." });
  }

  try {
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.searchParams.set("client", "gtx");
    url.searchParams.set("sl", pair[0]);
    url.searchParams.set("tl", pair[1]);
    url.searchParams.set("dt", "t");
    url.searchParams.set("q", text);

    const upstream = await fetch(url.toString());
    if (!upstream.ok) throw new Error(`Upstream translate failed (${upstream.status})`);

    const data = await upstream.json();
    const translated = Array.isArray(data?.[0]) ? data[0].map((chunk) => chunk[0]).join("") : text;
    res.json({ translated });
  } catch (err) {
    res.status(502).json({ error: err.message || "Translation failed" });
  }
});

// ---------------------------------------------------------------------------
// Static frontend (production only — after `npm run build`)
// ---------------------------------------------------------------------------

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  // naath-library is a static asset already inside dist/ (copied from public/),
  // so express.static above serves it. SPA fallback for hash-routed pages:
  app.get(/^(?!\/api\/).*/, (_req, res) => {
    res.sendFile(path.join(DIST_DIR, "index.html"));
  });
} else {
  app.get("/", (_req, res) => {
    res.send(
      "Dayom Lab API is running. Run `npm run build` first, then restart this server, to also serve the frontend from here."
    );
  });
}

app.listen(PORT, () => {
  console.log(`Dayom Lab backend listening on http://localhost:${PORT}`);
});
