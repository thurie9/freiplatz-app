"use client";

import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeader from "@/components/ui/SectionHeader";

import { useCase } from "../CaseContext";

export default function NotesSection() {
  const { notes } = useCase();

  return (
    <div
      style={{
        marginTop: "40px",
      }}
    >
      <SectionHeader
        title="📝 Verlaufsnotizen"
      />

      {notes.length === 0 ? (
        <EmptyState
          title="Noch keine Verlaufsnotizen."
        />
      ) : (
        <div
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          {notes.map((note) => (
            <Card key={note.id}>
              <p
                style={{
                  whiteSpace: "pre-wrap",
                  marginBottom: "12px",
                }}
              >
                {note.note}
              </p>

              <small
                style={{
                  color: "#64748b",
                }}
              >
                {new Date(
                  note.created_at
                ).toLocaleString(
                  "de-DE"
                )}
              </small>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}