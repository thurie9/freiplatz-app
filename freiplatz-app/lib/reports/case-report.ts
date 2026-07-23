// lib/reports/case-report.ts

import { PdfBuilder } from "./pdf-builder-v2";
import { buildTimeline } from "./timeline";

import { CaseReportData } from "./types";

import { drawMasterData } from "./sections/master-data";
import { drawOverview } from "./sections/overview";
import { drawTimeline } from "./sections/timeline";
import { drawNotes } from "./sections/notes";
import { drawIncidents } from "./sections/incidents";
import { drawDocuments } from "./sections/documents";
import { drawStatistics } from "./sections/statistics";
import { drawDisclaimer } from "./sections/disclaimer";

export async function generateCaseReport(
  report: CaseReportData,
): Promise<Buffer> {
  const pdf = new PdfBuilder();

  await pdf.init();

  pdf.setCaseNumber(
  report.child.case_number,
);

  report.timeline = buildTimeline(report);

  pdf.title(
    `Fallbericht – ${report.child.case_number}`,
  );

  drawMasterData(pdf, report);

  drawOverview(pdf, report);

  drawTimeline(pdf, report);

  drawNotes(pdf, report);

  drawIncidents(pdf, report);

  drawDocuments(pdf, report);

  drawStatistics(pdf, report);

  drawDisclaimer(pdf);

  return pdf.save();
}