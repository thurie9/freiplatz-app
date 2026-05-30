"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setEmail(user.email || "");
    }

    checkUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <main className="min-h-screen p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="border rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">
          Willkommen
        </h2>

        <p>{email}</p>
      </div>
    </main>
  );
}