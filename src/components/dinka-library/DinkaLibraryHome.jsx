function ArrowRight({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  );
}

const REGIONS = [
  { code: "NE", name: "Northeast", subs: "Abialang, Ageer, Dongjol, Ngok (Sobat), Thoi, Rut, Luac", accent: "bg-rose-200/50 text-rose-800 border-rose-200" },
  { code: "NW", name: "Northwest", subs: "Ruweng, Pan Aru, Alor, Ngok (Abyei), Ciec", accent: "bg-sky-200/50 text-sky-800 border-sky-200" },
  { code: "SW", name: "Southwest", subs: "Malual, Rek, Twic Mayardit, Luac (Tonj East)", accent: "bg-amber-300/40 text-amber-800 border-amber-300/60" },
  { code: "SC", name: "South Central", subs: "Gok, Agar, Ciec", accent: "bg-emerald-200/50 text-emerald-800 border-emerald-200" },
  { code: "SA", name: "South Aliap", subs: "Aliap", accent: "bg-violet-200/50 text-violet-800 border-violet-200" },
  { code: "SE", name: "Southeast", subs: "Bor, Twic East, Nyarweng, Ɣɔl", accent: "bg-orange-200/50 text-orange-800 border-orange-200" },
];

export default function DinkaLibraryHome() {
  return (
    <div className="relative hero-glow">
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="eyebrow mb-4">Open Data</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink-900 leading-[1.1]">
            Dinka Digital Library
          </h1>
          <p className="mt-6 text-[15px] sm:text-base text-ink-500 leading-relaxed">
            An open-data reference for Thuɔŋjäŋ (Dinka), one of the major Nilotic
            languages of South Sudan. Explore 9,199 lexical entries across six
            dialect regions.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#/dinka-library/dictionary" className="btn-primary">
              Open Dictionary <ArrowRight />
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Entries", value: "9,199" },
            { label: "Dialects", value: "18" },
            { label: "Regions", value: "6" },
            { label: "Status", value: "Active" },
          ].map((s) => (
            <div key={s.label} className="card p-4 text-center">
              <p className="text-2xl font-bold text-ink-900">{s.value}</p>
              <p className="text-[11px] text-ink-500 font-medium uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Dialect Regions */}
        <div className="mt-5 card p-6">
          <h3 className="text-lg font-bold text-ink-900 mb-4">Dialect Regions</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {REGIONS.map((r) => (
              <div key={r.code} className={`p-4 rounded-xl border ${r.accent}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold opacity-60">{r.code}</span>
                  <span className="text-sm font-bold">{r.name}</span>
                </div>
                <p className="text-xs opacity-80">{r.subs}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
