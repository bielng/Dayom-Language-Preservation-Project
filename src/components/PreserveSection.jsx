export default function PreserveSection() {
  return (
    <section id="about" className="bg-[#F3F1EA]">
      <div className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink-900">
          Preserving language through technology
        </h2>
        <p className="mt-5 text-[15px] text-ink-500 leading-relaxed max-w-2xl mx-auto">
          Nuer is spoken by millions of people across South Sudan, Ethiopia, and diaspora
          communities, but remains a low-resource language with almost no native NLP
          tooling. NaathNLP exists to change that: building translation models, parallel
          corpora, and language tools with quality reviewed by native speakers at every step.
        </p>
      </div>
    </section>
  );
}
