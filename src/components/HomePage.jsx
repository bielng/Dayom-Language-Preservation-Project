import Navbar from "./Navbar.jsx";
import Hero from "./Hero.jsx";
import TrustBar from "./TrustBar.jsx";
import PreserveSection from "./PreserveSection.jsx";
import WorkSection from "./WorkSection.jsx";
import LanguagesBand from "./LanguagesBand.jsx";
import AudienceSection from "./AudienceSection.jsx";
import ContributeCTA from "./ContributeCTA.jsx";
import Footer from "./Footer.jsx";
import LibraryTeaser from "./LibraryTeaser.jsx";
import DinkaLibraryTeaser from "./DinkaLibraryTeaser.jsx";
import NaathLibraryTeaser from "./NaathLibraryTeaser.jsx";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <PreserveSection />
        <WorkSection />
        <LanguagesBand />
        <NaathLibraryTeaser />
        <LibraryTeaser />
        <DinkaLibraryTeaser />
        <AudienceSection />
        <ContributeCTA />
      </main>
      <Footer />
    </div>
  );
}
