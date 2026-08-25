import PageShell, { Section, Prose, StatTile, InfoCard } from "./PageShell.jsx";
import { Database, Brain, Users, Globe, Heart, Book, ArrowUpRight, ArrowRight, Github } from "../Icons.jsx";
import { SITE, GITHUB, CORPUS_TOTAL, AUDIO_TOTAL, LANGUAGES } from "../../config/site.js";

const PRINCIPLES = [
  {
    icon: Database,
    title: "Open by default",
    body: "Every corpus we assemble ships publicly with its provenance attached. A dataset nobody can inspect cannot be corrected, and a language served by a closed dataset stays dependent on whoever owns it.",
  },
  {
    icon: Users,
    title: "Community-authored",
    body: "Speakers decide what correct looks like. Contributors are credited by name in the record they touched, and a native-speaker review gate sits between a submission and the published corpus.",
  },
  {
    icon: Globe,
    title: "Rooted in South Sudan",
    body: "The work is built from inside the language community rather than about it — locally curated dictionaries, lesson data, and recordings, not scraped text of unknown origin.",
  },
  {
    icon: Brain,
    title: "Toward native reasoning",
    body: "Pivoting through English loses what the language actually encodes. The long-term goal is a model that reasons in Nuer and Dinka directly, not one that translates its way to an answer.",
  },
];

