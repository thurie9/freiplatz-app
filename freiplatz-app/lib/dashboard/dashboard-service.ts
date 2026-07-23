import { getJugendamtDashboard } from "./jugendamt";
import { getEinrichtungDashboard } from "./einrichtung";

import type {
  JugendamtDashboardData,
  EinrichtungDashboardData,
} from "./types";

import type { UserRole } from "@/lib/auth/profile";

export async function getEinrichtungDashboard(
  userId: string,
): Promise<EinrichtungDashboardData> {

  const incomingRequests = await getIncomingRequests();

  return {
    impact: {
      availablePlaces: 0,
      childrenInCare: 0,
      openRequests: incomingRequests.length,
      pendingDocumentation: 0,
    },

    incomingRequests,

    childrenInCare: [],

    activities: [],
  };
}