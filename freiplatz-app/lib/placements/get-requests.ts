import { supabase } from "@/lib/supabase";

export async function getPlacementRequest(id: string) {
    return supabase
        .from("placement_requests")
        .select("*")
        .eq("id", id)
        .single();
}