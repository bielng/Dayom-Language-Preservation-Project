import LibraryPageShell from "./LibraryPageShell.jsx";
import PhraseTable from "./PhraseTable.jsx";

export default function StructuresPage() {
  return (
    <LibraryPageShell
      eyebrow="Structures"
      title="Sentence Structures"
      description="1,250 sentence patterns and grammatical structures, grouped by topic — from word order to question formation."
      wide
    >
      <PhraseTable url="/data/library/structures.json" active emptyNoun="structures" variant="list" />
    </LibraryPageShell>
  );
}
