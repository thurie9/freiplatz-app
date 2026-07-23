// lib/dashboard/jugendamt.ts

import type { JugendamtDashboardData } from "./types";

export async function getJugendamtDashboard(
  userId: string,
): Promise<JugendamtDashboardData> {

  // TODO: Replace with Supabase queries

  return {
    impact: {
      childrenSupported: 0,
      notesThisWeek: 0,
      documentsThisWeek: 0,
      tasksToday: 0,
    },

    priorities: [],

    childrenInFocus: [],

    activities: [],
  };
}