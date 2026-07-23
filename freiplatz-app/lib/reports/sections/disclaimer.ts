// lib/reports/sections/disclaimer.ts

import { PdfBuilder } from "../pdf-builder";

export function drawDisclaimer(
  pdf: PdfBuilder,
): void {
  pdf.section("Hinweis");

  pdf.paragraph(
    "Dieser Bericht wurde automatisch aus den in JugendKompass gespeicherten Falldaten erstellt."
  );

  pdf.paragraph(
    "Der Bericht enthält ausschließlich dokumentierte Informationen aus dem System. Es erfolgt keine fachliche Bewertung, Interpretation oder Empfehlung."
  );

  pdf.paragraph(
    "Maßgeblich bleiben die Originaldaten sowie die vollständige Falldokumentation in JugendKompass."
  );

  pdf.divider();
}