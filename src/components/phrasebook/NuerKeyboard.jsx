import { ChevronDown } from "../Icons.jsx";

const ROWS = [
  ["ŋ", "w", "e", "e̠", "ë", "r", "t", "y", "u", "i", "i̠", "o", "p"],
  ["a", "a̠", "ä", "ɛ", "ɛ̈", "ɛ̱", "d", "ɣ", "g", "h", "j", "k", "l"],
  ["ɔ", "ɔ̱", "c", "b", "n", "o̱", "ö", "m"],
];

const KEY_CLASS =
  "flex items-center justify-center select-none cursor-pointer rounded-lg bg-white border border-ink-200 text-ink-800 shadow-sm text-[13px] sm:text-sm h-9 active:scale-90 active:bg-cream-100 transition-transform";

export default function NuerKeyboard({ onKeyPress, onBackspace, onSpace, onClose }) {
  const holdFocus = (e) => e.preventDefault();
  const [row1, row2, row3] = ROWS;

  return (
    <div className="w-full bg-cream-100 border border-ink-200 rounded-2xl p-2.5 sm:p-3 animate-fade-in">
      <div className="flex items-center justify-between px-1 pb-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
          Thok Naath Keyboard
        </span>
        <button onMouseDown={holdFocus} onClick={onClose} className="p-1 rounded-full text-ink-400 hover:text-ink-900 hover:bg-cream-200">
          <ChevronDown />
        </button>
      </div>
      <div className="flex gap-1 mb-1">
        {row1.map((k) => (
          <button key={k} onMouseDown={holdFocus} onClick={() => onKeyPress(k)} className={`${KEY_CLASS} flex-1 min-w-0`}>{k}</button>
        ))}
      </div>
      <div className="flex gap-1 mb-1 px-3">
        {row2.map((k) => (
          <button key={k} onMouseDown={holdFocus} onClick={() => onKeyPress(k)} className={`${KEY_CLASS} flex-1 min-w-0`}>{k}</button>
        ))}
      </div>
      <div className="flex gap-1 mb-1">
        {row3.map((k) => (
          <button key={k} onMouseDown={holdFocus} onClick={() => onKeyPress(k)} className={`${KEY_CLASS} flex-1 min-w-0`}>{k}</button>
        ))}
        <button onMouseDown={holdFocus} onClick={onBackspace} className={`${KEY_CLASS} basis-[20%] bg-cream-200 text-ink-700`}>⌫</button>
      </div>
      <div className="flex gap-1">
        <button onMouseDown={holdFocus} onClick={onSpace} className={`${KEY_CLASS} flex-1 text-xs font-medium tracking-wide text-ink-500`}>
          Thok Naath
        </button>
      </div>
    </div>
  );
}
