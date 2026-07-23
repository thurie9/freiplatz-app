// lib/reports/sections/incidents.ts

import { PdfBuilder } from "../pdf-builder";
import { CaseReportData } from "../types";

export function drawIncidents(
  pdf: PdfBuilder,
  report: CaseReportData,
): void {
  pdf.section("Vorfälle");

  if (report.incidents.length === 0) {
    pdf.paragraph(
      "Für diesen Fall sind keine Vorfälle dokumentiert.",
    );

    pdf.divider();
    return;
  }

  const incidents = report.incidents
    .slice()
    .sort(
      (a, b) =>
        new Date(a.incident_date).getTime() -
        new Date(b.incident_date).getTime(),
    );

  incidents.forEach((incident, index) => {
    pdf.labelValue(
      "Datum",
      new Date(
        incident.incident_date,
      ).toLocaleDateString("de-DE"),
    );

    pdf.labelValue(
      "Art",
      incident.incident_type,
    );

    pdf.paragraph(
      incident.description,
    );

    if (index < incidents.length - 1) {
      pdf.divider();
    }
  });

  pdf.divider();
}