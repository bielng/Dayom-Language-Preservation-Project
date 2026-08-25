function BookOpen({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  );
}

function ArrowRight({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  );
}

export default function DinkaLibraryTeaser() {
  return (
    <section className="py-20 bg-cream-50 border-t border-ink-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1">
            <span className="eyebrow mb-3 inline-block" style={{ color: '#C65D3B' }}>New Archive</span>
            <h2 className="text-3xl font-bold text-ink-900 mb-4">Dinka Digital Library</h2>
            <p className="text-sm text-ink-600 leading-relaxed mb-6 max-w-md">
              A dedicated open-data reference for <strong>Thuɔŋjäŋ</strong> (Dinka). Browse 9,199 lexical entries across six dialect regions — Northeast, Northwest, Southwest, South Central, South Aliap, and Southeast.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#/dinka-library/dictionary" className="btn-primary" style={{ backgroundColor: '#C65D3B' }}>
                <BookOpen /> Browse Dictionary
              </a>
              <a href="#/dinka-library" className="btn-ghost">
                Learn more <ArrowRight />
              </a>
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl blur-2xl opacity-20" style={{ background: 'linear-gradient(135deg, #C65D3B, #1e293b)' }} />
              <div className="relative card p-6 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  <span className="w-2 h-2 rounded-full bg-sky-600" />
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400 ml-auto">9,199 entries</span>
                </div>
                {[
                  { word: "a-", def: "nominalizer marker on verbs", tag: "SW" },
                  { word: "abudho", def: "pumpkin, squash", tag: "SWr" },
                  { word: "aciek", def: "creator, inventor", tag: "SWr" },
                  { word: "akol", def: "day (a specific day)", tag: "SWr" },
                ].map((e) => (
                  <div key={e.word} className="flex items-center gap-3 p-3 rounded-lg bg-cream-50 border border-ink-100">
                    <span className="font-bold text-ink-900 w-20 shrink-0">{e.word}</span>
                    <span className="text-xs text-ink-600 flex-1 truncate">{e.def}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-ink-100 text-ink-600 font-medium">{e.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
