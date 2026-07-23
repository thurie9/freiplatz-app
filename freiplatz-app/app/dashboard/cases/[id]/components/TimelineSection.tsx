"use client";

import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeader from "@/components/ui/SectionHeader";

import { useCase } from "../CaseContext";

export default function TimelineSection() {
  const {
    incidents,
    notes,
    documents,
  } = useCase();

  const timeline = [
    ...incidents.map((incident) => ({
      id: incident.id,
      type: "incident",
      title: incident.incident_type,
      description: incident.description,
      date: `${incident.incident_date} ${incident.incident_time}`,
    })),

    ...notes.map((note) => ({
      id: note.id,
      type: "note",
      title: "Verlaufsnotiz",
      description: note.note,
      date: `${note.note_date} ${note.note_time}`,
    })),

    ...documents.map((doc) => ({
      id: doc.id,
      type: "document",
      title: doc.file_name,
      description: doc.document_type,
      date: doc.created_at,
    })),
  ];

  timeline.sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  );

  return (
    <div
      style={{
        marginTop: "40px",
      }}
    >
      <SectionHeader
        title="📜 Timeline"
      />

      {timeline.length === 0 ? (
        <EmptyState title="Noch keine Einträge." />
      ) : (
        <div
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          {timeline.map((item) => (
            <Card key={`${item.type}-${item.id}`}>
              <h3>{item.title}</h3>

              <p>{item.description}</p>

              <small>{item.date}</small>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}