import MainLayout from "@/src/components/layout/MainLayout";
import Section from "@/src/components/layout/Section";

export const metadata = {
  title: "Ticket Cancellation | Azure Fest"
};

export default function CancellationConfirmationPage() {
  return (
    <MainLayout>
      <Section headerText="Registration Cancelled" sectionBackground={1}>
        <div className="text-center">
          <h2>We&apos;re sorry to see you go!</h2>
          <p className="lead mt-5">Your registration has been successfully cancelled.</p>
        </div>
      </Section>
    </MainLayout>
  );
}
