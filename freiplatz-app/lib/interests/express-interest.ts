import { supabase } from "@/lib/supabase";

export async function expressInterest(requestId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  // Prevent duplicates
  const { data: existing } = await supabase
    .from("placement_interests")
    .select("id")
    .eq("request_id", requestId)
    .eq("facility_id", user.id)
    .maybeSingle();

  if (existing) {
    return { success: true, alreadyInterested: true };
  }

  const { error } = await supabase
    .from("placement_interests")
    .insert({
      request_id: requestId,
      facility_id: user.id,
      status: "interested",
    });

  if (error) {
    throw error;
  }

  return {
    success: true,
    alreadyInterested: false,
  };
}