"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FreePlacesPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");

  const [places, setPlaces] = useState<any[]>([]);

  async function loadPlaces() {
    const { data } = await supabase
      .from("free_places")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setPlaces(data);
    }
  }

  useEffect(() => {
    loadPlaces();

    const channel = supabase
      .channel("realtime free_places")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "free_places",
        },
        (payload) => {
          console.log("Realtime update:", payload);

          loadPlaces();
        }
      )
      .subscribe((status) => {
        console.log("Realtime status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function createPlace() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("free_places").insert({
      title,
      description,
      city,
      created_by: user?.id,
    });

    setTitle("");
    setDescription("");
    setCity("");

    loadPlaces();
  }

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-10">
        Freiplätze
      </h1>

      <div className="border rounded-2xl p-6 mb-10">
        <h2 className="text-2xl font-bold mb-4">
          Freiplatz erstellen
        </h2>

        <input
          type="text"
          placeholder="Titel"
          className="w-full border p-3 rounded mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Beschreibung"
          className="w-full border p-3 rounded mb-4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="text"
          placeholder="Stadt"
          className="w-full border p-3 rounded mb-4"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button
          onClick={createPlace}
          className="bg-black text-white px-6 py-3 rounded"
        >
          Speichern
        </button>
      </div>

      <div className="grid gap-6">
        {places.map((place) => (
          <div
            key={place.id}
            className="border rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold">
              {place.title}
            </h2>

            <p className="mt-2">
              {place.description}
            </p>

            <p className="mt-4 text-sm text-gray-500">
              {place.city}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}