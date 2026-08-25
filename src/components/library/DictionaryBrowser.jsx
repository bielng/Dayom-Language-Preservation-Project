import { useMemo, useState } from "react";
import { useJsonData } from "../../utils/useJsonData.js";
import DataState from "./DataState.jsx";
import { Search, X, Sparkle, Rotate } from "../Icons.jsx";

const PAGE_SIZE = 60;

const POS_LABEL = {
  noun: "Noun",
  verb: "Verb",
  adjective: "Adjective",
  adverb: "Adverb",
  pronoun: "Pronoun",
};

function normalise(value = "") {
  return String(value).toLowerCase();
}

function firstLetter(word = "") {
  return word.trim().charAt(0).toUpperCase() || "#";
}

export default function DictionaryBrowser({ url, active }) {
  const { status, data, error } = useJsonData(url, { active });
  const [query, setQuery] = useState("");
  const [pos, setPos] = useState("All");
  const [letter, setLetter] = useState("All");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [spotlight, setSpotlight] = useState(null);

  const entries = useMemo(() => data?.entries ?? [], [data]);

  const posOptions = useMemo(() => {
    const set = new Set(entries.map((e) => e.partOfSpeech).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [entries]);

  const letters = useMemo(() => {
    const set = new Set(entries.map((e) => firstLetter(e.nuer)));
    return Array.from(set).sort();
  }, [entries]);

  const filtered = useMemo(() => {
    const q = normalise(query.trim());
    return entries.filter((e) => {
      if (pos !== "All" && e.partOfSpeech !== pos) return false;
      if (letter !== "All" && firstLetter(e.nuer) !== letter) return false;
      if (!q) return true;
      return (
        normalise(e.english).includes(q) ||
        normalise(e.nuer).includes(q) ||
        (e.alternatives || []).some((a) => normalise(a).includes(q))
      );
    });
  }, [entries, query, pos, letter]);

  const visible = filtered.slice(0, limit);

  const showRandom = () => {
    if (entries.length === 0) return;
    setSpotlight(entries[Math.floor(Math.random() * entries.length)]);
  };

  return (
    <DataState status={status} error={error}>
      <div>
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setLimit(PAGE_SIZE); }}
              placeholder="Search the dictionary — English or Nuer…"
              className="w-full bg-cream-50 rounded-full pl-10 pr-9 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 border border-ink-200 outline-none focus:border-ink-400"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-900">
                <X />
              </button>
            )}
          </div>
          <select
            value={pos}
            onChange={(e) => { setPos(e.target.value); setLimit(PAGE_SIZE); }}
            className="chip font-medium sm:w-48 shrink-0"
            style={{ padding: "0.55rem 1rem" }}
          >
            {posOptions.map((p) => <option key={p} value={p}>{POS_LABEL[p] || p}</option>)}
          </select>
          <button onClick={showRandom} className="btn-primary shrink-0 whitespace-nowrap">
            <Sparkle /> Random word
          </button>
        </div>

        {spotlight && (
          <div className="mb-4 card p-5 bg-amber-300/15 border-amber-300/60 animate-fade-in flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow mb-1">Word spotlight</p>
              <h4 className="text-xl font-bold text-ink-900">{spotlight.nuer}</h4>
              <p className="text-sm text-ink-600 mt-0.5">{spotlight.english}</p>
              {spotlight.partOfSpeech && (
                <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-300/40 text-ink-700 font-medium">
                  {POS_LABEL[spotlight.partOfSpeech] || spotlight.partOfSpeech}
                </span>
              )}
            </div>
            <button onClick={showRandom} className="shrink-0 p-2 rounded-full bg-white border border-ink-200 hover:bg-cream-100" title="Another word">
              <Rotate />
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-1 mb-4">
          <button
            onClick={() => { setLetter("All"); setLimit(PAGE_SIZE); }}
            className={`h-7 min-w-7 px-2 rounded-lg text-xs font-medium transition ${letter === "All" ? "bg-ink-900 text-white" : "bg-white border border-ink-200 text-ink-600 hover:border-ink-400"}`}
          >
            All
          </button>
          {letters.map((l) => (
            <button
              key={l}
              onClick={() => { setLetter(l); setLimit(PAGE_SIZE); }}
              className={`h-7 min-w-7 px-2 rounded-lg text-xs font-medium transition ${letter === l ? "bg-ink-900 text-white" : "bg-white border border-ink-200 text-ink-600 hover:border-ink-400"}`}
            >
              {l}
            </button>
          ))}
        </div>

        <p className="text-xs text-ink-400 mb-3">
          Showing {Math.min(visible.length, filtered.length)} of {filtered.length} words
          {data?.metadata?.totalEntries ? ` · ${data.metadata.totalEntries} in the full dictionary` : ""}
        </p>

        {visible.length === 0 ? (
          <div className="text-center py-10 text-sm text-ink-400">No words match your search.</div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-2.5">
            {visible.map((e) => (
              <div key={e.id} className="bg-cream-50 border border-ink-200 rounded-xl px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-semibold text-ink-900">{e.nuer}</h4>
                  {e.partOfSpeech && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-300/30 text-ink-700 font-medium">
                      {POS_LABEL[e.partOfSpeech] || e.partOfSpeech}
                    </span>
                  )}
                </div>
                <p className="text-sm text-ink-600 mt-0.5">{e.english}</p>
                {e.alternatives?.length > 0 && (
                  <p className="text-xs text-ink-400 mt-1">Also: {e.alternatives.join(", ")}</p>
                )}
                {e.examples?.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {e.examples.slice(0, 2).map((ex, i) => (
                      <p key={i} className="text-xs text-ink-500 italic">
                        {typeof ex === "string" ? ex : `${ex.nuer} — ${ex.english}`}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {limit < filtered.length && (
          <div className="flex justify-center mt-4">
            <button onClick={() => setLimit((l) => l + PAGE_SIZE)} className="btn-ghost text-xs">
              Load more
            </button>
          </div>
        )}
      </div>
    </DataState>
  );
}
