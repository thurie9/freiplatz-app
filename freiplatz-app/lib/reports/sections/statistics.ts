// lib/reports/sections/statistics.ts

import { PdfBuilder } from "../pdf-builder";
import { CaseReportData } from "../types";

export function drawStatistics(
  pdf: PdfBuilder,
  report: CaseReportData,
): void {
  pdf.section("Statistik");

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
    "Timeline-Ereignisse",
    report.timeline.length,
  );

  pdf.divider();
}