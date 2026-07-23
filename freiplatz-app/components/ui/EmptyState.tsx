"use client";

interface EmptyStateProps {
  title: string;
}

export default function EmptyState({
  title,
}: EmptyStateProps) {
  return (
    <div
      style={{
        background: "white",
        padding: "28px",
        borderRadius: "20px",
        textAlign: "center",
        color: "#64748b",
      }}
    >
      {title}
    </div>
  );
}