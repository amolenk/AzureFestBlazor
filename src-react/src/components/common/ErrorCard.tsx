import React from "react";

interface ErrorCardProps {
    error: string;
}

export default function ErrorCard({
    error
}: ErrorCardProps) {
    return (
        <div className="d-flex justify-content-center align-items-center">
        <div className="card h-100 shadow-sm w-50">
            <div className="card-header text-danger text-center"><h3>Unexpected Error</h3></div>
            <div className="card-body lead text-center">{error}</div>
        </div>
        </div>
    );
}
