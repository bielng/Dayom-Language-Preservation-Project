import { ArrowUpRight, ArrowRight } from "./Icons.jsx";

export default function Hero() {
  return (
    <section className="relative hero-glow">
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ink-900 leading-[1.05]">
          Dayom Lab brings South<br className="hidden sm:block" /> Sudanese languages to the<br className="hidden sm:block" /> digital world
        </h1>
        <p className="mt-7 text-[15px] sm:text-base text-ink-500 max-w-xl mx-auto leading-relaxed">
          We are a South Sudan-rooted language technology and AI data startup building
          large-scale, open-source datasets and natural language processing (NLP)
          models for under-represented languages.
        </p>
        <div className="mt-9 flex items-center justify-center gap-3 flex-wrap">
          <a href="#/studio" className="btn-primary">
            Translate for free <ArrowUpRight />
          </a>
          <a href="#about" className="btn-ghost">
            Learn More <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
