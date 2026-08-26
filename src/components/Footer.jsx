import { Logo, Github, Mail } from "./Icons.jsx";
import { SITE, FOOTER_COLUMNS, SOCIALS } from "../config/site.js";

const SOCIAL_ICONS = { github: Github };

export default function Footer() {
  const activeSocials = SOCIALS.filter((s) => s.url);

  return (
    <footer className="bg-white border-t border-ink-200">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10">
        <div>
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-semibold text-ink-900">Dayom Lab</span>
          </div>
          <p className="mt-4 text-sm text-ink-500 max-w-xs leading-relaxed">
            {SITE.tagline} — open NLP infrastructure and datasets for South Sudan's under
            represented languages, starting with Nuer and Dinka.
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 transition"
          >
            <Mail /> {SITE.email}
          </a>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.heading}>
            <p className="text-sm font-semibold text-ink-900 mb-3">{col.heading}</p>
            <ul className="space-y-2 text-sm text-ink-500">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noreferrer" : undefined}
                    className="hover:text-ink-900 transition"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-ink-200">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-500 text-center sm:text-left">
          <p>
            Copyright © {new Date().getFullYear()} {SITE.legalName}. All rights reserved. See our{" "}
            <a href="/terms" className="hover:text-ink-900 transition underline underline-offset-2">
              terms
            </a>
            .
          </p>
          {activeSocials.length > 0 && (
            <div className="flex items-center gap-3">
              {activeSocials.map((s) => {
                const Icon = SOCIAL_ICONS[s.id];
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="hover:text-ink-900 transition"
                  >
                    {Icon ? <Icon /> : s.label}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
