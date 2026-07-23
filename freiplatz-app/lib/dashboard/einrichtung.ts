// lib/dashboard/einrichtung.ts

import type { EinrichtungDashboardData } from "./types";

import { supabase } from "@/lib/supabase";
import type {
  EinrichtungDashboardData,
  PlacementRequest,
} from "./types";

export async function getEinrichtungDashboard(
  userId: string,
): Promise<EinrichtungDashboardData> {

  // TODO: Replace with Supabase queries

  return {
    impact: {
      availablePlaces: 0,
      childrenInCare: 0,
      openRequests: 0,
      pendingDocumentation: 0,
    },

    incomingRequests: [],

    childrenInCare: [],

    activities: [],
  };
}

async function getIncomingRequests(): Promise<PlacementRequest[]> {
  const { data, error } = await supabase
    .from("placement_requests")
    .select(`
      id,
      case_number,
      age,
      placement_type,
      urgency,
      description,
      location,
      required_skillsets,
      created_by
    `)
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    caseNumber: row.case_number,
    age: row.age,
    placementType: row.placement_type,
    urgency: row.urgency,
    description: row.description,
    location: row.location,
    requiredSkillsets: row.required_skillsets ?? [],
    createdBy: row.created_by,
  }));
}