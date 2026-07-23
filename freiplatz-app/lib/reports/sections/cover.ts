import { PdfBuilder } from "../pdf-builder";
import { CaseReportData } from "../types";

export function drawCover(
  pdf: PdfBuilder,
  report: CaseReportData
) {
  pdf.space(60);

  pdf.title("JugendKompass");

  pdf.space(20);

  pdf.title("FALLBERICHT");

  pdf.space(40);

  pdf.labelValue(
    "Aktennummer",
    report.child.case_number
  );

  pdf.labelValue(
    "Vorname",
    report.child.first_name
  );

  pdf.labelValue(
    "Nachname",
    report.child.last_name
  );

  pdf.labelValue(
    "Erstellt am",
    new Date().toLocaleDateString("de-DE")
  );

  pdf.space(80);

  pdf.paragraph(
    "Dieser Bericht wurde automatisch aus den dokumentierten Falldaten erstellt."
  );

  pdf.paragraph(
    "Er enthält ausschließlich dokumentierte Informationen."
  );

  pdf.newPage();
}