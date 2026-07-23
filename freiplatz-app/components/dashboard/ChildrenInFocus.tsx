import {
  AlertCircle,
  AlertTriangle,
  Clock3,
} from "lucide-react";

interface FocusChild {
  id: string;
  name: string;
  reason: string;
  status: "high" | "medium" | "low";
}

interface ChildrenInFocusProps {
  children: FocusChild[];
}

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: "28px",
  padding: "32px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  marginBottom: "40px",
};

export function ChildrenInFocus({
  children,
}: ChildrenInFocusProps) {
  return (
    <div style={cardStyle}>
      <h2
        style={{
          fontSize: "30px",
          fontWeight: 700,
          marginBottom: "8px",
        }}
      >
        Kinder im Fokus
      </h2>

      <p
        style={{
          color: "#6B7280",
          marginBottom: "28px",
        }}
      >
        Kinder, die heute besondere Aufmerksamkeit benötigen.
      </p>

      <div
        style={{
          display: "grid",
          gap: "18px",
        }}
      >
        {children.map((child) => {

          const Icon =
            child.status === "high"
              ? AlertCircle
              : child.status === "medium"
              ? AlertTriangle
              : Clock3;

          const color =
            child.status === "high"
              ? "#DC2626"
              : child.status === "medium"
              ? "#EA580C"
              : "#2563EB";

          const background =
            child.status === "high"
              ? "#FEF2F2"
              : child.status === "medium"
              ? "#FFF7ED"
              : "#EFF6FF";

          return (
            <div
              key={child.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
                padding: "20px",
                borderRadius: "20px",
                background,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  size={24}
                  color={color}
                />
              </div>

              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "18px",
                    marginBottom: "6px",
                  }}
                >
                  {child.name}
                </div>

                <div
                  style={{
                    color: "#6B7280",
                  }}
                >
                  {child.reason}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}