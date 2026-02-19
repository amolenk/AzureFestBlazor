import MainLayout from "@/src/components/layout/MainLayout";
import Section from "@/src/components/layout/Section";
import SpeakersSection from "@/src/components/sections/SpeakersSection";
import { websiteSettings } from "@/src/config/website-settings";

export const metadata = {
  title: "Speakers | Azure Fest"
};

export default function SpeakersPage() {
  const cfp = websiteSettings.currentEdition.cfp;

  if (!websiteSettings.currentEdition.speakers.announced) {
    return (
      <MainLayout>
        <Section headerText="Speakers">
          <div className="text-center">
            <p>For the brightest ideas and newest perspectives, we're bringing the best minds together!</p>
            <p>
              Please stay tuned for updates on our website and social media channels for speaker
              announcements.
            </p>
            {cfp.isOpen() && (
              <p>
                Interested in speaking? Submit your session via{" "}
                <a href={cfp.sessionizeUrl} target="_blank" rel="noopener noreferrer">
                  Sessionize
                </a>
                .
              </p>
            )}
          </div>
        </Section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SpeakersSection />
    </MainLayout>
  );
}
