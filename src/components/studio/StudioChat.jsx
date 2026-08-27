import { useState, useRef, useEffect } from "react";
import {
  Sparkle,
  Send,
  Bug,
  Volume2,
  RotateCcw,
  BookOpen,
  ChevronRight,
} from "../Icons.jsx";
import { askDayomAi, CHAT_STARTERS } from "../../data/chatKnowledge.js";
import { askNuerModel, warmChat } from "../../services/nuerChat.js";

const welcomeMessage = {
  role: "assistant",
  text: "**Welcome to Dayom AI!** \n\nI can help you with:\n· **Translations** — Nuer ⇄ D ⇄ English\n· **Definitions** — What does a word mean?\n· **Grammar** — Plurals, conjugations, structures\n· **Pronunciation** — Audio playback for phrasebook entries\n· **Comparisons** — See Nuer vs Dinka side-by-side\n\nAsk me anything, or pick a starter below!",
  sources: [],
  suggestions: [
    "How do I say hello in Nuer?",
    "What does Malɛ mean?",
    "Teach me a Dinka greeting",
  ],
};

function SuggestionChips({ suggestions, onClick, isLoading }) {
  if (!suggestions?.length || isLoading) return null;
  return (
    <div className='flex flex-wrap gap-2 mt-3'>
      {suggestions.map((s, i) => (
        <button
          key={`${s}-${i}`}
          type='button'
          onClick={() => onClick(s)}
          className='text-xs px-3 py-1.5 rounded-full border border-amber-300/60 bg-amber-50 text-ink-700 hover:bg-amber-100 hover:border-amber-400 transition flex items-center gap-1'
        >
          <ChevronRight className='w-3 h-3' />
          {s}
        </button>
      ))}
    </div>
  );
}

