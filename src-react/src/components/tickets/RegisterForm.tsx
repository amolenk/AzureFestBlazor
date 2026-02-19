"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ErrorCard from "../common/ErrorCard";
import MainConferenceForm from "./MainConferenceForm";
import PersonalDetailsForm, { PersonalDetails } from "./PersonalDetailsForm";
import SpinningButton from "../common/SpinningButton";
import {
  AdmittoError,
  Availability,
  getAvailability,
  isAfterRegistrationClosed,
  isBeforeRegistrationOpen,
  register
} from "../../api/admitto";
import { websiteSettings } from "@/src/config/website-settings";

interface RegisterFormProps {
  email: string;
  token: string;
}

export default function RegisterForm({ email, token }: RegisterFormProps) {
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittingError, setSubmittingError] = useState("");
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [details, setDetails] = useState<PersonalDetails>({
    firstName: "",
    lastName: "",
    employmentStatus: "",
    companyName: ""
  });

  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const availabilityResult = await getAvailability();
        setAvailability(availabilityResult);
        setLoading(false);
      } catch (err: any) {
        setLoadingError(err.message || "Could not fetch ticket availability.");
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (email === "" || token === "") {
      router.push("/tickets/register/expired");
    }
  }, [email, token, router]);

  const conferenceTicket = useMemo(() => {
    return availability?.ticketTypes.find(
      (ticket) => ticket.slug === websiteSettings.admitto.mainConferenceTicketSlug
    );
  }, [availability]);

  const canBookConference = !!conferenceTicket?.hasCapacity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmittingError("");

    try {
      await register(
        email,
        details.firstName,
        details.lastName,
        [
          { name: "EmploymentStatus", value: details.employmentStatus },
          { name: "CompanyName", value: details.companyName }
        ],
        [websiteSettings.admitto.mainConferenceTicketSlug],
        token
      );

      router.push("/tickets/register/thankyou");
    } catch (err: any) {
      if (err instanceof AdmittoError && err.code === "attendee.invalid_token") {
        router.push("/tickets/register/expired");
      } else {
        setSubmitting(false);
        setSubmittingError(err.message || "Registration failed. Please try again.");
      }
    }
  };

  const isFormValid = () => (formRef.current?.checkValidity() ?? false) && canBookConference;

  if (loading || email === "" || token === "") {
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

  if (availability && isBeforeRegistrationOpen(availability)) {
    return (
      <div className="card h-100 shadow-sm">
        <div className="card-header text-center">
          <h3>Registration is closed</h3>
        </div>
        <div className="card-body text-center">Registration is not open yet. Please check back later.</div>
      </div>
    );
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
      <form ref={formRef} onSubmit={handleSubmit} className="ticket-form">
        <MainConferenceForm availability={availability} />

        <PersonalDetailsForm details={details} setDetails={setDetails} disabled={submitting}>
          <div className="text-center mt-3">
            {submittingError && <div className="text-danger mt-2">{submittingError}</div>}

            <div className="text-center">
              <SpinningButton loading={submitting} disabled={!isFormValid()} className="mt-2">
                Register
              </SpinningButton>
            </div>
          </div>
        </PersonalDetailsForm>
      </form>
    </div>
  );
}
