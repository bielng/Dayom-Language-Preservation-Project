import { useState } from "react";

// ---------- List (default) ----------
export function ListItems({ items }) {
  return (
    <div className="grid sm:grid-cols-2 gap-2.5">
      {items.map((e, i) => (
        <div key={i} className="bg-cream-50 border border-ink-200 rounded-xl px-3.5 py-2.5">
          <p className="text-sm font-semibold text-ink-900">{e.nuer}</p>
          <p className="text-xs text-ink-600 mt-0.5">{e.english}</p>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-300/30 text-ink-700 font-medium">
              {e.topic_title}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- Flashcards (vocabulary) ----------
function Flashcard({ entry }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      className="text-left bg-white border border-ink-200 rounded-2xl px-4 py-5 hover:border-ink-300 transition min-h-[104px] flex flex-col justify-center relative overflow-hidden"
      style={{ perspective: "600px" }}
    >
      <span className="absolute top-2.5 right-3 text-[9px] uppercase tracking-wider text-ink-300 font-semibold">
        {flipped ? "English" : "Nuer"}
      </span>
      {flipped ? (
        <div className="animate-fade-in">
          <p className="text-sm font-semibold text-ink-900">{entry.english}</p>
          <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-300/30 text-ink-700 font-medium">
            {entry.topic_title}
          </span>
        </div>
      ) : (
        <p className="text-lg font-bold text-ink-900 animate-fade-in">{entry.nuer}</p>
      )}
      <span className="mt-2 text-[10px] text-ink-400">Tap to flip</span>
    </button>
  );
}

export function FlashcardGrid({ items }) {
  return (
    <div className="grid sm:grid-cols-3 gap-3">
      {items.map((e, i) => <Flashcard key={i} entry={e} />)}
    </div>
  );
}

// ---------- Chat bubbles (conversation) ----------
export function ChatBubbles({ items }) {
  return (
    <div className="space-y-3 max-w-2xl mx-auto">
      {items.map((e, i) => {
        const fromRight = i % 2 === 1;
        return (
          <div key={i} className={`flex ${fromRight ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${fromRight ? "bg-ink-900 text-white rounded-br-md" : "bg-cream-100 text-ink-800 rounded-bl-md"}`}>
              <p className="text-sm font-semibold">{e.nuer}</p>
              <p className={`text-xs mt-0.5 ${fromRight ? "text-white/70" : "text-ink-500"}`}>{e.english}</p>
              <span className={`inline-block mt-1.5 text-[9px] uppercase tracking-wide ${fromRight ? "text-white/50" : "text-ink-400"}`}>
                {e.topic_title}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Drill / reveal cards (grammar) ----------
function DrillCard({ entry, index }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="bg-white border border-ink-200 rounded-2xl px-4 py-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="h-6 w-6 rounded-full bg-violet-200/60 text-ink-900 text-[11px] font-bold flex items-center justify-center shrink-0">
          {index + 1}
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-300/30 text-ink-700 font-medium">{entry.topic_title}</span>
      </div>
      <p className="text-base font-semibold text-ink-900">{entry.nuer}</p>
      {revealed ? (
        <p className="text-sm text-ink-600 mt-1.5 animate-fade-in">{entry.english}</p>
      ) : (
        <button
          onClick={() => setRevealed(true)}
          className="mt-2 text-xs font-medium text-ink-500 hover:text-ink-900 underline underline-offset-4 decoration-ink-300"
        >
          Reveal English
        </button>
      )}
    </div>
  );
}

export function DrillCards({ items }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {items.map((e, i) => <DrillCard key={i} entry={e} index={i} />)}
    </div>
  );
}
