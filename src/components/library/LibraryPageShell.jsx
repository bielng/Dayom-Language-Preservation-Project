export default function LibraryPageShell({ eyebrow, title, description, children, wide = false, showHomeLink = false }) {
  return (
    <div className="relative hero-glow">
      <div className={`${wide ? "max-w-5xl" : "max-w-3xl"} mx-auto px-6 pt-12 pb-20`}>
        {showHomeLink && (
          <a href="#/" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900 transition mb-6">
            ← Return to home page
          </a>
        )}
        <div className="text-center mb-8">
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h1 className="section-title">{title}</h1>
          {description && (
            <p className="mt-4 text-[15px] text-ink-500 max-w-xl mx-auto leading-relaxed">{description}</p>
          )}
        </div>
        <div className="card p-5 sm:p-7 shadow-[0_2px_30px_rgba(11,18,32,0.05)]">
          {children}
        </div>
      </div>
    </div>
  );
}
