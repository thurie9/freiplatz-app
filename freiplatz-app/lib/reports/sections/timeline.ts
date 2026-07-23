// lib/reports/sections/timeline.ts

import { PdfBuilder } from "../pdf-builder";
import { CaseReportData } from "../types";

export function drawTimeline(
  pdf: PdfBuilder,
  report: CaseReportData,
): void {
  pdf.section("Chronologischer Verlauf");

  if (report.timeline.length === 0) {
    pdf.paragraph(
      "Für diesen Fall liegen keine chronologischen Einträge vor.",
    );

    pdf.divider();
    return;
  }

  report.timeline.forEach((item) => {
    pdf.timelineCard(
      item.type,
      item.date.toLocaleDateString("de-DE"),
      item.title,
      item.description,
    );
  });

  pdf.divider();
}