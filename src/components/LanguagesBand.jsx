export default function LanguagesBand() {
  const langs = [
    { code: "nuer", label: "Nuer (Thok Naath)" },
    { code: "dinka", label: "Dinka" },
    { code: "shilluk", label: "Shilluk" },
    { code: "bari", label: "Bari" },
  ];
  return (
    <section id="models" className="relative bg-[#0B1220] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-30" style={{
        background: "radial-gradient(700px 300px at 20% 0%, rgba(245,201,91,0.15), transparent 60%), radial-gradient(500px 200px at 90% 100%, rgba(245,201,91,0.10), transparent 60%)"
      }} />
      <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Our models already support<br className="hidden sm:block" /> core Nilotic languages
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {langs.map((l) => (
            <button
              key={l.code}
              className="px-4 py-2 rounded-full text-sm border border-white/15 bg-white/5 hover:bg-white/10 transition text-white/90"
            >
              {l.label}
            </button>
          ))}
        </div>
        <p className="mt-6 text-xs text-white/50">+ scaling across South Sudan's 100+ native languages</p>
      </div>
    </section>
  );
}
