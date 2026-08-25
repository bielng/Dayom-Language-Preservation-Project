import { Rotate, AlertCircle } from "../Icons.jsx";

export default function DataState({ status, error, children }) {
  if (status === "loading" || status === "idle") {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-ink-500">
        <Rotate className="animate-spin" /> Loading dataset…
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-ink-500">
        <AlertCircle className="text-amber-500" /> Couldn't load this dataset ({error}).
      </div>
    );
  }
  return children;
}
