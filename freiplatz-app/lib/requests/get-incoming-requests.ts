import { supabase } from "@/lib/supabase";

export async function getIncomingRequests() {
  const { data, error } = await supabase
    .from("placement_requests")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((request) => ({
    id: request.id,
    caseNumber: request.case_number,
    age: request.age,
    placementType: request.placement_type,
    location: request.location,
    urgency: request.urgency,
    description: request.description,
    requiredSkillsets: request.required_skillsets ?? [],
  }));
}