// lib/reports/types.ts

export interface ChildRecord {
  id: string;

  case_number: string;

  first_name: string;

  last_name: string;

  date_of_birth: string | null;

  gender: string | null;

  responsible_jugendamt: string | null;

  assigned_facility: string | null;

  placement_status: string;

  created_at: string;
}

export interface CaseNote {
  id: string;

  child_id: string;

  note: string;

  created_at: string;
}

export interface Incident {
  id: string;

  child_id: string;

  incident_type: string;

  incident_date: string;

  description: string;

  created_at?: string;
}

export interface CaseDocument {
  id: string;

  child_id: string;

  file_name: string;

  document_type: string | null;

  created_at: string;
}

export type TimelineItemType =
  | "case"
  | "note"
  | "incident"
  | "document";

export interface TimelineItem {
  date: Date;

  type: TimelineItemType;

  title: string;

  description: string;
}

export interface CaseReportData {
  child: ChildRecord;

  notes: CaseNote[];

  incidents: Incident[];

  documents: CaseDocument[];

  timeline: TimelineItem[];
}