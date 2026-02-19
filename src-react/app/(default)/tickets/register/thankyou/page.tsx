import MainLayout from "@/src/components/layout/MainLayout";
import Section from "@/src/components/layout/Section";

export const metadata = {
  title: "Ticket Registration | Azure Fest"
};

export default function ThankYouPage() {
  return (
    <MainLayout>
      <Section headerText="Registration Complete" sectionBackground={1}>
        <div className="text-center">
          <h2>Thank you for registering!</h2>
          <p className="lead mt-5">We&apos;ve received your registration. Check your email for confirmation.</p>
          <p className="mt-5">If you don&apos;t receive an email shortly, please check your spam folder.</p>
        </div>
      </Section>
    </MainLayout>
  );
}
