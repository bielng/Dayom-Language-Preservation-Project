import { useEffect, useState } from "react";
import {
  Swap,
  Sparkle,
  Copy,
  Check,
  Volume,
  Rotate,
  AlertCircle,
  ChevronDown,
} from "../Icons.jsx";
import { translateText, getLangName } from "../../services/translate.js";
import { warmModel } from "../../services/nuerModel.js";
import { synthesizeSpeech, speakEnglish } from "../../services/tts.js";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "nus", name: "Nuer (Thok Naath)" },
  { code: "din", name: "Dinka (Thuɔŋjäŋ)" },
];

const SAMPLE_INPUTS = {
  "en-nus": [
    "Nuer language preservation.",
    "Many people make a living by herding cattle and farming",
    "I wanna go to Kenya",
    "It contains the Sudd, one of the biggest wetlands in the world.",
  ],
  "en-din": [
    "Dinka language preservation.",
    "Many people make a living by herding cattle and farming",
    "I want to go to Kenya",
    "South Sudan is the youngest country in Africa.",
  ],
  "nus-en": [
    "Ɣän cieŋä kä Kenya",
    "Ɣän ta̱a̱ kɛ määth mi cɔali Kidit.",
    "Cä jɛ nhɔk ɛn ɣöö ŋotdɛ thiɛlɛ dup ti̱ gɔw rɛy juba",
  ],
  "din-en": [
    "Ɣɛn anɔŋ mäth cɔl Yar.",
    "Alaak aciɛ̈ɛ̈r në Nairobi, Kenya.",
    "Ɣɛn lɔ Juba, miäkduur.",
  ],
  "nus-din": ["Ɣän cieŋä kä Kenya", "Ɣän ta̱a̱ kɛ määth mi cɔali Kidit."],
  "din-nus": ["Ɣɛn anɔŋ mäth cɔl Yar.", "Alaak aciɛ̈ɛ̈r në Nairobi, Kenya."],
};

