export interface YesterdayActivity {
  notes: number;
  documents: number;
  incidents: number;
  placements: number;
}

export interface WelcomeMessage {
  title: string;
  subtitle: string;
  message: string;
}

// --------------------
// Shared Dashboard Types
// --------------------

export interface Activity {
  id: string;
  title: string;
  message: string;
  created_at: string;
}

export interface DashboardImpact {
  childrenSupported: number;
  notesThisWeek: number;
  documentsThisWeek: number;
  tasksToday: number;
}

export interface FacilityImpact {
  availablePlaces: number;
  childrenInCare: number;
  openRequests: number;
  pendingDocumentation: number;
}

export interface PriorityItem {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  type: "placement" | "document" | "followup" | "notification";
}

export interface FocusChild {
  id: string;
  name: string;
  reason: string;
  status: "high" | "medium" | "low";
}

export interface ChildInCare {
  id: string;
  name: string;
  reason: string;
  status: "high" | "medium" | "low";
}

export interface PlacementRequest {
  id: string;
  caseNumber: string;
  age: number;
  placementType: string;
  urgency: "high" | "medium" | "low";
  description: string;
  location: string;
  requiredSkillsets: string[];
  createdBy: string;
}

// --------------------
// Dashboard Models
// --------------------

export interface JugendamtDashboardData {
  impact: DashboardImpact;
  priorities: PriorityItem[];
  childrenInFocus: FocusChild[];
  activities: Activity[];
}

export interface EinrichtungDashboardData {
  impact: FacilityImpact;
  incomingRequests: PlacementRequest[];
  childrenInCare: ChildInCare[];
  activities: Activity[];
}

export interface PlacementInterest {
  id: string;
  requestId: string;
  facilityId: string;
  status: "interested" | "accepted" | "rejected";
  createdAt: string;
}