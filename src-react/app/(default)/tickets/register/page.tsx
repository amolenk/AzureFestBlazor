import MainLayout from "@/src/components/layout/MainLayout";
import Section from "@/src/components/layout/Section";
import RegisterForm from "@/src/components/tickets/RegisterForm";

export const metadata = {
  title: "Ticket Registration | Azure Fest"
};

export default async function RegisterPage({
  searchParams
}: {
  searchParams: Promise<{ email: string; token: string }>;
}) {
  const { email, token } = await searchParams;

  return (
    <MainLayout>
      <Section headerText="Registration" sectionBackground={1}>
        <div className="row justify-content-center mb-5">
          <div className="col-lg-9">
            <RegisterForm email={email} token={token} />
          </div>
        </div>
      </Section>
    </MainLayout>
  );
}
