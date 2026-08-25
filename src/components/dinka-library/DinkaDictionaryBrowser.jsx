import { useMemo, useState } from "react";
import { useJsonData } from "../../utils/useJsonData.js";
import DataState from "../library/DataState.jsx";

const PAGE_SIZE = 60;

const REGION_META = {
  NE: { label: "Northeast", color: "bg-rose-700", light: "bg-rose-50", text: "text-rose-800", border: "border-rose-200" },
  NW: { label: "Northwest", color: "bg-sky-700", light: "bg-sky-50", text: "text-sky-800", border: "border-sky-200" },
  SW: { label: "Southwest", color: "bg-amber-700", light: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  SC: { label: "South Central", color: "bg-emerald-700", light: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  SA: { label: "South Aliap", color: "bg-violet-700", light: "bg-violet-50", text: "text-violet-800", border: "border-violet-200" },
  SE: { label: "Southeast", color: "bg-orange-700", light: "bg-orange-50", text: "text-orange-800", border: "border-orange-200" },
};

function normalise(value = "") {
  return String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function firstLetter(word = "") {
  return word.trim().charAt(0).toUpperCase() || "#";
}

function getRegion(tag) {
  const match = tag.match(/^([A-Z]+)/);
  return match ? match[1] : tag;
}

function SearchIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  );
}

function XIcon({ className }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}

function SparkleIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>
    </svg>
  );
}

function RotateIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
    </svg>
  );
}