function AudioPlayer({ src }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.onended = () => setPlaying(false);
      audioRef.current.onerror = () => setPlaying(false);
    }
    if (playing) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition ${
        playing
          ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
          : "bg-cream-100 text-ink-600 border border-ink-200 hover:bg-amber-50 hover:border-amber-300"
      }`}
    >
      <Volume2 className='w-3.5 h-3.5' />
      {playing ? "Playing…" : "Listen"}
    </button>
  );
}

function Message({ message, debug, onSuggestionClick }) {
  const hasAudio = message.text?.includes("🔊");
  const audioMatches = hasAudio
    ? [...message.text.matchAll(/🔊\s*\[Listen to pronunciation\]\(([^)]+)\)/g)]
    : [];

  // Replace audio markers with actual players
  let processedText = message.text;
  if (hasAudio) {
    processedText = message.text
      .replace(/🔊\s*\[Listen to pronunciation\]\(([^)]+)\)/g, "")
      .trim();
  }

  return (
    <div
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
          message.role === "user"
            ? "bg-ink-900 text-white rounded-br-md"
            : "bg-cream-50 text-ink-800 rounded-bl-md border border-ink-100"
        }`}
      >
        {/* Render text with bold handling */}
        {processedText.split(/(\*\*.*?\*\*)/g).map((part, index) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={index} className='font-semibold text-ink-900'>
              {part.slice(2, -2)}
            </strong>
          ) : (
            <span key={index}>{part}</span>
          ),
        )}

        {/* Audio players */}
        {audioMatches.length > 0 && (
          <div className='flex flex-wrap gap-2 mt-2'>
            {audioMatches.map((m, i) => (
              <AudioPlayer key={i} src={m[1]} />
            ))}
          </div>
        )}

        {/* English rendering of a Nuer answer, from the pivot pipeline */}
        {message.english && (
          <p className='mt-2.5 pt-2 border-t border-ink-200/60 text-[13px] text-ink-500 italic'>
            {message.english}
          </p>
        )}

        {/* Fallback notice */}
        {message.modelError && (
          <p className='mt-2.5 text-[11px] text-amber-700'>
            The assistant didn't answer ({message.modelError}) — this came from
            the local datasets instead.
          </p>
        )}

        {/* Sources */}
        {message.sources?.length > 0 && (
          <p className='mt-3 pt-2 border-t border-ink-200/60 text-[11px] text-ink-400'>
            {message.sources.join(" · ")}
          </p>
        )}

        {/* Suggestions */}
        {message.role === "assistant" && (
          <SuggestionChips
            suggestions={message.suggestions}
            onClick={onSuggestionClick}
            isLoading={false}
          />
        )}

        {/* Debug */}
        {debug && message.meta && (
          <details className='mt-3 text-[10px] text-ink-400 border-t border-ink-200/40 pt-2'>
            <summary className='cursor-pointer hover:text-ink-600 font-mono'>
              🔧 debug
            </summary>
            <pre className='mt-1 overflow-x-auto bg-white/70 rounded p-2 text-[9px] leading-tight'>
              {JSON.stringify(message.meta, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

export default function StudioChat() {
  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debug, setDebug] = useState(false);
  const [proficiency, setProficiency] = useState("beginner");
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Wake the Space while the user reads the welcome message. The local corpus
  // is deliberately NOT loaded here — it is only a fallback, and eagerly
  // fetching all eight datasets delayed the page for seconds.
  useEffect(warmChat, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const sendMessage = async (text) => {
    const question = (text || input).trim();
    if (!question || isLoading) return;

    setMessages((current) => [...current, { role: "user", text: question }]);
    if (!text) setInput("");
    setIsLoading(true);

    let answer;
    try {
      // The fine-tuned assistant answers in Nuer and returns the English
      // rendering alongside it.
      const reply = await askNuerModel(question);
      answer = {
        text: reply.nuer || reply.english,
        english: reply.nuer ? reply.english : null,
        engine: "model",
        sources: ["Fine-tuned Nuer assistant"],
        meta: debug ? reply : null,
      };
    } catch (err) {
      // Space asleep, queued, or offline — answer from the local corpus so the
      // chat still works rather than failing outright.
      console.warn("[chat] model unavailable:", err.message);
      const local = await askDayomAi(question, { debug });
      answer = { ...local, engine: "corpus", modelError: err.message };
    }

    setMessages((current) => [...current, { role: "assistant", ...answer }]);
    setIsLoading(false);
    inputRef.current?.focus();
  };

  const clearChat = () => {
    setMessages([welcomeMessage]);
  };

  return (
    <div className='relative hero-glow min-h-screen'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-12 sm:pb-20'>
        {/* Header */}
        <div className='text-center mb-6'>
          <p className='eyebrow mb-2'>Chat Assistant</p>
          <h1 className='section-title text-2xl sm:text-3xl'>
            Chat with Dayom AI
          </h1>
          <p className='mt-3 text-[14px] text-ink-500 max-w-md mx-auto leading-relaxed'>
            Nuer & Dinka translations, grammar, pronunciation, and cultural
            context from verified local sources.
          </p>
        </div>

        {/* Proficiency Toggle */}
        <div className='flex justify-center gap-2 mb-4'>
          {["beginner", "intermediate", "advanced"].map((level) => (
            <button
              key={level}
              onClick={() => setProficiency(level)}
              className={`text-[11px] px-3 py-1 rounded-full border transition capitalize ${
                proficiency === level
                  ? "bg-ink-900 text-white border-ink-900"
                  : "bg-white text-ink-500 border-ink-200 hover:border-ink-400"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Chat Card */}
        <div className='card overflow-hidden shadow-[0_10px_40px_rgba(11,18,32,0.1)]'>
          {/* Top Bar */}
          <div className='flex items-center justify-between px-4 sm:px-5 py-3 border-b border-ink-200 bg-cream-50'>
            <div className='flex items-center gap-2.5'>
              <span className='h-9 w-9 rounded-full bg-amber-300 flex items-center justify-center text-ink-900 shadow-sm'>
                <Sparkle />
              </span>
              <div>
                <p className='text-sm font-semibold text-ink-900'>Dayom AI</p>
                <p className='text-[11px] text-ink-400'>
                  Fine-tuned Nuer assistant · {proficiency}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-1.5'>
              <button
                type='button'
                onClick={clearChat}
                className='h-8 w-8 rounded-full bg-white border border-ink-200 text-ink-400 hover:text-ink-700 hover:border-ink-400 transition flex items-center justify-center'
                title='Clear chat'
              >
                <RotateCcw className='w-3.5 h-3.5' />
              </button>
              <button
                type='button'
                onClick={() => setDebug((d) => !d)}
                className={`h-8 w-8 rounded-full flex items-center justify-center transition border ${
                  debug
                    ? "bg-amber-300 text-ink-900 border-amber-400"
                    : "bg-white text-ink-400 border-ink-200 hover:text-ink-700 hover:border-ink-400"
                }`}
                title={debug ? "Debug ON" : "Debug OFF"}
              >
                <Bug className='w-3.5 h-3.5' />
              </button>
              <span
                className='h-2 w-2 rounded-full bg-emerald-500 ml-1'
                title='Ready'
              />
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className='h-[380px] sm:h-[480px] overflow-y-auto space-y-4 p-4 sm:p-5 bg-white'
          >
            {messages.map((message, index) => (
              <Message
                key={index}
                message={message}
                debug={debug}
                onSuggestionClick={sendMessage}
              />
            ))}
            {isLoading && (
              <div className='flex items-center gap-2 text-sm text-ink-500'>
                <span className='h-2 w-2 rounded-full bg-amber-400 animate-pulse' />
                <span className='animate-pulse'>
                  Thinking… the model may be waking up.
                </span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className='px-4 sm:px-5 py-3 border-t border-ink-200 bg-cream-50'>
            {/* Starters */}
            <div className='flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-2'>
              {CHAT_STARTERS.map((starter) => (
                <button
                  key={starter}
                  type='button'
                  onClick={() => sendMessage(starter)}
                  className='shrink-0 text-[11px] px-3 py-1.5 rounded-full border border-ink-200 bg-white text-ink-600 hover:border-amber-400 hover:text-ink-900 hover:bg-amber-50 transition'
                >
                  {starter}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className='flex items-center gap-2'
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Ask anything about Nuer or Dinka…'
                className='min-w-0 flex-1 bg-white border border-ink-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-ink-500 focus:ring-1 focus:ring-ink-200 transition'
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button
                type='submit'
                disabled={!input.trim() || isLoading}
                className='h-10 w-10 shrink-0 rounded-xl bg-ink-900 text-white disabled:opacity-40 transition hover:bg-ink-700 flex items-center justify-center shadow-sm'
                aria-label='Send message'
              >
                <Send className='w-4 h-4' />
              </button>
            </form>

            <div className='flex justify-between items-center mt-2'>
              <p className='text-[10px] text-ink-400'>
                {debug
                  ? "Debug mode: search metadata visible"
                  : "Tip: Try 'Compare hello in Nuer and Dinka' or 'What is the plural of child?'"}
              </p>
              <div className='flex items-center gap-1 text-[10px] text-ink-400'>
                <BookOpen className='w-3 h-3' />
                <span>Fine-tuned model · datasets as fallback</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
