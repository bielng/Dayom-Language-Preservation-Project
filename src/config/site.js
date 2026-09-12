// Single source of truth for every outward-facing link, handle, and headline
// number used across the marketing/policy pages (About, Datasets, Models,
// API, Contribute, News, Privacy, Terms, Safety) and the Navbar/Footer.
// Change a URL here and it updates everywhere it's used.

export const SITE = {
  name: "Dayom Lab",
  legalName: "Dayom Lab",
  tagline: "Bringing South Sudanese languages to the digital world",
  email: "dayomtech@gmail.com",
  location: "Juba, South Sudan",
};

// The org that owns triage/contribution for this project. Both "contribute
// on GitHub" and "open an issue" point at the same org page per the current
// setup — there isn't a separate per-repo issue tracker being used yet.
const GH_CONTRIBUTE_URL = "https://github.com/NAATH-ARCHIVE";

// Where the actual corpus JSON files live in version control (this site's
// own repository) — kept separate from GH_CONTRIBUTE_URL above since that's
// the org people should go to in order to contribute or file an issue.
const GH_CORPUS_REPO = "https://github.com/bielng/demo_dayom_studio";

export const GITHUB = {
  org: GH_CONTRIBUTE_URL,
  repoUrl: GH_CONTRIBUTE_URL,
  issues: GH_CONTRIBUTE_URL,
  newIssue: GH_CONTRIBUTE_URL,
  discussions: GH_CONTRIBUTE_URL,
  pulls: GH_CONTRIBUTE_URL,
  corpusDir: `${GH_CORPUS_REPO}/tree/main/public/data`,
  contributing: `${GH_CORPUS_REPO}/blob/main/README.md`,
};

// Hugging Face is where the corpus and models are mirrored for anyone who'd
// rather pull from the Hub than fetch static JSON off this site.
export const HUGGINGFACE = {
  datasets: [
    {
      id: "naathnlp",
      label: "NaathNLP",
      url: "https://huggingface.co/NaathNLP/datasets",
    },
    {
      id: "dayomtechnologies",
      label: "Dayom Technologies",
      url: "https://huggingface.co/dayomtechnologies/datasets",
    },
  ],
  models: "https://huggingface.co/dayomtechnologies/models",
  spaces: "https://huggingface.co/dayomtechnologies/spaces",
};

// TODO(handles): swap the `url` values for the real accounts, then delete this note.
// Any entry left as null is hidden from the UI rather than rendered as a dead link.
export const SOCIALS = [
  { id: "github", label: "GitHub", url: GITHUB.org },
  { id: "twitter", label: "X (Twitter)", url: null },
  { id: "facebook", label: "Facebook", url: null },
  { id: "linkedin", label: "LinkedIn", url: null },
];

// Real, verified counts read from public/data at build-review time.
// Update alongside the corpus so the site never overstates what ships.
export const CORPUS = {
  datasets: [
    {
      id: "dictionary",
      name: "Nuer Dictionary",
      entries: 3209,
      file: "/data/library/dictionary.json",
      href: "/library/dictionary",
      blurb:
        "English ↔ Nuer headwords with part of speech, alternative spellings, and usage examples.",
      fields: [
        "english",
        "nuer",
        "partOfSpeech",
        "alternatives",
        "examples",
        "source",
      ],
      license: "Open Source",
      source: "Merged from nuer_dictionary + english_nuer_indexed",
    },
    {
      id: "dinka-dictionary",
      name: "Dinka Dictionary",
      entries: 9199,
      file: "/data/dinka/dictionary.json",
      href: "/dinka-library/dictionary",
      blurb:
        "Dinka (Thuɔŋjäŋ) ↔ English headwords covering 6 dialect regions and 18 dialect subcodes.",
      fields: ["dinka", "english", "partOfSpeech", "dialectTags", "example"],
      license: "Open Source",
      source: "Community contributors",
    },
    {
      id: "structures",
      name: "Sentence Structures",
      entries: 1250,
      file: "/data/library/structures.json",
      href: "/library/structures",
      blurb:
        "Sentence-level parallel pairs grouped by grammatical topic, for pattern drilling and few-shot prompting.",
      fields: [
        "topic_title",
        "category",
        "nuer",
        "english",
        "source",
        "license",
      ],
      license: "Open Source",
      source: "Ethio Language Box",
    },
    {
      id: "vocabulary",
      name: "Vocabulary",
      entries: 966,
      file: "/data/library/vocabulary.json",
      href: "/library/vocabulary",
      blurb:
        "Topic-organised word lists spanning everyday domains — family, numbers, body, food, place.",
      fields: [
        "topic_title",
        "category",
        "nuer",
        "english",
        "source",
        "license",
      ],
      license: "Open Source",
      source: "Ethio Language Box",
    },
    {
      id: "conversation",
      name: "Conversation",
      entries: 810,
      file: "/data/library/conversation.json",
      href: "/library/conversation",
      blurb:
        "Dialogue turns and conversational exchanges covering greetings, requests, and daily interaction.",
      fields: [
        "topic_title",
        "category",
        "nuer",
        "english",
        "source",
        "license",
      ],
      license: "Open Source",
      source: "Ethio Language Box",
    },
    {
      id: "phrasebook",
      name: "Phrasebook + Audio",
      entries: 401,
      audioClips: 551,
      file: "/data/phrasebook.json",
      href: "/library/phrasebook",
      blurb:
        "Community phrasebook with IPA transcription, plural forms, sense glosses, dialect notes, and recorded pronunciation.",
      fields: [
        "nuer",
        "ipa",
        "part_of_speech",
        "plural_info",
        "senses",
        "examples",
        "audio_files",
        "dialect",
      ],
      license: "Open Source",
      source: "Community contributors",
    },
    {
      id: "grammar",
      name: "Grammar Drills",
      entries: 257,
      file: "/data/library/grammar.json",
      href: "/library/grammar",
      blurb:
        "Grammar exercises keyed to specific rules — negation, tense marking, copula, and possession.",
      fields: [
        "topic_title",
        "category",
        "nuer",
        "english",
        "source",
        "license",
      ],
      license: "Open Source",
      source: "Ethio Language Box",
    },
    {
      id: "examples",
      name: "Curated Examples",
      entries: 221,
      file: "/data/library/examples.json",
      href: "/library/examples",
      blurb:
        "Hand-checked Thok Nath ↔ English pairs across 18 categories, built specifically for few-shot prompting.",
      fields: ["nuer", "english", "category", "pattern"],
      license: "Mixed — see per-record source",
      source: "ELB, African Storybook (CC BY 4.0), Nuer Bible, grammar rules",
    },
  ],

  // Prose reference set that ships alongside the structured data.
  reference: {
    name: "Grammar Guide",
    file: "/data/library/grammar-guide.md",
    href: "/library/guide",
    blurb:
      "A long-form Thok Nath grammar reference in Markdown, covering the rule set the datasets encode.",
  },

  sources: [
    {
      name: "Ethio Language Box",
      license: "Open Source",
      url: "https://ethiolanguagebox.com",
    },
    {
      name: "African Storybook",
      license: "CC BY 4.0",
      url: "https://africanstorybook.org",
    },
    {
      name: "Nuer Bible (RUAC KUƆTH IN RƐL RƆ)",
      license: "Bible Society in South Sudan",
      url: null,
    },
    { name: "Community contributors", license: "Open Source", url: null },
  ],
};

