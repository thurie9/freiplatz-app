export interface Placement {
  id: string;

  requestId: string;

  facilityId: string;

  childId?: string;

  status: "pending" | "active" | "completed";

  startDate?: string;

  endDate?: string;
}