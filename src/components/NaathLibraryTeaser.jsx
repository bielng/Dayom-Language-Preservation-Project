function BookStack({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function ArrowUpRight({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7" /><path d="M7 7h10v10" />
    </svg>
  );
}

export default function NaathLibraryTeaser() {
  return (
    <section className="py-20 bg-cream-50 border-t border-ink-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1">
            <span className="eyebrow mb-3 inline-block" style={{ color: '#b8923f' }}>Immersive Archive</span>
            <h2 className="text-3xl font-bold text-ink-900 mb-4">Naath Living Library</h2>
            <p className="text-sm text-ink-600 leading-relaxed mb-6 max-w-md">
              Browse eight volumes of Thok Nath on a continuous, interactive 3D shelf.
              Pull any book forward to inspect vocabulary, structures, grammar, and
              conversation — a whole new way to explore the archive.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="/naath-library/index.html" className="btn-primary" style={{ backgroundColor: '#b8923f' }}>
                <BookStack /> Naath Living Library
              </a>
              <a href="#/library" className="btn-ghost">
                Browse the data <ArrowUpRight />
              </a>
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl blur-2xl opacity-20" style={{ background: 'linear-gradient(135deg, #b8923f, #1e293b)' }} />
              <div className="relative card p-3 overflow-hidden">
                <img
                  src="/naath-library-preview.png"
                  alt="The Naath Living Library — eight volumes on an interactive 3D shelf"
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
