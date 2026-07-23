export interface ChildRecord {
  id: string;
  case_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  gender: string |null;

  responsible_jugendamt: string | null;
  assigned_facility: string | null;

  placement_status: string;

  notes: string | null;

  created_by: string;

  created_at: string;

  updated_at: string;

  is_archived: boolean;
}

export interface Incident {

  id: string;

  child_id: string;

  incident_date: string;

  incident_time: string;

  incident_type: string;

  severity: string;

  description: string;

  staff_member: string;

  action_taken: string;

  follow_up_required: boolean;

  created_by: string;

  created_at: string;

}

export interface CaseNote {

  id: string;

  child_id: string;

  note: string;

  note_date: string;

  note_time: string;

  created_by: string;

  created_at: string;

}

export interface CaseDocument {

  id: string;

  child_id: string;

  file_name: string;

  file_path: string;

  document_type: string;

  created_by: string;

  created_at: string;

}

export interface AuditLog {

  id: string;

  child_id: string;

  user_id: string;

  user_name?: string;

  organisation?: string;

  action: string;

  entity_type: string;

  entity_id?: string;

  description: string;

  created_at: string;

}

export interface TimelineItem {

  id: string;

  type:
    | "incident"
    | "note"
    | "document";

  created_at: string;

}