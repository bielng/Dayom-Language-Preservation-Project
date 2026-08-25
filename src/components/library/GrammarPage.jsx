import LibraryPageShell from "./LibraryPageShell.jsx";
import PhraseTable from "./PhraseTable.jsx";

export default function GrammarPage() {
  return (
    <LibraryPageShell
      eyebrow="Grammar"
      title="Grammar Drills"
      description="257 grammar drills as reveal cards — read the Nuer, think it through, then check the English."
      wide
    >
      <PhraseTable url="/data/library/grammar.json" active emptyNoun="grammar drills" variant="drill" />
    </LibraryPageShell>
  );
}
