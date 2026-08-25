import LibraryPageShell from "./LibraryPageShell.jsx";
import PhraseTable from "./PhraseTable.jsx";

export default function ConversationPage() {
  return (
    <LibraryPageShell
      eyebrow="Conversation"
      title="Everyday Conversation"
      description="810 lines of dialogue laid out as back-and-forth conversation — greetings, small talk, and common exchanges."
    >
      <PhraseTable url="/data/library/conversation.json" active emptyNoun="conversation lines" variant="chat" />
    </LibraryPageShell>
  );
}
