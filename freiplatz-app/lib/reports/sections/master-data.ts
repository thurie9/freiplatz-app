// lib/reports/sections/master-data.ts

import { PdfBuilder } from "../pdf-builder";
import { CaseReportData } from "../types";

export function drawMasterData(
  pdf: PdfBuilder,
  report: CaseReportData,
): void {
  pdf.section("Stammdaten");

  const child = report.child;

  pdf.labelValue(
    "Aktennummer",
    child.case_number,
  );

  pdf.labelValue(
    "Vorname",
    child.first_name,
  );

  pdf.labelValue(
    "Nachname",
    child.last_name,
  );

  pdf.labelValue(
    "Geburtsdatum",
    child.date_of_birth ?? "—",
  );

  pdf.labelValue(
    "Geschlecht",
    child.gender ?? "—",
  );

  pdf.labelValue(
    "Jugendamt",
    child.responsible_jugendamt ?? "—",
  );

  pdf.labelValue(
    "Einrichtung",
    child.assigned_facility ?? "—",
  );

  pdf.labelValue(
    "Status",
    child.placement_status,
  );

  pdf.divider();
}