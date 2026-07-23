// lib/reports/timeline.ts

import {
  CaseReportData,
  TimelineItem,
} from "./types";

export function buildTimeline(
  report: CaseReportData,
): TimelineItem[] {
  const items: TimelineItem[] = [];

  items.push({
    date: new Date(report.child.created_at),
    type: "case",
    title: "Fall angelegt",
    description: `Fallakte ${report.child.case_number} wurde erstellt.`,
  });

  report.notes.forEach((note) => {
    items.push({
      date: new Date(note.created_at),
      type: "note",
      title: "Verlaufsnotiz",
      description: note.note,
    });
  });

  report.incidents.forEach((incident) => {
    items.push({
      date: new Date(incident.incident_date),
      type: "incident",
      title: incident.incident_type,
      description: incident.description,
    });
  });

  report.documents.forEach((document) => {
    items.push({
      date: new Date(document.created_at),
      type: "document",
      title: "Dokument",
      description: document.file_name,
    });
  });

  return items.sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );
}