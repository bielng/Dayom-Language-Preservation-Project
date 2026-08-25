import { useMemo, useState } from "react";
import { useJsonData } from "../../utils/useJsonData.js";
import DataState from "./DataState.jsx";
import { Search, X, Sparkle, Rotate } from "../Icons.jsx";

function normalise(value = "") {
  return String(value).toLowerCase();
}

function titleCase(value = "") {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ExamplesBrowser({ url, active }) {
  const { status, data, error } = useJsonData(url, { active });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [spotlight, setSpotlight] = useState(null);

  const examples = useMemo(() => data?.examples ?? [], [data]);

  const categories = useMemo(() => {
    const set = new Set(examples.map((e) => e.category).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [examples]);

  const filtered = useMemo(() => {
    const q = normalise(query.trim());
    return examples.filter((e) => {
      const matchesCategory = category === "All" || e.category === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      return normalise(e.nuer).includes(q) || normalise(e.english).includes(q);
    });
  }, [examples, query, category]);

  const showRandom = () => {
    if (examples.length === 0) return;
    setSpotlight(examples[Math.floor(Math.random() * examples.length)]);
  };

  return (
    <DataState status={status} error={error}>
      <div>
        {data?.meta?.description && (
          <p className="text-xs text-ink-500 mb-3">{data.meta.description}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search example sentences…"
              className="w-full bg-cream-50 rounded-full pl-10 pr-9 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 border border-ink-200 outline-none focus:border-ink-400"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-900">
                <X />
              </button>
            )}
          </div>
          <button onClick={showRandom} className="btn-primary shrink-0 whitespace-nowrap">
            <Sparkle /> Surprise me
          </button>
        </div>

        {spotlight && (
          <div className="mb-4 card p-5 bg-amber-300/15 border-amber-300/60 animate-fade-in flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow mb-1">Sentence of the moment</p>
              <p className="text-lg font-bold text-ink-900">{spotlight.nuer}</p>
              <p className="text-sm text-ink-600 mt-0.5">{spotlight.english}</p>
              <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-300/40 text-ink-700 font-medium">
                {titleCase(spotlight.category)}
              </span>
            </div>
            <button onClick={showRandom} className="shrink-0 p-2 rounded-full bg-white border border-ink-200 hover:bg-cream-100" title="Another example">
              <Rotate />
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mb-3">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`chip !cursor-pointer text-xs ${category === c ? "active" : ""}`}
              style={{ padding: "0.3rem 0.8rem" }}
            >
              {c === "All" ? "All" : titleCase(c)}
            </button>
          ))}
        </div>

        <p className="text-xs text-ink-400 mb-3">
          Showing {filtered.length} of {examples.length} examples
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-10 text-sm text-ink-400">No examples match your search.</div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-2.5">
            {filtered.map((e, i) => (
              <div key={i} className="bg-cream-50 border border-ink-200 rounded-xl px-3.5 py-2.5">
                <p className="text-sm font-semibold text-ink-900">{e.nuer}</p>
                <p className="text-xs text-ink-600 mt-0.5">{e.english}</p>
                <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full bg-amber-300/30 text-ink-700 font-medium">
                  {titleCase(e.category)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DataState>
  );
}
