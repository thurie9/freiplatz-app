"use client";

import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
}

export default function SectionHeader({
  title,
  action,
}: SectionHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: "26px",
          fontWeight: 700,
        }}
      >
        {title}
      </h2>

      {action}
    </div>
  );
}