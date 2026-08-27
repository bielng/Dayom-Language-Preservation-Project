import { useState, useRef, useEffect } from "react";
import { Sparkle, Send, Volume, Play, Rotate, AlertCircle, Check } from "../Icons.jsx";
import { CHAT_STARTERS } from "../../data/chatKnowledge.js";
import { askDayomAi } from "../../data/chatKnowledge.js";
import { synthesizeSpeech } from "../../services/tts.js";

const WELCOME = (language) => ({
  role: "assistant",
  answer: {
    kind: "meta",
    verified: true,
    text:
      `Ask me any English word or phrase and I'll look it up in Dayom Lab's published ${language} corpus.\n\nMany entries include IPA and a **recorded pronunciation** you can play. Use the language switch above whenever you want to translate into ${language}.`,
    sources: [],
  },
});

/** Renders **bold** and [label](/path) inline, nothing else. */
function RichText({ text }) {
  const parts = String(text).split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a key={i} href={link[2]} className="underline underline-offset-2 font-medium hover:text-ink-900">
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

function SourceBadges({ sources, verified }) {
  if (!sources?.length) return null;
  return (
    <div className="mt-3 pt-2.5 border-t border-ink-200/70 flex items-center gap-1.5 flex-wrap">
      <span className="text-[10px] uppercase tracking-wider text-ink-400 mr-0.5">
        {verified ? "Retrieved from" : "Source"}
      </span>
      {sources.map((s) => (
        <span
          key={s}
          className={`text-[10px] px-2 py-0.5 rounded-full ${
            verified ? "bg-ink-100 text-ink-700" : "bg-amber-300/40 text-ink-900"
          }`}
        >
          {s}
        </span>
      ))}
      {verified && (
        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 ml-0.5">
          <Check width="10" height="10" /> verified
        </span>
      )}
    </div>
  );
}

/** Play the real recording when the corpus has one, else synthesise. */
function ListenButton({ result }) {
  const [state, setState] = useState("idle"); // idle | loading | playing | error
  const audioRef = useRef(null);
  const hasRecording = result.audio?.length > 0;

  useEffect(() => () => audioRef.current?.pause(), []);

  const play = async () => {
    if (state === "loading") return;
    audioRef.current?.pause();
    setState("loading");
    try {
      const src = hasRecording
        ? `/${result.audio[0]}`
        : await synthesizeSpeech(result.nuer, "nus");
      const audio = new Audio(src);
      audioRef.current = audio;
      audio.onended = () => setState("idle");
      audio.onerror = () => setState("error");
      await audio.play();
      setState("playing");
    } catch {
      setState("error");
    }
  };

  return (
    <button
      type="button"
      onClick={play}
      disabled={state === "loading"}
      title={hasRecording ? "Play the recorded pronunciation" : "Synthesise speech"}
      className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border border-ink-200 bg-white text-ink-700 hover:border-ink-400 hover:text-ink-900 transition disabled:opacity-50"
    >
      {state === "loading" ? <Rotate className="animate-spin" width="11" height="11" />
        : state === "playing" ? <Volume width="11" height="11" />
        : <Play width="11" height="11" />}
      {state === "error" ? "Unavailable" : hasRecording ? "Recording" : "Synthesise"}
    </button>
  );
}

function ResultCard({ result, verified, primary = false }) {
  return (
    <div className={primary ? "" : "pt-3 mt-3 border-t border-ink-200/70"}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`font-semibold text-ink-900 ${primary ? "text-lg leading-snug" : "text-[15px]"}`}>
            {result.nuer}
          </p>
          <p className="text-[13px] text-ink-500 mt-0.5">{result.english}</p>
        </div>
        {result.nuer && <ListenButton result={result} />}
      </div>

      {(result.ipa || result.partOfSpeech || result.plural || result.dialect) && (
        <div className="mt-2 flex items-center gap-2.5 flex-wrap text-[11px] text-ink-500">
          {result.ipa && <span className="font-mono text-ink-700">{result.ipa}</span>}
          {result.partOfSpeech && <span className="italic">{result.partOfSpeech}</span>}
          {result.plural && <span>pl. {result.plural}</span>}
          {result.dialect && <span className="text-ink-400">{result.dialect}</span>}
        </div>
      )}

      {primary && result.examples?.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {result.examples.map((ex, i) => (
            <div key={i} className="text-[12.5px] leading-relaxed border-l-2 border-amber-300 pl-2.5">
              <span className="text-ink-900">{ex.nuer}</span>
              {ex.english && <span className="text-ink-500"> — {ex.english}</span>}
            </div>
          ))}
        </div>
      )}

      {!verified && primary && (
        <p className="mt-2 text-[11px] text-ink-500">Not checked by a speaker.</p>
      )}
    </div>
  );
}

function Answer({ answer }) {
  // Plain-prose replies: meta, empty, error, no-match.
  if (answer.text) {
    return (
      <>
        <div className="whitespace-pre-line">
          <RichText text={answer.text} />
        </div>
        <SourceBadges sources={answer.sources} verified={answer.verified} />
      </>
    );
  }

  const unverified = !answer.verified;

  return (
    <>
      {unverified && (
        <div className="flex items-start gap-2 mb-3 text-[12px] text-ink-700 bg-amber-300/25 border border-amber-300/70 rounded-xl px-3 py-2">
          <span className="mt-0.5 shrink-0 text-amber-500"><AlertCircle width="12" height="12" /></span>
          <span>Unverified machine translation</span>
        </div>
      )}

      <ResultCard result={answer.primary} verified={answer.verified} primary />

      {answer.alternatives?.length > 0 && (
        <div className="mt-3">
          <p className="text-[10px] uppercase tracking-wider text-ink-400">
            Also attested ({answer.alternatives.length})
          </p>
          {answer.alternatives.map((alt, i) => (
            <ResultCard key={i} result={alt} verified={answer.verified} />
          ))}
        </div>
      )}

      {answer.note && (
        <p className="mt-3 text-[12px] text-ink-500 leading-relaxed">
          <RichText text={answer.note} />
        </p>
      )}

      <SourceBadges sources={answer.sources} verified={answer.verified} />
    </>
  );
}

