"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function calculateMatch(
  requestSkills: string[] = [],
  facilitySkills: string[] = []
) {
  if (
    requestSkills.length === 0
  )
    return 0;

  const matches =
    requestSkills.filter(
      (skill) =>
        facilitySkills.includes(
          skill
        )
    ).length;

  return Math.round(
    (matches /
      requestSkills.length) *
      100
  );
}

function getInterestedFacilities(
  requestId: string,
  interests: any[]
) {
  return interests.filter(
    (interest) =>
      interest.request_id === requestId
  );
}

const availableSkillsets = [
  "Traumapädagogik",
  "Psychologische Betreuung",
  "Krisenintervention",
  "Inklusion",
  "Autismus",
  "ADHS",
  "Familienhilfe",
  "Jugendcoaching",
  "Suchtberatung",
  "Notfallaufnahme",
];

const placementTypes = [
  "Stationär",
  "Betreutes Wohnen",
  "Intensivpädagogisch",
  "Krisenplatz",
  "Inobhutnahme",
  "Ambulant",
];

type PlacementRequest = {
  id: string;
  case_number: string;
  age: number;
  gender: string;
  location: string;
  urgency: string;
  placement_type: string;
  required_skillsets: string[];
  description: string;
  status: string;
};

export default function PlacementRequestsPage() {
  const [requests, setRequests] = useState<
    PlacementRequest[]
  >([]);

  const [profile, setProfile] =
    useState<any>(null);

const [facilities, setFacilities] =
  useState<any[]>([]);

const [interests, setInterests] =
  useState<any[]>([]);

const [currentUserId, setCurrentUserId] =
  useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [age, setAge] =
    useState("");

  const [gender, setGender] =
    useState("female");

  const [location, setLocation] =
    useState("");

  const [urgency, setUrgency] =
    useState("medium");

  const [placementType, setPlacementType] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [skills, setSkills] =
    useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

setCurrentUserId(user.id);

    const { data: userProfile } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    setProfile(userProfile);

    const { data: facilityData } =
  await supabase
    .from("profiles")
    .select("*")
    .eq("role", "einrichtung");

setFacilities(
  facilityData || []
);

    const { data } =
      await supabase
        .from("placement_requests")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    const { data: interestData } =
  await supabase
    .from("placement_interests_view")
    .select("*");

setInterests(
  interestData || []
);

setRequests(data || []);
  }

  function generateCaseNumber() {
    const year =
      new Date().getFullYear();

    const random = Math.floor(
      1000 + Math.random() * 9000
    );

    return `JK-${year}-${random}`;
  }

  async function createRequest() {
    if (
      !age ||
      !location ||
      !placementType
    ) {
      alert(
        "Bitte alle Pflichtfelder ausfüllen."
      );
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } =
      await supabase
        .from("placement_requests")
        .insert({
          created_by: user.id,
          case_number:
            generateCaseNumber(),
          age: Number(age),
          gender,
          location,
          urgency,
          placement_type:
            placementType,
          required_skillsets:
            skills,
          description,
        });

    if (error) {
      alert(error.message);
      return;
    }

    setShowModal(false);

    setAge("");
    setLocation("");
    setDescription("");
    setPlacementType("");
    setSkills([]);

    loadData();
  }

  async function expressInterest(
  requestId: string
) {
  const alreadyInterested =
    interests.some(
      (interest) =>
        interest.request_id === requestId &&
        interest.facility_id ===
          currentUserId
    );

  if (alreadyInterested) {
    alert(
      "Interesse wurde bereits bekundet."
    );
    return;
  }

  const { error } =
    await supabase
      .from("placement_interests")
      .insert({
        request_id: requestId,
        facility_id: currentUserId,
      });

  if (error) {
    alert(error.message);
    return;
  }

  loadData();
}

  console.log(facilities);

  return (
    <div>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "35px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "48px",
              fontWeight: 700,
            }}
          >
            Platzanfragen
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: "10px",
            }}
          >
            Anonyme Fallanfragen
            und Vermittlungen
          </p>
        </div>

        {profile?.role ===
          "jugendamt" && (
          <button
            onClick={() =>
              setShowModal(true)
            }
            style={{
              background:
                "linear-gradient(135deg,#0f172a,#1e3a8a)",
              color: "white",
              border: "none",
              padding:
                "16px 24px",
              borderRadius:
                "16px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            + Neue Anfrage
          </button>
        )}
      </div>

      {/* REQUEST LIST */}
      <div
        style={{
          display: "grid",
          gap: "20px",
        }}
      >
        {requests.length === 0 ? (
          <div
            style={{
              background:
                "white",
              padding: "40px",
              borderRadius:
                "24px",
            }}
          >
            Noch keine
            Platzanfragen
            vorhanden.
          </div>
        ) : (
          requests.map(
            (request) => (
              <div
                key={request.id}
                style={{
                  background:
                    "white",
                  padding: "28px",
                  borderRadius:
                    "24px",
                }}
              >
                <h2>
                  {
                    request.case_number
                  }
                </h2>

                <p>
                  {request.age} Jahre
                </p>

                <p>
                  📍{" "}
                  {
                    request.location
                  }
                </p>

                <p>
                  {
                    request.placement_type
                  }
                </p>

                <p>
  Status:
  <strong>
    {request.status === "open"
      ? " 🟢 Offen"
      : request.status === "placed"
      ? " 🔵 Vermittelt"
      : request.status === "closed"
      ? " ⚫ Geschlossen"
      : request.status}
  </strong>
</p>

                <p>
  Dringlichkeit:
  <strong>
    {request.urgency === "emergency"
      ? " 🔴 Notfall"
      : request.urgency === "high"
      ? " 🟠 Hoch"
      : request.urgency === "medium"
      ? " 🟡 Mittel"
      : " ⚪ Niedrig"}
  </strong>
</p>

                <p>
                  Skillsets:
                </p>

                <p>
  {request.required_skillsets?.join(", ")}
</p>

<div
  style={{
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "1px solid #e5e7eb",
  }}
>
  <p
    style={{
      fontWeight: 700,
      marginBottom: "12px",
    }}
  >
    Top Matches
  </p>

  {facilities
    .map((facility) => ({
      ...facility,
      score: calculateMatch(
        request.required_skillsets,
        facility.skillsets
      ),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((facility) => (
      <div
        key={facility.id}
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "6px 0",
        }}
      >
        <span>{facility.name}</span>

        <strong>
          {facility.score}%
        </strong>
      </div>
    ))}
</div>

<div
  style={{
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "1px solid #e5e7eb",
  }}
>
  <p
    style={{
      fontWeight: 700,
      marginBottom: "10px",
    }}
  >
    Interessierte Einrichtungen
  </p>

  {getInterestedFacilities(
    request.id,
    interests
  ).length === 0 ? (
    <p>
      Noch keine Interessenbekundungen
    </p>
  ) : (
    getInterestedFacilities(
      request.id,
      interests
    ).map((interest) => (
      <div key={interest.id}>
        ✓ {interest.facility_name}
      </div>
    ))
  )}
</div>

{profile?.role ===
  "einrichtung" && (
  <div
    style={{
      marginTop: "20px",
    }}
  >
    <button
      onClick={() =>
        expressInterest(
          request.id
        )
      }
      style={{
        background:
          "#1e3a8a",
        color: "white",
        border: "none",
        padding:
          "12px 20px",
        borderRadius:
          "12px",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      Interesse bekunden
    </button>
  </div>
)}

              </div>
            )
          )
        )}
      </div>


      {/* MODAL */}
      {showModal && (
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
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background:
                "white",
              width: "800px",
              maxWidth: "95%",
              borderRadius:
                "30px",
              padding: "40px",
              maxHeight:
                "90vh",
              overflowY: "auto",
            }}
          >
            <h2
              style={{
                marginBottom:
                  "30px",
              }}
            >
              Neue
              Platzanfrage
            </h2>

            <div
              style={{
                display: "grid",
                gap: "16px",
              }}
            >
              <input
                placeholder="Alter"
                value={age}
                onChange={(e) =>
                  setAge(
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
                <option value="female">
                  Weiblich
                </option>

                <option value="male">
                  Männlich
                </option>

                <option value="diverse">
                  Divers
                </option>
              </select>

              <input
                placeholder="Region"
                value={location}
                onChange={(e) =>
                  setLocation(
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
                <option value="low">
                  Niedrig
                </option>

                <option value="medium">
                  Mittel
                </option>

                <option value="high">
                  Hoch
                </option>

                <option value="emergency">
                  Notfall
                </option>
              </select>

              <select
                value={
                  placementType
                }
                onChange={(e) =>
                  setPlacementType(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Unterbringungsart
                </option>

                {placementTypes.map(
                  (
                    type
                  ) => (
                    <option
                      key={type}
                    >
                      {type}
                    </option>
                  )
                )}
              </select>

              <div>
                <p
                  style={{
                    marginBottom:
                      "12px",
                    fontWeight: 600,
                  }}
                >
                  Skillsets
                </p>

                <div
                  style={{
                    display:
                      "flex",
                    flexWrap:
                      "wrap",
                    gap: "10px",
                  }}
                >
                  {availableSkillsets.map(
                    (
                      skill
                    ) => {
                      const selected =
                        skills.includes(
                          skill
                        );

                      return (
                        <button
                          key={
                            skill
                          }
                          type="button"
                          onClick={() => {
                            if (
                              selected
                            ) {
                              setSkills(
                                skills.filter(
                                  (
                                    s
                                  ) =>
                                    s !==
                                    skill
                                )
                              );
                            } else {
                              setSkills(
                                [
                                  ...skills,
                                  skill,
                                ]
                              );
                            }
                          }}
                          style={{
                            padding:
                              "10px 16px",
                            borderRadius:
                              "999px",
                            border:
                              "none",
                            cursor:
                              "pointer",
                            background:
                              selected
                                ? "#1e3a8a"
                                : "#e2e8f0",
                            color:
                              selected
                                ? "white"
                                : "#0f172a",
                          }}
                        >
                          {
                            skill
                          }
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <textarea
                placeholder="Anonyme Beschreibung"
                value={
                  description
                }
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                style={{
                  minHeight:
                    "140px",
                }}
              />

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "flex-end",
                  gap: "12px",
                }}
              >
                <button
                  onClick={() =>
                    setShowModal(
                      false
                    )
                  }
                >
                  Abbrechen
                </button>

                <button
                  onClick={
                    createRequest
                  }
                  style={{
                    background:
                      "#1e3a8a",
                    color:
                      "white",
                    border:
                      "none",
                    padding:
                      "12px 20px",
                    borderRadius:
                      "12px",
                  }}
                >
                  Anfrage
                  erstellen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}