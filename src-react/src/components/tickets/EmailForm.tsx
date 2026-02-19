'use client'

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SpinningButton from "../common/SpinningButton";
import { requestOtp } from "../../api/admitto";

export default function EmailForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await requestOtp(email);
            router.push(`/tickets/register/verify?email=${encodeURIComponent(email)}`);
        }
        catch (err: any) {
            setLoading(false);
            setError(err.message || "Verification request failed. Please try again.");
        }
    };

    const isFormValid = () => formRef.current?.checkValidity() ?? false;

    return (
        <div className="w-75 mx-auto text-center">
            <form ref={formRef} onSubmit={handleSubmit} className="ticket-form">
                {error && <div className="text-danger mt-2">{error}</div>}
                <div className="form-group row justify-content-center align-items-center mb-2">
                    <label htmlFor="email" className="col-auto col-form-label text-end">
                        Email:
                    </label>
                    <div className="col-9">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="form-control"
                            />
                    </div>
                </div>
                <SpinningButton loading={loading} disabled={!isFormValid()} className="mt-2">
                    Start registration
                </SpinningButton>
            </form>
        </div>
    );
}
