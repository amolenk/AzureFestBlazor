import MainLayout from "@/src/components/layout/MainLayout";
import Section from "@/src/components/layout/Section";
import UpdateRegistrationForm from "@/src/components/tickets/UpdateRegistrationForm";

export const metadata = {
  title: "Manage Registration | Azure Fest"
};

export default async function UpdateRegistrationPage({
  params,
  searchParams
}: {
  params: Promise<{ publicId: string; signature: string }>;
  searchParams: Promise<{ redirect?: boolean }>;
}) {
  const { publicId, signature } = await params;
  const { redirect } = await searchParams;

  return (
    <MainLayout>
      <Section headerText="Manage Registration" sectionBackground={1}>
        <div className="row justify-content-center mb-5">
          <div className="col-lg-9">
            {redirect && (
              <div className="alert alert-warning">
                We found an existing registration for this email. You can manage your registration below.
              </div>
            )}

            <UpdateRegistrationForm publicId={publicId} signature={signature} />
          </div>
        </div>
      </Section>
    </MainLayout>
  );
}
