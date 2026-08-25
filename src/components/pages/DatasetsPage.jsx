import PageShell, { Section, Prose, StatTile } from "./PageShell.jsx";
import { Download, ArrowRight, ArrowUpRight, Github, Scale, Volume, Book } from "../Icons.jsx";
import { CORPUS, CORPUS_TOTAL, AUDIO_TOTAL, GITHUB, HUGGINGFACE, SITE } from "../../config/site.js";

function DatasetCard({ d }) {
  return (
    <div className="card p-6 flex flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-ink-900">{d.name}</h3>
          <p className="mt-1 text-xs text-ink-400">{d.source}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="font-mono text-lg font-bold text-ink-900 leading-none">
            {d.entries.toLocaleString()}
          </div>
          <div className="text-[11px] text-ink-400 mt-1">records</div>
        </div>
      </div>

      <p className="mt-4 text-sm text-ink-500 leading-relaxed flex-1">{d.blurb}</p>

      {d.audioClips && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink-500">
          <span className="text-amber-500"><Volume /></span>
          {d.audioClips.toLocaleString()} pronunciation clips
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {d.fields.map((f) => (
          <span key={f} className="font-mono text-[11px] px-2 py-0.5 rounded bg-ink-100 text-ink-700">
            {f}
          </span>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-ink-200 flex items-center justify-between gap-3">
        <a
          href={d.href}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-900 underline underline-offset-4 decoration-ink-300 hover:decoration-ink-900"
        >
          Browse <ArrowRight />
        </a>
        <a
          href={d.file}
          download
          className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 transition"
        >
          <Download /> JSON
        </a>
      </div>
    </div>
  );
}

export default function DatasetsPage() {
  const sorted = [...CORPUS.datasets].sort((a, b) => b.entries - a.entries);
  const count = CORPUS.datasets.length;

  return (
    <PageShell
      wide
      eyebrow="Open Corpus"
      title="View the datasets"
      lede={`Every record behind ${SITE.name}'s Nuer and Dinka language tools, published openly with its source attached. Browse it in the library, or download the raw JSON and use it in your own work.`}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatTile value={CORPUS_TOTAL.toLocaleString()} label="Total records" sub={`Across ${count} datasets`} />
        <StatTile value={AUDIO_TOTAL.toLocaleString()} label="Audio clips" sub="Recorded pronunciation" />
        <StatTile value={String(count)} label="Datasets" sub="Plus a grammar reference" />
        <StatTile value="JSON" label="Format" sub="UTF-8, Latin + Nuer/Dinka diacritics" />
      </div>

      <div className="card p-5 sm:p-6 mb-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-ink-500 leading-relaxed">
          Prefer to work from the repository? Every file below lives in{" "}
          <span className="font-mono text-[13px] text-ink-700">public/data/</span> and is versioned
          alongside the site.
        </p>
        <a href={GITHUB.corpusDir} target="_blank" rel="noreferrer" className="btn-ghost shrink-0">
          <Github /> Browse on GitHub
        </a>
      </div>

      <Section eyebrow="The Data" title={`${count} datasets`} className="mb-16">
        <p className="text-[15px] text-ink-500 leading-relaxed mb-8 max-w-2xl">
          Counts are the actual number of records in each shipped file — not targets. Field names
          below are the real keys you will find in the JSON.
        </p>
        <div className="grid md:grid-cols-2 gap-5">
          {sorted.map((d) => (
            <DatasetCard key={d.id} d={d} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Reference" title="Grammar guide" className="mb-16">
        <div className="card p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-amber-300/40 flex items-center justify-center text-ink-900 shrink-0">
              <Book />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-ink-900">{CORPUS.reference.name}</h3>
              <p className="mt-2 text-sm text-ink-500 leading-relaxed">{CORPUS.reference.blurb}</p>
              <div className="mt-5 flex items-center gap-5 flex-wrap">
                <a
                  href={CORPUS.reference.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-900 underline underline-offset-4 decoration-ink-300 hover:decoration-ink-900"
                >
                  Read the guide <ArrowRight />
                </a>
                <a
                  href={CORPUS.reference.file}
                  download
                  className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 transition"
                >
                  <Download /> Markdown
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section eyebrow="Mirrors" title="Also on Hugging Face" className="mb-16">
        <p className="text-[15px] text-ink-500 leading-relaxed mb-6 max-w-2xl">
          Prefer the Hub? The same corpus is mirrored on Hugging Face under two organisations —
          use whichever namespace you're already pulling from.
        </p>
        <div className="grid sm:grid-cols-2 gap-5">
          {HUGGINGFACE.datasets.map((h) => (
            <a
              key={h.id}
              href={h.url}
              target="_blank"
              rel="noreferrer"
              className="card p-6 flex items-center justify-between gap-4 hover:border-ink-300 transition group"
            >
              <div>
                <h3 className="font-semibold text-ink-900">{h.label}</h3>
                <p className="mt-1 text-xs text-ink-400 font-mono">huggingface.co/{h.url.split("huggingface.co/")[1]}</p>
              </div>
              <ArrowUpRight className="shrink-0 text-ink-400 group-hover:text-ink-900 transition" />
            </a>
          ))}
        </div>
      </Section>

      <Section id="licensing" eyebrow="Provenance" title="Sources and licensing" className="mb-16">
        <Prose>
          <p>
            Every record carries its origin. We do not merge an entry into the corpus without
            knowing where it came from, because a dataset whose provenance is unclear cannot be
            responsibly used — and cannot be corrected when it is wrong.
          </p>
        </Prose>

        <div className="card divide-y divide-ink-200 mt-6">
          {CORPUS.sources.map((s) => (
            <div key={s.name} className="px-5 sm:px-6 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm font-medium text-ink-900 truncate">{s.name}</div>
                <div className="text-xs text-ink-400 mt-0.5">{s.license}</div>
              </div>
              {s.url && (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 inline-flex items-center gap-1 text-xs text-ink-500 hover:text-ink-900 transition"
                >
                  Source <ArrowUpRight />
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="card p-5 sm:p-6 mt-6 border-amber-300 bg-amber-300/15">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-ink-900 shrink-0"><Scale /></span>
            <div className="text-sm text-ink-700 leading-relaxed space-y-3">
              <p>
                <b className="text-ink-900">Using this data.</b> The corpus mixes sources under
                different terms. Records sourced from Ethio Language Box and community contributors
                are open; African Storybook material is CC BY 4.0 and requires attribution; scripture
                text remains under the rights of the Bible Society in South Sudan. Check the{" "}
                <span className="font-mono text-[13px]">source</span> and{" "}
                <span className="font-mono text-[13px]">license</span> field on each record before
                redistributing, and attribute the original source rather than only this site.
              </p>
              <p>
                <b className="text-ink-900">Found an error?</b> Corrections are the most valuable
                contribution we receive.{" "}
                <a
                  href={GITHUB.newIssue}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink-900 underline underline-offset-4 decoration-ink-300 hover:decoration-ink-900"
                >
                  Open an issue
                </a>{" "}
                with the record id and what it should say.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section eyebrow="Build On It" title="Use the corpus" className="mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <a href="#/api" className="btn-primary">
            API access <ArrowUpRight />
          </a>
          <a href="#/models" className="btn-ghost">
            Models trained on this data <ArrowRight />
          </a>
          <a href="#/contribute" className="btn-ghost">
            Add to the corpus
          </a>
        </div>
      </Section>
    </PageShell>
  );
}
