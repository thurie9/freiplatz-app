import { supabase } from "@/lib/supabase";

export async function expressInterest(
  requestId: string,
  facilityId: string,
) {
  return supabase
    .from("placement_interests")
    .insert({
      request_id: requestId,
      facility_id: facilityId,
      status: "interested",
    });
}

export async function expressInterest(
  requestId: string,
  facilityId: string,
) {
  const { data: existing } = await supabase
    .from("placement_interests")
    .select("id")
    .eq("request_id", requestId)
    .eq("facility_id", facilityId)
    .maybeSingle();

  if (existing) {
    return {
      error: new Error("Already interested"),
    };
  }

  return supabase
    .from("placement_interests")
    .insert({
      request_id: requestId,
      facility_id: facilityId,
      status: "interested",
    });
}