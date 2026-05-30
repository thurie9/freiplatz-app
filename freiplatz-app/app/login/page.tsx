"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;

    if (user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email,
          role: "jugendamt",
        });

      if (profileError) {
        console.log(profileError);
      }
    }

    window.location.href = "/dashboard";
  }

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      window.location.href = "/dashboard";
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md border rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6">
          Jugendhilfe Login
        </h1>

        <input
          type="email"
          placeholder="E-Mail"
          className="w-full border p-3 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Passwort"
          className="w-full border p-3 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white p-3 rounded mb-3"
        >
          Login
        </button>

        <button
          onClick={handleSignup}
          className="w-full border p-3 rounded"
        >
          Registrieren
        </button>
      </div>
    </main>
  );
}