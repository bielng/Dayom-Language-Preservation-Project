import LegalPage from "./LegalPage.jsx";
import { SITE, GITHUB } from "../../config/site.js";

const SECTIONS = [
  {
    id: "acceptance",
    heading: "Using this site",
    body: (
      <>
        <p>
          These terms cover the {SITE.name} website, the Naath Dayom Library, the Dinka Digital
          Library, the Studio tools, and the open corpus files served from this domain. By using
          any of them you accept what follows. If you do not, please do not use the service.
        </p>
        <p>
          Everything here is provided free of charge, with no account required. We may change,
          suspend, or discontinue any feature — this is a volunteer-driven research project, not a
          commercial product with an uptime commitment.
        </p>
      </>
    ),
  },
  {
    id: "corpus-licence",
    heading: "The corpus: licensing and attribution",
    body: (
      <>
        <p>
          This is the most important section on the page, because it is the part people most often
          get wrong. The corpus is <b className="text-ink-900">not</b> uniformly licensed. It is an
          aggregation of sources under different terms, and your obligations depend on which
          records you use.
        </p>
        <ul>
          <li>
            <b className="text-ink-900">Check every record.</b> Each entry carries a{" "}
            <span className="font-mono text-[13px]">source</span> and, where applicable, a{" "}
            <span className="font-mono text-[13px]">license</span> field. That field governs — not
            this page, and not a blanket assumption that "open data" means unrestricted.
          </li>
          <li>
            <b className="text-ink-900">Attribute the original source.</b> Crediting {SITE.name}{" "}
            alone is not sufficient. Material derived from Ethio Language Box, African Storybook
            (CC BY 4.0), or scripture translations must credit those originators on their own terms.
          </li>
          <li>
            <b className="text-ink-900">Some records are more restricted than others.</b> Scripture
            text remains under the rights of its publisher. If you are redistributing a subset,
            filter by source rather than assuming the whole set travels together.
          </li>
          <li>
            <b className="text-ink-900">Keep provenance intact.</b> If you redistribute or build on
            the corpus, carry the source fields through. Stripping provenance makes the data
            impossible for anyone downstream to use responsibly, and defeats the purpose of
            publishing it openly.
          </li>
        </ul>
        <p>
          Commercial use of the open-licensed portions is permitted within those licences. If your
          intended use is broad or you are unsure which records it covers, ask us at{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> rather than guessing.
        </p>
      </>
    ),
  },
  {
    id: "accuracy",
    heading: "Accuracy and fitness for purpose",
    body: (
      <>
        <p>
          Nuer and Dinka are low-resource languages and this is early-stage work. The data contains
          errors, the models produce wrong output, and the coverage is uneven. We would rather say
          that plainly than have you discover it in production.
        </p>
        <p>
          Specifically, and without limiting the above:{" "}
          <b className="text-ink-900">do not rely on these tools for consequential decisions</b>{" "}
          without a qualified human translator in the loop. That includes medical, legal, financial,
          immigration, safeguarding, and emergency contexts. Automated translation in those settings
          causes real harm when it is wrong, and it will sometimes be wrong in ways that read as
          entirely fluent.
        </p>
        <p>
          The service and the data are provided "as is", without warranty of any kind, express or
          implied, including fitness for a particular purpose. To the maximum extent permitted by
          law, {SITE.name} and its contributors are not liable for any loss or damage arising from
          use of the site, the models, or the corpus.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    heading: "Acceptable use",
    body: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>
            Use the Studio or the corpus to produce material that harasses, defames, or endangers
            Nuer or Dinka speakers or any other community.
          </li>
          <li>
            Present machine output as a verified human translation, or as endorsed by {SITE.name}.
          </li>
          <li>
            Automate requests at a volume that degrades the service for others. The corpus files are
            not rate-limited; please cache or mirror them rather than re-fetching in a loop.
          </li>
          <li>
            Strip attribution or provenance from redistributed data, or relicense openly-contributed
            community material under more restrictive terms.
          </li>
          <li>
            Submit contributions you do not have the right to share, including copyrighted material
            or recordings of people who did not consent.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "contributions",
    heading: "Contributions",
    body: (
      <>
        <p>
          When you contribute data, audio, or code, you confirm that you have the right to do so and
          you agree that it may be published as part of the open corpus under the project's terms.
          Contributions arrive through a{" "}
          <a href={GITHUB.repoUrl} target="_blank" rel="noreferrer">
            public GitHub organisation
          </a>
          .
        </p>
        <p>
          You keep authorship credit on what you contribute, and you may ask to be anonymised
          instead. We commit that community contributions stay openly licensed: they will not be
          moved behind a paywall or relicensed restrictively at a later date.
        </p>
        <p>
          Contributions are reviewed by native speakers and may be edited, corrected, or declined.
          Review is a judgement about linguistic accuracy, not about you.
        </p>
      </>
    ),
  },
  {
    id: "third-party",
    heading: "Third-party services",
    body: (
      <p>
        Several Studio features depend on external providers — machine translation, Meta's MMS
        speech models on the Hugging Face Inference API, and your browser's own speech recognition.
        Those services have their own terms and their own availability, and we do not control
        either. Section 3 of the{" "}
        <a href="#/privacy">Privacy Policy</a> lists exactly which features send your input where.
      </p>
    ),
  },
  {
    id: "changes",
    heading: "Changes and contact",
    body: (
      <p>
        We may update these terms as the project develops; material changes will be reflected in the
        date on this page. For questions about licensing, permitted use, or anything else here, email{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms of Service"
      title="Terms of Service"
      lede="What you can do with the corpus and the tools, what you must attribute, and where this early-stage work should not be relied on."
      sections={SECTIONS}
      closing={
        <p>
          See also the{" "}
          <a href="#/privacy" className="text-ink-900 underline underline-offset-4 decoration-ink-300 hover:decoration-ink-900">
            Privacy Policy
          </a>
          ,{" "}
          <a href="#/safety" className="text-ink-900 underline underline-offset-4 decoration-ink-300 hover:decoration-ink-900">
            Safety
          </a>
          , and the{" "}
          <a
            href="#/datasets"
            className="text-ink-900 underline underline-offset-4 decoration-ink-300 hover:decoration-ink-900"
          >
            per-dataset licensing detail
          </a>
          .
        </p>
      }
    />
  );
}
