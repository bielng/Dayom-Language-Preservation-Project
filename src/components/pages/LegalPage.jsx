import PageShell, { DraftBanner } from "./PageShell.jsx";
import { SITE, LEGAL_LAST_UPDATED, LEGAL_IS_DRAFT } from "../../config/site.js";

/**
 * Shared layout for the policy pages (Privacy, Terms, Safety).
 * Renders a sticky contents rail on wide screens and numbered sections that
 * deep-link cleanly, so the footer can point at a specific clause.
 *
 * sections: [{ id, heading, body: ReactNode }]
 */
export default function LegalPage({ eyebrow, title, lede, sections, closing }) {
  // Plain in-page anchors (e.g. href="#summary") would otherwise be picked
  // up by the site's hash router as a route change and bounce the user back
  // to the homepage. Scroll manually instead and leave the URL untouched.
  const scrollToSection = (event, id) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <PageShell wide eyebrow={eyebrow} title={title} lede={lede}>
      {LEGAL_IS_DRAFT && (
        <DraftBanner>
          <b className="text-ink-900">Draft — pending legal review.</b> This text describes how{" "}
          {SITE.name} actually operates today and is written to be accurate rather than
          decorative, but it has not yet been reviewed by a qualified lawyer and is not a
          substitute for legal advice. If a clause here conflicts with the licence attached to a
          specific corpus record, the record's licence governs.
        </DraftBanner>
      )}

      <div className="lg:grid lg:grid-cols-[14rem_1fr] lg:gap-12">
        <nav className="hidden lg:block">
          <div className="sticky top-24">
            <p className="eyebrow mb-4">Contents</p>
            <ul className="space-y-2.5">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => scrollToSection(e, s.id)}
                    className="text-[13px] text-ink-500 hover:text-ink-900 transition leading-snug block"
                  >
                    <span className="font-mono text-ink-300 mr-1.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-8 pt-6 border-t border-ink-200 text-[11px] text-ink-400 leading-relaxed">
              Last updated
              <br />
              {LEGAL_LAST_UPDATED}
            </p>
          </div>
        </nav>

        <div>
          <p className="lg:hidden text-xs text-ink-400 mb-8">Last updated {LEGAL_LAST_UPDATED}</p>

          <div className="space-y-12">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="text-lg font-semibold text-ink-900 flex items-baseline gap-3">
                  <span className="font-mono text-sm text-ink-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.heading}
                </h2>
                <div className="mt-4 space-y-4 text-[15px] text-ink-700 leading-relaxed [&_a]:text-ink-900 [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-ink-300 [&_a:hover]:decoration-ink-900 [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:pl-1">
                  {s.body}
                </div>
              </section>
            ))}
          </div>

          {closing && (
            <div className="mt-14 pt-8 border-t border-ink-200 text-sm text-ink-500 leading-relaxed">
              {closing}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