export default function DinkaDictionaryBrowser({ url, active }) {
  const { status, data, error } = useJsonData(url, { active });
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [letter, setLetter] = useState("All");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [spotlight, setSpotlight] = useState(null);

  const entries = useMemo(() => data?.entries ?? [], [data]);
  const dialectMap = useMemo(() => data?.dialectMap ?? {}, [data]);

  const letters = useMemo(() => {
    const set = new Set(entries.map((e) => firstLetter(e.dinka)));
    return Array.from(set).sort();
  }, [entries]);

  const filtered = useMemo(() => {
    const q = normalise(query.trim());
    return entries.filter((e) => {
      if (region !== "All") {
        const tags = e.dialectTags || [];
        const hasRegion = tags.some((t) => getRegion(t) === region);
        if (!hasRegion) return false;
      }
      if (letter !== "All" && firstLetter(e.dinka) !== letter) return false;
      if (!q) return true;
      return (
        normalise(e.dinka).includes(q) ||
        normalise(e.english).includes(q) ||
        normalise(e.partOfSpeech).includes(q)
      );
    });
  }, [entries, query, region, letter]);

  const visible = filtered.slice(0, limit);

  const showRandom = () => {
    if (entries.length === 0) return;
    setSpotlight(entries[Math.floor(Math.random() * entries.length)]);
  };

  const activeRegions = useMemo(() => {
    const set = new Set();
    entries.forEach((e) => {
      (e.dialectTags || []).forEach((t) => set.add(getRegion(t)));
    });
    return Array.from(set).sort();
  }, [entries]);

  return (
    <DataState status={status} error={error}>
      <div>
        {/* Search + Discover */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setLimit(PAGE_SIZE); }}
              placeholder="Search Dinka word or English meaning…"
              className="w-full bg-cream-50 rounded-full pl-10 pr-9 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 border border-ink-200 outline-none focus:border-ink-400"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-900">
                <XIcon />
              </button>
            )}
          </div>
          <button onClick={showRandom} className="btn-primary shrink-0 whitespace-nowrap">
            <SparkleIcon /> Discover a word
          </button>
        </div>

        {/* Spotlight */}
        {spotlight && (
          <div className="mb-5 card p-6 border border-amber-300/60 bg-amber-300/10 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 bg-amber-300/20" />
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="eyebrow mb-1">Word of the moment</p>
                <h4 className="text-2xl font-bold text-ink-900">{spotlight.dinka}</h4>
                <p className="text-sm text-ink-600 mt-1 leading-relaxed">{spotlight.english}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {spotlight.partOfSpeech && spotlight.partOfSpeech !== 'unknown' && (
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-ink-900 text-white font-medium uppercase tracking-wide">
                      {spotlight.partOfSpeech}
                    </span>
                  )}
                  {(spotlight.dialectTags || []).map((tag) => {
                    const reg = getRegion(tag);
                    const meta = REGION_META[reg] || {};
                    return (
                      <span key={tag} className={`text-[10px] px-2 py-1 rounded-full ${meta.light || 'bg-cream-100'} ${meta.text || 'text-ink-600'} border ${meta.border || 'border-ink-200'} font-medium`} title={dialectMap[tag] || tag}>
                        {tag}
                      </span>
                    );
                  })}
                </div>
                {spotlight.example && (
                  <p className="mt-3 text-xs text-ink-500 italic border-l-2 pl-3 border-amber-400/60">
                    {spotlight.example}
                  </p>
                )}
              </div>
              <button onClick={showRandom} className="shrink-0 p-2 rounded-full bg-white border border-ink-200 hover:bg-cream-100 shadow-sm" title="Another word">
                <RotateIcon />
              </button>
            </div>
          </div>
        )}

        {/* Region Filter */}
        <div className="mb-4">
          <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wider mb-2">Filter by dialect region</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => { setRegion("All"); setLimit(PAGE_SIZE); }}
              className={`h-8 px-3 rounded-lg text-xs font-semibold transition border ${region === "All" ? "bg-ink-900 text-white border-ink-900" : "bg-white text-ink-600 border-ink-200 hover:border-ink-400"}`}
            >
              All regions
            </button>
            {activeRegions.map((r) => {
              const meta = REGION_META[r];
              if (!meta) return null;
              const isActive = region === r;
              return (
                <button
                  key={r}
                  onClick={() => { setRegion(isActive ? "All" : r); setLimit(PAGE_SIZE); }}
                  className={`h-8 px-3 rounded-lg text-xs font-semibold transition border flex items-center gap-1.5 ${isActive ? `${meta.color} text-white border-transparent` : `bg-white ${meta.text} ${meta.border} hover:border-current`}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : meta.color}`} />
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* A-Z Jump */}
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
          Showing {Math.min(visible.length, filtered.length)} of {filtered.length} entries
          {data?.metadata?.totalEntries ? ` · ${data.metadata.totalEntries} total` : ""}
        </p>

        {visible.length === 0 ? (
          <div className="text-center py-12 text-sm text-ink-400 bg-cream-50 rounded-xl border border-dashed border-ink-200">
            No entries match your search.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-2.5">
            {visible.map((e) => (
              <div key={e.id} className="bg-cream-50 border border-ink-200 rounded-xl px-4 py-3 hover:shadow-sm transition group hover:border-amber-400/50">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-semibold text-ink-900 group-hover:text-amber-700 transition">{e.dinka}</h4>
                  {e.partOfSpeech && e.partOfSpeech !== 'unknown' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-ink-100 text-ink-600 font-medium uppercase tracking-wide">
                      {e.partOfSpeech}
                    </span>
                  )}
                </div>
                <p className="text-sm text-ink-600 mt-0.5 leading-relaxed">{e.english}</p>
                {(e.dialectTags || []).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {e.dialectTags.map((tag) => {
                      const reg = getRegion(tag);
                      const meta = REGION_META[reg] || {};
                      return (
                        <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded-md ${meta.light || 'bg-cream-100'} ${meta.text || 'text-ink-500'} border ${meta.border || 'border-ink-100'}`} title={dialectMap[tag] || tag}>
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                )}
                {e.example && (
                  <p className="mt-2 text-xs text-ink-500 italic border-l-2 border-ink-200 pl-2.5">
                    {e.example}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {limit < filtered.length && (
          <div className="flex justify-center mt-5">
            <button onClick={() => setLimit((l) => l + PAGE_SIZE)} className="btn-ghost text-xs">
              Load more entries
            </button>
          </div>
        )}
      </div>
    </DataState>
  );
}
