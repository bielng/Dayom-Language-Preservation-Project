import { Logo, ArrowLeft, Home, Sparkle, Translate, Mic, Volume } from "../Icons.jsx";

const NAV_ITEMS = [
  { id: "home", label: "Home", href: "#/studio", icon: Home },
  { id: "chat", label: "Chat Assistant", href: "#/studio/chat", icon: Sparkle },
  { id: "translate", label: "Text Translation", href: "#/studio/translate", icon: Translate },
  { id: "voice", label: "Speech Recognition", href: "#/studio/voice", icon: Mic },
  { id: "tts", label: "Text to Speech", href: "#/studio/tts", icon: Volume },
];

export default function StudioLayout({ active, children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f9f6ee]">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FCFAF5]/90 border-b border-ink-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <a href="#/studio" className="flex items-center gap-2 shrink-0">
            <Logo />
            <span className="font-semibold text-[15px] tracking-tight text-ink-900 hidden sm:inline">
              Dayom AI Studio
            </span>
          </a>

          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`shrink-0 inline-flex items-center gap-1.5 text-xs sm:text-sm px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full transition ${
                    isActive
                      ? "bg-amber-300 text-ink-900 font-medium"
                      : "text-ink-600 hover:text-ink-900 hover:bg-ink-100"
                  }`}
                >
                  <Icon />
                  <span className="hidden sm:inline">{item.label}</span>
                </a>
              );
            })}
          </nav>

          <a
            href="#/"
            className="shrink-0 inline-flex items-center gap-1.5 text-xs sm:text-sm text-ink-500 hover:text-ink-900 transition"
          >
            <ArrowLeft />
            <span className="hidden md:inline">Back to main site</span>
          </a>
        </div>
      </header>

      <main className="flex-1 w-full">{children}</main>

      <footer className="w-full text-center py-5 px-4 border-t border-ink-200 bg-white">
        <p className="text-[11px] sm:text-xs text-ink-400">
          Dayom AI Studio · Powered by Dayom Lab · Preserving Nilotic languages through AI
        </p>
      </footer>
    </div>
  );
}
