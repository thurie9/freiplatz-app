export type RequestStatus =
  | "draft"
  | "open"
  | "matched"
  | "placed"
  | "closed";

export type Urgency =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface PlacementRequest {
  id: string;

  caseNumber: string;

  age: number;

  placementType: string;

  urgency: Urgency;

  location: string;

  description: string;

  requiredSkillsets: string[];

  status: RequestStatus;

  createdAt: string;

  createdBy: string;
}