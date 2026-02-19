"use client";

import { Availability } from "@/src/api/admitto";
import { websiteSettings } from "@/src/config/website-settings";
import { formatDate } from "@/src/utils/date-utils";

interface MainConferenceFormProps {
  availability: Availability | null;
}

export default function MainConferenceForm({ availability }: MainConferenceFormProps) {
  const edition = websiteSettings.currentEdition;
  const conferenceTicket = availability?.ticketTypes.find(
    (ticket) => ticket.slug === websiteSettings.admitto.mainConferenceTicketSlug
  );

  if (!conferenceTicket || !conferenceTicket.hasCapacity) {
    return (
      <div className="card h-100 shadow-sm mt-3 mb-4">
        <div className="card-header text-center">
          <h3>
            General Admission - {formatDate(edition.conferenceDate)}
            <span className="badge bg-danger ms-2">Sold Out</span>
          </h3>
        </div>
        <div className="card-body text-start mx-5">
          <p>General admission is currently fully booked.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-100 shadow-sm mt-3 mb-4">
      <div className="card-header text-center">
        <h3>General Admission - {formatDate(edition.conferenceDate)}</h3>
      </div>
      <div className="card-body text-start mx-5">
        <p>
          Tickets to Azure Fest are <strong>100% free</strong> and include parking &amp; diner.
        </p>
        <p>
          This registration reserves your seat for the full conference day.
          <span className="badge text-bg-success ms-2">Available</span>
        </p>
      </div>
    </div>
  );
}
