// lib/reports/sections/overview.ts

import { PdfBuilder } from "../pdf-builder";
import { CaseReportData } from "../types";

export function drawOverview(
  pdf: PdfBuilder,
  report: CaseReportData,
): void {
  pdf.section("Übersicht");

  pdf.labelValue(
    "Verlaufsnotizen",
    report.notes.length,
  );

  pdf.labelValue(
    "Vorfälle",
    report.incidents.length,
  );

  pdf.labelValue(
    "Dokumente",
    report.documents.length,
  );

  pdf.labelValue(
    "Timeline-Einträge",
    report.timeline.length,
  );

  pdf.labelValue(
    "Fall erstellt",
    new Date(
      report.child.created_at,
    ).toLocaleDateString("de-DE"),
  );

  pdf.paragraph(
    "Diese Übersicht enthält ausschließlich automatisch ermittelte Falldaten. Es erfolgt keine fachliche Bewertung oder Interpretation."
  );

  pdf.divider();
}