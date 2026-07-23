"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

export default function ReservationsPage() {
  const [reservations, setReservations] =
    useState<any[]>([]);

  const [role, setRole] =
    useState("");

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } =
      await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (data) {
      setRole(data.role);
    }
  }

  async function loadReservations() {
    const { data, error } =
      await supabase
        .from("reservations")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (data) {
      setReservations(data);
    }

    if (error) {
      console.log(error);
    }
  }

  async function updateStatus(
    id: string,
    status: string
  ) {
    /* UPDATE RESERVATION */
    const { data, error } =
      await supabase
        .from("reservations")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

    if (error) {
      alert(error.message);
      return;
    }

    /* SEND NOTIFICATION */
    if (data?.requested_by) {
      await supabase
        .from("notifications")
        .insert({
          user_id:
            data.requested_by,

          title:
            status === "approved"
              ? "Reservierung genehmigt"
              : "Reservierung abgelehnt",

          message:
            status === "approved"
              ? "Ihre Reservierungsanfrage wurde genehmigt."
              : "Ihre Reservierungsanfrage wurde abgelehnt.",

          is_read: false,
        });
    }

    loadReservations();
  }

  useEffect(() => {
    loadProfile();
    loadReservations();
  }, []);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          marginBottom: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "52px",
            fontWeight: "bold",
            marginBottom: "10px",
            color: "#111827",
          }}
        >
          Reservierungen
        </h1>

        <p
          style={{
            color: "#6b7280",
            fontSize: "20px",
          }}
        >
          Verwaltung aller
          Reservierungsanfragen
        </p>
      </div>

      {/* Empty State */}
      {reservations.length === 0 ? (
        <div style={cardStyle}>
          <h2
            style={{
              fontSize: "34px",
              fontWeight: "bold",
              marginBottom: "14px",
            }}
          >
            Keine Reservierungen
          </h2>

          <p
            style={{
              color: "#6b7280",
              fontSize: "18px",
            }}
          >
            Neue Reservierungen
            erscheinen hier automatisch.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "24px",
          }}
        >
          {reservations.map(
            (reservation) => (
              <div
                key={reservation.id}
                style={cardStyle}
              >
                {/* TOP */}
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "flex-start",
                    marginBottom:
                      "28px",
                    flexWrap: "wrap",
                    gap: "20px",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontSize:
                          "34px",
                        fontWeight:
                          "bold",
                        marginBottom:
                          "10px",
                        color:
                          "#111827",
                      }}
                    >
                      {
                        reservation.child_name
                      }
                    </h2>

                    <p
                      style={{
                        color:
                          "#6b7280",
                        fontSize:
                          "18px",
                      }}
                    >
                      Reservierungsanfrage
                    </p>
                  </div>

                  {/* STATUS */}
                  <div
                    style={{
                      padding:
                        "10px 18px",
                      borderRadius:
                        "14px",
                      fontWeight: 600,
                      fontSize: "14px",

                      background:
  reservation.status ===
  "approved"
    ? "#fed7aa"
                          : reservation.status ===
                            "rejected"
                          ? "#fee2e2"
                          : "#fef3c7",

                      color:
  reservation.status ===
  "approved"
    ? "#9a3412"
                          : reservation.status ===
                            "rejected"
                          ? "#991b1b"
                          : "#92400e",
                    }}
                  >
                    {reservation.status ===
"approved"
  ? "🟠 Reserviert"
  : reservation.status ===
    "rejected"
  ? "🔴 Abgelehnt"
  : reservation.status ===
    "placed"
  ? "✅ Vermittelt"
  : "🟡 Angefragt"}
                  </div>
                </div>

                {/* DETAILS */}
                <div
                  style={{
                    display: "flex",
                    gap: "14px",
                    flexWrap: "wrap",
                    marginBottom:
                      "28px",
                  }}
                >
                  <div
                    style={badgeStyle}
                  >
                    📅{" "}
                    {new Date(
                      reservation.created_at
                    ).toLocaleDateString()}
                  </div>

                  <div
                    style={badgeStyle}
                  >
                    ⚡{" "}
                    {reservation.urgency}
                  </div>
                </div>

                {/* NOTES */}
                {reservation.notes && (
                  <div
                    style={{
                      marginBottom:
                        "28px",
                      background:
                        "#f5f7fb",
                      padding:
                        "20px",
                      borderRadius:
                        "18px",
                    }}
                  >
                    <p
                      style={{
                        color:
                          "#374151",
                        lineHeight:
                          1.6,
                      }}
                    >
                      {
                        reservation.notes
                      }
                    </p>
                  </div>
                )}

                {/* ACTIONS */}
                {role ===
                  "einrichtung" &&
                  reservation.status ===
                    "pending" && (
                    <div
                      style={{
                        display: "flex",
                        gap: "14px",
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <button
                        onClick={() =>
                          updateStatus(
                            reservation.id,
                            "approved"
                          )
                        }
                        style={{
                          background:
                            "#16a34a",
                          color:
                            "white",
                          padding:
                            "14px 22px",
                          borderRadius:
                            "16px",
                          border:
                            "none",
                          fontWeight: 600,
                          cursor:
                            "pointer",
                        }}
                      >
                        Genehmigen
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(
                            reservation.id,
                            "rejected"
                          )
                        }
                        style={{
                          background:
                            "#dc2626",
                          color:
                            "white",
                          padding:
                            "14px 22px",
                          borderRadius:
                            "16px",
                          border:
                            "none",
                          fontWeight: 600,
                          cursor:
                            "pointer",
                        }}
                      >
                        Ablehnen
                      </button>
                    </div>
                  )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

const cardStyle = {
  background: "white",
  borderRadius: "32px",
  padding: "32px",
  boxShadow:
    "0 1px 3px rgba(0,0,0,0.08)",
};

const badgeStyle = {
  background: "#f5f7fb",
  padding: "10px 16px",
  borderRadius: "14px",
  fontSize: "14px",
  fontWeight: 600,
};