// Minimal inline SVG icon set — no extra dependency needed.
// Base set carried over from NAATH-ARCHIVE/Ai_lab; studio-only icons added below in the same style.

export const ArrowUpRight = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2.2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='M7 17 17 7' />
    <path d='M7 7h10v10' />
  </svg>
);

export const ArrowRight = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='M5 12h14' />
    <path d='m12 5 7 7-7 7' />
  </svg>
);

export const ArrowLeft = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='M19 12H5' />
    <path d='m12 19-7-7 7-7' />
  </svg>
);

export const Check = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2.5}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='M20 6 9 17l-5-5' />
  </svg>
);

export const Rotate = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='M3 12a9 9 0 1 0 3-6.7' />
    <path d='M3 4v5h5' />
  </svg>
);

export const Translate = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='M4 5h8' />
    <path d='m4 5 4 14' />
    <path d='M2 9h10' />
    <path d='m13 21 5-11 5 11' />
    <path d='M15 17h6' />
  </svg>
);

export const Mic = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <rect x='9' y='2' width='6' height='12' rx='3' />
    <path d='M5 10a7 7 0 0 0 14 0' />
    <path d='M12 19v3' />
  </svg>
);

export const Volume = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='M11 5 6 9H3v6h3l5 4z' />
    <path d='M16 9a4 4 0 0 1 0 6' />
    <path d='M19 6a8 8 0 0 1 0 12' />
  </svg>
);

export const Brain = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='M9.5 2A2.5 2.5 0 0 0 7 4.5v.5a3 3 0 0 0-2 5.6A3 3 0 0 0 6 16v.5A2.5 2.5 0 0 0 8.5 19H10V2H9.5z' />
    <path d='M14.5 2A2.5 2.5 0 0 1 17 4.5v.5a3 3 0 0 1 2 5.6A3 3 0 0 1 18 16v.5A2.5 2.5 0 0 1 15.5 19H14V2h.5z' />
  </svg>
);

export const Sparkle = (p) => (
  <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor' {...p}>
    <path d='M12 2 13.8 8.2 20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z' />
  </svg>
);

export const Github = (p) => (
  <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor' {...p}>
    <path d='M12 2C6.5 2 2 6.6 2 12.3c0 4.6 2.9 8.4 6.8 9.8.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1.1 1.5 1.1.9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.7-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .9-.3 2.8 1 .8-.2 1.7-.3 2.5-.3.9 0 1.7.1 2.5.3 1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5 4-1.4 6.8-5.2 6.8-9.8C22 6.6 17.5 2 12 2z' />
  </svg>
);

export const Twitter = (p) => (
  <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor' {...p}>
    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
  </svg>
);

export const Facebook = (p) => (
  <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor' {...p}>
    <path d='M22 12a10 10 0 1 0-11.6 9.9V15h-2.4v-3h2.4V9.5c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5V12h2.6l-.4 3h-2.2v6.9A10 10 0 0 0 22 12z' />
  </svg>
);

export const LinkedIn = (p) => (
  <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor' {...p}>
    <path d='M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v15.5H.22V8zM8.34 8h4.37v2.12h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 7v8.74h-4.56v-7.75c0-1.85-.03-4.23-2.58-4.23-2.58 0-2.97 2.02-2.97 4.1v7.88H8.34V8z' />
  </svg>
);

export const ChevronDown = (p) => (
  <svg
    width='12'
    height='12'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2.5}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='m6 9 6 6 6-6' />
  </svg>
);

export const Server = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <rect x='2' y='3' width='20' height='8' rx='2' />
    <rect x='2' y='13' width='20' height='8' rx='2' />
    <path d='M6 7h.01' />
    <path d='M6 17h.01' />
  </svg>
);

export const Building = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <rect x='3' y='3' width='18' height='18' rx='2' />
    <path d='M9 7h.01M15 7h.01M9 12h.01M15 12h.01M9 17h.01M15 17h.01' />
  </svg>
);

export const Heart = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' />
  </svg>
);

export const Logo = ({ width = 22, height = 22, className, ...p }) => (
  <img
    src='/TrBg_logo.png'
    width={width}
    height={height}
    alt='Dayom Lab'
    className={`rounded-[7px] object-cover ${className || ""}`}
    {...p}
  />
);

/* ---------- Studio-only additions (same minimal stroke style) ---------- */

