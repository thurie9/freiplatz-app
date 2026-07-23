"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] =
    useState(false);

  const [mobile, setMobile] =
    useState(false);

    const [unreadNotifications, setUnreadNotifications] =
  useState(0);

  const router = useRouter();

  useEffect(() => {
    function handleResize() {
      setMobile(
        window.innerWidth < 768
      );
    }

    handleResize();

    loadNotifications();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/login");
  }

  async function loadNotifications() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data } =
    await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_read", false);

  setUnreadNotifications(
    data?.length || 0
  );
}

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#f5f7fb",
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: collapsed
            ? "110px"
            : "300px",

          transition:
            "all 0.25s ease",

          background: "white",

          padding: "24px",

          display: "flex",

          flexDirection: "column",

          position: mobile
            ? "fixed"
            : "relative",

          zIndex: 100,

          height: "100vh",

          borderRight:
            "1px solid #e5e7eb",

          boxShadow:
            "0 10px 40px rgba(0,0,0,0.04)",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            display: "flex",
            justifyContent:
              "center",

            marginBottom: "40px",
          }}
        >
          <Image
            src="/logo.png"
            alt="JugendKompass"
            width={
              collapsed ? 80 : 220
            }
            height={
              collapsed ? 80 : 220
            }
            style={{
              borderRadius: "28px",
              objectFit: "cover",

              transition:
                "all 0.25s ease",

              background:
                "white",

              padding: "8px",
            }}
          />
        </div>

        {/* NAVIGATION */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <SidebarLink
            href="/dashboard"
            collapsed={collapsed}
            icon="🏠"
            label="Dashboard"
          />

          <SidebarLink
            href="/dashboard/free-places"
            collapsed={collapsed}
            icon="📍"
            label="Freiplätze"
          />
          

<SidebarLink
  href="/dashboard/placement-requests"
  collapsed={collapsed}
  icon="🧒"
  label="Platzanfragen"
/>

<SidebarLink
  href="/dashboard/cases"
  collapsed={collapsed}
  icon="📁"
  label="Fallakten"
/>

          <SidebarLink
            href="/dashboard/reservations"
            collapsed={collapsed}
            icon="📋"
            label="Reservierungen"
          />

          <SidebarLink
  href="/dashboard/notifications"
  collapsed={collapsed}
  icon="🔔"
  label={
    unreadNotifications > 0
      ? `Benachrichtigungen (${unreadNotifications})`
      : "Benachrichtigungen"
  }
/>

          <SidebarLink
            href="/dashboard/profile"
            collapsed={collapsed}
            icon="👤"
            label="Profil"
          />
        </div>

        {/* SPACER */}
        <div
          style={{
            flex: 1,
          }}
        />

        {/* LOGOUT LINK */}
<div
  onClick={handleLogout}
  style={{
    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    gap: "8px",

    padding: "12px",

    cursor: "pointer",

    color: "#0f172a",

    fontSize: "15px",

    fontWeight: 600,

    marginBottom: "30px",

    textAlign: "center",
  }}
>
          <span
            style={{
              fontSize: "20px",
            }}
          >
            ↩
          </span>

          {!collapsed && (
            <span>
              Logout
            </span>
          )}
        </div>

        {/* TOGGLE */}
        <div
          style={{
            display: "flex",
            justifyContent:
              "center",

            paddingTop: "30px",

            borderTop:
              "1px solid #e5e7eb",
          }}
        >
          <button
            onClick={() =>
              setCollapsed(
                !collapsed
              )
            }
            style={{
              width: "60px",

              height: "60px",

              borderRadius:
                "999px",

              border: "none",

              background:
                "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",

              color: "white",

              cursor: "pointer",

              fontSize: "28px",

              fontWeight: "bold",

              boxShadow:
                "0 10px 20px rgba(15,23,42,0.25)",

              transition:
                "all 0.2s ease",
            }}
          >
            {collapsed
              ? "→"
              : "←"}
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main
        style={{
          flex: 1,

          padding: "40px",

          overflowY: "auto",

          transition:
            "all 0.25s ease",

          marginLeft: mobile
            ? collapsed
              ? "110px"
              : "300px"
            : "0",
        }}
      >
        {children}
      </main>
    </div>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  collapsed,
}: {
  href: string;
  icon: string;
  label: string;
  collapsed: boolean;
}) {
  return (
    <a
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed
          ? "center"
          : "flex-start",
        gap: "18px",
        padding: collapsed
          ? "22px"
          : "22px 24px",
        borderRadius: "26px",
        textDecoration: "none",
        color: "#ffffff",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
        fontWeight: 600,
        fontSize: "15px",
        transition: "all 0.2s ease",
        boxShadow:
          "0 10px 20px rgba(15,23,42,0.18)",
      }}
    >
      <span
        style={{
          fontSize: "24px",
          lineHeight: 1,
        }}
      >
        {icon}
      </span>

      {!collapsed && (
        <span
          style={{
            color: "#ffffff",
            fontWeight: 600,
          }}
        >
          {label}
        </span>
      )}
    </a>
  );
}