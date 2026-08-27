import { useRef, useState } from "react";
import { Volume, Play, Pause, Rotate, Download, AlertCircle, ChevronDown } from "../Icons.jsx";
import { synthesizeSpeech, speakWithBrowser } from "../../services/tts.js";
import { getLangName } from "../../services/translate.js";

const LANGUAGES = [
  { code: "nus", name: "Nuer (Thok Naath)" },
  { code: "din", name: "Dinka (Thuɔŋjäŋ)" },
];

const EXAMPLES = {
  nus: [
    "Ɣän cieŋä kä Nai̱röbi̱, Kɛnya",
    "Ɣän ta̱a̱ kɛ määth mi cɔali Kidit.",
    "Cä jɛ nhɔk ɛn ɣöö ŋotdɛ thiɛlɛ dup ti̱ gɔw rɛy juba",
  ],
  din: [
    "Ŋa cökä ka Nairobi, Kenya",
    "Ŋa tää kɛ määt mi cɔal Kidit.",
    "Ca jɛ nhɔk ɛn ɣöö ŋɔtɛ thiɛlɛ dup ti gɔw rɛy juba",
  ],
};

export default function StudioTTS() {
  const [lang, setLang] = useState("nus");
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  const handleSynthesize = async () => {
    if (!text.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    setAudioUrl(null);
    try {
      const url = await synthesizeSpeech(text.trim(), lang);
      setAudioUrl(url);
      requestAnimationFrame(() => {
        audioRef.current?.play();
        setIsPlaying(true);
      });
    } catch (err) {
      console.error("TTS error:", err);
      try {
        await speakWithBrowser(text.trim(), lang);
      } catch {
        setError("Couldn't reach the voice model — it may be waking up, or unavailable right now. Try again shortly.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
  };

  return (
    <div className="relative hero-glow">
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        <div className="text-center mb-8">
          <p className="eyebrow mb-3">Text to Speech</p>
          <h1 className="section-title">Hear Nuer &amp; Dinka spoken naturally</h1>
          <p className="mt-4 text-[15px] text-ink-500 max-w-lg mx-auto leading-relaxed">
            Speech synthesis for Nuer and Dinka, powered by fine-tuned models.
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <select
              value={lang}
              onChange={(e) => { setLang(e.target.value); setText(""); setAudioUrl(null); }}
              className="appearance-none chip font-medium pr-9"
              style={{ padding: "0.6rem 2.25rem 0.6rem 1rem" }}
            >
              {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-500" />
          </div>
        </div>

        <div className="card p-5 sm:p-7 shadow-[0_2px_30px_rgba(11,18,32,0.05)]">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="eyebrow">{getLangName(lang)} Text</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Enter text in ${getLangName(lang)} to synthesize speech…`}
            rows={3}
            className="w-full bg-cream-50 rounded-2xl p-4 text-[15px] text-ink-900 placeholder:text-ink-400 resize-none border border-ink-200 outline-none focus:border-ink-400 transition"
          />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-ink-400 mr-1">Try:</span>
            {EXAMPLES[lang].map((ex) => (
              <button
                key={ex}
                onClick={() => setText(ex)}
                className="text-xs px-3 py-1.5 rounded-full border border-ink-200 text-ink-500 hover:text-ink-900 hover:border-ink-300 transition"
              >
                {ex.length > 32 ? ex.slice(0, 32) + "…" : ex}
              </button>
            ))}
          </div>

          <div className="flex justify-center my-5">
            <button onClick={handleSynthesize} disabled={isLoading || !text.trim()} className="btn-primary">
              {isLoading ? (<><Rotate className="animate-spin" /> Synthesizing…</>) : (<><Volume /> Generate Speech</>)}
            </button>
          </div>

          <div className="w-full bg-cream-50 rounded-2xl p-5 border border-ink-200 flex flex-col items-center justify-center gap-3 text-center">
            {audioUrl ? (
              <>
                <button
                  onClick={handlePlayPause}
                  className="w-12 h-12 rounded-full bg-ink-900 hover:bg-ink-700 text-white flex items-center justify-center transition"
                >
                  {isPlaying ? <Pause /> : <Play />}
                </button>
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full max-w-xs"
                  controls
                />
                <a
                  href={audioUrl}
                  download={`${lang}-speech.wav`}
                  className="text-xs font-semibold text-ink-700 hover:text-ink-900 flex items-center gap-1"
                >
                  <Download /> Download WAV
                </a>
              </>
            ) : (
              <p className="text-ink-400 text-sm italic">Audio will play here after generation…</p>
            )}
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 bg-cream-100 border border-ink-200 rounded-2xl px-4 py-3 text-sm text-ink-700">
              <AlertCircle className="shrink-0 mt-0.5 text-amber-500" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-ink-400">
          Voice synthesis calls a hosted model and requires an internet connection.
        </p>
      </div>
    </div>
  );
}
