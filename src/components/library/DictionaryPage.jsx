import LibraryPageShell from "./LibraryPageShell.jsx";
import DictionaryBrowser from "./DictionaryBrowser.jsx";

export default function DictionaryPage() {
  return (
    <LibraryPageShell
      eyebrow="Dictionary"
      title="English – Nuer Dictionary"
      description="3,209 words. Search by English or Nuer, filter by part of speech, jump to a letter, or spin up a random word."
      wide
    >
      <DictionaryBrowser url="/data/library/dictionary.json" active />
    </LibraryPageShell>
  );
}
