"use client";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";

import { useRouter } from "next/navigation";

interface CaseHeaderProps {
  caseNumber: string;
  firstName: string;
  lastName: string;
  placementStatus: string;
  dateOfBirth?: string | null;
  facility?: string | null;
  jugendamt?: string | null;
}

export default function CaseHeader({
  caseNumber,
  firstName,
  lastName,
  placementStatus,
  dateOfBirth,
  facility,
  jugendamt,
}: CaseHeaderProps) {
  const router = useRouter();

  return (
    <>
      <Button
        variant="secondary"
        onClick={() =>
          router.push("/dashboard/cases")
        }
        style={{
          marginBottom: "20px",
        }}
      >
        ← Zurück
      </Button>

      <Card>
        <SectionHeader
          title={`👦 ${firstName} ${lastName}`}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr auto",
            gap: "20px",
          }}
        >
          <div>
            <p>
              <strong>Aktennummer:</strong>{" "}
              {caseNumber}
            </p>

            <p>
              <strong>Geburtsdatum:</strong>{" "}
              {dateOfBirth || "-"}
            </p>

            <p>
              <strong>Einrichtung:</strong>{" "}
              {facility || "-"}
            </p>

            <p>
              <strong>Jugendamt:</strong>{" "}
              {jugendamt || "-"}
            </p>
          </div>

          <div>
            <Badge
              color={
                placementStatus === "Aktiv"
                  ? "green"
                  : placementStatus ===
                    "Warteliste"
                  ? "yellow"
                  : "gray"
              }
            >
              {placementStatus}
            </Badge>
          </div>
        </div>
      </Card>
    </>
  );
}