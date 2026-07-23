import Link from "next/link";

import { notFound } from "next/navigation";

import { getPlacementRequest } from "@/lib/requests/get-requests";

export default async function IncomingRequestPage({
  params,
}: {
  params: { id: string };
}) {
  const request = await getPlacementRequest(params.id);

  if (!request) {
    notFound();
  }

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "40px",
      }}
    >
      <h1>{request.case_number}</h1>

      <p>
        <strong>Alter:</strong> {request.age}
      </p>

      <p>
        <strong>Unterbringung:</strong> {request.placement_type}
      </p>

      <p>
        <strong>Ort:</strong> {request.location}
      </p>

      <p>
        <strong>Dringlichkeit:</strong> {request.urgency}
      </p>

      <p>
        <strong>Beschreibung</strong>
      </p>

      <p>{request.description}</p>

<div
  style={{
    marginTop: "20px",
    display: "flex",
    justifyContent: "flex-end",
  }}
>
  <Link
    href={`/dashboard/incoming/${request.id}`}
    style={{
      background: "#2563EB",
      color: "white",
      padding: "10px 18px",
      borderRadius: "10px",
      textDecoration: "none",
      fontWeight: 600,
    }}
  >
    Details
  </Link>
</div>

      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginTop: 20,
        }}
      >
        {request.required_skillsets?.map((skill: string) => (
          <span
            key={skill}
            style={{
              background: "#EEF6FF",
              color: "#2563EB",
              padding: "6px 12px",
              borderRadius: "999px",
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </main>
  );
}