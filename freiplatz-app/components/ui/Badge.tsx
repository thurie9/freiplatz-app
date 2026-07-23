"use client";

import { ReactNode } from "react";

type BadgeColor =
  | "green"
  | "yellow"
  | "red"
  | "blue"
  | "gray";

interface BadgeProps {
  color?: BadgeColor;
  children: ReactNode;
}

export default function Badge({
  color = "gray",
  children,
}: BadgeProps) {
  const colors = {
    green: {
      background: "#dcfce7",
      color: "#166534",
    },
    yellow: {
      background: "#fef9c3",
      color: "#854d0e",
    },
    red: {
      background: "#fee2e2",
      color: "#991b1b",
    },
    blue: {
      background: "#dbeafe",
      color: "#1d4ed8",
    },
    gray: {
      background: "#e2e8f0",
      color: "#334155",
    },
  };

  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 12px",
        borderRadius: "999px",
        fontSize: "13px",
        fontWeight: 600,
        background:
          colors[color].background,
        color:
          colors[color].color,
      }}
    >
      {children}
    </span>
  );
}