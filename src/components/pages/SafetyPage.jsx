import LegalPage from "./LegalPage.jsx";
import { SITE, GITHUB } from "../../config/site.js";

const SECTIONS = [
  {
    id: "approach",
    heading: "Why safety looks different for a low-resource language",
    body: (
      <>
        <p>
          Most AI safety discussion assumes a language with abundant data, established benchmarks,
          and enough speakers online to notice when a model is wrong. Nuer and Dinka have none of
          those. That changes which risks actually matter here.
        </p>
        <p>
          The dominant risk is not a model saying something forbidden. It is a model producing{" "}
          <b className="text-ink-900">confident, fluent, wrong Nuer or Dinka</b> that no one in the
          loop can check — and having that output treated as authoritative precisely because
          nothing else exists to compare it against. A wrong gloss in the only available dictionary
          does not get corrected by the market; it gets copied.
        </p>
        <p>
          So our safety work concentrates on provenance, on refusing to generate what we cannot
          attest, and on keeping speakers in the review position rather than the consumer position.
        </p>
      </>
    ),
  },
  {
    id: "commitments",
    heading: "What we do about it",
    body: (
      <ul>
        <li>
          <b className="text-ink-900">Retrieval over generation, where it counts.</b> The chat
          assistant returns only attested phrases from the reviewed corpus and says plainly when it
          has no match. It would be easy to make it fluent by letting it invent Nuer or Dinka; that
          would also make it a machine for teaching learners errors.
        </li>
        <li>
          <b className="text-ink-900">Native-speaker review as a gate, not a garnish.</b> Nothing
          enters the published corpus without a speaker signing off on it.
        </li>
        <li>
          <b className="text-ink-900">Provenance on every record.</b> Each entry carries its source,
          so an error can be traced to where it came from and corrected everywhere it propagated.
        </li>
        <li>
          <b className="text-ink-900">Honest status labels.</b> Our{" "}
          <a href="/models">models page</a> states which features are real models and which are
          still browser fallbacks. Voice input currently has no Nuer or Dinka acoustic model and we
          say so on the page rather than letting the interface imply otherwise.
        </li>
        <li>
          <b className="text-ink-900">One documented speech provider.</b> Nuer and Dinka
          text-to-speech both run through the same named provider — Meta's MMS models — rather than
          a patchwork of undisclosed backends, so what processes your text is never a mystery.
        </li>
        <li>
          <b className="text-ink-900">No fabricated metrics.</b> We do not publish benchmark scores
          for languages with no established benchmark, because a number computed against our own
          held-out data would imply a rigour that does not exist.
        </li>
      </ul>
    ),
  },
  {
    id: "high-stakes",
    heading: "Where not to use these tools",
    body: (
      <>
        <p>
          Please do not rely on automated translation from this site, without a qualified human
          translator, in any of the following:
        </p>
        <ul>
          <li>Medical consultation, diagnosis, consent, or medication instructions</li>
          <li>Legal proceedings, asylum and immigration interviews, or police interaction</li>
          <li>Emergency and humanitarian response where a misunderstanding risks safety</li>
          <li>Financial or contractual agreements</li>
          <li>Child protection and safeguarding contexts</li>
        </ul>
        <p>
          This is not boilerplate risk-aversion. Displaced and minority-language speakers are
          routinely handed machine translation in exactly these settings because a human interpreter
          is expensive or unavailable, and the failure lands on the person least able to challenge
          it. Our output is not good enough for that, and we would rather lose the use case than
          pretend otherwise.
        </p>
      </>
    ),
  },
  {
    id: "data-ethics",
    heading: "Community consent and data ethics",
    body: (
      <>
        <p>
          Language data is not neutral raw material. It is produced by communities who have often
          seen their cultural knowledge extracted without benefit returning to them.
        </p>
        <ul>
          <li>
            <b className="text-ink-900">Consent for recordings.</b> Voice contributions are given
            knowingly, with the contributor aware that the audio becomes part of an open dataset
            usable for model training.
          </li>
          <li>
            <b className="text-ink-900">No scraped text of unknown origin.</b> We build from
            curated sources we can name. It would be faster to scrape; it would also make the
            corpus impossible to license responsibly or correct reliably.
          </li>
          <li>
            <b className="text-ink-900">Openness is a safeguard, not just a licence choice.</b> An
            open corpus can be audited, corrected, and forked by the community it describes. A closed
            one leaves speakers dependent on whoever holds it.
          </li>
          <li>
            <b className="text-ink-900">Sacred and sensitive material.</b> Some knowledge is not
            ours to publish. Where community members tell us material should not be in an open
            dataset, it comes out.
          </li>
          <li>
            <b className="text-ink-900">Dialect is not error.</b> Nuer and Dinka each vary across
            regions. Flattening that variation into one "correct" form would encode a hierarchy
            among speakers, so records carry dialect notes instead.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "limitations",
    heading: "Known limitations",
    body: (
      <>
        <p>Stated plainly, so you can judge the tools yourself:</p>
        <ul>
          <li>
            Translation currently runs on a general-purpose backend not trained on our corpus. It
            mishandles diacritics, tone marking, kinship terms, and tense markers.
          </li>
          <li>
            There is no Nuer or Dinka speech recognition model. Voice input uses browser recognition
            with no support for either language and will mis-hear both badly.
          </li>
          <li>
            Corpus coverage is uneven across domains — everyday vocabulary is far better served than
            technical, medical, or legal registers.
          </li>
          <li>
            The corpus reflects the dialects of its contributors and is not evenly representative of
            all Nuer- or Dinka-speaking regions.
          </li>
          <li>
            Speech synthesis is a single voice per language and does not represent the full range of
            Nuer or Dinka speech.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "reporting",
    heading: "Reporting a problem",
    body: (
      <>
        <p>
          Corrections are the most valuable contribution we receive. If you find a wrong entry,
          offensive output, a mishandled recording, or content that should not have been published:
        </p>
        <ul>
          <li>
            For data errors, <a href={GITHUB.newIssue} target="_blank" rel="noreferrer">open an
            issue</a> with the record id and what it should say.
          </li>
          <li>
            For anything sensitive — a consent concern, culturally inappropriate material, or a
            recording that should be withdrawn — email{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a> directly rather than filing publicly.
          </li>
        </ul>
        <p>
          Takedown requests from community members regarding their own language material are taken
          seriously and acted on. We would rather remove a disputed record and discuss it than
          defend its presence while the dispute is open.
        </p>
      </>
    ),
  },
];

export default function SafetyPage() {
  return (
    <LegalPage
      eyebrow="Safety"
      title="Safety and responsible use"
      lede="The real risk in a low-resource language is not a model that refuses too little — it is a model that is fluently wrong with nothing to check it against. Here is how we handle that, and where you should not trust these tools."
      sections={SECTIONS}
      closing={
        <p>
          See also the{" "}
          <a href="/terms" className="text-ink-900 underline underline-offset-4 decoration-ink-300 hover:decoration-ink-900">
            Terms of Service
          </a>
          ,{" "}
          <a href="/privacy" className="text-ink-900 underline underline-offset-4 decoration-ink-300 hover:decoration-ink-900">
            Privacy Policy
          </a>
          , and the{" "}
          <a href="/models" className="text-ink-900 underline underline-offset-4 decoration-ink-300 hover:decoration-ink-900">
            model status board
          </a>
          .
        </p>
      }
    />
  );
}
