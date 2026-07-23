// lib/reports/sections/documents.ts

import { PdfBuilder } from "../pdf-builder";
import { CaseReportData } from "../types";

export function drawDocuments(
  pdf: PdfBuilder,
  report: CaseReportData,
): void {
  pdf.section("Dokumente");

  if (report.documents.length === 0) {
    pdf.paragraph(
      "Für diesen Fall sind keine Dokumente hinterlegt.",
    );

    pdf.divider();
    return;
  }

  const documents = report.documents
    .slice()
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime(),
    );

  documents.forEach((document, index) => {
    pdf.labelValue(
      "Datei",
      document.file_name,
    );

    pdf.labelValue(
      "Typ",
      document.document_type ?? "—",
    );

    pdf.labelValue(
      "Erstellt",
      new Date(
        document.created_at,
      ).toLocaleString("de-DE"),
    );

    if (index < documents.length - 1) {
      pdf.divider();
    }
  });

  pdf.divider();
}