import MainLayout from "@/src/components/layout/MainLayout";
import Section from "@/src/components/layout/Section";
import CancelForm from "@/src/components/tickets/CancelForm";

export const metadata = {
  title: "Ticket Cancellation | Azure Fest"
};

export default async function CancelPage({
  params
}: {
  params: Promise<{ publicId: string; signature: string }>;
}) {
  const { publicId, signature } = await params;

  return (
    <MainLayout>
      <Section headerText="Ticket Cancellation" sectionBackground={1}>
        <div className="row justify-content-center mb-5">
          <div className="col-lg-6">
            <div className="card h-100 shadow-sm">
              <div className="card-header text-center">
                <h3>Confirm Cancellation</h3>
              </div>
              <div className="card-body center text-center">
                <CancelForm publicId={publicId} signature={signature} />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </MainLayout>
  );
}
