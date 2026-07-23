// lib/reports/sections/notes.ts

import { PdfBuilder } from "../pdf-builder";
import { CaseReportData } from "../types";

export function drawNotes(
  pdf: PdfBuilder,
  report: CaseReportData,
): void {
  pdf.section("Verlaufsnotizen");

  if (report.notes.length === 0) {
    pdf.paragraph(
      "Für diesen Fall sind keine Verlaufsnotizen vorhanden.",
    );

    pdf.divider();
    return;
  }

  report.notes
    .slice()
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime(),
    )
    .forEach((note, index) => {
      pdf.labelValue(
        "Eintrag",
        `${index + 1}`,
      );

      pdf.labelValue(
        "Datum",
        new Date(
          note.created_at,
        ).toLocaleString("de-DE"),
      );

      pdf.paragraph(note.note);

      if (index < report.notes.length - 1) {
        pdf.divider();
      }
    });

  pdf.divider();
}