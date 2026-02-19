import MainLayout from "@/src/components/layout/MainLayout";
import Section from "@/src/components/layout/Section";
import EmailForm from "@/src/components/tickets/EmailForm";
import ErrorCard from "@/src/components/common/ErrorCard";
import { getAvailability } from "@/src/api/admitto";
import { websiteSettings } from "@/src/config/website-settings";

export const metadata = {
  title: "Tickets | Azure Fest"
};

export const dynamic = "force-dynamic";

export default async function TicketsPage() {
  const edition = websiteSettings.currentEdition;
  const registrationVisible = edition.registration.isOpen();

  if (!registrationVisible) {
    return (
      <MainLayout>
        <Section id="tickets" headerText="Tickets">
          <div className="row justify-content-center">
            <div className="col-lg-6 text-center">
              <p>Tickets to Azure Fest are 100% free and include parking &amp; diner.</p>
              <p>
                Available from July 8th for everybody. Members of Dutch Azure Meetup can get a ticket 1 day
                earlier.
              </p>
            </div>
          </div>
        </Section>
      </MainLayout>
    );
  }

  try {
    const availability = await getAvailability();
    if ((availability.ticketTypes || []).every((ticket) => ticket.hasCapacity === false)) {
      return (
        <MainLayout>
          <Section id="tickets" headerText="Tickets">
            <div className="row justify-content-center">
              <div className="col-lg-6 text-center">
                <p>We&apos;re sorry, but all tickets for Azure Fest are currently sold out.</p>
                <p>Please follow us on social media for updates and future editions.</p>
              </div>
            </div>
          </Section>
        </MainLayout>
      );
    }
  } catch {
    return (
      <MainLayout>
        <ErrorCard error="An error occurred while checking ticket availability." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Section id="tickets" headerText="Tickets">
        <div className="row">
          <div className="col-lg-3"></div>
          <div className="col-lg-6">
            <div className="card mb-5 mb-lg-0">
              <div className="card-body">
                <h5 className="card-title text-muted text-uppercase text-center">General admission</h5>
                <h6 className="card-price text-center">FREE</h6>
                <hr />
                <div className="text-center">
                  <p>Tickets to Azure Fest are 100% free and include parking &amp; diner.</p>
                </div>
                <hr />
                <EmailForm />
              </div>
            </div>
          </div>
          <div className="col-lg-3"></div>
        </div>
      </Section>
    </MainLayout>
  );
}
