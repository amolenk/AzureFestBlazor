import Section from "../layout/Section";
import SessionCard from "@/src/components/sections/SessionCard";
import { websiteSettings } from "@/src/config/website-settings";

interface SpeakerSessionsSectionProps {
  sessions: string[];
  allSessions: any[];
  edition?: string;
}

export default function SpeakerSessionsSection({ sessions, allSessions, edition }: SpeakerSessionsSectionProps) {
  const targetEdition = edition ?? websiteSettings.currentEdition.slug;

  return (
    <Section headerText="Sessions" sectionBackground={1}>
      <div className="row d-flex justify-content-center">
        {sessions.map((sessionId: string) => {
          const session = allSessions.find((item: any) => item.Id === sessionId);
          return session ? <SessionCard key={session.Id} session={session} edition={targetEdition} /> : null;
        })}
      </div>
    </Section>
  );
}
