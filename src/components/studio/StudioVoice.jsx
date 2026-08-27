import { useState, useRef, useEffect } from "react";
import { Volume, Copy, Check, AlertCircle, Rotate, Sparkle, ChevronDown, Mic } from "../Icons.jsx";
import { translateText, getLangName } from "../../services/translate.js";

const LANGUAGES = [
  { code: "nus", name: "Nuer (Thok Naath)" },
  { code: "din", name: "Dinka (Thuɔŋjäŋ)" },
];

function LiveBlob({ active, size = 120 }) {
  const bars = [
    { h: 24, d: 0.0 }, { h: 40, d: 0.07 }, { h: 30, d: 0.14 },
    { h: 50, d: 0.21 }, { h: 36, d: 0.28 }, { h: 46, d: 0.35 },
    { h: 26, d: 0.42 }, { h: 44, d: 0.49 }, { h: 24, d: 0.56 },
  ];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {active && (
        <div
          className="absolute inset-0"
          style={{
            borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
            background: "conic-gradient(from 0deg, #F5C95B, #E8B53A, #F8D980, #F5C95B)",
            animation: "blobMorph 8s ease-in-out infinite, blobSpin 10s linear infinite",
            filter: "blur(16px)",
            opacity: 0.5,
            transform: "scale(1.25)",
          }}
        />
      )}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          width: size,
          height: size,
          borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
          animation: "blobMorph 8s ease-in-out infinite",
          background: "#0B1220",
        }}
      >
        <div
          className="absolute inset-[-50%]"
          style={{
            background: "conic-gradient(from 0deg, #F5C95B, #E8B53A, #F8D980, #F5C95B)",
            animation: "blobSpin 10s linear infinite",
            filter: "blur(2px)",
            opacity: 0.85,
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.25) 0%, transparent 55%)" }}
        />
        <div className="relative z-10 flex items-center justify-center" style={{ gap: 5 }}>
          {bars.map((bar, i) => (
            <span
              key={i}
              className="block rounded-full bg-white/90"
              style={{
                width: 3,
                height: active ? undefined : bar.h,
                minHeight: 6,
                animation: active
                  ? `waveBar 0.55s ease-in-out ${bar.d}s infinite alternate`
                  : `waveBarIdle 2.5s ease-in-out ${bar.d * 2}s infinite alternate`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StudioVoice() {
  const [lang, setLang] = useState("nus");
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [translation, setTranslation] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [browserSupport] = useState(
    () => typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  );

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (event) => {
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript;
      }
      if (final) setTranscript((prev) => (prev ? prev + " " + final : final));
    };
    rec.onerror = (event) => {
      if (event.error !== "aborted") setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };
    rec.onend = () => setIsListening(false);

    recognitionRef.current = rec;
    return () => rec.abort();
  }, []);

  const handleToggleListen = () => {
    setError(null);
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      setTranslation("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleTranslate = async () => {
    if (!transcript.trim() || isTranslating) return;
    setIsTranslating(true);
    setError(null);
    setTranslation("");
    try {
      const result = await translateText(transcript.trim(), `en-to-${lang}`);
      setTranslation(result);
    } catch (err) {
      console.error("Translation error:", err);
      setError("Couldn't translate. Try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!translation || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(translation);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="relative hero-glow">
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        <div className="text-center mb-8">
          <p className="eyebrow mb-3">Speech Recognition</p>
          <h1 className="section-title">Speak, transcribe, translate</h1>
          <p className="mt-4 text-[15px] text-ink-500 max-w-lg mx-auto leading-relaxed">
            Speak in English — get a live transcript, then translate it into Nuer or Dinka.
          </p>
        </div>

        {!browserSupport ? (
          <div className="card p-8 text-center">
            <AlertCircle className="mx-auto text-amber-500" />
            <p className="mt-3 text-sm sm:text-base font-medium text-ink-900">
              Your browser doesn't support speech recognition.
            </p>
            <p className="mt-2 text-sm text-ink-500">Please use Chrome, Edge, or Safari for voice input.</p>
          </div>
        ) : (
          <div className="card p-5 sm:p-7 shadow-[0_2px_30px_rgba(11,18,32,0.05)]">
            <div className="relative flex justify-center mb-4">
              <div className="relative">
                <select
                  value={lang}
                  onChange={(e) => { setLang(e.target.value); setTranslation(""); }}
                  className="appearance-none chip font-medium pr-9"
                  style={{ padding: "0.6rem 2.25rem 0.6rem 1rem" }}
                >
                  {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-500" />
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 mb-6">
              <button
                onClick={handleToggleListen}
                className="relative cursor-pointer transition-transform active:scale-95"
                title={isListening ? "Stop listening" : "Start listening"}
              >
                <LiveBlob active={isListening} />
                {!isListening && (
                  <span className="absolute inset-0 flex items-center justify-center text-white">
                    <Mic />
                  </span>
                )}
              </button>
              <span className="text-sm font-medium text-ink-700">
                {isListening ? "Listening… tap to stop" : "Tap to speak"}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="eyebrow">English Transcript</span>
                {transcript && (
                  <button onClick={() => handleCopy(transcript)} className="chip text-xs" style={{ padding: "0.3rem 0.7rem" }}>
                    {copied ? <Check className="text-emerald-600" /> : <Copy />} {copied ? "Copied" : "Copy"}
                  </button>
                )}
              </div>
              <div className="min-h-[5rem] bg-cream-50 rounded-2xl p-4 border border-ink-200 text-ink-900 text-[15px]">
                {transcript ? (
                  <p className="animate-fade-in">{transcript}</p>
                ) : (
                  <span className="text-ink-400 text-sm italic">Your speech will appear here…</span>
                )}
              </div>
            </div>

            <div className="flex justify-center my-5">
              <button onClick={handleTranslate} disabled={isTranslating || !transcript.trim()} className="btn-primary">
                {isTranslating ? (<><Rotate className="animate-spin" /> Translating…</>) : (<><Sparkle /> Translate to {getLangName(lang)}</>)}
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="eyebrow">{getLangName(lang)} Translation</span>
                {translation && (
                  <div className="flex items-center gap-2">
                    <button onClick={handleSpeak} className="chip text-xs" style={{ padding: "0.3rem 0.7rem" }}>
                      <Volume /> Speak
                    </button>
                    <button onClick={() => handleCopy(translation)} className="chip text-xs" style={{ padding: "0.3rem 0.7rem" }}>
                      <Copy /> Copy
                    </button>
                  </div>
                )}
              </div>
              <div className="min-h-[5rem] bg-cream-50 rounded-2xl p-4 border border-ink-200 text-ink-900 text-[15px] sm:text-lg flex items-center">
                {translation ? (
                  <div className="w-full font-medium animate-fade-in">{translation}</div>
                ) : (
                  <span className="text-ink-400 font-normal text-sm">Translation will appear here…</span>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2 bg-cream-100 border border-ink-200 rounded-2xl px-4 py-3 text-sm text-ink-700">
                <AlertCircle className="shrink-0 mt-0.5 text-amber-500" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        <p className="mt-5 text-center text-xs text-ink-400">
          Voice input requires microphone access and a Chromium-based or Safari browser.
        </p>
      </div>
    </div>
  );
}
