import { Brain, Server, Building, Heart, ArrowRight } from "./Icons.jsx";

const items = [
  {
    icon: Brain,
    title: "AI Researchers",
    body: "Access high-quality, cleanly formatted parallel corpora and open models to advance research in low-resource language processing.",
  },
  {
    icon: Server,
    title: "Tech Platforms",
    body: "Integrate robust datasets to improve global Trust & Safety, content moderation, and accessibility for marginalized user bases.",
  },
  {
    icon: Building,
    title: "Academic Institutions",
    body: "Collaborate on linguistic preservation, computational linguistics projects, and access baseline resources for indigenous languages.",
  },
  {
    icon: Heart,
    title: "Indigenous Communities",
    body: "Contribute directly to the digital survival of your native language, ensuring cultural continuity and future technological inclusion.",
  },
];

export default function AudienceSection() {
  return (
    <section id="initiatives" className="bg-[#FCFAF5]">
      <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-3 gap-8">
        <div>
          <p className="eyebrow mb-4">Target Audience</p>
          <h3 className="section-title">Who We're Built For</h3>
          <p className="mt-5 text-ink-500 text-[15px] leading-relaxed">
            Dayom Lab provides data and infrastructure that empowers a wide ecosystem of
            language and AI stakeholders.
          </p>
          <a href="#about" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-900 underline underline-offset-4 decoration-ink-300 hover:decoration-ink-900">
            More on our mission <ArrowRight />
          </a>
        </div>

        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <div key={it.title} className="card p-6">
                <div className="h-10 w-10 rounded-full bg-amber-300/40 flex items-center justify-center text-ink-900 mb-4">
                  <Icon />
                </div>
                <h4 className="font-semibold text-ink-900">{it.title}</h4>
                <p className="mt-2 text-sm text-ink-500 leading-relaxed">{it.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
