export default function TrustBar() {
  const partners = ["Khan AI", "NaathNLP", "Global AI Trust", "Open Data Init"];
  return (
    <section className="bg-[#F3F1EA]">
      <div className="max-w-5xl mx-auto px-6 py-12 text-center">
        <p className="text-xs text-ink-500 mb-6">Trusted by Global Tech Platforms &amp; Academic Institutions</p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {partners.map((p) => (
            <div key={p} className="text-ink-400 hover:text-ink-700 transition text-sm font-semibold tracking-tight flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-ink-300" />
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
