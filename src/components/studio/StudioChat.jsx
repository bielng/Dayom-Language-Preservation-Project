import { useState, useRef, useEffect } from "react";
import { Sparkle, Send } from "../Icons.jsx";
import { askDayomAi, CHAT_STARTERS } from "../../data/chatKnowledge.js";

const welcomeMessage = {
  role: "assistant",
  text: "Welcome to the Dayom AI Chat Assistant. Ask about a Nuer or Dinka word, a greeting, or a common phrase — I'll answer from a small verified starter knowledge base.",
  sources: [],
};

function Message({ message }) {
  return (
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
          message.role === "user"
            ? "bg-ink-900 text-white rounded-br-md"
            : "bg-cream-100 text-ink-800 rounded-bl-md"
        }`}
      >
        {message.text.split(/(\*\*.*?\*\*)/g).map((part, index) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={index}>{part.slice(2, -2)}</strong>
          ) : (
            part
          )
        )}
        {message.sources?.length > 0 && (
          <p className="mt-3 pt-2 border-t border-ink-200/80 text-[11px] text-ink-500">
            Retrieved from: {message.sources.join(" · ")}
          </p>
        )}
      </div>
    </div>
  );
}

export default function StudioChat() {
  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (event) => {
    event?.preventDefault();
    const question = input.trim();
    if (!question || isLoading) return;

    setMessages((current) => [...current, { role: "user", text: question }]);
    setInput("");
    setIsLoading(true);

    const answer = await askDayomAi(question);
    setMessages((current) => [...current, { role: "assistant", ...answer }]);
    setIsLoading(false);
  };

  return (
    <div className="relative hero-glow">
      <div className="max-w-2xl mx-auto px-6 pt-12 pb-20">
        <div className="text-center mb-8">
          <p className="eyebrow mb-3">Chat Assistant</p>
          <h1 className="section-title">Chat with Dayom AI</h1>
          <p className="mt-4 text-[15px] text-ink-500 max-w-lg mx-auto leading-relaxed">
            Ask about Nuer and Dinka words and everyday phrases in your language.
          </p>
        </div>

        <div className="card overflow-hidden shadow-[0_10px_35px_rgba(11,18,32,0.08)]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-200 bg-cream-50">
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-full bg-amber-300 flex items-center justify-center text-ink-900">
                <Sparkle />
              </span>
              <div>
                <p className="text-sm font-semibold">Dayom AI</p>
                <p className="text-[11px] text-ink-500">Starter knowledge base</p>
              </div>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-500" title="Ready" />
          </div>

          <div ref={scrollRef} className="h-[420px] overflow-y-auto space-y-4 p-5 bg-white">
            {messages.map((message, index) => (
              <Message key={index} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-ink-500">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                Searching verified local sources…
              </div>
            )}
          </div>

          <div className="px-5 py-3 border-t border-ink-200 bg-cream-50">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {CHAT_STARTERS.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => setInput(starter)}
                  className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-ink-200 bg-white text-ink-600 hover:border-ink-400 hover:text-ink-900 transition"
                >
                  {starter}
                </button>
              ))}
            </div>
            <form onSubmit={sendMessage} className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask Dayom AI…"
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
      </div>
    </div>
  );
}
