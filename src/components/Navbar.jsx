import { useEffect, useState } from "react";
import { Logo, ArrowUpRight, Menu, X } from "./Icons.jsx";
import { NAV_LINKS } from "../config/site.js";

// Order mirrors the actual top-to-bottom flow of the site: mission -> data ->
// models -> the ways to explore the archive -> who it's for -> get involved.
// About/Datasets/Models/API are now dedicated pages (see config/site.js);
// Initiatives stays a homepage-only anchor since it has no standalone page.
const LINKS = [
  ...NAV_LINKS,
  { href: "/initiatives", label: "Initiatives" },
  { href: "/contribute", label: "Contribute" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Close the mobile menu on route change and lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onPopState = () => setOpen(false);
    window.addEventListener("popstate", onPopState);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("popstate", onPopState);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FCFAF5]/85 border-b border-[#E5E7EB]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <a href="/" className="flex items-center gap-2 group shrink-0">
          <Logo />
          <span className="font-semibold text-[15px] tracking-tight text-ink-900">Dayom Lab</span>
        </a>

        <nav className="hidden xl:flex items-center gap-6 text-sm text-ink-700">
          {LINKS.filter((l) => l.label !== "Contribute").map((l) => (
            <a key={l.label} href={l.href} className="hover:text-ink-900 transition">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a href="/contribute" className="btn-primary whitespace-nowrap">
            <span className="hidden sm:inline">Get Involved</span> <ArrowUpRight />
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="xl:hidden inline-flex items-center justify-center h-9 w-9 rounded-full border border-ink-200 text-ink-700 hover:bg-ink-100 transition shrink-0"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="xl:hidden border-t border-[#E5E7EB]/60 bg-[#FCFAF5] px-4 sm:px-6 py-4">
          <nav className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-lg text-[15px] text-ink-700 hover:bg-ink-100 hover:text-ink-900 transition"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
