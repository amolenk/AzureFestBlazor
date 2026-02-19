import MainLayout from "@/src/components/layout/MainLayout";
import Section from "@/src/components/layout/Section";
import { reconfirm } from "@/src/api/admitto";

export const metadata = {
  title: "Attendance Confirmation | Azure Fest"
};

export default async function ReconfirmPage({
  params
}: {
  params: Promise<{ publicId: string; signature: string }>;
}) {
  const { publicId, signature } = await params;

  let success = false;
  let errorMessage = "";

  try {
    await reconfirm(publicId, signature);
    success = true;
  } catch (err: any) {
    errorMessage = err.message || "Reconfirmation failed. Please try again.";
  }

  return (
    <MainLayout>
      <Section headerText="Attendance Confirmation" sectionBackground={1}>
        {success ? (
          <div className="text-center">
            <h2>Your attendance has been successfully reconfirmed!</h2>
            <p className="lead mt-5">Thank you for confirming your attendance. We look forward to seeing you at Azure Fest!</p>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-danger">Reconfirmation Failed</h2>
            <p className="lead mt-5">{errorMessage}</p>
          </div>
        )}
      </Section>
    </MainLayout>
  );
}
