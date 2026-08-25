import { useEffect, useState } from "react";
import HomePage from "./components/HomePage.jsx";
import StudioLayout from "./components/studio/StudioLayout.jsx";
import StudioHome from "./components/studio/StudioHome.jsx";
import StudioChat from "./components/studio/StudioChat.jsx";
import StudioTranslate from "./components/studio/StudioTranslate.jsx";
import StudioVoice from "./components/studio/StudioVoice.jsx";
import StudioTTS from "./components/studio/StudioTTS.jsx";
import LibraryLayout from "./components/library/LibraryLayout.jsx";
import LibraryHome from "./components/library/LibraryHome.jsx";
import DictionaryPage from "./components/library/DictionaryPage.jsx";
import VocabularyPage from "./components/library/VocabularyPage.jsx";
import StructuresPage from "./components/library/StructuresPage.jsx";
import ConversationPage from "./components/library/ConversationPage.jsx";
import GrammarPage from "./components/library/GrammarPage.jsx";
import ExamplesPage from "./components/library/ExamplesPage.jsx";
import PhrasebookPage from "./components/library/PhrasebookPage.jsx";
import GuidePage from "./components/library/GuidePage.jsx";
import DinkaLibraryLayout from "./components/dinka-library/DinkaLibraryLayout.jsx";
import DinkaLibraryHome from "./components/dinka-library/DinkaLibraryHome.jsx";
import DinkaDictionaryPage from "./components/dinka-library/DinkaDictionaryPage.jsx";
import AboutPage from "./components/pages/AboutPage.jsx";
import DatasetsPage from "./components/pages/DatasetsPage.jsx";
import ModelsPage from "./components/pages/ModelsPage.jsx";
import ApiPage from "./components/pages/ApiPage.jsx";
import ContributePage from "./components/pages/ContributePage.jsx";
import NewsPage from "./components/pages/NewsPage.jsx";
import PrivacyPage from "./components/pages/PrivacyPage.jsx";
import TermsPage from "./components/pages/TermsPage.jsx";
import SafetyPage from "./components/pages/SafetyPage.jsx";

function useHashPath() {
  const [path, setPath] = useState(() => window.location.hash.replace(/^#/, "") || "/");

  useEffect(() => {
    const onHashChange = () => setPath(window.location.hash.replace(/^#/, "") || "/");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return path;
}

const STUDIO_PAGES = {
  home: StudioHome,
  chat: StudioChat,
  translate: StudioTranslate,
  voice: StudioVoice,
  tts: StudioTTS,
};

const LIBRARY_PAGES = {
  home: LibraryHome,
  dictionary: DictionaryPage,
  vocabulary: VocabularyPage,
  structures: StructuresPage,
  conversation: ConversationPage,
  grammar: GrammarPage,
  examples: ExamplesPage,
  phrasebook: PhrasebookPage,
  guide: GuidePage,
};

const DINKA_PAGES = {
  home: DinkaLibraryHome,
  dictionary: DinkaDictionaryPage,
};

// Standalone top-level marketing/policy pages, keyed by exact path (no
// sub-routes). Matched against the path with any "#section" fragment
// stripped off first — see SITE_PAGES lookup below.
const SITE_PAGES = {
  "/about": AboutPage,
  "/datasets": DatasetsPage,
  "/models": ModelsPage,
  "/api": ApiPage,
  "/contribute": ContributePage,
  "/news": NewsPage,
  "/privacy": PrivacyPage,
  "/terms": TermsPage,
  "/safety": SafetyPage,
};

// Only these are real "pages" (full route changes that should reset scroll
// to the top). Anything else — like #about, #datasets, #contribute (the
// homepage anchors, note: no leading slash) — is an in-page anchor on the
// homepage and should be left to the browser's normal "jump to that
// section" behavior instead of being reset to the top.
const ROUTE_PREFIXES = ["/studio", "/library", "/dinka-library", ...Object.keys(SITE_PAGES)];

function isRoutePath(path) {
  return path === "/" || ROUTE_PREFIXES.some((prefix) => path.startsWith(prefix));
}

export default function App() {
  const path = useHashPath();

  useEffect(() => {
    if (isRoutePath(path)) {
      window.scrollTo({ top: 0 });
    }
  }, [path]);

  if (path.startsWith("/studio")) {
    const segment = path.split("/")[2] || "home";
    const Page = STUDIO_PAGES[segment] || StudioHome;
    return (
      <StudioLayout active={segment in STUDIO_PAGES ? segment : "home"}>
        <Page />
      </StudioLayout>
    );
  }

  if (path.startsWith("/library")) {
    const segment = path.split("/")[2] || "home";
    const Page = LIBRARY_PAGES[segment] || LibraryHome;
    return (
      <LibraryLayout active={segment in LIBRARY_PAGES ? segment : "home"}>
        <Page />
      </LibraryLayout>
    );
  }

  if (path.startsWith("/dinka-library")) {
    const segment = path.split("/")[2] || "home";
    const Page = DINKA_PAGES[segment] || DinkaLibraryHome;
    return (
      <DinkaLibraryLayout active={segment in DINKA_PAGES ? segment : "home"}>
        <Page />
      </DinkaLibraryLayout>
    );
  }

  const SitePage = SITE_PAGES[path];
  if (SitePage) {
    return <SitePage />;
  }

  return <HomePage />;
}
