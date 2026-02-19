import MainLayout from "@/src/components/layout/MainLayout";
import Section from "@/src/components/layout/Section";

export const metadata = {
  title: "Ticket Registration | Azure Fest"
};

export default function TokenExpiredPage() {
  return (
    <MainLayout>
      <Section headerText="Invalid Token" sectionBackground={1}>
        <div className="text-center">
          <h2>Verification token is invalid or expired</h2>
          <p className="lead mt-5">Please try registering again.</p>
          <a href="/tickets" className="btn btn-primary mt-4">
            Back to Registration
          </a>
        </div>
      </Section>
    </MainLayout>
  );
}
