"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import FacilityImpactCards from "./FacilityImpactCards";
import IncomingRequests from "./IncomingRequests";
import ChildrenInCare from "./ChildrenInCare";
import { getIncomingRequests } from "@/lib/placements/get-incoming-requests"; 

export default function EinrichtungDashboard() {

  const [impact, setImpact] = useState({
  childrenSupported: 0,
  notesThisWeek: 0,
  documentsThisWeek: 0,
  tasksToday: 0,
});

const [firstName, setFirstName] = useState("Kollege");

const [greeting, setGreeting] = useState("");

const [message, setMessage] = useState("");

const [places, setPlaces] = useState(0);

const [reservations, setReservations] = useState(0);

const [approved, setApproved] = useState(0);

const [activities, setActivities] = useState<any[]>([]);

const [requests, setRequests] = useState<PlacementRequest[]>([]);

 async function loadImpact() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const startOfWeek = new Date();

  startOfWeek.setDate(
    startOfWeek.getDate() -
      startOfWeek.getDay() +
      1,
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
      .eq("created_by", user.id),

    supabase
      .from("case_notes")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("created_by", user.id)
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
      .eq("uploaded_by", user.id)
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
      .eq("created_by", user.id)
      .eq("status", "open"),
  ]);

  setImpact({
    childrenSupported:
      children.count ?? 0,

    notesThisWeek:
      notes.count ?? 0,

    documentsThisWeek:
      documents.count ?? 0,

    tasksToday:
      tasks.count ?? 0,
  });
}

 async function loadWelcome() {

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const name =
        user?.user_metadata?.first_name ??
        "Kollege";

    setFirstName(name);

    const hour =
        new Date().getHours();

    if (hour < 12)
        setGreeting("Guten Morgen");

    else if (hour < 18)
        setGreeting("Guten Tag");

    else
        setGreeting("Guten Abend");

    setMessage(
        "Heute begleiten Sie Kinder und Familien auf ihrem Weg. Jede sorgfältige Dokumentation trägt dazu bei, fundierte Entscheidungen zu ermöglichen und Kontinuität in der Betreuung sicherzustellen."
    );

}

 async function loadStats() {
    const { count: placesCount } =
      await supabase
        .from("free_places")
        .select("*", {
          count: "exact",
          head: true,
        });

    const {
      count: reservationsCount,
    } = await supabase
      .from("reservations")
      .select("*", {
        count: "exact",
        head: true,
      });

    const {
      count: approvedCount,
    } = await supabase
      .from("reservations")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "approved");

    setPlaces(placesCount || 0);

    setReservations(
      reservationsCount || 0
    );

    setApproved(approvedCount || 0);
  }

  async function loadIncomingRequests() {
  const data = await getIncomingRequests();
  setRequests(data);
}

  async function loadActivities() {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(8);

    if (data) {
      setActivities(data);
    }
  }

 useEffect(() => {
  loadWelcome();
  loadStats();
  loadActivities();
  loadImpact();

  const channel = supabase
    .channel("dashboard realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "notifications",
      },
      () => {
        loadActivities();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

 return (

  <div>

    {/* HEADER */}
    <div
      style={{
        marginBottom: "70px",
      }}
    >
  <h1
    style={{
      fontSize: "46px",
      fontWeight: 500,
      color: "#111827",
      lineHeight: 1.1,
      marginBottom: "18px",
    }}
  >
    {greeting}, {firstName} 👋
  </h1>

  <div
    style={{
      color: "#4b5563",
      fontSize: "20px",
      lineHeight: 1.7,
      maxWidth: "900px",
      marginTop: "20px",
    }}
  >
    <p
      style={{
        margin: 0,
        marginBottom: "12px",
        fontWeight: 500,
      }}
    >
      Schön, dass Sie wieder da sind.
    </p>

    <p
      style={{
        margin: 0,
      }}
    >
      {message}
    </p>
  </div>
</div>

<div
  style={{
    marginBottom: "28px",
  }}
>
  <h2
    style={{
      fontSize: "36px",
      fontWeight: 700,
      color: "#111827",
      marginBottom: "8px",
    }}
  >
    Einrichtungsübersicht
  </h2>

  <p
    style={{
      color: "#6b7280",
      fontSize: "18px",
      margin: 0,
    }}
  >
    Ihre aktuellen Aufgaben, Aktivitäten und Prioritäten auf einen Blick.
  </p>
</div>

<FacilityImpactCards
  childrenSupported={
    impact.childrenSupported
  }
  notesThisWeek={
    impact.notesThisWeek
  }
  documentsThisWeek={
    impact.documentsThisWeek
  }
  tasksToday={
    impact.tasksToday
  }
/>

<div>
    Kinder in Betreuung
</div>

      {/* ACTIVITY FEED */}
      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "34px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              Aktivitätsfeed
            </h2>

            <p
              style={{
                color: "#6b7280",
                fontSize: "18px",
              }}
            >
              Realtime Plattformaktivitäten
            </p>
          </div>

          <div
            style={{
              width: "12px",
              height: "12px",
              background: "#16a34a",
              borderRadius: "999px",
            }}
          />
        </div>

        {/* ACTIVITIES */}
        <div
          style={{
            display: "grid",
            gap: "18px",
          }}
        >
          {activities.length ===
          0 ? (
            <div
              style={{
                background:
                  "#f5f7fb",
                padding: "24px",
                borderRadius:
                  "20px",
              }}
            >
              <p
                style={{
                  color:
                    "#6b7280",
                  fontSize:
                    "16px",
                }}
              >
                Noch keine Aktivitäten
                vorhanden.
              </p>
            </div>
          ) : (
            activities.map(
              (activity) => (
                <div
                  key={activity.id}
                  style={{
                    background:
                      "#f5f7fb",
                    padding:
                      "22px",
                    borderRadius:
                      "20px",

                    display: "flex",
                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",

                    gap: "20px",

                    flexWrap:
                      "wrap",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize:
                          "18px",
                        fontWeight:
                          "bold",
                        marginBottom:
                          "8px",
                      }}
                    >
                      {
                        activity.title
                      }
                    </h3>

                    <p
                      style={{
                        color:
                          "#6b7280",
                        lineHeight:
                          1.5,
                      }}
                    >
                      {
                        activity.message
                      }
                    </p>
                  </div>

                  <div
                    style={{
                      color:
                        "#9ca3af",
                      fontSize:
                        "14px",
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {new Date(
                      activity.created_at
                    ).toLocaleString(
                      "de-DE"
                    )}
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
  }

  const cardStyle = {
  background: "white",
  borderRadius: "32px",
  padding: "32px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
};

const badgeStyle = {
  background: "#f5f7fb",
  padding: "10px 16px",
  borderRadius: "14px",
  fontSize: "14px",
  fontWeight: 600,
  width: "fit-content",
};