'use client'

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OtpInput from "./OtpInput";
import SpinningButton from "../common/SpinningButton";
import { verifyOtp as admittoVerifyOtp } from "../../api/admitto";

export default function OtpVerifyForm() {
    const router = useRouter();
    const params = useSearchParams();
    const email = params.get("email") || "";
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const code = otp.join("");
        try {
            const verificationResult = await admittoVerifyOtp(email, code);
            // If we received a publicId, the user already has tickets.
            if (verificationResult.publicId) {
                router.push(`/tickets/edit/${verificationResult.publicId}/${verificationResult.signature}?redirect=true`);
            } else {
                router.push(`/tickets/register?token=${encodeURIComponent(verificationResult.registrationToken)}&email=${encodeURIComponent(email)}`);
            }
        } catch (err: any) {
            setLoading(false);
            setError(err.message || "Verification failed. Please try again.");
        }
    };
 
    return (
        <form onSubmit={handleSubmit} className="ticket-form">
            {error && <div className="text-danger my-3">{error}</div>}
            <OtpInput value={otp} onChange={setOtp} />
            <SpinningButton loading={loading} disabled={otp.some(digit => digit === "")} className="mt-2">
                Verify email
            </SpinningButton>
        </form>
    );
}
