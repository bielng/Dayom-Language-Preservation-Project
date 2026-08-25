import { ArrowUpRight, Sparkle } from "./Icons.jsx";

const PARTS = ["Dictionary", "Vocabulary", "Structures", "Conversation", "Grammar", "Examples", "Phrasebook", "Grammar Guide"];

export default function LibraryTeaser() {
  return (
    <section className="relative py-20 dot-bg">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="eyebrow mb-3">Open Data</p>
        <h2 className="section-title">Naath Dayom Library</h2>
        <p className="mt-4 text-[15px] text-ink-500 leading-relaxed max-w-xl mx-auto">
          Every dataset behind Dayom Lab's Nuer language tools in one place — dictionary,
          vocabulary flashcards, sentence structures, conversation, grammar drills,
          curated examples, the community phrasebook with pronunciation audio, and a
          full grammar reference.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-1.5">
          {PARTS.map((p) => (
            <span key={p} className="text-xs px-3 py-1.5 rounded-full border border-ink-200 bg-white text-ink-600">
              {p}
            </span>
          ))}
        </div>

        <div className="mt-8">
          <a href="#/library" className="btn-primary">
            <Sparkle /> Explore the Library <ArrowUpRight />
          </a>
        </div>
      </div>
    </section>
  );
}
