"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import { v4 as uuidv4 } from "uuid";

import { supabase } from "@/lib/supabase";

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

export default function ProfilePage() {
  const [loading, setLoading] =
    useState(false);

  const [logoUploading, setLogoUploading] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [profile, setProfile] =
    useState<any>(null);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [city, setCity] =
    useState("");

  const [description, setDescription] =
    useState("");

    const [skillsets, setSkillsets] =
  useState<string[]>([]);

  const [logoUrl, setLogoUrl] =
    useState("");

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (data) {
      setProfile(data);

      setName(data.name || "");

      setEmail(data.email || "");

      setPhone(
        data.phone || ""
      );

      setCity(data.city || "");

      setDescription(
        data.description || ""
      );

      setSkillsets(
  data.skillsets || []
);

      setLogoUrl(
        data.logo_url || ""
      );
    }
  }

  async function uploadLogo(
    file: File
  ) {
    try {
      setLogoUploading(true);

      const fileExt =
        file.name.split(".").pop();

      const fileName = `${uuidv4()}.${fileExt}`;

      const { error } =
        await supabase.storage
          .from("logos")
          .upload(
            fileName,
            file
          );

      if (error) {
        alert(error.message);
        return;
      }

      const { data } =
        supabase.storage
          .from("logos")
          .getPublicUrl(
            fileName
          );

      setLogoUrl(
        data.publicUrl
      );
    } finally {
      setLogoUploading(false);
    }
  }

  async function saveProfile() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } =
      await supabase
        .from("profiles")
        .update({
          name,
          email,
          phone,
          city,
          description,
          skillsets,
          logo_url: logoUrl,
        })
        .eq("id", user.id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setShowEditModal(false);

    loadProfile();
  }

  useEffect(() => {
    loadProfile();
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
            Profil
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: "18px",
            }}
          >
            Informationen Ihrer
            Einrichtung
          </p>
        </div>

        <button
          onClick={() =>
            setShowEditModal(true)
          }
          style={{
            background:
              "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",

            color: "white",

            border: "none",

            borderRadius:
              "18px",

            padding:
              "16px 24px",

            fontWeight: 600,

            cursor: "pointer",

            fontSize: "15px",
          }}
        >
          Update
        </button>
      </div>

      {/* PROFILE CARD */}
      <div
        style={{
          background: "white",
          borderRadius: "32px",
          padding: "40px",
          boxShadow:
            "0 1px 3px rgba(0,0,0,0.06)",

          maxWidth: "900px",
        }}
      >
        {/* TOP */}
        <div
          style={{
            display: "flex",
            gap: "30px",
            alignItems: "center",
            marginBottom: "40px",
            flexWrap: "wrap",
          }}
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="Logo"
              width={140}
              height={140}
              style={{
                borderRadius:
                  "28px",

                objectFit:
                  "cover",

                background:
                  "#f8fafc",

                padding: "12px",
              }}
            />
          ) : (
            <div
              style={{
                width: "140px",
                height: "140px",
                borderRadius:
                  "28px",

                background:
                  "#f5f7fb",

                display: "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                fontSize: "52px",
              }}
            >
              🏢
            </div>
          )}

          <div>
  <h2
    style={{
      fontSize: "36px",
      fontWeight: "bold",
      marginBottom: "6px",
    }}
  >
    {name ||
      "Einrichtung"}
  </h2>

  {/* ROLE */}
  <p
    style={{
      fontSize: "14px",
      color: "#64748b",
      marginBottom: "12px",
      fontWeight: 500,
    }}
  >
    {profile?.role ===
    "jugendamt"
      ? "Jugendamt"
      : "Einrichtung"}
  </p>

  {/* CITY */}
  <p
    style={{
      color: "#64748b",
      fontSize: "18px",
    }}
  >
    {city}
  </p>
</div>
        </div>

        {/* DETAILS */}
        <div
          style={{
            display: "grid",
            gap: "24px",
          }}
        >
          <ProfileItem
            label="E-Mail"
            value={email}
          />

          <ProfileItem
            label="Telefonnummer"
            value={phone}
          />

          <ProfileItem
            label="Stadt"
            value={city}
          />

          <ProfileItem
            label="Beschreibung"
            value={description}
          />
          <div>
  <p
    style={{
      fontSize: "14px",
      color: "#64748b",
      marginBottom: "14px",
    }}
  >
    Skillsets
  </p>

  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "12px",
    }}
  >
    {skillsets.length ===
    0 ? (
      <p>-</p>
    ) : (
      skillsets.map(
        (skill) => (
          <div
            key={skill}
            style={{
              padding:
                "12px 18px",

              borderRadius:
                "999px",

              background:
                "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",

              color: "white",

              fontWeight: 600,

              fontSize: "14px",
            }}
          >
            {skill}
          </div>
        )
      )
    )}
  </div>
