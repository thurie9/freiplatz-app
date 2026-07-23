"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<any[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } =
      await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

    setNotifications(data || []);
  }

  async function markAsRead(
    id: string
  ) {
    await supabase
      .from("notifications")
      .update({
        is_read: true,
      })
      .eq("id", id);

    loadNotifications();
  }

  return (
    <div>
      <h1
        style={{
          fontSize: "48px",
          fontWeight: 700,
          marginBottom: "30px",
        }}
      >
        Benachrichtigungen
      </h1>

      <div
        style={{
          display: "grid",
          gap: "16px",
        }}
      >
        {notifications.length ===
        0 ? (
          <div
            style={{
              background:
                "white",
              padding: "30px",
              borderRadius:
                "20px",
            }}
          >
            Keine
            Benachrichtigungen
            vorhanden.
          </div>
        ) : (
          notifications.map(
            (
              notification
            ) => (
              <div
                key={
                  notification.id
                }
                style={{
  background:
    notification.is_read
      ? "white"
      : "#eff6ff",

  border:
    notification.is_read
      ? "1px solid #e5e7eb"
      : "1px solid #bfdbfe",

  padding: "24px",

  borderRadius: "20px",

  transition:
    "all 0.2s ease",
}}
              >
                <h3>
                  {
                    notification.title
                  }
                </h3>

<div
  style={{
    marginTop: "6px",
    marginBottom: "12px",
    fontSize: "13px",
    fontWeight: 600,
    color:
      notification.is_read
        ? "#64748b"
        : "#2563eb",
  }}
>
  {notification.is_read
    ? "Gelesen"
    : "Neu"}
</div>

                <p>
                  {
                    notification.message
                  }
                </p>

<p
  style={{
    marginTop: "12px",
    fontSize: "13px",
    color: "#64748b",
  }}
>
  {new Date(
    notification.created_at
  ).toLocaleString("de-DE")}
</p>

                {!notification.is_read && (
                  <button
                    onClick={() =>
                      markAsRead(
                        notification.id
                      )
                    }
                    style={{
                      marginTop:
                        "12px",
                      background:
                        "#1e3a8a",
                      color:
                        "white",
                      border:
                        "none",
                      padding:
                        "10px 16px",
                      borderRadius:
                        "10px",
                    }}
                  >
                    Als gelesen
                    markieren
                  </button>
                )}
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}