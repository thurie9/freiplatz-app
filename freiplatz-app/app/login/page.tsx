"use client";

import {
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("jugendamt");

  async function handleSignup() {
    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;

    if (user) {
      const {
        error: profileError,
      } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email,
          role,
        });

      if (profileError) {
        alert(
          profileError.message
        );
      }
    }

    window.location.href =
      "/dashboard";
  }

  async function handleLogin() {
    const { error } =
      await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

    if (error) {
      alert(error.message);
    } else {
      window.location.href =
        "/dashboard";
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns:
          "1fr 1fr",
        background: "#f5f7fb",
      }}
    >
      {/* LEFT SIDE */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #111827, #1e3a8a)",
          color: "white",
          padding: "80px",
          display: "flex",
          flexDirection: "column",
          justifyContent:
            "space-between",
        }}
      >
        <div>
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              marginBottom: "60px",
            }}
          >
            <img
              src="/logo.png"
              alt="JugendKompass"
              style={{
                width: "72px",
                height: "72px",
                borderRadius:
                  "18px",
              }}
            />

            <div>
              <h1
                style={{
                  fontSize: "36px",
                  fontWeight:
                    "bold",
                  margin: 0,
                }}
              >
                JugendKompass
              </h1>

              <p
                style={{
                  color:
                    "rgba(255,255,255,0.7)",
                  marginTop: "6px",
                  fontSize: "16px",
                }}
              >
                Moderne Jugendhilfe
              </p>
            </div>
          </div>

          {/* Hero */}
          <div>
            <h2
              style={{
                fontSize: "64px",
                lineHeight: 1.1,
                fontWeight:
                  "bold",
                marginBottom:
                  "28px",
              }}
            >
              Digitale
              Jugendhilfe
              neu gedacht.
            </h2>

            <p
              style={{
                color:
                  "rgba(255,255,255,0.75)",
                fontSize: "22px",
                lineHeight: 1.6,
                maxWidth:
                  "520px",
              }}
            >
              Die moderne Plattform
              für freie Plätze,
              Kommunikation und
              intelligente
              Vermittlung in der
              Jugendhilfe.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p
          style={{
            color:
              "rgba(255,255,255,0.5)",
            fontSize: "15px",
          }}
        >
          © 2026 JugendKompass
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            "center",
          padding: "40px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "520px",
            background: "white",
            borderRadius: "36px",
            padding: "50px",
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              marginBottom: "40px",
            }}
          >
            <h2
              style={{
                fontSize: "42px",
                fontWeight:
                  "bold",
                color: "#111827",
                marginBottom:
                  "10px",
              }}
            >
              Willkommen
            </h2>

            <p
              style={{
                color: "#6b7280",
                fontSize: "18px",
              }}
            >
              Anmeldung bei
              JugendKompass
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gap: "22px",
            }}
          >
            {/* Email */}
            <div>
              <label
                style={
                  labelStyle
                }
              >
                E-Mail
              </label>

              <input
                type="email"
                placeholder="E-Mail eingeben"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                style={inputStyle}
              />
            </div>

            {/* Password */}
            <div>
              <label
                style={
                  labelStyle
                }
              >
                Passwort
              </label>

              <input
                type="password"
                placeholder="Passwort"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                style={inputStyle}
              />
            </div>

            {/* Role */}
            <div>
              <label
                style={
                  labelStyle
                }
              >
                Rolle
              </label>

              <select
                value={role}
                onChange={(e) =>
                  setRole(
                    e.target.value
                  )
                }
                style={inputStyle}
              >
                <option value="jugendamt">
                  Jugendamt
                </option>

                <option value="einrichtung">
                  Einrichtung
                </option>
              </select>
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "grid",
                gap: "16px",
                marginTop: "10px",
              }}
            >
              <button
                onClick={
                  handleLogin
                }
                style={{
                  background:
                    "#111827",
                  color: "white",
                  padding:
                    "18px",
                  borderRadius:
                    "18px",
                  fontSize: "18px",
                  fontWeight: 600,
                }}
              >
                Login
              </button>

              <button
                onClick={
                  handleSignup
                }
                style={{
                  background:
                    "#eff6ff",
                  color:
                    "#1e3a8a",
                  padding:
                    "18px",
                  borderRadius:
                    "18px",
                  fontSize: "18px",
                  fontWeight: 600,
                }}
              >
                Registrieren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "18px",
  border: "none",
  borderRadius: "18px",
  background: "#f5f7fb",
  fontSize: "16px",
  color: "#111827",
  outline: "none",
};

const labelStyle = {
  display: "block",
  marginBottom: "10px",
  fontWeight: 600,
  color: "#6b7280",
  fontSize: "14px",
  textTransform:
    "uppercase" as const,
  letterSpacing: "1px",
};