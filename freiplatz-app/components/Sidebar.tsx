"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Sidebar() {
  async function handleLogout() {
    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  return (
    <div className="w-64 min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-10">
        Jugendhilfe
      </h1>

      <nav className="flex flex-col gap-4">
        <Link href="/dashboard">
          Dashboard
        </Link>

        <Link href="/dashboard/free-places">
          Freiplätze
        </Link>

        <Link href="/dashboard/reservations">
          Reservierungen
        </Link>

        <Link href="/dashboard/profile">
  Profil
</Link>

<Link href="/dashboard/notifications">
  Benachrichtigungen
</Link>

<Link href="/dashboard/messages">
  Nachrichten
</Link>

        <button
          onClick={handleLogout}
          className="text-left mt-10"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}