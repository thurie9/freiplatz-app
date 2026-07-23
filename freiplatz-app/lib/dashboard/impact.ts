import { createClient } from "@/lib/supabase/client";

export interface DashboardImpact {
  childrenSupported: number;
  notesThisWeek: number;
  documentsThisWeek: number;
  tasksToday: number;
}

export async function getDashboardImpact(
  userId: string,
): Promise<DashboardImpact> {

  const supabase = createClient();

  const startOfWeek = new Date();

  startOfWeek.setDate(
    startOfWeek.getDate() - startOfWeek.getDay() + 1,
  );

  startOfWeek.setHours(0, 0, 0, 0);

  const [
    children,
    notes,
    documents,
    tasks,
  ] = await Promise.all([

    supabase
      .from("child_records")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("created_by", userId),

    supabase
      .from("case_notes")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("created_by", userId)
      .gte(
        "created_at",
        startOfWeek.toISOString(),
      ),

    supabase
      .from("case_documents")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("uploaded_by", userId)
      .gte(
        "created_at",
        startOfWeek.toISOString(),
      ),

    supabase
      .from("placement_requests")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("created_by", userId)
      .eq("status", "open"),

  ]);

  return {

    childrenSupported:
      children.count ?? 0,

    notesThisWeek:
      notes.count ?? 0,

    documentsThisWeek:
      documents.count ?? 0,

    tasksToday:
      tasks.count ?? 0,

  };

}