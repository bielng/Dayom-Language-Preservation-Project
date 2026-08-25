import { Sparkle, ArrowRight } from "../Icons.jsx";

const PARTS = [
  {
    id: "dictionary", href: "#/library/dictionary", title: "Dictionary", count: "3,209 words",
    body: "The full English–Nuer word list. Search, filter by part of speech, and jump straight to a letter.",
    accent: "bg-amber-300/40",
  },
  {
    id: "vocabulary", href: "#/library/vocabulary", title: "Vocabulary", count: "966 flashcards",
    body: "Everyday vocabulary as flip-cards — tap a card to reveal the English meaning.",
    accent: "bg-emerald-200/50",
  },
  {
    id: "structures", href: "#/library/structures", title: "Structures", count: "1,250 patterns",
    body: "Sentence patterns and grammatical structures, grouped by topic.",
    accent: "bg-sky-200/50",
  },
  {
    id: "conversation", href: "#/library/conversation", title: "Conversation", count: "810 lines",
    body: "Everyday dialogue, laid out as back-and-forth conversation.",
    accent: "bg-rose-200/50",
  },
  {
    id: "grammar", href: "#/library/grammar", title: "Grammar", count: "257 drills",
    body: "Grammar drills as reveal cards — think it through, then check the answer.",
    accent: "bg-violet-200/50",
  },
  {
    id: "examples", href: "#/library/examples", title: "Examples", count: "221 sentences",
    body: "Curated example sentences by category — a gallery to browse or get a random one.",
    accent: "bg-orange-200/50",
  },
  {
    id: "phrasebook", href: "#/library/phrasebook", title: "Phrasebook", count: "401 words · audio",
    body: "The community phrasebook — search, filter by category or dialect, and hear real pronunciation audio.",
    accent: "bg-pink-200/50",
  },
  {
    id: "guide", href: "#/library/guide", title: "Grammar Guide", count: "reference",
    body: "The full Thok Naath grammar reference — searchable, sectioned, and readable.",
    accent: "bg-cream-200",
  },
];

export default function LibraryHome() {
  return (
    <div className="relative hero-glow">
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="eyebrow mb-4">Open Data</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink-900 leading-[1.1]">
            The Naath Dayom Library
          </h1>
          <p className="mt-6 text-[15px] sm:text-base text-ink-500 leading-relaxed">
            Every dataset behind Dayom Lab's Nuer language tools, browsable in one
            place — each with a UI shaped for how that content is actually used.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 gap-5">
          {PARTS.map((part) => (
            <a
              key={part.id}
              href={part.href}
              className="card p-6 group hover:border-ink-300 transition shadow-[0_1px_2px_rgba(11,18,32,0.04)] hover:shadow-[0_10px_30px_rgba(11,18,32,0.08)]"
            >
              <div className={`h-11 w-11 rounded-full ${part.accent} flex items-center justify-center text-ink-900 mb-5 font-bold text-sm`}>
                {part.title.charAt(0)}
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-ink-900 text-lg">{part.title}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-ink-100 text-ink-500 font-medium">{part.count}</span>
              </div>
              <p className="mt-2.5 text-sm text-ink-500 leading-relaxed">{part.body}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-900 underline underline-offset-4 decoration-ink-300 group-hover:decoration-ink-900">
                Open {part.title} <ArrowRight />
              </span>
            </a>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-300/35 px-4 py-2 text-xs text-ink-700">
            <Sparkle /> Sourced from Ethio Language Box, curated corpora, and community contributors
          </div>
        </div>
      </div>
    </div>
  );
}
