import PageShell, { Section, Prose, InfoCard } from "./PageShell.jsx";
import { Mic, Book, Code, Users, Heart, Server, Github, ArrowUpRight, ArrowRight, Mail } from "../Icons.jsx";
import { GITHUB, SITE, AUDIO_TOTAL } from "../../config/site.js";

const WAYS = [
  {
    icon: Mic,
    title: "Record pronunciation",
    need: "Most needed",
    body:
      `Nuer and Dinka speech recognition are blocked on audio volume — we have ${AUDIO_TOTAL} clips where a usable acoustic model needs orders of magnitude more. If you speak either language and have a phone, this is the single highest-leverage thing you can give us.`,
  },
  {
    icon: Book,
    title: "Correct the corpus",
    need: "High value",
    body:
      "Wrong entries do more damage than missing ones, because learners trust what they read and models train on it. If you spot a bad gloss, a dropped diacritic, or a tone error, flag the record id and tell us what it should say.",
  },
  {
    icon: Users,
    title: "Review submissions",
    need: "Ongoing",
    body:
      "Nothing enters the published corpus without a native speaker signing off. Reviewers work through the queue of proposed entries and decide what is actually correct rather than merely plausible.",
  },
  {
    icon: Code,
    title: "Write code",
    need: "Open issues",
    body:
      "The site, the studio tools, and the data pipelines are open source. Frontend, data cleaning, evaluation tooling, and model training all have work available — issues are labelled by area and difficulty.",
  },
  {
    icon: Server,
    title: "Donate compute",
    need: "Unblocks training",
    body:
      "Fine-tuning runs are the practical bottleneck on shipping better translation and any Nuer or Dinka ASR at all. GPU credits or cluster time move those dates directly.",
  },
  {
    icon: Heart,
    title: "Add a language",
    need: "Long term",
    body:
      "Shilluk, Bari, Zande, and Murle are queued behind a data pathway and willing reviewers, the same path Dinka just came through. If you can bring either for one of them, that language moves from queued to active.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Pick what you are adding",
    body:
      "A correction to an existing record, a batch of new entries, or audio for words already in the phrasebook. Corrections are fastest to accept; batches need a source we can cite.",
  },
  {
    n: "02",
    title: "Open an issue",
    body:
      "Describe the contribution in a GitHub issue before doing bulk work. It takes a minute and it prevents two people cleaning the same 500 rows in parallel.",
  },
  {
    n: "03",
    title: "Submit it",
    body:
      "Small fixes go straight in as a pull request against the JSON. Larger batches can arrive as a spreadsheet or CSV — we will handle the conversion rather than make you learn our schema.",
  },
  {
    n: "04",
    title: "Native-speaker review",
    body:
      "A speaker checks the submission before it merges. Expect questions on ambiguous glosses; that back-and-forth is the part that makes the corpus trustworthy.",
  },
];

export default function ContributePage() {
  return (
    <PageShell
      eyebrow="Get Involved"
      title="This only works if speakers build it"
      lede="Dayom Lab is a volunteer-driven effort. A language technology project run without its speakers produces confident, fluent, wrong output — so the review step is not a formality here, it is the product."
    >
      <Section eyebrow="Ways To Help" title="Six things that actually move the work" className="mb-16">
        <div className="grid sm:grid-cols-2 gap-5">
          {WAYS.map((w) => (
            <div key={w.title} className="card p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-300/40 flex items-center justify-center text-ink-900 shrink-0">
                  <w.icon />
                </div>
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-ink-100 text-ink-700 shrink-0">
                  {w.need}
                </span>
              </div>
              <h3 className="mt-4 font-semibold text-ink-900">{w.title}</h3>
              <p className="mt-2 text-sm text-ink-500 leading-relaxed">{w.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Process" title="How a contribution lands" className="mb-16">
        <div className="card divide-y divide-ink-200">
          {STEPS.map((s) => (
            <div key={s.n} className="p-6 flex gap-5">
              <span className="font-mono text-sm font-bold text-amber-500 shrink-0 pt-0.5">{s.n}</span>
              <div>
                <h3 className="font-semibold text-ink-900 text-[15px]">{s.title}</h3>
                <p className="mt-1.5 text-sm text-ink-500 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Credit" title="Contributors keep their attribution" className="mb-16">
        <Prose>
          <p>
            Every record carries the source that produced it, and contributors are credited on the
            entries they authored or corrected. If you would rather stay anonymous, say so and we
            will record the contribution without your name — but the default is that you keep credit
            for your own language work.
          </p>
          <p>
            The corpus stays open. Nothing you contribute gets moved behind a licence fee later:
            that would take community labour and convert it into someone's private asset, which is
            the exact outcome this project exists to prevent.
          </p>
        </Prose>
      </Section>

      <Section eyebrow="Start" title="Contribute on GitHub" className="mb-4">
        <div className="card p-6 sm:p-8">
          <p className="text-[15px] text-ink-700 leading-relaxed">
            All the work happens in the open — data, site, and tooling. Open an issue on{" "}
            <span className="font-mono text-[13px]">NAATH-ARCHIVE</span> to introduce yourself and
            what you would like to work on, and someone will point you at the right file.
          </p>

          <div className="mt-7 flex items-center gap-3 flex-wrap">
            <a href={GITHUB.newIssue} target="_blank" rel="noreferrer" className="btn-primary">
              Open an issue <ArrowUpRight />
            </a>
            <a href={GITHUB.repoUrl} target="_blank" rel="noreferrer" className="btn-dark">
              <Github /> Contribute on GitHub
            </a>
            <a href={`mailto:${SITE.email}?subject=Contributing%20to%20Dayom%20Lab`} className="btn-ghost">
              <Mail /> Email us
            </a>
          </div>

          <div className="mt-7 pt-6 border-t border-ink-200 grid sm:grid-cols-3 gap-4">
            <a
              href={GITHUB.issues}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 transition"
            >
              Browse open issues <ArrowRight />
            </a>
            <a
              href={GITHUB.corpusDir}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 transition"
            >
              The corpus files <ArrowRight />
            </a>
            <a
              href="/datasets"
              className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 transition"
            >
              What already exists <ArrowRight />
            </a>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
