import { useMemo, useRef, useState } from "react";
import { useJsonData } from "../../utils/useJsonData.js";
import { useAudioPlayer } from "../phrasebook/useAudioPlayer.js";
import AudioButton from "../phrasebook/AudioButton.jsx";
import NuerKeyboard from "../phrasebook/NuerKeyboard.jsx";
import DataState from "./DataState.jsx";
import LibraryPageShell from "./LibraryPageShell.jsx";
import { Search, X, Copy, Check, Keyboard, Sparkle, Rotate } from "../Icons.jsx";

const POS_TO_CATEGORY = {
  noun: "Noun",
  "prop. noun": "Noun",
  "loc. noun": "Noun",
  "tr. verb": "Verb",
  "intr. verb": "Verb",
  "adj. verb": "Verb",
  gerund: "Verb",
  "pron.": "Pronoun",
  "dem. pron.": "Pronoun",
  "num.": "Number",
  "num. classifier": "Number",
  adverb: "Adverb",
  "cop.": "Other",
  "exclam.": "Other",
};
const toCategory = (pos) => (pos ? POS_TO_CATEGORY[pos] ?? "Other" : "Other");
const WORD_CATEGORIES = ["Noun", "Verb", "Pronoun", "Number", "Adverb", "Other"];

export default function PhrasebookPage() {
  const { status, data, error } = useJsonData("/data/phrasebook.json", { active: true });

  const dictionary = useMemo(() => {
    if (!data) return [];
    return data.map((e) => ({
      id: e.id,
      nuer: e.nuer,
      ipa: e.ipa,
      partOfSpeech: e.part_of_speech,
      category: toCategory(e.part_of_speech),
      pluralInfo: e.plural_info,
      senses: e.senses ?? [],
      examples: e.examples ?? [],
      audioFiles: e.audio_files ?? [],
      dialect: e.dialect,
    }));
  }, [data]);

  const dialects = useMemo(
    () => Array.from(new Set(dictionary.map((e) => e.dialect).filter(Boolean))).sort(),
    [dictionary]
  );

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [dialect, setDialect] = useState("All");
  const [copiedId, setCopiedId] = useState(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [spotlight, setSpotlight] = useState(null);
  const inputRef = useRef(null);
  const { play, playingPath, missingPath } = useAudioPlayer();

  const categories = ["All", ...WORD_CATEGORIES];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dictionary.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesDialect = dialect === "All" || item.dialect === dialect;
      if (!matchesCategory || !matchesDialect) return false;
      if (!q) return true;
      return (
        item.nuer.toLowerCase().includes(q) ||
        (item.ipa ?? "").toLowerCase().includes(q) ||
        item.senses.some((s) => s.toLowerCase().includes(q)) ||
        item.examples.some((ex) => ex.nuer.toLowerCase().includes(q) || ex.english.toLowerCase().includes(q))
      );
    });
  }, [dictionary, query, category, dialect]);

  const handleCopy = (item) => {
    navigator.clipboard.writeText(`${item.nuer} — ${item.senses.join(", ")}`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const showRandom = () => {
    if (dictionary.length === 0) return;
    setSpotlight(dictionary[Math.floor(Math.random() * dictionary.length)]);
  };

  const insertAtCursor = (text) => {
    const el = inputRef.current;
    const start = el?.selectionStart ?? query.length;
    const end = el?.selectionEnd ?? query.length;
    const next = query.slice(0, start) + text + query.slice(end);
    setQuery(next);
    requestAnimationFrame(() => {
      el?.focus();
      const pos = start + text.length;
      el?.setSelectionRange(pos, pos);
    });
  };

  const handleBackspace = () => {
    const el = inputRef.current;
    const start = el?.selectionStart ?? query.length;
    const end = el?.selectionEnd ?? query.length;
    if (start !== end) {
      setQuery(query.slice(0, start) + query.slice(end));
    } else if (start > 0) {
      setQuery(query.slice(0, start - 1) + query.slice(start));
    }
  };

  return (
    <LibraryPageShell
      eyebrow="Community Phrasebook"
      title="Nuer Phrasebook"
      description={`${dictionary.length > 0 ? `${dictionary.length} words` : "Words"} with pronunciation audio, meanings, and example sentences in Thok Naath.`}
      wide
    >
      <DataState status={status} error={error}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Nuer or English words…"
                className="w-full bg-cream-50 rounded-full pl-10 pr-9 py-2.5 sm:py-3 text-sm text-ink-900 placeholder:text-ink-400 border border-ink-200 outline-none focus:border-ink-400"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-900">
                  <X />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowKeyboard((v) => !v)}
              className={`shrink-0 p-2.5 sm:p-3 rounded-full border transition-all ${
                showKeyboard ? "bg-amber-300 border-amber-300 text-ink-900" : "bg-white border-ink-200 text-ink-600 hover:bg-cream-100"
              }`}
              title="Thok Naath keyboard"
            >
              <Keyboard />
            </button>
            <button onClick={showRandom} className="btn-primary shrink-0 whitespace-nowrap">
              <Sparkle /> Random word
            </button>
          </div>

          {showKeyboard && (
            <NuerKeyboard
              onKeyPress={insertAtCursor}
              onBackspace={handleBackspace}
              onSpace={() => insertAtCursor(" ")}
              onClose={() => setShowKeyboard(false)}
            />
          )}

          {spotlight && (
            <div className="card p-5 bg-amber-300/15 border-amber-300/60 animate-fade-in flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="eyebrow mb-1">Word spotlight</p>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-xl font-bold text-ink-900">{spotlight.nuer}</h4>
                  <AudioButton path={spotlight.audioFiles[0]} playingPath={playingPath} missingPath={missingPath} onPlay={play} size="sm" />
                </div>
                {spotlight.senses.length > 0 && <p className="text-sm text-ink-600 mt-0.5">{spotlight.senses.join(", ")}</p>}
                <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-300/40 text-ink-700 font-medium">
                  {spotlight.category}
                </span>
              </div>
              <button onClick={showRandom} className="shrink-0 p-2 rounded-full bg-white border border-ink-200 hover:bg-cream-100" title="Another word">
                <Rotate />
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`chip !cursor-pointer text-xs ${category === c ? "active" : ""}`}
                style={{ padding: "0.3rem 0.8rem" }}
              >
                {c}
              </button>
            ))}
          </div>

          {dialects.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 -mt-2">
              <span className="text-[11px] text-ink-500 font-medium">Dialect:</span>
              <button
                onClick={() => setDialect("All")}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${dialect === "All" ? "bg-ink-900 text-white" : "text-ink-500 border border-ink-200"}`}
              >
                All
              </button>
              {dialects.map((d) => (
                <button
                  key={d}
                  onClick={() => setDialect(d)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${dialect === d ? "bg-ink-900 text-white" : "text-ink-500 border border-ink-200"}`}
                >
                  {d.replace(" dialect", "")}
                </button>
              ))}
            </div>
          )}

          <p className="text-[11px] text-ink-400 -mt-1">{filtered.length} of {dictionary.length} words</p>

          {filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-2.5">
              {filtered.map((item) => (
                <div key={item.id} className="bg-cream-50 rounded-2xl p-3.5 border border-ink-200 flex items-start justify-between gap-3 hover:border-ink-300 transition">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-ink-900">{item.nuer}</h3>
                      <AudioButton path={item.audioFiles[0]} playingPath={playingPath} missingPath={missingPath} onPlay={play} size="sm" />
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-300/30 text-ink-700 font-medium">{item.category}</span>
                      {item.dialect && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-ink-100 text-ink-500">{item.dialect.replace(" dialect", "")}</span>
                      )}
                    </div>
                    {item.senses.length > 0 && <p className="text-sm text-ink-700 font-medium">{item.senses.join(", ")}</p>}
                    {item.ipa && <p className="text-xs text-ink-400 font-mono">Pronunciation: {item.ipa}</p>}
                    {item.pluralInfo && (
                      <p className="text-xs text-ink-500">Plural: <span className="font-mono">{item.pluralInfo.replace(/^ŋuan:/, "")}</span></p>
                    )}
                    {item.examples.length > 0 && (
                      <div className="mt-1.5 bg-cream-100 border border-ink-200 rounded-lg px-2.5 py-1.5 space-y-1">
                        {item.examples.map((ex, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-ink-700 italic">{ex.nuer}</p>
                              <p className="text-[11px] text-ink-400">{ex.english}</p>
                            </div>
                            <AudioButton path={item.audioFiles[1]} playingPath={playingPath} missingPath={missingPath} onPlay={play} size="sm" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button onClick={() => handleCopy(item)} className="p-2 rounded-full bg-white border border-ink-200 text-ink-600 hover:bg-cream-100 transition shrink-0">
                    {copiedId === item.id ? <Check className="text-emerald-600" /> : <Copy />}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-sm text-ink-400">No words match your search.</div>
          )}
        </div>
      </DataState>
    </LibraryPageShell>
  );
}
