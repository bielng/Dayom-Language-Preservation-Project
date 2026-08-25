import PageShell, { Section, Prose } from "./PageShell.jsx";
import { Newspaper, ArrowRight, ArrowUpRight, Github, Mail } from "../Icons.jsx";
import { GITHUB, SITE, CORPUS_TOTAL, AUDIO_TOTAL } from "../../config/site.js";

// Entries below are project milestones we can point at concrete artefacts for —
// dataset metadata timestamps and repository history. Add new items at the top.
const UPDATES = [
  {
    date: "August 2026",
    tag: "Models",
    title: "Nuer & Dinka text-to-speech unified on Meta MMS",
    body:
      "Speech synthesis for both languages now runs through the same provider — Meta's MMS (Massively Multilingual Speech) models — instead of two different custom backends. One call shape, two model ids, no separate fallback story for Dinka.",
    links: [
      { label: "Try text-to-speech", href: "#/studio/tts" },
      { label: "Model status", href: "#/models" },
    ],
  },
  {
    date: "August 2026",
    tag: "Release",
    title: "Dinka Digital Library goes live",
    body:
      "A 9,199-entry Dinka (Thuɔŋjäŋ) dictionary spanning 6 dialect regions and 18 dialect subcodes ships as its own library, alongside the existing Nuer library.",
    links: [{ label: "Open the Dinka Library", href: "#/dinka-library" }],
  },
  {
    date: "August 2026",
    tag: "Release",
    title: "Naath Living Library — an interactive 3D shelf",
    body:
      "A standalone, self-contained page showing all 8 Nuer data 'volumes' on a draggable 3D bookshelf, bundling its own copy of the dictionary, vocabulary, structures, conversation, and grammar data inline.",
    links: [{ label: "Explore the shelf", href: "/naath-library/index.html" }],
  },
  {
    date: "August 2026",
    tag: "Release",
    title: "Studio and Library go live",
    body:
      "The public Studio (chat, translation, voice input, speech synthesis) and the Naath Dayom Library ship together, putting a browsable interface over the whole corpus. Both are free and need no account.",
    links: [
      { label: "Open the Studio", href: "#/studio" },
      { label: "Open the Library", href: "#/library" },
    ],
  },
  {
    date: "July 2026",
    tag: "Data",
    title: `Open corpus published — ${CORPUS_TOTAL.toLocaleString()} records`,
    body:
      `Eight datasets released openly: the Nuer dictionary, the Dinka dictionary, sentence structures, vocabulary, conversation, grammar drills, curated examples, and a community phrasebook with ${AUDIO_TOTAL} pronunciation clips. Every record ships with its source attached.`,
    links: [
      { label: "View the datasets", href: "#/datasets" },
      { label: "Licensing", href: "#/datasets" },
    ],
  },
  {
    date: "July 2026",
    tag: "Data",
    title: "Dictionary v1.0 — 3,209 merged entries",
    body:
      "Two separate English ↔ Nuer dictionary sources were reconciled and deduplicated into a single indexed set with part of speech, alternative spellings, and usage examples.",
    links: [{ label: "Browse the dictionary", href: "#/library/dictionary" }],
  },
];

export default function NewsPage() {
  return (
    <PageShell
      eyebrow="News"
      title="What has shipped"
      lede={`Release notes and project milestones from ${SITE.name}. We post here when something is actually usable, not when it is planned.`}
    >
      <div className="card p-5 sm:p-6 mb-12 flex items-start gap-3">
        <span className="mt-0.5 text-ink-400 shrink-0"><Newspaper /></span>
        <p className="text-sm text-ink-500 leading-relaxed">
          This is a changelog rather than a press page — there are no media announcements yet. For
          day-to-day activity, the{" "}
          <a
            href={GITHUB.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="text-ink-900 underline underline-offset-4 decoration-ink-300 hover:decoration-ink-900"
          >
            repository history
          </a>{" "}
          is the most current record of what is changing.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-0 sm:left-[7.5rem] top-2 bottom-2 w-px bg-ink-200 hidden sm:block" />

        <div className="space-y-10">
          {UPDATES.map((u, i) => (
            <article key={i} className="sm:grid sm:grid-cols-[7.5rem_1fr] sm:gap-8 relative">
              <div className="sm:text-right sm:pr-8 mb-3 sm:mb-0">
                <div className="text-xs text-ink-400 font-mono whitespace-nowrap">{u.date}</div>
              </div>

              <div className="relative">
                <span className="absolute -left-[calc(2rem+1px)] top-1.5 h-2.5 w-2.5 rounded-full bg-amber-300 ring-4 ring-[#f9f6ee] hidden sm:block" />

                <span className="inline-flex text-[11px] font-medium px-2.5 py-1 rounded-full bg-ink-100 text-ink-700 mb-3">
                  {u.tag}
                </span>
                <h2 className="font-semibold text-ink-900 text-[17px] leading-snug">{u.title}</h2>
                <p className="mt-2 text-sm text-ink-500 leading-relaxed max-w-2xl">{u.body}</p>

                {u.links && (
                  <div className="mt-4 flex items-center gap-5 flex-wrap">
                    {u.links.map((l) => (
                      <a
                        key={l.label}
                        href={l.href}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-900 underline underline-offset-4 decoration-ink-300 hover:decoration-ink-900"
                      >
                        {l.label} <ArrowRight />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      <Section eyebrow="Stay Updated" title="Follow the work" className="mt-20">
        <Prose>
          <p>
            There is no mailing list yet. Watching the repository is the reliable way to see changes
            as they land, and press or partnership enquiries are welcome by email.
          </p>
        </Prose>
        <div className="mt-7 flex items-center gap-3 flex-wrap">
          <a href={GITHUB.repoUrl} target="_blank" rel="noreferrer" className="btn-primary">
            <Github /> Watch on GitHub
          </a>
          <a href={`mailto:${SITE.email}?subject=Press%20enquiry`} className="btn-ghost">
            <Mail /> Press enquiries
          </a>
          <a href="#/contribute" className="btn-ghost">
            Get involved <ArrowUpRight />
          </a>
        </div>
      </Section>
    </PageShell>
  );
}
