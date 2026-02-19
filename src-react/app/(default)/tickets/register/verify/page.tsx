import { Suspense } from "react";
import MainLayout from "@/src/components/layout/MainLayout";
import Section from "@/src/components/layout/Section";
import OtpVerifyForm from "@/src/components/tickets/OtpVerifyForm";

export const metadata = {
  title: "Ticket Registration | Azure Fest"
};

export default function VerifyPage() {
  return (
    <MainLayout>
      <Section headerText="Verify Email" sectionBackground={1}>
        <div className="row justify-content-center mb-5">
          <div className="col-lg-6">
            <div className="card h-100 shadow-sm">
              <div className="card-header text-center">
                <h3>We&apos;ve sent a verification code to your email. Enter it below to continue.</h3>
              </div>
              <div className="card-body center text-center">
                <p className="text-center text-muted">(If you don&apos;t receive an email shortly, please check your spam folder.)</p>
                <Suspense fallback={<div>Loading verification form...</div>}>
                  <OtpVerifyForm />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </MainLayout>
  );
}
