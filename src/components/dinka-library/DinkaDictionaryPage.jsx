import LibraryPageShell from "../library/LibraryPageShell.jsx";
import DinkaDictionaryBrowser from "./DinkaDictionaryBrowser.jsx";

export default function DinkaDictionaryPage() {
  return (
    <LibraryPageShell
      eyebrow="Dictionary"
      title="English – Dinka Dictionary"
      description="9,199 lexical entries. Search by Dinka or English, filter by dialect region, or explore a random word from the archive."
      wide
    >
      <DinkaDictionaryBrowser url="/data/dinka/dictionary.json" active />
    </LibraryPageShell>
  );
}
