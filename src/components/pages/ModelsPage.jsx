import PageShell, { Section, Prose } from "./PageShell.jsx";
import { Volume, Translate, Mic, Brain, ArrowUpRight, ArrowRight, Github, Database } from "../Icons.jsx";
import { GITHUB, HUGGINGFACE, CORPUS_TOTAL, TTS } from "../../config/site.js";

const STATUS = {
  live: { label: "Live", cls: "bg-amber-300 text-ink-900" },
  beta: { label: "Beta", cls: "bg-ink-900 text-white" },
  dev: { label: "In development", cls: "bg-ink-100 text-ink-700" },
  research: { label: "Research", cls: "bg-white text-ink-500 border border-ink-200" },
};

const MODELS = [
  {
    id: "tts",
    icon: Volume,
    name: "Text-to-Speech — Nuer & Dinka",
    task: "Text → speech · Nuer, Dinka",
    status: "live",
    body:
      `Nuer and Dinka speech synthesis both run through the same provider — ${TTS.provider} — so the Studio's read-aloud feature uses one consistent backend for both languages instead of two different custom services.`,
    detail: [
      ["Provider", TTS.provider],
      ["Nuer model", TTS.models.nus],
      ["Dinka model", TTS.models.din],
      ["Host", "Hugging Face Inference API"],
    ],
    try: { href: "#/studio/tts", label: "Try text-to-speech" },
  },
  {
    id: "translate",
    icon: Translate,
    name: "English ↔ Nuer / Dinka Translation",
    task: "Translation · Nuer, Dinka",
    status: "beta",
    body:
      "The Studio's translation surface currently routes through a general-purpose translation backend that covers Nuer (nus) and Dinka (din). It works today, but it was not trained on our corpus and it shows — particularly on diacritics, kinship terms, and tense marking.",
    detail: [
      ["Current backend", "General-purpose MT (nus, din)"],
      ["Directions", "en↔nus, en↔din, nus↔din"],
      ["Replacement", "Fine-tuned NLLB-200, in training"],
      ["Training data", `${CORPUS_TOTAL.toLocaleString()} open corpus records`],
    ],
    try: { href: "#/studio/translate", label: "Try translation" },
    note:
      "We are fine-tuning NLLB (No Language Left Behind) on the open corpus to replace this backend. Until that ships, treat translation output as a draft to be checked by a speaker.",
  },
  {
    id: "asr",
    icon: Mic,
    name: "Speech Recognition — Nuer & Dinka",
    task: "Speech → text · Nuer, Dinka",
    status: "dev",
    body:
      "Voice input in the Studio currently uses your browser's built-in speech recognition, which has no Nuer or Dinka acoustic model — it will mis-hear both badly. A dedicated ASR model is the next training target, built on the phrasebook's recorded pronunciation.",
    detail: [
      ["Today", "Browser Web Speech API (no Nuer/Dinka model)"],
      ["Target", "Fine-tuned ASR on Nuer & Dinka audio"],
      ["Seed data", "551 community pronunciation clips"],
      ["Blocker", "Recording volume — contributions needed"],
    ],
    try: { href: "#/studio/voice", label: "Open voice studio" },
    note:
      "Being explicit because it matters: this is not yet a Nuer or Dinka speech model. If you want to move it forward, the fastest help is recorded audio.",
  },
  {
    id: "chat",
    icon: Database,
    name: "Grounded Chat Assistant",
    task: "Conversational · retrieval",
    status: "beta",
    body:
      "A retrieval-based assistant that answers only from attested phrases in the bundled corpus, and says so plainly when it has no match. It does not generate novel Nuer or Dinka — a deliberate choice, since a model that invents plausible-looking output teaches learners errors.",
    detail: [
      ["Approach", "Retrieval over curated phrase base"],
      ["Languages", "Nuer, Dinka"],
      ["Generation", "None — attested phrases only"],
      ["Fallback", "Explicit 'no match' response"],
    ],
    try: { href: "#/studio/chat", label: "Try the assistant" },
  },
  {
    id: "reasoning",
    icon: Brain,
    name: "Native Reasoning Model",
    task: "Reasoning · Nuer, Dinka",
    status: "research",
    body:
      "The long-horizon goal: a model that reasons in Nuer and Dinka directly rather than pivoting through English. Pivoting discards exactly what makes each language distinct — evidentiality, kinship systems, tense and tone marking. No timeline; the data foundation comes first.",
    detail: [
      ["Stage", "Research / problem framing"],
      ["Dependency", "Substantially larger monolingual corpus"],
      ["Timeline", "Not committed"],
    ],
  },
];

function ModelCard({ m }) {
  const s = STATUS[m.status];
  return (
    <div className="card p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 rounded-full bg-amber-300/40 flex items-center justify-center text-ink-900 shrink-0">
          <m.icon />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h3 className="font-semibold text-ink-900 text-[17px]">{m.name}</h3>
              <p className="text-xs text-ink-400 mt-0.5">{m.task}</p>
            </div>
            <span className={`shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full ${s.cls}`}>
              {s.label}
            </span>
          </div>

          <p className="mt-4 text-sm text-ink-500 leading-relaxed">{m.body}</p>

          <dl className="mt-5 grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
            {m.detail.map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <dt className="text-[11px] uppercase tracking-wider text-ink-400">{k}</dt>
                <dd className="text-[13px] text-ink-700 font-mono break-words">{v}</dd>
              </div>
            ))}
          </dl>

          {m.note && (
            <p className="mt-5 text-[13px] text-ink-700 leading-relaxed border-l-2 border-amber-300 pl-4">
              {m.note}
            </p>
          )}

          {m.try && (
            <a
              href={m.try.href}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-900 underline underline-offset-4 decoration-ink-300 hover:decoration-ink-900"
            >
              {m.try.label} <ArrowRight />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ModelsPage() {
  return (
    <PageShell
      eyebrow="Models"
      title="What we have trained, and what we have not"
      lede="An honest status board for every model behind the Studio — including the ones that are still a browser fallback rather than a real Nuer or Dinka model. Overstating coverage in a low-resource language wastes the time of the people trying to help."
    >
      <div className="space-y-5 mb-16">
        {MODELS.map((m) => (
          <ModelCard key={m.id} m={m} />
        ))}
      </div>

      <Section eyebrow="Evaluation" title="How we judge quality" className="mb-16">
        <Prose>
          <p>
            Standard translation benchmarks do not exist for Nuer or Dinka, so a BLEU score against
            a held-out slice of our own corpus would mostly measure how well a model memorised our
            own formatting. It is not a meaningful claim of quality and we will not publish one as
            if it were.
          </p>
          <p>
            Instead, evaluation runs through native-speaker review on held-out sentence sets, scored
            for whether meaning survives, whether diacritics and tone marking are correct, and
            whether kinship and possession are handled the way a speaker would actually say it.
            It is slower and less quotable than a benchmark number, and it is the only measure we
            currently trust.
          </p>
        </Prose>
      </Section>

      <Section eyebrow="Next" title="Build with the models" className="mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <a href="#/api" className="btn-primary">
            API access <ArrowUpRight />
          </a>
          <a href="#/datasets" className="btn-ghost">
            <Database /> The training data
          </a>
          <a href={HUGGINGFACE.models} target="_blank" rel="noreferrer" className="btn-ghost">
            Models on Hugging Face <ArrowUpRight />
          </a>
          <a href={GITHUB.repoUrl} target="_blank" rel="noreferrer" className="btn-ghost">
            <Github /> Source on GitHub
          </a>
        </div>
      </Section>
    </PageShell>
  );
}
