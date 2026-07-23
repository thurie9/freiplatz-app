import { supabase } from "@/lib/supabase";

export async function getPlacementInterests(requestId: string) {
  const { data, error } = await supabase
    .from("placement_interests")
    .select(`
      id,
      status,
      created_at,
      profiles!placement_interests_facility_id_fkey (
        id,
        name,
        city,
        phone,
        skillsets
      )
    `)
    .eq("request_id", requestId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}