export const Swap = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='M17 1l4 4-4 4' />
    <path d='M3 11V9a4 4 0 0 1 4-4h14' />
    <path d='M7 23l-4-4 4-4' />
    <path d='M21 13v2a4 4 0 0 1-4 4H3' />
  </svg>
);

export const Copy = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <rect x='9' y='9' width='12' height='12' rx='2' />
    <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' />
  </svg>
);

export const Play = (p) => (
  <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor' {...p}>
    <path d='M8 5v14l11-7z' />
  </svg>
);

export const Pause = (p) => (
  <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor' {...p}>
    <rect x='6' y='5' width='4' height='14' rx='1' />
    <rect x='14' y='5' width='4' height='14' rx='1' />
  </svg>
);

export const Download = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='M12 3v12' />
    <path d='m7 10 5 5 5-5' />
    <path d='M5 21h14' />
  </svg>
);

export const AlertCircle = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <circle cx='12' cy='12' r='10' />
    <path d='M12 8v5' />
    <path d='M12 16h.01' />
  </svg>
);

export const Send = (p) => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2.2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='M12 19V5' />
    <path d='m5 12 7-7 7 7' />
  </svg>
);

export const Search = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <circle cx='11' cy='11' r='7' />
    <path d='m21 21-4.3-4.3' />
  </svg>
);

export const X = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='M18 6 6 18' />
    <path d='m6 6 12 12' />
  </svg>
);

export const Keyboard = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <rect x='2' y='6' width='20' height='12' rx='2' />
    <path d='M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12' />
  </svg>
);

export const Home = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
    <path d='M9 22V12h6v10' />
  </svg>
);

export const Menu = (p) => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='M4 6h16' />
    <path d='M4 12h16' />
    <path d='M4 18h16' />
  </svg>
);

/* ---------- Site-page additions (ported from Dayom-experimental, same minimal stroke style) ---------- */

export const Database = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <ellipse cx='12' cy='5' rx='8' ry='3' />
    <path d='M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5' />
    <path d='M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3' />
  </svg>
);

export const Code = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='m16 18 6-6-6-6' />
    <path d='m8 6-6 6 6 6' />
  </svg>
);

export const Book = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20' />
    <path d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' />
  </svg>
);

export const Users = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
    <circle cx='9' cy='7' r='4' />
    <path d='M22 21v-2a4 4 0 0 0-3-3.9' />
    <path d='M16 3.1a4 4 0 0 1 0 7.8' />
  </svg>
);

export const Shield = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
  </svg>
);

export const Lock = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <rect x='3' y='11' width='18' height='11' rx='2' />
    <path d='M7 11V7a5 5 0 0 1 10 0v4' />
  </svg>
);

export const Scale = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='M12 3v18' />
    <path d='M5 7h14' />
    <path d='m5 7-3 6h6z' />
    <path d='m19 7-3 6h6z' />
    <path d='M8 21h8' />
  </svg>
);

export const Newspaper = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='M4 22h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Z' />
    <path d='M18 14h-8' />
    <path d='M18 18h-8' />
    <path d='M10 6h8v4h-8z' />
  </svg>
);

export const Globe = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <circle cx='12' cy='12' r='10' />
    <path d='M2 12h20' />
    <path d='M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20' />
  </svg>
);

export const Mail = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <rect x='2' y='4' width='20' height='16' rx='2' />
    <path d='m2 7 10 6 10-6' />
  </svg>
);

export const Terminal = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='m4 17 6-6-6-6' />
    <path d='M12 19h8' />
  </svg>
);

export const ChevronRight = (p) => (
  <svg
    width='12'
    height='12'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2.5}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='m9 18 6-6-6-6' />
  </svg>
);

export const BookOpen = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='M12 7v14' />
    <path d='M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z' />
  </svg>
);

export const RotateCcw = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' />
    <path d='M3 3v5h5' />
  </svg>
);

export const Volume2 = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <path d='M11 5 6 9H3v6h3l5 4z' />
    <path d='M15.54 8.46a5 5 0 0 1 0 7.07' />
    <path d='M19.07 4.93a10 10 0 0 1 0 14.14' />
  </svg>
);

export const Bug = (p) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...p}
  >
    <rect x='8' y='6' width='8' height='12' rx='4' />
    <path d='M8 12H2' />
    <path d='M22 12h-6' />
    <path d='m9 4-1.5-1.5' />
    <path d='m15 4 1.5-1.5' />
    <path d='m9 20-1.5 1.5' />
    <path d='m15 20 1.5 1.5' />
  </svg>
);