function Message({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-ink-900 text-white rounded-br-md whitespace-pre-line"
            : "bg-cream-100 text-ink-800 rounded-bl-md"
        }`}
      >
        {isUser ? message.text : <Answer answer={message.answer} />}
      </div>
    </div>
  );
}

export default function StudioChat() {
  const [targetLanguage, setTargetLanguage] = useState("Nuer");
  const [messages, setMessages] = useState([WELCOME("Nuer")]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const chatSessionRef = useRef(0);

  const changeTargetLanguage = (language) => {
    if (language === targetLanguage) return;
    chatSessionRef.current += 1;
    setTargetLanguage(language);
    setMessages([WELCOME(language)]);
    setInput("");
    setIsLoading(false);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (event, override) => {
    event?.preventDefault();
    const question = (override ?? input).trim();
    if (!question || isLoading) return;

    const hasExplicitLanguage =
      /\b(?:in|to|into)\s+(nuer|dinka|naath|thu[oö]ŋjäŋ)\b/i.test(question) ||
      /\b(nuer|dinka)\s+(?:greeting|word|phrase|language|translation|meaning)\b/i.test(question);
    const routedQuestion = hasExplicitLanguage
      ? question
      : `What is ${question} in ${targetLanguage}?`;
    const sessionId = chatSessionRef.current;
    setMessages((current) => [...current, { role: "user", text: question }]);
    setInput("");
    setIsLoading(true);
    try {
      const answer = await askDayomAi(routedQuestion, {
        targetLanguage: targetLanguage === "Dinka" ? "din" : "nus",
      });
      if (sessionId === chatSessionRef.current) {
        setMessages((current) => [...current, { role: "assistant", answer }]);
      }
    } catch {
      if (sessionId === chatSessionRef.current) {
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            answer: {
              kind: "error",
              verified: true,
              text: "Something went wrong looking that up. Try again.",
              sources: [],
            },
          },
        ]);
      }
    } finally {
      if (sessionId === chatSessionRef.current) setIsLoading(false);
    }
  };

  return (
    <div className="relative hero-glow">
      <div className="max-w-2xl mx-auto px-6 pt-12 pb-20">
        <div className="text-center mb-8">
          <p className="eyebrow mb-3">Chat Assistant</p>
          <h1 className="section-title">Chat with Dayom AI</h1>
          <p className="mt-4 text-[15px] text-ink-500 max-w-lg mx-auto leading-relaxed">
            Look up English words and phrases in the published Nuer or Dinka corpus — with
            pronunciation, IPA, and the source each answer came from.
          </p>
        </div>

        <div className="flex justify-center mb-5" aria-label="Target language">
          <div className="inline-flex rounded-full border border-ink-200 bg-white p-1 shadow-sm">
            {["Nuer", "Dinka"].map((language) => (
              <button
                key={language}
                type="button"
                onClick={() => changeTargetLanguage(language)}
                aria-pressed={targetLanguage === language}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  targetLanguage === language
                    ? "bg-amber-300 text-ink-900"
                    : "text-ink-500 hover:text-ink-900"
                }`}
              >
                {language}
              </button>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden shadow-[0_10px_35px_rgba(11,18,32,0.08)]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-200 bg-cream-50">
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-full bg-amber-300 flex items-center justify-center text-ink-900">
                <Sparkle />
              </span>
              <div>
                <p className="text-sm font-semibold">Dayom AI</p>
                <p className="text-[11px] text-ink-500">Corpus retrieval · {targetLanguage}</p>
              </div>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-500" title="Ready" />
          </div>

          <div ref={scrollRef} className="h-[440px] overflow-y-auto space-y-4 p-5 bg-white">
            {messages.map((message, index) => (
              <Message key={index} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-ink-500">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                Searching the corpus…
              </div>
            )}
          </div>

          <div className="px-5 py-3 border-t border-ink-200 bg-cream-50">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {CHAT_STARTERS.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => sendMessage(null, starter)}
                  disabled={isLoading}
                  className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-ink-200 bg-white text-ink-500 hover:border-ink-400 hover:text-ink-900 transition disabled:opacity-50"
                >
                  {starter}
                </button>
              ))}
            </div>
            <form onSubmit={sendMessage} className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type any English word…"
                className="min-w-0 flex-1 bg-white border border-ink-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-ink-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="h-10 w-10 shrink-0 rounded-full bg-ink-900 text-white disabled:opacity-40 transition hover:bg-ink-700 flex items-center justify-center"
                aria-label="Send message"
              >
                <Send />
              </button>
            </form>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-ink-400">
          Answers come from the{" "}
          <a href="/datasets" className="underline underline-offset-2 hover:text-ink-700">
            open corpus
          </a>
          . Anything not attested there is labelled as machine translation.
        </p>
      </div>
    </div>
  );
}
