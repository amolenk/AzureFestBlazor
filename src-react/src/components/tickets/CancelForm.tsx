'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SpinningButton from "../common/SpinningButton";
import Link from "next/link";
import { cancel } from "@/src/api/admitto";

interface CancelFormProps {
    publicId: string,
    signature: string
}

export default function CancelForm({ publicId, signature }: CancelFormProps) {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await cancel(publicId, signature);
            router.push("/tickets/cancel/confirmation");
        } catch (err: any) {
            setLoading(false);
            setError(err.message || "Registration failed. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="cancel-form">
            <div className="text-center">
                <p>Are you sure you want to cancel your registration?</p>
                {error && <div className="text-danger my-2">{error}</div>}
                <div className="text-center">
                    {loading ? (
                        <button type="button" className="btn btn-primary mt-2 me-2 text-light" disabled>
                            No, keep my registration
                        </button>
                    ) : (
                        <Link href="/" className="btn btn-primary mt-2 me-2 text-light">
                            No, keep my registration
                        </Link>
                    )}
                    <SpinningButton loading={loading} className="btn-danger mt-2 me-2">
                        Yes, cancel my registration
                    </SpinningButton>
                </div>
            </div>
        </form>
    );
}
