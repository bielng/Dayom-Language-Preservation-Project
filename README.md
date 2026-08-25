# Dayom AI Studio

A full site for **Dayom Lab** — chat, translate, transcribe, and synthesize
speech for **Nuer (Thok Naath)** and **Dinka (Thuɔŋjäŋ)**, plus a full open
data library and community phrasebook.

The homepage's design system, typography, and component patterns come from
[NAATH-ARCHIVE/Ai_lab](https://github.com/NAATH-ARCHIVE/Ai_lab). The Studio's
translation/speech logic comes from
[bielng/Dayom_new_features](https://github.com/bielng/Dayom_new_features).
The Phrasebook's data, audio, and interaction pattern come from
[bielng/Nuer_phrasebook_demo_v1](https://github.com/bielng/Nuer_phrasebook_demo_v1).
The nine marketing/policy pages (About, Datasets, Models, API, Contribute,
News, Privacy, Terms, Safety) are ported from
[21Bhang/Dayom-experimental](https://github.com/21Bhang/Dayom-experimental).
Everything is restyled to a single consistent visual system.

---

## Site map

The app is a single Vite/React build with a tiny hash router — three
independent areas, each with its own nav and a "Back to main site" link.

### `/` — Homepage
The original Ai_lab landing page (Navbar, Hero, TrustBar, PreserveSection,
WorkSection, LanguagesBand, NaathLibraryTeaser, AudienceSection, DinkaLibraryTeaser,
ContributeCTA, Footer), with:
- Hero CTA **"Translate for free"** → opens the Studio
- A **Naath Living Library** button → opens the 3D shelf experience
- A **Library teaser** section → opens the Library
- A **Dinka Digital Library** teaser → opens the Dinka library

### `/naath-library/` — Naath Living Library (3D shelf)
A standalone, self-contained page (own HTML/CSS/JS, ships its own copy of
the Nuer dictionary/vocabulary/structures/conversation/grammar data inline)
showing all 8 "volumes" on an interactive, draggable 3D bookshelf. It is
served as a static file at `/naath-library/` — not part of the hash router —
so it works the same in dev, preview, and production, and has its own
"⌂ Return to Dayom Lab" link back to `/`.

### `#/studio` — Dayom AI Studio
| Page | Route | What it does |
|---|---|---|
| Home | `#/studio` | Dashboard linking to each tool |
| Chat Assistant | `#/studio/chat` | Small local-knowledge-base Nuer/Dinka chat |
| Text Translation | `#/studio/translate` | English ⇄ Nuer ⇄ Dinka, via Google Translate |
| Speech Recognition | `#/studio/voice` | Browser speech-to-text → translation |
| Text to Speech | `#/studio/tts` | Nuer/Dinka speech synthesis via a hosted model |

### `#/library` — Naath Dayom Library
| Page | Route | UI |
|---|---|---|
| Home | `#/library` | Dashboard, one card per part |
| Dictionary | `#/library/dictionary` | Search, part-of-speech filter, A–Z quick-jump, "Random word" spotlight |
| Vocabulary | `#/library/vocabulary` | Flip-card grid — tap to reveal English |
| Structures | `#/library/structures` | Filterable pattern list, grouped by topic |
| Conversation | `#/library/conversation` | Chat-bubble dialogue view |
| Grammar | `#/library/grammar` | Numbered reveal/drill cards |
| Examples | `#/library/examples` | Sentence gallery + "Surprise me" random spotlight |
| Phrasebook | `#/library/phrasebook` | Search, category/dialect filters, on-screen Thok Naath keyboard, pronunciation audio |
| Grammar Guide | `#/library/guide` | The full grammar reference, parsed into searchable, collapsible sections with real tables |

### `#/dinka-library` — Dinka Digital Library
| Page | Route | UI |
|---|---|---|
| Home | `#/dinka-library` | Dashboard |
| Dictionary | `#/dinka-library/dictionary` | 9,199-entry Dinka ↔ English dictionary, 6 dialect regions / 18 dialect subcodes |

### Marketing & policy pages
Ported over from [21Bhang/Dayom-experimental](https://github.com/21Bhang/Dayom-experimental) —
standalone pages, each sharing the site's Navbar/Footer via `PageShell.jsx`:

| Page | Route | What it does |
|---|---|---|
| About | `#/about` | Mission, four commitments, workstreams, language coverage |
| Datasets | `#/datasets` | All 8 datasets with counts/fields/licences + Hugging Face mirrors |
| Models | `#/models` | Honest status board — what's live, beta, or research-only |
| API | `#/api` | How to call the corpus and Meta MMS speech models directly |
| Contribute | `#/contribute` | Ways to help, contribution process, attribution policy |
| News | `#/news` | Changelog-style release notes |
| Privacy | `#/privacy` | Privacy policy (draft) |
| Terms | `#/terms` | Terms of service (draft) |
| Safety | `#/safety` | Safety & responsible-use policy (draft) |

All the links, counts, and external URLs these pages use (GitHub, Hugging
Face, email) come from one file: `src/config/site.js`.

---

## Project structure

```
├── index.html                  Entry HTML — favicon links, page title
├── netlify.toml                Pins the Netlify build command/publish dir
├── vite.config.js              Vite + Tailwind v4 + vite-plugin-singlefile
├── eslint.config.js
├── server/
│   └── index.js                 Express backend — REST API over the JSON
│                                 datasets + a translate proxy; serves dist/
│                                 as static files once built
├── public/
│   ├── logo.png                 Dayom Lab logo (used via <Logo />)
│   ├── favicon.ico / favicon.png / favicon.svg
│   ├── naath-library/index.html Standalone 3D "Naath Living Library" shelf
│   │                             (self-contained page, own data + assets)
│   ├── audio/                   551 phrasebook pronunciation clips (.mp3)
│   └── data/
│       ├── phrasebook.json      401 phrasebook entries
│       └── library/             dictionary/vocabulary/structures/conversation/
│                                 grammar/examples (.json) + grammar-guide.md
└── src/
    ├── main.jsx / App.jsx        Hash router: "/", "/studio/*", "/library/*",
    │                             "/dinka-library/*", and the 9 SITE_PAGES
    │                             routes ("/about", "/datasets", etc.)
    ├── index.css                 Design tokens (cream/amber/ink palette),
    │                             .card/.chip/.btn-* classes, animations
    ├── config/
    │   └── site.js                Single source of truth: SITE, GITHUB,
    │                               HUGGINGFACE, CORPUS (all 8 datasets),
    │                               LANGUAGES, TTS, NAV_LINKS, FOOTER_COLUMNS
    ├── components/
    │   ├── Icons.jsx              Hand-drawn icon set (incl. <Logo />)
    │   ├── HomePage.jsx           Homepage assembly
    │   ├── Navbar.jsx, Hero.jsx, Footer.jsx, TrustBar.jsx,
    │   │   PreserveSection.jsx, WorkSection.jsx, LanguagesBand.jsx,
    │   │   AudienceSection.jsx, ContributeCTA.jsx, LibraryTeaser.jsx,
    │   │   DinkaLibraryTeaser.jsx, NaathLibraryTeaser.jsx
    │   ├── pages/                 Standalone marketing/policy pages
    │   │   ├── PageShell.jsx              Shared hero header + Navbar/Footer
    │   │   ├── LegalPage.jsx              Shared layout for Privacy/Terms/Safety
    │   │   ├── AboutPage.jsx, DatasetsPage.jsx, ModelsPage.jsx, ApiPage.jsx,
    │   │   │   ContributePage.jsx, NewsPage.jsx
    │   │   └── PrivacyPage.jsx, TermsPage.jsx, SafetyPage.jsx
    │   ├── studio/
    │   │   ├── StudioLayout.jsx           Studio nav + back link
    │   │   ├── StudioHome.jsx             Studio dashboard
    │   │   ├── StudioChat.jsx             Chat Assistant page
    │   │   ├── StudioTranslate.jsx        Text Translation page
    │   │   ├── StudioVoice.jsx            Speech Recognition page
    │   │   └── StudioTTS.jsx              Text to Speech page (Nuer + Dinka)
    │   ├── dinka-library/
    │   │   ├── DinkaLibraryLayout.jsx, DinkaLibraryHome.jsx
    │   │   └── DinkaDictionaryPage.jsx
    │   ├── library/
    │   │   ├── LibraryLayout.jsx          Library nav + back link
    │   │   ├── LibraryHome.jsx            Library dashboard
    │   │   ├── LibraryPageShell.jsx       Shared hero header + card wrapper
    │   │   ├── DataState.jsx              Shared loading/error state
    │   │   ├── DictionaryBrowser.jsx / DictionaryPage.jsx
    │   │   ├── PhraseTable.jsx            Shared table for the ELB-shaped
    │   │   │                              datasets (vocabulary/structures/
    │   │   │                              conversation/grammar)
    │   │   ├── PhraseVariants.jsx         List / flashcard / chat / drill
    │   │   │                              rendering variants for PhraseTable
    │   │   ├── VocabularyPage.jsx, StructuresPage.jsx,
    │   │   │   ConversationPage.jsx, GrammarPage.jsx
    │   │   ├── ExamplesBrowser.jsx / ExamplesPage.jsx
    │   │   ├── PhrasebookPage.jsx         Full phrasebook UI, its own page
    │   │   └── GrammarGuide.jsx / GuidePage.jsx  Markdown parser + reader
    │   └── phrasebook/
    │       ├── AudioButton.jsx, NuerKeyboard.jsx, useAudioPlayer.js
    │       (shared by PhrasebookPage)
    ├── data/
    │   └── chatKnowledge.js       Self-contained phrase base for Chat Assistant
    ├── services/
    │   ├── translate.js           Google Translate (unofficial) client
    │   └── tts.js                 Meta MMS speech synthesis client — one
    │                               provider, two model ids (nus/din), called
    │                               via the Hugging Face Inference API
    └── utils/
        └── useJsonData.js         Lazy fetch + in-memory cache for /public
                                    JSON/Markdown, keyed by tab/route
```

---

## Design system

All colors, type, buttons, and cards are tokens defined in `src/index.css`,
taken from Ai_lab's `@theme` block:

- **Palette:** cream (`#FFFDF7`–`#FAEFD1`), amber (`#F8D980`–`#E8B53A`),
  ink (`#0B1220`–`#F3F4F6`)
- **Type:** Inter (sans), JetBrains Mono (code)
- **Components:** `.card`, `.chip`, `.btn-primary` / `.btn-ghost` / `.btn-dark`,
  `.eyebrow`, `.section-title`, `.hero-glow`, `.dot-bg`
- **Icons:** hand-drawn inline SVGs in `Icons.jsx` — no icon library dependency
- **Logo:** `<Logo />` renders `/public/logo.png`, used in every nav (home,
  Studio, Library) and the footer

## Data & assets

- The **Studio's** translation/ASR call a live, unofficial Google Translate
  endpoint; TTS for **both** Nuer and Dinka calls Meta's MMS (Massively
  Multilingual Speech) models — `facebook/mms-tts-nus` and
  `facebook/mms-tts-din` — via the Hugging Face Inference API, so there's one
  documented speech provider instead of two different backends. Both
  translate and TTS need an internet connection to work.
- The **Library's** and **Phrasebook's** datasets (~2.4 MB of JSON + 16 MB of
  audio) live as static files in `public/data` and `public/audio` — they are
  **not** bundled into the JS, and are fetched lazily (on first tab open, or
  on page mount for dedicated routes) via `useJsonData`, so the initial page
  load stays light.
- The **Chat Assistant** ships a small, self-contained starter phrase list
  (`src/data/chatKnowledge.js`). Ai_lab's original chat/translator components
  referenced dataset JSON files that were never committed upstream, so this
  project doesn't depend on them.

## Running it

### Option A — frontend only (no backend, same as before)

```bash
npm install
npm run dev        # local dev server, http://localhost:5173
npm run build       # production build — outputs dist/index.html (app shell
                     # is inlined via vite-plugin-singlefile) plus dist/data,
                     # dist/audio, dist/naath-library, and favicon/logo files
npm run preview     # preview the production build
npm run lint        # eslint
```

This is enough to browse the whole site, including the Naath Living Library
at `/naath-library/` — its data is bundled in the page itself, no API needed.

### Option B — with the backend (recommended for the full project)

The backend is a small Express server (`server/index.js`) that exposes the
Library/Dinka/Phrasebook datasets as a REST API and proxies translation, and
also serves the built frontend so the whole app runs from one process.

**Step by step:**

```bash
# 1) Install dependencies (frontend + backend, same package.json)
npm install

# 2) Build the frontend once (creates dist/)
npm run build

# 3) Start the backend — serves the API *and* the built site
npm run server
# → Dayom Lab backend listening on http://localhost:8787
```

Then open **http://localhost:8787** in your browser — that's the whole
site (home page, Studio, Library, Dinka Library, Naath Living Library) plus
the API, from a single server. `npm start` does steps 2 and 3 together
(`npm run build && npm run server`).

For active frontend development against the backend, run the two dev
servers side by side in separate terminals — `npm run dev` (Vite, hot
reload, port 5173) and `npm run server` (API, port 8787) — the frontend's
`services/translate.js` calls Google directly so this split works without
any extra configuration.

**API endpoints** (all return JSON, `GET` unless noted):

| Endpoint | Notes |
|---|---|
| `/api/health` | Uptime check |
| `/api/library/:section` | `section` = `dictionary`\|`vocabulary`\|`structures`\|`conversation`\|`grammar`\|`examples`. Query params: `q` (search), `limit`, `offset` |
| `/api/library/:section/random` | One random entry from that section |
| `/api/dinka/dictionary` | Same `q`/`limit`/`offset` params, over the 9,199-entry Dinka set |
| `/api/phrasebook` | Same params, over the phrasebook |
| `/api/translate` | `POST` `{ "text": "...", "direction": "en-to-nus" }` → `{ "translated": "..." }`. Directions: `en-to-nus`, `nus-to-en`, `en-to-din`, `din-to-en`, `nus-to-din`, `din-to-nus` |

The frontend itself doesn't call this API yet (it still reads the JSON
files directly and calls Google Translate from the browser, as before) —
the backend is there as a ready-to-use foundation for a native app, a CLI,
or a future frontend refactor that wants a single source of truth on the
server side instead of shipping raw JSON to the client.

## Deploying (Netlify)

`netlify.toml` pins the build config so a stale dashboard setting can't
override it:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

If Library/Phrasebook data 404s on a live deploy, it almost always means
`public/data` and/or `public/audio` weren't committed to the repo — check
that they're actually present on GitHub before re-deploying.
