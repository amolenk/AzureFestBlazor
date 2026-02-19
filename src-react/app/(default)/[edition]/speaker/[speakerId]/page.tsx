import MainLayout from "@/src/components/layout/MainLayout";
import Section from "@/src/components/layout/Section";
import SpeakerBioSection from "@/src/components/sections/SpeakerBioSection";
import SpeakerSessionsSection from "@/src/components/sections/SpeakerSessionsSection";
import { websiteSettings } from "@/src/config/website-settings";

export const metadata = {
  title: "Speaker Details | Azure Fest"
};

export default async function SpeakerDetailPage({
  params
}: {
  params: Promise<{ edition: string; speakerId: string }>;
}) {
  let { edition, speakerId } = await params;
  edition = edition ?? websiteSettings.currentEdition.slug;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/data/${edition}.json`);
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }

    const data = await response.json();
    const speaker = (data.Speakers || []).find((s: any) => s.Id === speakerId);

    if (!speaker) {
      return (
        <MainLayout>
          <Section headerText="Speaker">
            <p>Speaker not found.</p>
          </Section>
        </MainLayout>
      );
    }

    return (
      <MainLayout>
        <SpeakerBioSection
          fullName={speaker.FullName}
          tagLine={speaker.TagLine}
          profilePictureUrl={speaker.ProfilePictureUrl}
          bio={speaker.Bio}
        />
        <SpeakerSessionsSection sessions={speaker.sessions || []} allSessions={data.Sessions || []} edition={edition} />
      </MainLayout>
    );
  } catch {
    return (
      <MainLayout>
        <Section headerText="Speaker">
          <p>Failed to load speaker.</p>
        </Section>
      </MainLayout>
    );
  }
}
