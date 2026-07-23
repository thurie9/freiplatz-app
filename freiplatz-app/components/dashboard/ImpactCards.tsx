import {
  UsersRound,
  FileText,
  FileStack,
  CalendarClock,
} from "lucide-react";

interface ImpactCardsProps {
  childrenSupported: number;
  notesThisWeek: number;
  documentsThisWeek: number;
  tasksToday: number;
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "24px",
  marginBottom: "60px",
};

const cardStyle: React.CSSProperties = {
  borderRadius: "28px",
  padding: "30px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const titleStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#374151",
  marginTop: "20px",
};

const valueStyle: React.CSSProperties = {
  fontSize: "56px",
  fontWeight: 700,
  color: "#111827",
  margin: "12px 0",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: "15px",
  color: "#6B7280",
};

export function ImpactCards({
  childrenSupported,
  notesThisWeek,
  documentsThisWeek,
  tasksToday,
}: ImpactCardsProps) {
  const cards = [
    {
      title: "Kinder",
      value: childrenSupported,
      subtitle: "Aktuell begleitet",
      icon: UsersRound,
      background: "#F8FAFC",
      circle: "#DBEAFE",
      color: "#2563EB",
    },
    {
      title: "Verlaufsnotizen",
      value: notesThisWeek,
      subtitle: "Diese Woche",
      icon: FileText,
      background: "#F8FAFC",
      circle: "#DCFCE7",
      color: "#16A34A",
    },
    {
      title: "Dokumente",
      value: documentsThisWeek,
      subtitle: "Hochgeladen",
      icon: FileStack,
      background: "#F8FAFC",
      circle: "#FED7AA",
      color: "#EA580C",
    },
    {
      title: "Heute",
      value: tasksToday,
      subtitle: "Offene Aufgaben",
      icon: CalendarClock,
      background: "#F8FAFC",
      circle: "#E9D5FF",
      color: "#7C3AED",
    },
  ];

  return (
    <div style={gridStyle}>
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            style={{
              ...cardStyle,
              background: card.background,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: card.circle,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                size={26}
                color={card.color}
              />
            </div>

            <div style={titleStyle}>
              {card.title}
            </div>

            <div style={valueStyle}>
              {card.value}
            </div>

            <div style={subtitleStyle}>
              {card.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
}