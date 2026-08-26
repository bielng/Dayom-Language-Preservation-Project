import PageShell, { Section, Prose, InfoCard } from "./PageShell.jsx";
import { Terminal, Volume, Database, Mail, ArrowUpRight, Github, Lock } from "../Icons.jsx";
import { CORPUS, GITHUB, HUGGINGFACE, SITE, TTS } from "../../config/site.js";

function CodeBlock({ label, children }) {
  return (
    <div className="card overflow-hidden">
      {label && (
        <div className="px-5 py-2.5 border-b border-ink-200 bg-ink-100/50 flex items-center gap-2">
          <span className="text-ink-400"><Terminal /></span>
          <span className="font-mono text-[11px] text-ink-500">{label}</span>
        </div>
      )}
      <pre className="code-block whitespace-pre-wrap px-5 py-4 overflow-x-auto">{children}</pre>
    </div>
  );
}

const CORPUS_FETCH = `// Every dataset is a static JSON file served over HTTPS.
// No key, no rate limit, no sign-up — just fetch it.

const res  = await fetch("https://demo-dayom-studio.netlify.app/data/library/dictionary.json");
const { metadata, entries } = await res.json();

console.log(metadata.totalEntries);   // 3209
console.log(entries[0]);
// {
//   id: 1,
//   english: "woman",
//   nuer: "Ci̱ek",
//   partOfSpeech: "noun",
//   alternatives: [...],
//   examples: [...],
//   source: "..."
// }`;

const TTS_SNIPPET = `// Nuer AND Dinka text-to-speech both run through the same provider —
// Meta's MMS (Massively Multilingual Speech) models — via the Hugging
// Face Inference API. One call shape, just a different model id.

const MODELS = {
  nus: "${TTS.models.nus}",   // Nuer
  din: "${TTS.models.din}",   // Dinka
};

async function synthesize(text, lang) {
  const res = await fetch(
    \`https://api-inference.huggingface.co/models/\${MODELS[lang]}\`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: text }),
    }
  );
  const audioBlob = await res.blob();
  return URL.createObjectURL(audioBlob);   // playable audio
}

const nuerAudio = await synthesize("Malɛ! Tëë di̱ kɛ ji̱?", "nus");
const dinkaAudio = await synthesize("Cɔŋ ba nyiɛn?", "din");`;

const PY_SNIPPET = `# Load the whole corpus into pandas in a few lines.
import pandas as pd, requests

BASE = "https://demo-dayom-studio.netlify.app/data/library"

for name in ["dictionary", "vocabulary", "structures", "conversation", "grammar"]:
    payload = requests.get(f"{BASE}/{name}.json").json()
    df = pd.DataFrame(payload["entries"])
    print(f"{name:14} {len(df):>5} rows  {list(df.columns)[:4]}")`;

