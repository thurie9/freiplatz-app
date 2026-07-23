"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const reservationId =
    "422fda90-4254-440e-becd-946493ba72f7";

  async function loadMessages() {
    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        profiles (
          email
        )
      `)
      .eq("reservation_id", reservationId)
      .order("created_at", {
        ascending: true,
      });

    if (data) {
      setMessages(data);
    }

    if (error) {
      console.log(error);
    }
  }

  async function sendMessage() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("messages")
      .insert({
        reservation_id: reservationId,
        sender_id: user.id,
        message,
      });

    setMessage("");
  }

  useEffect(() => {
    loadMessages();

    const channel = supabase
      .channel("realtime messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-10">
        Nachrichten
      </h1>

      <div className="bg-white rounded-2xl p-6">
        <div className="grid gap-4 mb-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="border rounded-xl p-4"
            >
              <p className="font-bold">
                {msg.profiles?.email}
              </p>

              <p className="mt-2">
                {msg.message}
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Nachricht"
            className="flex-1 border p-3 rounded"
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
          />

          <button
            onClick={sendMessage}
            style={{
              backgroundColor: "black",
              color: "white",
              padding: "12px 20px",
              borderRadius: "10px",
            }}
          >
            Senden
          </button>
        </div>
      </div>
    </main>
  );
}