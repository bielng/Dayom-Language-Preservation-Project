import { useState } from "react";
import { Rotate } from "../Icons.jsx";

export function ListItems({ items }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3 px-1">
          <p className="text-sm font-semibold text-ink-900">{item.nuer}</p>
          <p className="text-sm text-ink-500">{item.english}</p>
        </div>
      ))}
    </div>
  );
}

export function FlashcardGrid({ items }) {
  const [flipped, setFlipped] = useState({});

  const toggle = (id) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((item, i) => {
        const isFlipped = flipped[i];
        return (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={`relative aspect-[4/3] sm:aspect-[3/2] rounded-2xl border border-ink-200 bg-white p-4 sm:p-5 text-left transition-all hover:shadow-md active:scale-[0.98] overflow-hidden ${
              isFlipped ? "bg-cream-50" : ""
            }`}
          >
            <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 transition-opacity ${isFlipped ? "opacity-0" : "opacity-100"}`}>
              <p className="text-base sm:text-lg font-semibold text-ink-900 text-center">{item.nuer}</p>
              <p className="text-xs text-ink-400 mt-1 text-center">{item.topic_title}</p>
            </div>
            <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 transition-opacity ${isFlipped ? "opacity-100" : "opacity-0"}`}>
              <p className="text-sm sm:text-base text-ink-700 text-center">{item.english}</p>
            </div>
            <Rotate className="absolute bottom-3 right-3 w-4 h-4 text-ink-300" />
          </button>
        );
      })}
    </div>
  );
}

export function ChatBubbles({ items }) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="bg-cream-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-full sm:max-w-[80%]">
            <p className="text-sm font-semibold text-ink-900">{item.nuer}</p>
          </div>
          <div className="bg-white border border-ink-200 rounded-2xl rounded-br-md px-4 py-3 max-w-full sm:max-w-[80%] self-end">
            <p className="text-sm text-ink-600">{item.english}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DrillCards({ items }) {
  const [revealed, setRevealed] = useState({});

  const toggle = (id) => {
    setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isRevealed = revealed[i];
        return (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="w-full text-left rounded-2xl border border-ink-200 bg-white p-4 sm:p-5 transition hover:shadow-md active:scale-[0.98]"
          >
            <p className="text-sm font-semibold text-ink-900">{item.nuer}</p>
            <div className={`mt-2 transition-all ${isRevealed ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
              <p className="text-sm text-ink-600 border-t border-ink-100 pt-2">{item.english}</p>
            </div>
            <p className="text-xs text-ink-400 mt-2">{isRevealed ? "Tap to hide" : "Tap to reveal"}</p>
          </button>
        );
      })}
    </div>
  );
}