export default function ApiPage() {
  return (
    <PageShell
      eyebrow="API Access"
      title="Call the corpus and models from your own code"
      lede="There is no gated REST API and no API key to request. The corpus is static JSON on a CDN and speech synthesis is a public model endpoint — both are callable right now, from anything that can make an HTTP request."
    >
      <div className="grid sm:grid-cols-3 gap-5 mb-16">
        <InfoCard icon={Database} title="Corpus — open" accent>
          Every dataset is a public JSON file. No key, no quota, no account.
        </InfoCard>
        <InfoCard icon={Volume} title="Speech — open">
          Nuer & Dinka TTS on Meta's MMS models, callable via the Hugging Face Inference API.
        </InfoCard>
        <InfoCard icon={Lock} title="Hosted REST API — planned">
          A managed translation endpoint with keys and quotas is not built yet.
        </InfoCard>
      </div>

      <Section id="corpus" eyebrow="Available Now" title="Corpus endpoints" className="mb-16">
        <Prose>
          <p>
            Each dataset is served as a static file, so a plain <span className="font-mono text-[13px]">fetch</span> is
            the whole integration. Files are UTF-8 and preserve Nuer and Dinka diacritics — make
            sure your reader does not silently transcode them.
          </p>
        </Prose>

        <div className="card divide-y divide-ink-200 my-6 overflow-hidden">
          <div className="px-5 py-3 bg-ink-100/50 grid grid-cols-[1fr_auto] gap-4">
            <span className="text-[11px] uppercase tracking-wider text-ink-400">Path</span>
            <span className="text-[11px] uppercase tracking-wider text-ink-400">Records</span>
          </div>
          {CORPUS.datasets.map((d) => (
            <a
              key={d.id}
              href={d.file}
              download
              className="px-5 py-3 grid grid-cols-[1fr_auto] gap-4 items-center hover:bg-ink-100/40 transition group"
            >
              <span className="font-mono text-[13px] text-ink-700 truncate group-hover:text-ink-900">
                {d.file}
              </span>
              <span className="font-mono text-[13px] text-ink-500">{d.entries.toLocaleString()}</span>
            </a>
          ))}
          <a
            href={CORPUS.reference.file}
            download
            className="px-5 py-3 grid grid-cols-[1fr_auto] gap-4 items-center hover:bg-ink-100/40 transition group"
          >
            <span className="font-mono text-[13px] text-ink-700 truncate group-hover:text-ink-900">
              {CORPUS.reference.file}
            </span>
            <span className="font-mono text-[13px] text-ink-500">markdown</span>
          </a>
        </div>

        <CodeBlock label="javascript — fetch a dataset">{CORPUS_FETCH}</CodeBlock>

        <div className="mt-5">
          <CodeBlock label="python — load the corpus into pandas">{PY_SNIPPET}</CodeBlock>
        </div>

        <p className="mt-5 text-sm text-ink-500 leading-relaxed">
          The corpus is also mirrored on Hugging Face under{" "}
          <a
            href={HUGGINGFACE.datasets[0].url}
            target="_blank"
            rel="noreferrer"
            className="text-ink-900 underline underline-offset-4 decoration-ink-300 hover:decoration-ink-900"
          >
            {HUGGINGFACE.datasets[0].label}
          </a>{" "}
          and{" "}
          <a
            href={HUGGINGFACE.datasets[1].url}
            target="_blank"
            rel="noreferrer"
            className="text-ink-900 underline underline-offset-4 decoration-ink-300 hover:decoration-ink-900"
          >
            {HUGGINGFACE.datasets[1].label}
          </a>{" "}
          if you'd rather pull from the Hub.
        </p>
      </Section>

      <Section id="speech" eyebrow="Available Now" title="Speech synthesis" className="mb-16">
        <Prose>
          <p>
            Nuer and Dinka text-to-speech are both exposed through {TTS.provider} on the Hugging
            Face Inference API — the same one-service approach the Studio itself calls, so what
            you get back is what you hear on this site. There's no separate, weaker fallback for
            Dinka: it's the same provider, just a different model id.
          </p>
        </Prose>
        <div className="mt-6">
          <CodeBlock label="javascript — synthesize Nuer & Dinka speech">{TTS_SNIPPET}</CodeBlock>
        </div>
        <p className="mt-4 text-sm text-ink-500 leading-relaxed">
          A cold model can return a 503 with an estimated wait on its first call after a quiet
          period — handle that latency rather than treating it as a failure. Browse both
          checkpoints, plus everything else we host, on{" "}
          <a
            href={HUGGINGFACE.spaces}
            target="_blank"
            rel="noreferrer"
            className="text-ink-900 underline underline-offset-4 decoration-ink-300 hover:decoration-ink-900"
          >
            our Hugging Face Spaces
          </a>
          .
        </p>
      </Section>

      <Section id="planned" eyebrow="Not Yet Built" title="Hosted translation API" className="mb-16">
        <div className="card p-6 sm:p-8 border-amber-300 bg-amber-300/15">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-ink-900 shrink-0"><Lock /></span>
            <div className="text-sm text-ink-700 leading-relaxed space-y-3">
              <p>
                <b className="text-ink-900">There is no key to request yet.</b> A managed
                translation endpoint — stable URL, API keys, quotas, versioned model — waits on the
                fine-tuned NLLB model finishing training. Shipping a hosted API in front of a
                general-purpose backend would mean charging people for output we do not yet stand
                behind.
              </p>
              <p>
                If a hosted API is what you need, tell us the use case and we will contact you when
                it exists. Concrete descriptions of real integrations are what move it up the queue.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <a
              href={`mailto:${SITE.email}?subject=API%20access%20interest`}
              className="btn-primary"
            >
              <Mail /> Register interest
            </a>
            <a href={GITHUB.discussions} target="_blank" rel="noreferrer" className="btn-ghost">
              <Github /> Discuss on GitHub
            </a>
          </div>
        </div>
      </Section>

      <Section eyebrow="Terms" title="Fair use" className="mb-4">
        <Prose>
          <p>
            The corpus files sit behind a CDN and we do not rate-limit them, which means the limit
            is courtesy. Cache what you fetch rather than pulling the same file on every request,
            and mirror it if you need it at volume.
          </p>
          <p>
            Attribution follows the source, not this site: check the{" "}
            <span className="font-mono text-[13px]">source</span> and{" "}
            <span className="font-mono text-[13px]">license</span> field on each record before
            redistributing. Full detail on the{" "}
            <a href="/datasets">licensing section</a> of the datasets page, and in the{" "}
            <a href="/terms">terms of service</a>.
          </p>
        </Prose>
        <div className="mt-7 flex items-center gap-3 flex-wrap">
          <a href="/datasets" className="btn-ghost">
            <Database /> Browse the corpus
          </a>
          <a href="/models" className="btn-ghost">
            Model status <ArrowUpRight />
          </a>
        </div>
      </Section>
    </PageShell>
  );
}
