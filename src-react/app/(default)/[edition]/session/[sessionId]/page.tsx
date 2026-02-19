import MainLayout from "@/src/components/layout/MainLayout";
import Section from "@/src/components/layout/Section";
import SessionDetailSection from "@/src/components/sections/SessionDetailSection";
import { websiteSettings } from "@/src/config/website-settings";

export const metadata = {
  title: "Session Details | Azure Fest"
};

export default async function SessionDetailPage({
  params
}: {
  params: Promise<{ edition: string; sessionId: string }>;
}) {
  let { edition, sessionId } = await params;
  edition = edition ?? websiteSettings.currentEdition.slug;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/data/${edition}.json`);
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }

    const data = await response.json();
    let session = (data.Sessions || []).find((s: any) => s.Id === sessionId);

    if (!session) {
      return (
        <MainLayout>
          <Section headerText="Session">
            <p>Session not found.</p>
          </Section>
        </MainLayout>
      );
    }

    session = {
      ...session,
      Speakers: (session.speakers || [])
        .map((speakerId: string) => (data.Speakers || []).find((speaker: any) => speaker.Id === speakerId))
        .filter(Boolean)
    };

    return (
      <MainLayout>
        <Section headerText={session.Title}>
          <SessionDetailSection session={session} edition={edition} />
        </Section>
      </MainLayout>
    );
  } catch {
    return (
      <MainLayout>
        <Section headerText="Session">
          <p>Failed to load session.</p>
        </Section>
      </MainLayout>
    );
  }
}
