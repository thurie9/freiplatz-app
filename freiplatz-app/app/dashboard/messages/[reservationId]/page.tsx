"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

import { use } from "react";

export default function MessagesPage({
  params,
}: {
  params: Promise<{
    reservationId: string;
  }>;
}) {
  const resolvedParams = use(params);

  const reservationId =
    resolvedParams.reservationId;

  const [messages, setMessages] =
    useState<any[]>([]);

  const [documents, setDocuments] =
    useState<any[]>([]);

  const [message, setMessage] =
    useState("");

  const [file, setFile] =
    useState<File | null>(null);

  async function loadMessages() {
    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        profiles (
          email
        )
      `)
      .eq(
        "reservation_id",
        reservationId
      )
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

  async function loadDocuments() {
    const { data, error } =
      await supabase
        .from("documents")
        .select("*")
        .eq(
          "reservation_id",
          reservationId
        )
        .order("created_at", {
          ascending: false,
        });

    if (data) {
      setDocuments(data);
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

    const { error } = await supabase
      .from("messages")
      .insert({
        reservation_id:
          reservationId,
        sender_id: user.id,
        message,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setMessage("");
  }

  async function uploadFile() {
    if (!file) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const filePath =
      `${Date.now()}-${file.name}`;

    const {
      error: uploadError,
    } = await supabase.storage
      .from("documents")
      .upload(filePath, file);

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("documents")
      .getPublicUrl(filePath);

    const { error } = await supabase
      .from("documents")
      .insert({
        reservation_id:
          reservationId,
        uploaded_by: user.id,
        file_name: file.name,
        file_url: publicUrl,
      });

    if (error) {
      alert(error.message);
    } else {
      alert("Datei hochgeladen");

      loadDocuments();
    }
  }

  useEffect(() => {
    loadMessages();
    loadDocuments();

    const channel = supabase
      .channel(
        "realtime messages"
      )
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
    <div className="h-[85vh] flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-5xl font-bold text-[#111827]">
          Nachrichten
        </h1>

        <p className="text-gray-500 mt-2">
          Realtime Kommunikation
        </p>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-3xl p-6 border shadow-sm mb-6">
        <h2 className="text-2xl font-bold mb-4">
          Dokumente
        </h2>

        <div className="grid gap-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex justify-between items-center border rounded-2xl p-4"
            >
              <div>
                <p className="font-semibold">
                  {doc.file_name}
                </p>
              </div>

              <a
                href={doc.file_url}
                target="_blank"
                rel="noreferrer"
                className="bg-black text-white px-4 py-2 rounded-xl hover:opacity-90 transition"
              >
                Download
              </a>
            </div>
          ))}
        </div>

        {/* Upload */}
        <div className="flex gap-4 mt-6">
          <input
            type="file"
            onChange={(e) =>
              setFile(
                e.target.files?.[0] ||
                  null
              )
            }
            className="border rounded-xl p-3 bg-white"
          />

          <button
            onClick={uploadFile}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:opacity-90 transition"
          >
            Datei hochladen
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-3xl border shadow-sm flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f9fafb]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="flex justify-start"
            >
              <div className="max-w-[75%] rounded-3xl px-6 py-5 shadow-sm bg-white border">
                <p className="text-xs font-semibold mb-3 text-gray-500">
                  {msg.profiles?.email}
                </p>

                <p className="leading-relaxed text-base text-[#111827]">
                  {msg.message}
                </p>

                <p className="text-xs mt-4 text-gray-400">
                  {new Date(
                    msg.created_at
                  ).toLocaleTimeString(
                    "de-DE",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t p-5 bg-white flex gap-4 items-center">
          <input
            type="text"
            placeholder="Nachricht schreiben..."
            className="flex-1 border rounded-2xl p-4 bg-[#f9fafb]"
            value={message || ""}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
          />

          <button
            onClick={sendMessage}
            className="bg-black text-white px-8 py-4 rounded-2xl hover:opacity-90 transition shadow-sm"
          >
            Senden
          </button>
        </div>
      </div>
    </div>
  );
}