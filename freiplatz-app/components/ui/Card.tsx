"use client";

import { ReactNode, CSSProperties } from "react";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
}

export default function Card({
  children,
  style,
}: CardProps) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "24px",
        boxShadow:
          "0 1px 3px rgba(0,0,0,0.08)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}