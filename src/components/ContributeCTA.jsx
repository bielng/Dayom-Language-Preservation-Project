import { Github, ArrowUpRight } from "./Icons.jsx";
import { GITHUB } from "../config/site.js";

export default function ContributeCTA() {
  return (
    <section id="contribute" className="relative bg-[#0B1220] text-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(800px 350px at 70% 50%, rgba(245,201,91,0.10), transparent 60%)",
        }}
      />
      <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Start Contributing</h2>
        <p className="mt-5 text-white/60 max-w-xl mx-auto text-[15px] leading-relaxed">
          Join our volunteer-driven effort to build infrastructure for South Sudanese
          languages. Whether it's data, review, compute, or code, your help matters.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <a href={GITHUB.repoUrl} target="_blank" rel="noreferrer" className="btn-primary">
            <Github /> Contribute on GitHub
          </a>
          <a
            href="#/contribute"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition"
          >
            See the ways to help <ArrowUpRight />
          </a>
        </div>
      </div>
    </section>
  );
}
