"use client";

import React from "react";

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  employmentStatus: "Employed" | "SelfEmployed" | "";
  companyName: string;
}

interface PersonalDetailsFormProps {
  details: PersonalDetails;
  setDetails: React.Dispatch<React.SetStateAction<PersonalDetails>>;
  disabled: boolean;
  children?: React.ReactNode;
}

export default function PersonalDetailsForm({
  details,
  setDetails,
  disabled,
  children
}: PersonalDetailsFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDetails({ ...details, [e.target.name]: e.target.value } as PersonalDetails);
  };

  return (
    <div className="card h-100 shadow-sm mt-3">
      <div className="card-header text-center">
        <h3>Tell us a bit about yourself</h3>
      </div>
      <div className="card-body text-center mx-5">
        <div className="form-group mb-3 text-start">
          <label htmlFor="firstName" className="form-label">
            First name<span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={details.firstName}
            onChange={handleChange}
            maxLength={50}
            required
            className="form-control"
            disabled={disabled}
          />
        </div>

        <div className="form-group mb-3 text-start">
          <label htmlFor="lastName" className="form-label">
            Last name<span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={details.lastName}
            onChange={handleChange}
            maxLength={50}
            required
            className="form-control"
            disabled={disabled}
          />
        </div>

        <div className="form-group mb-3 text-start">
          <label htmlFor="employmentStatus" className="form-label">
            Are you employed or self-employed?<span className="text-danger">*</span>
          </label>
          <select
            id="employmentStatus"
            name="employmentStatus"
            value={details.employmentStatus}
            onChange={handleChange}
            required
            className="form-control"
            disabled={disabled}
          >
            <option value="">Please select</option>
            <option value="Employed">Employed</option>
            <option value="SelfEmployed">Self-employed</option>
          </select>
        </div>

        <div className="form-group mb-3 text-start">
          <label htmlFor="companyName" className="form-label">
            Company name (optional)
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={details.companyName}
            onChange={handleChange}
            maxLength={120}
            className="form-control"
            disabled={disabled}
          />
        </div>

        {children}
      </div>
    </div>
  );
}