export default function StudioTranslate() {
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("nus");
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakError, setSpeakError] = useState(null);

  // Wake the Space while the user is still typing, so the first translation
  // does not pay the cold start.
  useEffect(warmModel, []);

  const direction = `${sourceLang}-to-${targetLang}`;
  const sourceLabel = getLangName(sourceLang);
  const targetLabel = getLangName(targetLang);
  const sampleKey = `${sourceLang}-${targetLang}`;

  const handleSourceChange = (e) => {
    const val = e.target.value;
    if (val === targetLang) setTargetLang(sourceLang);
    setSourceLang(val);
    setInputText("");
    setResult(null);
    setError(null);
    setSpeakError(null);
  };

  const handleTargetChange = (e) => {
    const val = e.target.value;
    if (val === sourceLang) setSourceLang(targetLang);
    setTargetLang(val);
    setInputText("");
    setResult(null);
    setError(null);
    setSpeakError(null);
  };

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(result?.text || "");
    setResult(null);
    setError(null);
    setSpeakError(null);
  };

  const handleTranslate = async () => {
    if (!inputText.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    setSpeakError(null);
    try {
      setResult(await translateText(inputText.trim(), direction));
    } catch (err) {
      console.error("Translation error:", err);
      setError(
        "Couldn't load the translation datasets. Reload the page and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.text) return;
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = async () => {
    if (!result?.text || isSpeaking) return;
    setSpeakError(null);
    setIsSpeaking(true);

    try {
      if (targetLang === "en") {
        // English → browser TTS (never MMS)
        await speakEnglish(result.text);
        setIsSpeaking(false);
      } else {
        // Nuer or Dinka → MMS (Space first, then Inference fallback)
        const url = await synthesizeSpeech(result.text, targetLang);
        const audio = new Audio(url);
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = (e) => {
          console.error("Audio playback error:", e);
          setSpeakError("Audio playback failed in the browser.");
          setIsSpeaking(false);
        };
        await audio.play();
      }
    } catch (err) {
      console.error("TTS error:", err);
      setSpeakError(err.message || "Voice synthesis failed. Try again.");
      setIsSpeaking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleTranslate();
  };

  return (
    <div className='relative hero-glow'>
      <div className='max-w-3xl mx-auto px-6 pt-12 pb-20'>
        <div className='text-center mb-8'>
          <p className='eyebrow mb-3'>Text Translation</p>
          <h1 className='section-title'>Translate for free</h1>
          <p className='mt-4 text-[15px] text-ink-500 max-w-lg mx-auto leading-relaxed'>
            English, Nuer, and Dinka — translate between any two languages
            instantly.
          </p>
        </div>

        <div className='flex items-center justify-center gap-2 sm:gap-3 mb-6 flex-wrap'>
          <div className='relative'>
            <select
              value={sourceLang}
              onChange={handleSourceChange}
              className='appearance-none chip pr-9 font-medium'
              style={{ padding: "0.6rem 2.25rem 0.6rem 1rem" }}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
            <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-500' />
          </div>

          <button
            onClick={handleSwap}
            title='Swap languages'
            className='h-10 w-10 rounded-full border border-ink-200 bg-white flex items-center justify-center hover:bg-ink-100 transition text-ink-700'
          >
            <Swap />
          </button>

          <div className='relative'>
            <select
              value={targetLang}
              onChange={handleTargetChange}
              className='appearance-none chip pr-9 font-medium'
              style={{ padding: "0.6rem 2.25rem 0.6rem 1rem" }}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
            <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-500' />
          </div>
        </div>

        <div className='card p-5 sm:p-7 shadow-[0_2px_30px_rgba(11,18,32,0.05)]'>
          <div className='flex items-center justify-between px-1 mb-2'>
            <span className='eyebrow'>{sourceLabel}</span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Type something in ${sourceLabel} to translate into ${targetLabel}…`}
            rows={3}
            className='w-full bg-cream-50 rounded-2xl p-4 text-[15px] text-ink-900 placeholder:text-ink-400 resize-none border border-ink-200 outline-none focus:border-ink-400 transition'
          />

          {SAMPLE_INPUTS[sampleKey] && (
            <div className='mt-3 flex flex-wrap items-center gap-2'>
              <span className='text-xs text-ink-400 mr-1'>Try:</span>
              {SAMPLE_INPUTS[sampleKey].map((sample) => (
                <button
                  key={sample}
                  onClick={() => setInputText(sample)}
                  className='text-xs px-3 py-1.5 rounded-full border border-ink-200 text-ink-500 hover:text-ink-900 hover:border-ink-300 transition'
                >
                  {sample.length > 38 ? sample.slice(0, 38) + "…" : sample}
                </button>
              ))}
            </div>
          )}

          <div className='flex justify-center my-5'>
            <button
              onClick={handleTranslate}
              disabled={isLoading || !inputText.trim()}
              className='btn-primary'
            >
              {isLoading ? (
                <>
                  <Rotate className='animate-spin' /> Translating…
                </>
              ) : (
                <>
                  <Sparkle /> Translate
                </>
              )}
            </button>
          </div>

          <div className='flex items-center justify-between px-1 mb-2'>
            <span className='eyebrow'>{targetLabel}</span>
            {result?.text && (
              <div className='flex items-center gap-2'>
                <button
                  onClick={handleSpeak}
                  disabled={isSpeaking}
                  className='chip !cursor-pointer text-xs'
                  style={{ padding: "0.35rem 0.75rem" }}
                >
                  <Volume
                    className={isSpeaking ? "animate-pulse text-amber-500" : ""}
                  />
                  {isSpeaking ? "Speaking…" : "Speak"}
                </button>
                <button
                  onClick={handleCopy}
                  className='chip !cursor-pointer text-xs'
                  style={{ padding: "0.35rem 0.75rem" }}
                >
                  {copied ? <Check className='text-emerald-600' /> : <Copy />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            )}
          </div>

          <div className='min-h-[6rem] bg-cream-50 rounded-2xl p-4 border border-ink-200 text-ink-900 text-[15px] sm:text-lg flex items-center'>
            {result?.text ? (
              <div className='w-full font-medium animate-fade-in whitespace-pre-wrap'>
                {result.text}
              </div>
            ) : (
              <span className='text-ink-400 font-normal text-sm'>
                Translation result will appear here…
              </span>
            )}
          </div>

          {result?.text && (
            <div className='mt-4 space-y-2 text-xs text-ink-500 animate-fade-in'>
              <div className='flex flex-wrap items-center gap-2'>
                <span
                  className='chip'
                  style={{ padding: "0.3rem 0.7rem" }}
                  title='Which engine produced this result'
                >
                  {result.engine === "model"
                    ? "Fine-tuned Nuer model"
                    : result.method === "verified"
                      ? "Exact dataset match"
                      : `Dataset assembly — ${Math.round(result.coverage * 100)}% of words matched`}
                </span>
                {result.pivot && (
                  <span className='chip' style={{ padding: "0.3rem 0.7rem" }}>
                    via English
                  </span>
                )}
                {result.sources.length > 0 && (
                  <span>From: {result.sources.join(" · ")}</span>
                )}
              </div>

              {result.modelError && (
                <p className='text-amber-700'>
                  The fine-tuned model didn't answer ({result.modelError}) — this
                  came from the datasets instead. It may be waking up; try again
                  in a moment for a better translation.
                </p>
              )}

              {result.engine === "corpus" &&
                !result.modelError &&
                result.method !== "verified" &&
                (sourceLang === "din" || targetLang === "din") && (
                  <p>
                    Dinka has no fine-tuned model yet, so this is assembled from
                    the Dinka dictionary.
                  </p>
                )}

              {result.unresolved.length > 0 && (
                <p>
                  Not recorded in your datasets yet, so left as written:{" "}
                  <span className='text-ink-700 font-medium'>
                    {result.unresolved.join(", ")}
                  </span>
                </p>
              )}

              {result.approximate.length > 0 && (
                <p>
                  Matched through a related word form:{" "}
                  <span className='text-ink-700 font-medium'>
                    {result.approximate.join(", ")}
                  </span>
                </p>
              )}

              {result.engine === "corpus" && result.method === "assembled" && (
                <p>
                  Dataset assembly is phrase-by-phrase and is not guaranteed to
                  be grammatical.
                </p>
              )}
            </div>
          )}

          {error && (
            <div className='mt-4 flex items-start gap-2 bg-cream-100 border border-ink-200 rounded-2xl px-4 py-3 text-sm text-ink-700'>
              <AlertCircle className='shrink-0 mt-0.5 text-amber-500' />
              <span>{error}</span>
            </div>
          )}
          {speakError && (
            <div className='mt-4 flex items-start gap-2 bg-cream-100 border border-ink-200 rounded-2xl px-4 py-3 text-sm text-ink-700'>
              <AlertCircle className='shrink-0 mt-0.5 text-amber-500' />
              <span>{speakError}</span>
            </div>
          )}
        </div>

        <p className='mt-5 text-center text-xs text-ink-400'>
          English ↔ Nuer runs on our fine-tuned Nuer model, backed by the
          verified corpus. No third-party translation service is used.
        </p>
      </div>
    </div>
  );
}