export const CORPUS_TOTAL = CORPUS.datasets.reduce(
  (sum, d) => sum + d.entries,
  0,
);
export const AUDIO_TOTAL = CORPUS.datasets.reduce(
  (sum, d) => sum + (d.audioClips || 0),
  0,
);

// Dinka now ships live (dictionary + the Dinka Digital Library), so it moved
// out of "next" — keep this list in sync with what's actually browsable.
export const LANGUAGES = {
  live: ["Nuer (Thok Naath)", "Dinka (Thuɔŋjäŋ)"],
  next: ["Shilluk (Dhøg Cøllø)", "Bari", "Zande", "Murle"],
};

// Nuer and Dinka speech synthesis run on fine-tuned Meta MMS models
// hosted as dedicated Hugging Face Spaces (Gradio). The public Inference
// API is no longer used — Spaces give better quality, reliability, and
// a natural-sounding voice instead of the generic base checkpoint.
export const TTS = {
  provider: "Meta MMS (fine-tuned) via Hugging Face Spaces",
  providerUrl: "https://huggingface.co/facebook/mms-tts",
  spaces: {
    nus: "dayomtechnologies/Text_To_Speech_Thok_Naath",
    din: "Alaak/Dinka_Text_To_Speech",
  },
  // Base model IDs kept for reference (Models page, docs, etc.)
  // and as the last-resort Inference API fallback if the Space is down.
  models: {
    nus: "facebook/mms-tts-nus",
    din: "facebook/mms-tts-dik",
  },
};

// Fine-tuned translation and chat models, served as public Gradio Spaces so
// the browser can call them directly with no API key (same pattern as TTS).
// Nuer only for now — there is no Dinka Space yet, so Dinka falls back to the
// dataset pipeline in services/translate.js.
export const MT = {
  spaces: {
    // /translate → { text, direction: "English to Nuer" | "Nuer to English" }
    nus: "dayomtechnologies/English_to_Nuer_Translator",
  },
  // Underlying checkpoints, for the Models page and docs.
  models: {
    nus: "dayomtechnologies/nllb-600m-english-nuer",
    nusBidirectional: "dayomtechnologies/MT_Nuer_to_English_Bidirectional",
  },
  chat: {
    // /chat → { message } ; runs on ZeroGPU and needs an HF token for API use.
    space: "dayomtechnologies/Thok_Naath_Chatbot_Via_Pivot_Pipeline",
    model: "dayomtechnologies/llama32-3b-nuer-lora",
  },
};

// Primary navigation — hash routes, matching the existing /studio and
// /library pattern already used across the site.
export const NAV_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Datasets", href: "/datasets" },
  { label: "Models", href: "/models" },
  { label: "Library", href: "/library" },
  { label: "Living Library", href: "/naath-library/index.html" },
  { label: "Studio", href: "/studio" },
  { label: "API", href: "/api" },
];

export const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Open Corpus", href: "/datasets" },
      { label: "Models", href: "/models" },
      { label: "API Access", href: "/api" },
      { label: "Library", href: "/library" },
      { label: "Dinka Library", href: "/dinka-library" },
      { label: "Studio", href: "/studio" },
    ],
  },
  {
    heading: "Organisation",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Mission", href: "/about" },
      { label: "Get Involved", href: "/contribute" },
      { label: "Submit A Translation Pair", href: "/contribute/submit" },
      { label: "News", href: "/news" },
      { label: "Contribute on GitHub", href: GITHUB.repoUrl, external: true },
      { label: "Open an Issue", href: GITHUB.newIssue, external: true },
      { label: "Email Us", href: `mailto:${SITE.email}` },
    ],
  },
  {
    heading: "Trust",
    links: [
      { label: "Safety", href: "/safety" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Data Licensing", href: "/datasets" },
    ],
  },
];

// Shown on the drafted legal pages. Bump when the text is reviewed and signed off.
export const LEGAL_LAST_UPDATED = "August 2026";
export const LEGAL_IS_DRAFT = true;
