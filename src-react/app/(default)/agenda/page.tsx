import MainLayout from "@/src/components/layout/MainLayout";
import AgendaSection from "@/src/components/sections/AgendaSection";
import Section from "@/src/components/layout/Section";
import { websiteSettings } from "@/src/config/website-settings";

export const metadata = {
  title: "Agenda | Azure Fest"
};

export default function AgendaPage() {
  if (!websiteSettings.currentEdition.schedule.announced) {
    return (
      <MainLayout>
        <Section headerText="Agenda">
          <div className="row text-center">
            <p>We are currently working diligently to finalize the agenda for the event.</p>
            <p>Please check back soon for the full agenda, which will be published as soon as it is confirmed.</p>
          </div>
        </Section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <AgendaSection />
    </MainLayout>
  );
}
