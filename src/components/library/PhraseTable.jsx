import { useMemo, useState } from "react";
import { useJsonData } from "../../utils/useJsonData.js";
import DataState from "./DataState.jsx";
import { Search, X } from "../Icons.jsx";
import { ListItems, FlashcardGrid, ChatBubbles, DrillCards } from "./PhraseVariants.jsx";

const PAGE_SIZE = { list: 60, flashcard: 45, chat: 40, drill: 40 };

function normalise(value = "") {
  return value.toLowerCase();
}

export default function PhraseTable({ url, active, emptyNoun = "phrases", variant = "list" }) {
  const { status, data, error } = useJsonData(url, { active });
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All topics");
  const pageSize = PAGE_SIZE[variant] ?? 60;
  const [limit, setLimit] = useState(pageSize);

  const entries = useMemo(() => data?.entries ?? [], [data]);

  const topics = useMemo(() => {
    const set = new Set(entries.map((e) => e.topic_title).filter(Boolean));
    return ["All topics", ...Array.from(set)];
  }, [entries]);

  const filtered = useMemo(() => {
    const q = normalise(query.trim());
    return entries.filter((e) => {
      const matchesTopic = topic === "All topics" || e.topic_title === topic;
      if (!matchesTopic) return false;
      if (!q) return true;
      return (
        normalise(e.nuer).includes(q) ||
        normalise(e.english).includes(q) ||
        normalise(e.topic_title).includes(q)
      );
    });
  }, [entries, query, topic]);

  const visible = filtered.slice(0, limit);

  return (
    <DataState status={status} error={error}>
      <div>
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setLimit(pageSize); }}
              placeholder={`Search Nuer or English ${emptyNoun}…`}
              className="w-full bg-cream-50 rounded-full pl-10 pr-9 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 border border-ink-200 outline-none focus:border-ink-400"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-900">
                <X />
              </button>
            )}
          </div>
          <select
            value={topic}
            onChange={(e) => { setTopic(e.target.value); setLimit(pageSize); }}
            className="chip font-medium sm:w-56 shrink-0"
            style={{ padding: "0.55rem 1rem" }}
          >
            {topics.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <p className="text-xs text-ink-400 mb-3">
          Showing {Math.min(visible.length, filtered.length)} of {filtered.length} {emptyNoun}
          {data?.metadata?.totalEntries ? ` · ${data.metadata.totalEntries} total in this set` : ""}
        </p>

        {visible.length === 0 ? (
          <div className="text-center py-10 text-sm text-ink-400">No {emptyNoun} match your search.</div>
        ) : variant === "flashcard" ? (
          <FlashcardGrid items={visible} />
        ) : variant === "chat" ? (
          <ChatBubbles items={visible} />
        ) : variant === "drill" ? (
          <DrillCards items={visible} />
        ) : (
          <ListItems items={visible} />
        )}

        {limit < filtered.length && (
          <div className="flex justify-center mt-4">
            <button onClick={() => setLimit((l) => l + pageSize)} className="btn-ghost text-xs">
              Load more
            </button>
          </div>
        )}
      </div>
    </DataState>
  );
}
