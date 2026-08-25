import { Logo, ArrowLeft, Home } from "../Icons.jsx";

const NAV_ITEMS = [
  { id: "home", label: "Home", href: "#/dinka-library" },
  { id: "dictionary", label: "Dictionary", href: "#/dinka-library/dictionary" },
];

export default function DinkaLibraryLayout({ active, children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f9f6ee]">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FCFAF5]/90 border-b border-ink-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <a href="#/dinka-library" className="flex items-center gap-2 shrink-0">
            <Logo />
            <span className="font-semibold text-[15px] tracking-tight text-ink-900 hidden sm:inline">
              Dinka Digital Library
            </span>
          </a>

          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`shrink-0 inline-flex items-center gap-1 text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full transition ${
                    isActive
                      ? "bg-amber-300 text-ink-900 font-medium"
                      : "text-ink-600 hover:text-ink-900 hover:bg-ink-100"
                  }`}
                >
                  {item.id === "home" && <Home />}
                  {item.label}
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
          Dinka Digital Library · Open dataset from Dayom Lab and community contributors
        </p>
      </footer>
    </div>
  );
}
