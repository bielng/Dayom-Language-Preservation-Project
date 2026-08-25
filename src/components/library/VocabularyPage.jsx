import LibraryPageShell from "./LibraryPageShell.jsx";
import PhraseTable from "./PhraseTable.jsx";

export default function VocabularyPage() {
  return (
    <LibraryPageShell
      eyebrow="Vocabulary"
      title="Vocabulary Flashcards"
      description="966 everyday words, grouped by topic. Tap a card to flip it and reveal the English meaning."
      wide
    >
      <PhraseTable url="/data/library/vocabulary.json" active emptyNoun="vocabulary cards" variant="flashcard" />
    </LibraryPageShell>
  );
}
