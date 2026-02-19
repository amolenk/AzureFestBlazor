"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Availability,
  changeTickets,
  getAvailability,
  getTickets,
  isAfterRegistrationClosed
} from "@/src/api/admitto";
import { websiteSettings } from "@/src/config/website-settings";
import ErrorCard from "../common/ErrorCard";
import SpinningButton from "../common/SpinningButton";

interface UpdateRegistrationFormProps {
  publicId: string;
  signature: string;
}

export default function UpdateRegistrationForm({ publicId, signature }: UpdateRegistrationFormProps) {
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittingError, setSubmittingError] = useState("");
  const [submittingSuccess, setSubmittingSuccess] = useState("");
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [hasConferenceTicket, setHasConferenceTicket] = useState(false);

  const mainTicketSlug = websiteSettings.admitto.mainConferenceTicketSlug;

  useEffect(() => {
    async function fetchData() {
      try {
        const [availabilityResult, ticketsResult] = await Promise.all([
          getAvailability(),
          getTickets(publicId, signature)
        ]);

        setAvailability(availabilityResult);
        setHasConferenceTicket((ticketsResult.tickets || []).includes(mainTicketSlug));

        if (!ticketsResult.tickets || ticketsResult.tickets.length === 0) {
          setLoadingError("No existing registration found with the provided link.");
        }
      } catch (err: any) {
        setLoadingError(err.message || "Could not fetch ticket availability.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [publicId, signature, mainTicketSlug]);

  const canClaimTicket = useMemo(() => {
    const ticket = availability?.ticketTypes.find((t) => t.slug === mainTicketSlug);
    return !!ticket?.hasCapacity;
  }, [availability, mainTicketSlug]);

  const handleClaimTicket = async () => {
    setSubmitting(true);
    setSubmittingError("");
    setSubmittingSuccess("");

    try {
      await changeTickets(publicId, signature, [mainTicketSlug]);
      setHasConferenceTicket(true);
      setSubmittingSuccess("Registration updated successfully.");
    } catch (err: any) {
      setSubmittingError(err.message || "Registration update failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (loadingError) {
    return <ErrorCard error={loadingError} />;
  }

  if (availability && isAfterRegistrationClosed(availability)) {
    return (
      <div className="card h-100 shadow-sm">
        <div className="card-header text-center">
          <h3>Registration is closed</h3>
        </div>
        <div className="card-body text-center">Registration for this event has closed. See you next time!</div>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <div className="card h-100 shadow-sm mb-4">
        <div className="card-header text-center">
          <h3>Your Registration</h3>
        </div>
        <div className="card-body text-center">
          {hasConferenceTicket ? (
            <p>You are already registered for Azure Fest general admission.</p>
          ) : (
            <>
              <p>This registration does not currently include a conference ticket.</p>
              {canClaimTicket ? (
                <SpinningButton type="button" loading={submitting} className="mt-2" onClick={handleClaimTicket}>
                  Claim conference ticket
                </SpinningButton>
              ) : (
                <p className="text-danger">General admission is sold out.</p>
              )}
            </>
          )}

          {submittingError && <div className="text-danger mt-3">{submittingError}</div>}
          {submittingSuccess && <div className="text-success mt-3">{submittingSuccess}</div>}

          <div className="mt-4">
            {/* TODO Add dedicated attendee detail editing if Azure Fest needs it in Admitto. */}
            <Link href={`/tickets/cancel/${publicId}/${signature}`} className="btn btn-danger">
              Cancel Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
