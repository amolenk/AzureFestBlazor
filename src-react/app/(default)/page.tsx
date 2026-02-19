import { websiteSettings } from "@/src/config/website-settings";
import MainLayout from "@/src/components/layout/MainLayout";
import Hero from "@/src/components/sections/Hero";
import About from "@/src/components/sections/About";
import SpeakerHighlights from "@/src/components/sections/SpeakerHighlights";
import Venue from "@/src/components/sections/Venue";
import Sponsors from "@/src/components/sections/Sponsors";
import TicketsAd from "@/src/components/sections/TicketsAd";
import Organizers from "@/src/components/sections/Organizers";

export default function HomePage() {
  const edition = websiteSettings.currentEdition;

  return (
    <MainLayout>
      <Hero />
      <About />
      {edition.speakers.announced && <SpeakerHighlights />}
      <Venue />
      <Sponsors />
      {edition.registration.enabled && <TicketsAd />}
      <Organizers />
    </MainLayout>
  );
}