</div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {showEditModal && (
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

            padding: "20px",
          }}
        >
          <div
            style={{
              background: "white",

              width: "100%",

              maxWidth: "700px",

              borderRadius:
                "32px",

              padding: "40px",

              maxHeight:
                "90vh",

              overflowY: "auto",
            }}
          >
            {/* MODAL HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                marginBottom:
                  "30px",
              }}
            >
              <h2
                style={{
                  fontSize:
                    "36px",
                  fontWeight:
                    "bold",
                }}
              >
                Profil bearbeiten
              </h2>

              <button
                onClick={() =>
                  setShowEditModal(
                    false
                  )
                }
                style={{
                  background:
                    "#f1f5f9",

                  border: "none",

                  width: "42px",

                  height: "42px",

                  borderRadius:
                    "999px",

                  cursor:
                    "pointer",

                  fontSize:
                    "18px",
                }}
              >
                ✕
              </button>
            </div>

            {/* LOGO */}
            <div
              style={{
                marginBottom: "30px",
              }}
            >
              <p
                style={{
                  fontWeight: 600,
                  marginBottom:
                    "14px",
                }}
              >
                Logo
              </p>

              {logoUrl && (
                <Image
                  src={logoUrl}
                  alt="Logo"
                  width={120}
                  height={120}
                  style={{
                    borderRadius:
                      "24px",

                    marginBottom:
                      "16px",
                  }}
                />
              )}

              <label
                style={{
                  display:
                    "inline-flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  background:
                    "#f1f5f9",

                  padding:
                    "14px 20px",

                  borderRadius:
                    "16px",

                  cursor:
                    "pointer",

                  fontWeight: 600,
                }}
              >
                {logoUrl
                  ? "Edit"
                  : "Add Logo"}

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(
                    e
                  ) => {
                    const file =
                      e.target
                        .files?.[0];

                    if (file) {
                      uploadLogo(
                        file
                      );
                    }
                  }}
                />
              </label>

              {logoUploading && (
                <p
                  style={{
                    marginTop:
                      "10px",

                    color:
                      "#64748b",
                  }}
                >
                  Upload läuft...
                </p>
              )}
            </div>

            {/* FORM */}
            <div
              style={{
                display: "grid",
                gap: "20px",
              }}
            >
              <input
                placeholder="Einrichtung"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
              />

              <input
                placeholder="E-Mail"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Telefonnummer"
                value={phone}
                onChange={(e) =>
                  setPhone(
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
<div>
  <p
    style={{
      fontWeight: 600,
      marginBottom: "14px",
    }}
  >
    Skillsets
  </p>

  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "12px",
    }}
  >
    {availableSkillsets.map(
      (skill) => {
        const selected =
          skillsets.includes(
            skill
          );

        return (
          <button
            key={skill}
            type="button"
            onClick={() => {
              if (selected) {
                setSkillsets(
                  skillsets.filter(
                    (s) =>
                      s !== skill
                  )
                );
              } else {
                setSkillsets([
                  ...skillsets,
                  skill,
                ]);
              }
            }}
            style={{
              padding:
                "12px 18px",

              borderRadius:
                "999px",

              border: "none",

              cursor: "pointer",

              fontWeight: 600,

              background:
                selected
                  ? "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)"
                  : "#f1f5f9",

              color: selected
                ? "white"
                : "#0f172a",
            }}
          >
            {skill}
          </button>
        );
      }
    )}
  </div>
</div>
              <textarea
                placeholder="Beschreibung"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                style={{
                  minHeight:
                    "160px",

                  resize: "none",

                  padding:
                    "18px",

                  border: "none",

                  borderRadius:
                    "18px",

                  background:
                    "#f8fafc",
                }}
              />

              <button
                onClick={
                  saveProfile
                }
                disabled={loading}
                style={{
                  background:
                    "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",

                  color: "white",

                  border: "none",

                  borderRadius:
                    "18px",

                  padding:
                    "18px 24px",

                  fontWeight: 600,

                  cursor: "pointer",

                  fontSize: "16px",

                  marginTop: "10px",
                }}
              >
                {loading
                  ? "Speichert..."
                  : "Änderungen speichern"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p
        style={{
          fontSize: "14px",
          color: "#64748b",
          marginBottom: "8px",
        }}
      >
        {label}
      </p>

      <p
        style={{
          fontSize: "18px",
          fontWeight: 500,
        }}
      >
        {value || "-"}
      </p>
    </div>
  );
}