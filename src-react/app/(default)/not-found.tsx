import MainLayout from "@/src/components/layout/MainLayout";
import Section from "@/src/components/layout/Section";

export default function NotFoundPage() {
  return (
    <MainLayout>
      <Section headerText="Page Not Found">
        <div className="text-center">
          <h2>Oops! We couldn&apos;t find that page.</h2>
        </div>
      </Section>
    </MainLayout>
  );
}
