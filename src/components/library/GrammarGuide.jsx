import { useMemo, useState } from "react";
import { useJsonData } from "../../utils/useJsonData.js";
import DataState from "./DataState.jsx";
import { Search, X } from "../Icons.jsx";

function renderInline(text, keyPrefix) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={`${keyPrefix}-${i}`} className="font-mono text-[13px] bg-ink-100 px-1 py-0.5 rounded">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

// Parses a markdown string into sections split on "## " headers. Each block
// inside a section is one of: h3, p, table, ul, quote, hr.
function parseMarkdown(markdown) {
  const lines = markdown.split("\n");
  const sections = [];
  let current = { id: "intro", title: "Overview", blocks: [] };
  let paragraphBuf = [];
  let listBuf = [];
  let tableBuf = [];

  const flushParagraph = () => {
    if (paragraphBuf.length) {
      current.blocks.push({ type: "p", text: paragraphBuf.join(" ") });
      paragraphBuf = [];
    }
  };
  const flushList = () => {
    if (listBuf.length) {
      current.blocks.push({ type: "ul", items: listBuf });
      listBuf = [];
    }
  };
  const flushTable = () => {
    if (tableBuf.length) {
      const [headerLine, , ...rowLines] = tableBuf;
      const header = headerLine.split("|").slice(1, -1).map((c) => c.trim());
      const rows = rowLines.map((line) => line.split("|").slice(1, -1).map((c) => c.trim()));
      current.blocks.push({ type: "table", header, rows });
      tableBuf = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith("## ")) {
      flushParagraph(); flushList(); flushTable();
      sections.push(current);
      const title = line.replace(/^##\s+/, "");
      current = { id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60), title, blocks: [] };
      continue;
    }
    if (line.startsWith("### ")) {
      flushParagraph(); flushList(); flushTable();
      current.blocks.push({ type: "h3", text: line.replace(/^###\s+/, "") });
      continue;
    }
    if (line.startsWith("# ")) {
      flushParagraph(); flushList(); flushTable();
      continue; // document title, shown separately in the section header
    }
    if (/^\|.*\|$/.test(line)) {
      flushParagraph(); flushList();
      tableBuf.push(line);
      continue;
    }
    if (tableBuf.length) flushTable();

    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      listBuf.push(line.replace(/^[-*]\s+/, ""));
      continue;
    }
    if (listBuf.length) flushList();

    if (line.startsWith("> ")) {
      flushParagraph();
      current.blocks.push({ type: "quote", text: line.replace(/^>\s?/, "") });
      continue;
    }
    if (/^-{3,}$/.test(line.trim())) {
      flushParagraph();
      current.blocks.push({ type: "hr" });
      continue;
    }
    if (line.trim() === "") {
      flushParagraph();
      continue;
    }
    paragraphBuf.push(line.trim());
  }
  flushParagraph(); flushList(); flushTable();
  sections.push(current);

  return sections.filter((s) => s.blocks.length > 0);
}

function Block({ block, keyPrefix }) {
  switch (block.type) {
    case "h3":
      return <h4 className="text-sm font-semibold text-ink-900 mt-4 mb-1.5">{renderInline(block.text, keyPrefix)}</h4>;
    case "p":
      return <p className="text-sm text-ink-600 leading-relaxed mb-2.5">{renderInline(block.text, keyPrefix)}</p>;
    case "quote":
      return (
        <blockquote className="border-l-2 border-amber-400 pl-3 text-sm text-ink-500 italic my-2.5">
          {renderInline(block.text, keyPrefix)}
        </blockquote>
      );
    case "ul":
      return (
        <ul className="list-disc list-inside text-sm text-ink-600 space-y-1 mb-2.5">
          {block.items.map((item, i) => <li key={`${keyPrefix}-li-${i}`}>{renderInline(item, `${keyPrefix}-li-${i}`)}</li>)}
        </ul>
      );
    case "hr":
      return <hr className="border-ink-200 my-4" />;
    case "table":
      return (
        <div className="overflow-x-auto mb-3 rounded-xl border border-ink-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream-100">
                {block.header.map((h, i) => (
                  <th key={i} className="text-left font-semibold text-ink-700 px-3 py-2 border-b border-ink-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className={ri % 2 ? "bg-cream-50" : "bg-white"}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 text-ink-600 border-b border-ink-100 align-top">{renderInline(cell, `${keyPrefix}-${ri}-${ci}`)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

export default function GrammarGuide({ url, active }) {
  const { status, data, error } = useJsonData(url, { active });
  const [query, setQuery] = useState("");
  const [openSection, setOpenSection] = useState(null);

  const sections = useMemo(() => (data ? parseMarkdown(data) : []), [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.blocks.some((b) => (b.text || "").toLowerCase().includes(q))
    );
  }, [sections, query]);

  return (
    <DataState status={status} error={error}>
      <div>
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the grammar guide — pronouns, tense, negation…"
            className="w-full bg-cream-50 rounded-full pl-10 pr-9 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 border border-ink-200 outline-none focus:border-ink-400"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-900">
              <X />
            </button>
          )}
        </div>

        <p className="text-xs text-ink-400 mb-3">
          {filtered.length} of {sections.length} sections{query ? " match your search" : ""}
        </p>

        <div className="space-y-2">
          {filtered.map((section, idx) => {
            const isOpen = openSection === section.id + idx || (Boolean(query) && filtered.length <= 4);
            return (
              <div key={section.id + idx} className="bg-cream-50 border border-ink-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenSection(isOpen ? null : section.id + idx)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm font-semibold text-ink-900">{section.title}</span>
                  <span className="text-ink-400 text-xs">{isOpen ? "Hide" : "Show"}</span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-ink-200 bg-white">
                    {section.blocks.map((block, bi) => (
                      <Block key={bi} block={block} keyPrefix={`${section.id}-${bi}`} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DataState>
  );
}
