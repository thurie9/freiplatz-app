"use client";

import { ButtonHTMLAttributes } from "react";

type Variant =
  | "primary"
  | "secondary"
  | "success"
  | "danger";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export default function Button({
  variant = "primary",
  children,
  style,
  ...props
}: ButtonProps) {
  const colors = {
    primary: "#1e3a8a",
    secondary: "#475569",
    success: "#15803d",
    danger: "#dc2626",
  };

  return (
    <button
      {...props}
      style={{
        background:
          colors[variant],
        color: "white",
        border: "none",
        borderRadius: "14px",
        padding: "14px 22px",
        fontSize: "16px",
        fontWeight: 600,
        cursor: "pointer",
        transition:
          "0.2s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}