import { Sparkle, Translate, Mic, Volume, ArrowRight } from "../Icons.jsx";

const FEATURES = [
  {
    id: "chat",
    href: "#/studio/chat",
    icon: Sparkle,
    title: "Chat Assistant",
    body: "Ask about Nuer or Dinka words, phrases, and everyday conversation. Answers are grounded in a curated local knowledge base.",
  },
  {
    id: "translate",
    href: "#/studio/translate",
    icon: Translate,
    title: "Text Translation",
    body: "Translate freely between English, Nuer (Thok Naath), and Dinka (Thuɔŋjäŋ) in either direction.",
  },
  {
    id: "voice",
    href: "#/studio/voice",
    icon: Mic,
    title: "Speech Recognition",
    body: "Speak in English and get a live transcript, then translate it instantly into Nuer or Dinka.",
  },
  {
    id: "tts",
    href: "#/studio/tts",
    icon: Volume,
    title: "Text to Speech",
    body: "Turn Nuer or Dinka text into natural spoken audio you can play back or download.",
  },
];

export default function StudioHome() {
  return (
    <div className="relative hero-glow">
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="eyebrow mb-4">Dayom AI Studio</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink-900 leading-[1.1]">
            Everything for Nuer &amp; Dinka,<br className="hidden sm:block" /> in one studio
          </h1>
          <p className="mt-6 text-[15px] sm:text-base text-ink-500 leading-relaxed">
            Chat, translate, transcribe, and synthesize speech for South Sudan's
            Nilotic languages — free, and built on open datasets and models from
            Dayom Lab.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 gap-5">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <a
                key={feature.id}
                href={feature.href}
                className="card p-6 group hover:border-ink-300 transition shadow-[0_1px_2px_rgba(11,18,32,0.04)] hover:shadow-[0_10px_30px_rgba(11,18,32,0.08)]"
              >
                <div className="h-11 w-11 rounded-full bg-amber-300/40 flex items-center justify-center text-ink-900 mb-5">
                  <Icon />
                </div>
                <h3 className="font-semibold text-ink-900 text-lg flex items-center gap-1.5">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-sm text-ink-500 leading-relaxed">{feature.body}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-900 underline underline-offset-4 decoration-ink-300 group-hover:decoration-ink-900">
                  Open {feature.title} <ArrowRight />
                </span>
              </a>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-300/35 px-4 py-2 text-xs text-ink-700">
            <Sparkle /> Local-first tools, built for low-resource languages
          </div>
        </div>
      </div>
    </div>
  );
}
