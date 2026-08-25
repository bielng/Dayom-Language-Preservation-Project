import { Volume } from "../Icons.jsx";

export default function AudioButton({ path, playingPath, missingPath, onPlay, size = "md" }) {
  if (!path) return null;
  const isPlaying = playingPath === path;
  const isMissing = missingPath === path;
  const dim = size === "sm" ? "p-1.5" : "p-2.5";

  return (
    <button
      type="button"
      onClick={() => onPlay(path)}
      title={isMissing ? "Audio unavailable" : "Play pronunciation"}
      className={`shrink-0 rounded-full border transition-all ${dim} ${
        isMissing
          ? "bg-ink-100 border-ink-200 text-ink-300"
          : isPlaying
          ? "bg-amber-300 border-amber-300 text-ink-900"
          : "bg-white border-ink-200 text-ink-600 hover:bg-cream-100"
      }`}
    >
      <Volume className={isPlaying ? "animate-pulse" : ""} />
    </button>
  );
}
