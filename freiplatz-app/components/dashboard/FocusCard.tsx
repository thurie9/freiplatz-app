import {
  CalendarClock,
  FileWarning,
  House,
} from "lucide-react";

interface FocusItem {
  id: string;
  title: string;
  description: string;
  type: "followup" | "document" | "placement";
}

interface FocusCardProps {
  items: FocusItem[];
}

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: "28px",
  padding: "32px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  marginBottom: "40px",
};

export function FocusCard({
  items,
}: FocusCardProps) {
  return (
    <div style={cardStyle}>
      <h2
        style={{
          fontSize: "30px",
          fontWeight: 700,
          marginBottom: "8px",
        }}
      >
        Heutige Prioritäten
      </h2>

      <p
        style={{
          color: "#6B7280",
          marginBottom: "28px",
        }}
      >
        Die wichtigsten Aufgaben für heute.
      </p>

      <div
        style={{
          display: "grid",
          gap: "20px",
        }}
      >
        {items.map((item) => {

          const Icon =
            item.type === "followup"
              ? CalendarClock
              : item.type === "document"
              ? FileWarning
              : House;

          return (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
                paddingBottom: "20px",
                borderBottom:
                  "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "#F3F4F6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={22} />
              </div>

              <div>
                <div
                  style={{
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                >
                  {item.title}
                </div>

                <div
                  style={{
                    color: "#6B7280",
                  }}
                >
                  {item.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}