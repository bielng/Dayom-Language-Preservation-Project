import LibraryPageShell from "./LibraryPageShell.jsx";
import GrammarGuide from "./GrammarGuide.jsx";

export default function GuidePage() {
  return (
    <LibraryPageShell
      eyebrow="Reference"
      title="Thok Naath Grammar Guide"
      description="The full grammar reference — searchable and organized into sections you can open one at a time."
      wide
    >
      <GrammarGuide url="/data/library/grammar-guide.md" active />
    </LibraryPageShell>
  );
}
