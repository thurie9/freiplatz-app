"use client";

interface PlacementRequest {
  id: string;
  caseNumber: string;
  age: number;
  placementType: string;
  location: string;
  urgency: "high" | "medium" | "low";
  description: string;
  requiredSkillsets: string[];
}

interface IncomingRequestsProps {
  requests: PlacementRequest[];
}

export default function IncomingRequests({
  requests,
}: IncomingRequestsProps) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "32px",
        padding: "32px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        marginBottom: "32px",
      }}
    >
      <h2
        style={{
          fontSize: "34px",
          fontWeight: "bold",
          marginBottom: "8px",
        }}
      >
        Neue Vermittlungsanfragen
      </h2>

      <p
        style={{
          color: "#6b7280",
          marginBottom: "28px",
        }}
      >
        Neue Anfragen von Jugendämtern.
      </p>

      <div
        style={{
          display: "grid",
          gap: "18px",
        }}
      >
        {requests.map((request) => (
          <div
            key={request.id}
            style={{
              background: "#f8fafc",
              borderRadius: "20px",
              padding: "20px",
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <strong>{request.caseNumber}</strong>

              <span
                style={{
                  color:
                    request.urgency === "high"
                      ? "#dc2626"
                      : request.urgency === "medium"
                      ? "#d97706"
                      : "#16a34a",
                  fontWeight: 600,
                }}
              >
                {request.urgency === "high"
                  ? "Hoch"
                  : request.urgency === "medium"
                  ? "Mittel"
                  : "Niedrig"}
              </span>
            </div>

            <div
  style={{
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "6px",
  }}
>
  {request.caseNumber}
</div>

<div style={{ color: "#6b7280" }}>
  👦 {request.age} Jahre
</div>

<div style={{ color: "#6b7280" }}>
  🏠 {request.placementType}
</div>

<div style={{ color: "#6b7280" }}>
  📍 {request.location}
</div>

<div
  style={{
    marginTop: "12px",
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  }}
>
  {request.requiredSkillsets.map((skill) => (
    <span
      key={skill}
      style={{
        background: "#EEF6FF",
        color: "#2563EB",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
      }}
    >
      {skill}
    </span>
  ))}
</div>

            <div
              style={{
                color: "#6b7280",
              }}
            >
              {request.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
<div
  style={{
    marginTop: "20px",
  }}
>
  <Link href={`/dashboard/requests/${request.id}`}>
    Details →
  </Link>
</div>