"use client";

import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({
  open,
  title,
  children,
  onClose,
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "white",
          width: "700px",
          maxWidth: "95%",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "24px",
          padding: "30px",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            border: "none",
            background: "transparent",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        <h2
          style={{
            marginTop: 0,
          }}
        >
          {title}
        </h2>

        {children}
      </div>
    </div>
  );
}