"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

export default function FreePlacesPage() {
  const [places, setPlaces] =
    useState<any[]>([]);

  const [role, setRole] =
    useState("");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [showReserveModal, setShowReserveModal] =
    useState(false);

  const [selectedPlace, setSelectedPlace] =
    useState<any>(null);

  // FILTERS
  const [search, setSearch] =
    useState("");

  const [genderFilter, setGenderFilter] =
    useState("all");

  // CREATE PLACE
  const [title, setTitle] =
    useState("");

  const [city, setCity] =
    useState("");

  const [ageFrom, setAgeFrom] =
    useState("");

  const [ageTo, setAgeTo] =
    useState("");

  const [gender, setGender] =
    useState("all");

  // RESERVATION
  const [childName, setChildName] =
    useState("");

  const [childAge, setChildAge] =
    useState("");

  const [reservationCity, setReservationCity] =
    useState("");

  const [urgency, setUrgency] =
    useState("normal");

  const [notes, setNotes] =
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

  async function loadPlaces() {
    const { data } = await supabase
      .from("free_places")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (data) {
      setPlaces(data);
    }
  }

  async function createPlace() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("free_places")
      .insert({
        title,
        city,
        age_from: ageFrom,
        age_to: ageTo,
        gender,
        created_by: user.id,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setShowCreateModal(false);

    setTitle("");
    setCity("");
    setAgeFrom("");
    setAgeTo("");
    setGender("all");

    loadPlaces();
  }

  async function createReservation() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !selectedPlace)
      return;

    const { error } = await supabase
      .from("reservations")
      .insert({
        free_place_id:
          selectedPlace.id,

        child_name: childName,

        child_age: childAge,

        city: reservationCity,

        urgency,

        notes,

        status: "pending",

        created_by: user.id,
      });

    if (error) {
      alert(error.message);
      return;
    }

    const {
      data: freePlaceOwner,
    } = await supabase
      .from("free_places")
      .select("created_by")
      .eq("id", selectedPlace.id)
      .single();

    if (freePlaceOwner) {
      await supabase
        .from("notifications")
        .insert({
          user_id:
            freePlaceOwner.created_by,

          title:
            "Neue Reservierung",

          message: `${childName} hat eine neue Reservierungsanfrage gesendet.`,

          read: false,
        });
    }

    setShowReserveModal(false);

    setChildName("");
    setChildAge("");
    setReservationCity("");
    setUrgency("normal");
    setNotes("");
  }

  const filteredPlaces =
    useMemo(() => {
      return places.filter((place) => {
        const matchesSearch =
          place.city
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          place.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesGender =
          genderFilter ===
            "all" ||
          place.gender ===
            genderFilter;

        return (
          matchesSearch &&
          matchesGender
        );
      });
    }, [
      places,
      search,
      genderFilter,
    ]);

  useEffect(() => {
    loadProfile();
    loadPlaces();
  }, []);

  return (
    <div>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "40px",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "52px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Freiplätze
          </h1>

          <p
            style={{
              color: "#6b7280",
              fontSize: "20px",
            }}
          >
            Verfügbare Plätze und
            Vermittlungen
          </p>
        </div>

        {role ===
          "einrichtung" && (
          <button
            onClick={() =>
              setShowCreateModal(true)
            }
            style={primaryButton}
          >
            + Freiplatz erstellen
          </button>
        )}
      </div>

      {/* FILTERS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "2fr 1fr",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <input
          placeholder="Nach Stadt oder Titel suchen..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <select
          value={genderFilter}
          onChange={(e) =>
            setGenderFilter(
              e.target.value
            )
          }
        >
          <option value="all">
            Alle Geschlechter
          </option>

          <option value="male">
            Jungen
          </option>

          <option value="female">
            Mädchen
          </option>
        </select>
      </div>

      {/* RESULTS */}
      <p
        style={{
          color: "#6b7280",
          marginBottom: "24px",
        }}
      >
        {filteredPlaces.length} Plätze
        gefunden
      </p>

      {/* LIST */}
      <div
        style={{
          display: "grid",
          gap: "24px",
        }}
      >
        {filteredPlaces.map(
          (place) => {
            const matchScore =
              Math.floor(
                Math.random() *
                  21
              ) + 80;

            return (
              <div
                key={place.id}
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
                      "24px",
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
                      }}
                    >
                      {place.title}
                    </h2>

                    <p
                      style={{
                        color:
                          "#6b7280",
                        fontSize:
                          "18px",
                      }}
                    >
                      📍 {place.city}
                    </p>
                  </div>

                  <div
                    style={{
                      display:
                        "flex",
                      gap: "12px",
                      alignItems:
                        "center",
                      flexWrap:
                        "wrap",
                    }}
                  >
                    <div
                      style={{
                        background:
                          "#dbeafe",
                        color:
                          "#1e3a8a",
                        padding:
                          "10px 16px",
                        borderRadius:
                          "14px",
                        fontWeight: 700,
                      }}
                    >
                      Match{" "}
                      {matchScore}%
                    </div>

                    <div
                      style={{
                        background:
                          "#dcfce7",
                        color:
                          "#166534",
                        padding:
                          "10px 16px",
                        borderRadius:
                          "14px",
                        fontWeight: 600,
                      }}
                    >
                      Verfügbar
                    </div>
                  </div>
                </div>

                {/* BADGES */}
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
                    style={
                      badgeStyle
                    }
                  >
                    👦{" "}
                    {place.age_from} -
                    {place.age_to} Jahre
                  </div>

                  <div
                    style={
                      badgeStyle
                    }
                  >
                    ⚧ {place.gender}
                  </div>
                </div>

                {/* ACTIONS */}
                {role ===
                  "jugendamt" && (
                  <button
                    onClick={() => {
                      setSelectedPlace(
                        place
                      );

                      setShowReserveModal(
                        true
                      );
                    }}
                    style={
                      primaryButton
                    }
                  >
                    Reservieren
                  </button>
                )}
              </div>
            );
          }
        )}
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <Modal>
          <h2 style={modalTitle}>
            Freiplatz erstellen
          </h2>

          <div style={formGrid}>
            <input
              placeholder="Titel"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
            />

            <input
              placeholder="Stadt"
              value={city}
              onChange={(e) =>
                setCity(
                  e.target.value
                )
              }
            />

            <input
              placeholder="Alter von"
              value={ageFrom}
              onChange={(e) =>
                setAgeFrom(
                  e.target.value
                )
              }
            />

            <input
              placeholder="Alter bis"
              value={ageTo}
              onChange={(e) =>
                setAgeTo(
                  e.target.value
                )
              }
            />

            <select
              value={gender}
              onChange={(e) =>
                setGender(
                  e.target.value
                )
              }
            >
              <option value="all">
                Alle
              </option>

              <option value="male">
                Jungen
              </option>

              <option value="female">
                Mädchen
              </option>
            </select>

            <button
              onClick={createPlace}
              style={primaryButton}
            >
              Speichern
            </button>
          </div>
        </Modal>
      )}

      {/* RESERVE MODAL */}
      {showReserveModal && (
        <Modal>
          <h2 style={modalTitle}>
            Reservierung erstellen
          </h2>

          <div style={formGrid}>
            <input
              placeholder="Name des Kindes"
              value={childName}
              onChange={(e) =>
                setChildName(
                  e.target.value
                )
              }
            />

            <input
              placeholder="Alter des Kindes"
              value={childAge}
              onChange={(e) =>
                setChildAge(
                  e.target.value
                )
              }
            />

            <input
              placeholder="Stadt"
              value={reservationCity}
              onChange={(e) =>
                setReservationCity(
                  e.target.value
                )
              }
            />

            <select
              value={urgency}
              onChange={(e) =>
                setUrgency(
                  e.target.value
                )
              }
            >
              <option value="normal">
                Normal
              </option>

              <option value="urgent">
                Dringend
              </option>

              <option value="emergency">
                Notfall
              </option>
            </select>

            <textarea
              placeholder="Notizen"
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              style={{
                minHeight:
                  "140px",
                padding: "18px",
                borderRadius:
                  "18px",
                border: "none",
                background:
                  "#f5f7fb",
                resize: "none",
              }}
            />

            <button
              onClick={
                createReservation
              }
              style={primaryButton}
            >
              Reservierung senden
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent:
          "center",
        alignItems: "center",
        zIndex: 100,
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "32px",
          padding: "40px",
          width: "100%",
          maxWidth: "700px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

const formGrid = {
  display: "grid",
  gap: "20px",
};

const modalTitle = {
  fontSize: "36px",
  fontWeight: "bold",
  marginBottom: "30px",
};

const primaryButton = {
  background: "#111827",
  color: "white",
  padding: "16px 24px",
  borderRadius: "18px",
  border: "none",
  fontWeight: 600,
  cursor: "pointer",
};

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