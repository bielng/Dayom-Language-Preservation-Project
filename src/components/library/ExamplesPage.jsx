import LibraryPageShell from "./LibraryPageShell.jsx";
import ExamplesBrowser from "./ExamplesBrowser.jsx";

export default function ExamplesPage() {
  return (
    <LibraryPageShell
      eyebrow="Examples"
      title="Example Sentence Gallery"
      description="221 curated example sentences by category. Browse, search, or hit Surprise me for a random one."
      wide
    >
      <ExamplesBrowser url="/data/library/examples.json" active />
    </LibraryPageShell>
  );
}