const WORKSTREAMS = [
  {
    icon: Database,
    title: "Open Corpus",
    body: "Parallel English ↔ Nuer and English ↔ Dinka data across dictionaries, vocabulary, sentence structures, conversation, grammar, and a pronunciation phrasebook.",
    href: "#/datasets",
    cta: "View datasets",
  },
  {
    icon: Brain,
    title: "Models",
    body: "Speech synthesis for Nuer and Dinka via Meta's MMS models, a general-purpose translation backend being replaced by a fine-tuned model, and speech recognition built for languages with almost no prior coverage.",
    href: "#/models",
    cta: "See models",
  },
  {
    icon: Book,
    title: "Library & Studio",
    body: "A public reference library over the raw data — including a Dinka Digital Library and a 3D Naath Living Library — plus a studio where anyone can translate, chat, transcribe, and synthesise speech for free.",
    href: "#/library",
    cta: "Open the library",
  },
];

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About Us"
      title="A language lab for the people who speak the language"
      lede={`${SITE.name} is a South Sudan-rooted language technology and AI data effort building large-scale, open-source datasets and NLP models for under-represented languages — starting with Nuer and Dinka.`}
    >
      <div className="grid sm:grid-cols-3 gap-5 mb-16">
        <StatTile value={CORPUS_TOTAL.toLocaleString()} label="Open corpus records" sub="Published, not projected" />
        <StatTile value={AUDIO_TOTAL.toLocaleString()} label="Pronunciation clips" sub="Community recorded" />
        <StatTile value={`${LANGUAGES.live.length + LANGUAGES.next.length}`} label="Languages in scope" sub={`${LANGUAGES.live.length} live, ${LANGUAGES.next.length} queued`} />
      </div>

      <Section id="mission" eyebrow="Our Mission" title="Make South Sudanese languages usable by machines — on the community's terms" className="mb-16">
        <Prose>
          <p>
            There are more than sixty languages spoken in South Sudan. Almost none of them are
            usable in the software people rely on every day. You cannot dictate a message in
            Nuer or Dinka, cannot have a form translated, cannot ask a device to read a document
            aloud. When a language is missing from the digital world, its speakers are pushed
            into a second language to do ordinary things — or excluded from doing them at all.
          </p>
          <p>
            That absence is not a fact of nature. It is a data problem. Modern language models
            need large, clean, well-attributed corpora, and for most Nilotic languages nobody has
            assembled one. Our mission is to build that missing foundation and keep it open, so
            that no single company owns the entry point to a language its speakers have used for
            centuries.
          </p>
          <p>
            We are deliberate about the order of the work. Data first, because models built on
            thin or unattributed data quietly encode errors that speakers then have to live with.
            Review by native speakers second, because accuracy in a low-resource language cannot
            be measured against a benchmark that does not exist. Tools last — and free, because
            the people who most need them are the least able to pay for them.
          </p>
        </Prose>
      </Section>

      <Section eyebrow="How We Work" title="Four commitments" className="mb-16">
        <div className="grid sm:grid-cols-2 gap-5">
          {PRINCIPLES.map((p) => (
            <InfoCard key={p.title} icon={p.icon} title={p.title}>
              {p.body}
            </InfoCard>
          ))}
        </div>
      </Section>

      <Section eyebrow="What We Build" title="Three workstreams" className="mb-16">
        <div className="grid md:grid-cols-3 gap-5">
          {WORKSTREAMS.map((w) => (
            <div key={w.title} className="card p-6 flex flex-col">
              <div className="h-10 w-10 rounded-full bg-amber-300/40 flex items-center justify-center text-ink-900 mb-4">
                <w.icon />
              </div>
              <h3 className="font-semibold text-ink-900">{w.title}</h3>
              <p className="mt-2 text-sm text-ink-500 leading-relaxed flex-1">{w.body}</p>
              <a
                href={w.href}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-900 underline underline-offset-4 decoration-ink-300 hover:decoration-ink-900"
              >
                {w.cta} <ArrowRight />
              </a>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Coverage" title="Where we are, and what comes next" className="mb-16">
        <div className="card p-6 sm:p-8">
          <p className="text-sm font-semibold text-ink-900 mb-3">In production</p>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.live.map((l) => (
              <span key={l} className="text-sm px-3.5 py-1.5 rounded-full bg-amber-300 text-ink-900 font-medium">
                {l}
              </span>
            ))}
          </div>

          <p className="text-sm font-semibold text-ink-900 mt-7 mb-3">Next, as data and reviewers allow</p>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.next.map((l) => (
              <span key={l} className="text-sm px-3.5 py-1.5 rounded-full border border-ink-200 bg-white text-ink-500">
                {l}
              </span>
            ))}
          </div>

          <p className="mt-7 text-sm text-ink-500 leading-relaxed">
            We add a language when we have both a data pathway and native speakers willing to
            review — not when we can merely scrape enough text to look plausible. If you speak one
            of the queued languages and want to move it forward,{" "}
            <a href="#/contribute" className="text-ink-900 underline underline-offset-4 decoration-ink-300 hover:decoration-ink-900">
              start here
            </a>
            .
          </p>
        </div>
      </Section>

      <Section eyebrow="Get In Touch" title="Work with us" className="mb-4">
        <div className="grid sm:grid-cols-2 gap-5">
          <InfoCard icon={Heart} title="Contribute data or review">
            Speakers, linguists, and teachers can add entries, correct existing ones, or record
            pronunciation.{" "}
            <a href="#/contribute" className="text-ink-900 underline underline-offset-4 decoration-ink-300 hover:decoration-ink-900">
              See how to get involved
            </a>
            .
          </InfoCard>
          <InfoCard icon={Users} title="Research & institutional partners">
            We share corpora and baselines with researchers and universities working on
            low-resource language processing. Reach us at{" "}
            <a href={`mailto:${SITE.email}`} className="text-ink-900 underline underline-offset-4 decoration-ink-300 hover:decoration-ink-900">
              {SITE.email}
            </a>
            .
          </InfoCard>
        </div>

        <div className="mt-8 flex items-center gap-3 flex-wrap">
          <a href="#/contribute" className="btn-primary">
            Get Involved <ArrowUpRight />
          </a>
          <a href={GITHUB.repoUrl} target="_blank" rel="noreferrer" className="btn-ghost">
            <Github /> Contribute on GitHub
          </a>
        </div>
      </Section>
    </PageShell>
  );
}
