import { ArrowRight, Brain, Mic, Volume, Sparkle } from "./Icons.jsx";

const codeExample = `{
  "en": "Woman",
  "nuer": "Ci̱ek"
},
{
  "en": "Good morning!",
  "nuer": "Ci̱ baak kɛ mal!"
},
{
  "en": "Hello! How are you?",
  "nuer": "Malɛ! Tëë di̱ kɛ ji̱?"
},`;

function Tag({ children, accent = false }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium ${accent ? "bg-amber-300 text-ink-900" : "bg-ink-100 text-ink-700"}`}>
      {children}
    </span>
  );
}

function ToolRow({ icon, title, subtitle, muted }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${muted ? "bg-ink-100 text-ink-400" : "bg-amber-300/30 text-ink-900"}`}>
        {icon}
      </div>
      <div>
        <div className={`text-sm font-semibold ${muted ? "text-ink-500" : "text-ink-900"}`}>{title}</div>
        <div className="text-xs text-ink-400 mt-0.5">{subtitle}</div>
      </div>
    </div>
  );
}

export default function WorkSection() {
  return (
    <section id="datasets" className="bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="eyebrow mb-4">Our Work</p>
            <h3 className="section-title">Building infrastructure for Nilotic languages</h3>
            <p className="mt-5 text-ink-500 leading-relaxed text-[15px]">
              We are developing a fine-tuned NLLB (No Language Left Behind) model
              specifically optimized for English ↔ Nuer translation, with cultural
              nuance and grammatical accuracy.
            </p>
            <a href="#/models" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-900 underline underline-offset-4 decoration-ink-300 hover:decoration-ink-900">
              Explore Translation <ArrowRight />
            </a>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-ink-500">Input:</span>
              <Tag>English</Tag>
            </div>
            <div className="rounded-lg bg-ink-100/70 px-4 py-3 text-sm text-ink-900">"Woman"</div>

            <div className="flex items-center justify-between my-4">
              <span className="text-xs text-ink-500">Output:</span>
              <Tag accent>"Ci̱ek" (Thok Nath)</Tag>
            </div>
            <div className="rounded-lg bg-amber-300/40 border border-amber-300/60 px-4 py-3 text-sm text-ink-900 font-medium">
              "Ci̱ek" (Thok Nath)
              <span className="ml-2 inline-flex"><Tag accent>Nuer</Tag></span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="card p-6">
            <pre className="code-block whitespace-pre-wrap font-mono">{codeExample}</pre>
            <p className="text-xs text-ink-400 mt-3 font-mono">▷ view_code · {`{ ... }`}</p>
          </div>

          <div>
            <p className="eyebrow mb-4">Data Infrastructure</p>
            <h3 className="section-title">Parallel Corpora</h3>
            <p className="mt-5 text-ink-500 leading-relaxed text-[15px]">
              Building the foundation of Nuer AI from locally curated English ↔ Nuer
              dictionaries, lesson data, conversation pairs, and parallel corpora.
            </p>
            <a href="#/datasets" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-900 underline underline-offset-4 decoration-ink-300 hover:decoration-ink-900">
              View Datasets <ArrowRight />
            </a>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="eyebrow mb-4">Advanced Tools</p>
            <h3 className="section-title">Speech &amp; Reasoning</h3>
            <ul className="mt-5 space-y-3 text-[15px] text-ink-700">
              <li className="flex items-start gap-2.5"><span className="mt-1 text-amber-500"><Sparkle /></span><span><b className="text-ink-900">Chatbot:</b> A dataset-grounded conversational prototype.</span></li>
              <li className="flex items-start gap-2.5"><span className="mt-1 text-amber-500"><Sparkle /></span><span><b className="text-ink-900">ASR &amp; TTS:</b> Automatic speech recognition and text-to-speech for Nuer, supporting learners and low-literacy speakers.</span></li>
              <li className="flex items-start gap-2.5"><span className="mt-1 text-amber-500"><Sparkle /></span><span><b className="text-ink-900">Native Reasoning:</b> Working toward a model that thinks in Nuer directly, rather than pivoting through English.</span></li>
            </ul>
          </div>

          <div className="card divide-y divide-ink-200">
            <ToolRow icon={<Mic />} title="Automatic Speech Recognition" subtitle="Transcribing spoken Nuer" />
            <ToolRow icon={<Volume />} title="Text-to-Speech (TTS)" subtitle="Synthesising fluent audio" />
            <ToolRow icon={<Brain />} title="Native Reasoning Model" subtitle="In development" muted />
          </div>
        </div>
      </div>
    </section>
  );
}
