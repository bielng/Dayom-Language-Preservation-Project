import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";

// Shared frame for every top-level marketing / policy page.
// Keeps the navbar + footer identical to the homepage and gives each page
// the same centred hero header the library shell uses.
export default function PageShell({ eyebrow, title, lede, children, wide = false }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f9f6ee]">
      <Navbar />
      <main className="flex-1">
        <section className="relative hero-glow">
          <div className="max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
            {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink-900 leading-[1.08]">
              {title}
            </h1>
            {lede && (
              <p className="mt-6 text-[15px] sm:text-base text-ink-500 max-w-xl mx-auto leading-relaxed">
                {lede}
              </p>
            )}
          </div>
        </section>

        <div className={`${wide ? "max-w-6xl" : "max-w-4xl"} mx-auto px-6 pb-24`}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ---------- Building blocks shared across the new pages ---------- */

export function Section({ id, eyebrow, title, children, className = "" }) {
  return (
    <section id={id} className={`scroll-mt-24 ${className}`}>
      {(eyebrow || title) && (
        <div className="mb-6">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          {title && <h2 className="section-title">{title}</h2>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Prose({ children }) {
  return (
    <div className="space-y-4 text-[15px] text-ink-700 leading-relaxed [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-ink-300 [&_a:hover]:decoration-ink-900">
      {children}
    </div>
  );
}

export function StatTile({ value, label, sub }) {
  return (
    <div className="card p-5">
      <div className="text-2xl font-bold tracking-tight text-ink-900 font-mono">{value}</div>
      <div className="mt-1 text-sm font-medium text-ink-900">{label}</div>
      {sub && <div className="mt-0.5 text-xs text-ink-400">{sub}</div>}
    </div>
  );
}

export function InfoCard({ icon: Icon, title, children, accent = false }) {
  return (
    <div className="card p-6">
      {Icon && (
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center mb-4 ${
            accent ? "bg-amber-300 text-ink-900" : "bg-amber-300/40 text-ink-900"
          }`}
        >
          <Icon />
        </div>
      )}
      <h3 className="font-semibold text-ink-900">{title}</h3>
      <div className="mt-2 text-sm text-ink-500 leading-relaxed">{children}</div>
    </div>
  );
}

export function DraftBanner({ children }) {
  return (
    <div className="card p-4 mb-10 border-amber-300 bg-amber-300/15 flex items-start gap-3">
      <span className="mt-0.5 text-ink-900 shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="M12 8v5" /><path d="M12 16h.01" />
        </svg>
      </span>
      <p className="text-sm text-ink-700 leading-relaxed">{children}</p>
    </div>
  );
}
