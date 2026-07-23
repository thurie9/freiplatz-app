"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ChildRecord = {
  id: string;
  case_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  placement_status: string;
};

export default function CasesPage() {
  const router = useRouter();

  const [cases, setCases] =
    useState<ChildRecord[]>([]);

  const [showModal, setShowModal] =
    useState(false);

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [dateOfBirth, setDateOfBirth] =
    useState("");

  useEffect(() => {
    loadCases();
  }, []);

  async function loadCases() {
    const { data } = await supabase
      .from("child_records")
      .select("*")
      .eq("is_archived", false)
      .order("created_at", {
        ascending: false,
      });

    setCases(data || []);
  }

  function generateCaseNumber() {
    const year =
      new Date().getFullYear();

    const random = Math.floor(
      1000 + Math.random() * 9000
    );

    return `JK-${year}-${random}`;
  }

  async function createCase() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    if (!firstName || !lastName) {
      alert(
        "Bitte Vor- und Nachname eingeben."
      );
      return;
    }

    const { error } =
      await supabase
        .from("child_records")
        .insert({
          case_number:
            generateCaseNumber(),
          first_name: firstName,
          last_name: lastName,
          date_of_birth:
            dateOfBirth || null,
          placement_status:
            "offen",
          created_by: user.id,
        });

    if (error) {
      alert(error.message);
      return;
    }

    setShowModal(false);

    setFirstName("");
    setLastName("");
    setDateOfBirth("");

    loadCases();
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            fontWeight: 700,
          }}
        >
          Fallakten
        </h1>

        <button
          onClick={() =>
            setShowModal(true)
          }
          style={{
            background:
              "#1e3a8a",
            color: "white",
            border: "none",
            padding:
              "14px 24px",
            borderRadius:
              "14px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          + Neue Fallakte
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gap: "20px",
        }}
      >
        {cases.length === 0 ? (
          <div
            style={{
              background:
                "white",
              padding: "30px",
              borderRadius:
                "20px",
            }}
          >
            Noch keine
            Fallakten vorhanden.
          </div>
        ) : (
          cases.map((child) => (
            <div
              key={child.id}
              style={{
                background:
                  "white",
                padding: "24px",
                borderRadius:
                  "20px",
              }}
            >
              <h2>
                {
                  child.case_number
                }
              </h2>

              <p>
                {child.first_name}{" "}
                {child.last_name}
              </p>

              <p>
                Status:
                {" "}
                <strong>
                  {
                    child.placement_status
                  }
                </strong>
              </p>

              <button
                onClick={() =>
                  router.push(
                    `/dashboard/cases/${child.id}`
                  )
                }
                style={{
                  background:
                    "#1e3a8a",
                  color:
                    "white",
                  border:
                    "none",
                  padding:
                    "10px 18px",
                  borderRadius:
                    "10px",
                  cursor:
                    "pointer",
                }}
              >
                Fall öffnen
              </button>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div
          style={{
            position:
              "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.5)",
            display:
              "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background:
                "white",
              width: "600px",
              maxWidth:
                "95%",
              borderRadius:
                "24px",
              padding: "30px",
              position:
                "relative",
            }}
          >
            <button
              onClick={() =>
                setShowModal(
                  false
                )
              }
              style={{
                position:
                  "absolute",
                top: "15px",
                right: "15px",
                border:
                  "none",
                background:
                  "none",
                cursor:
                  "pointer",
                fontSize:
                  "22px",
              }}
            >
              ✕
            </button>

            <h2>
              Neue Fallakte
            </h2>

            <div
              style={{
                display:
                  "grid",
                gap: "15px",
                marginTop:
                  "20px",
              }}
            >
              <input
                placeholder="Vorname"
                value={
                  firstName
                }
                onChange={(e) =>
                  setFirstName(
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Nachname"
                value={
                  lastName
                }
                onChange={(e) =>
                  setLastName(
                    e.target.value
                  )
                }
              />

              <input
                type="date"
                value={
                  dateOfBirth
                }
                onChange={(e) =>
                  setDateOfBirth(
                    e.target.value
                  )
                }
              />

              <button
                onClick={
                  createCase
                }
                style={{
                  background:
                    "#1e3a8a",
                  color:
                    "white",
                  border:
                    "none",
                  padding:
                    "12px",
                  borderRadius:
                    "12px",
                  cursor:
                    "pointer",
                }}
              >
                Fallakte erstellen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}