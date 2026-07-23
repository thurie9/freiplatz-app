import {
  UserPlus,
  FileText,
  FolderPlus,
  ClipboardPlus,
} from "lucide-react";

interface Action {
  title: string;
  href: string;
  icon: React.ElementType;
  color: string;
  background: string;
}

const actions: Action[] = [
  {
    title: "Neues Kind",
    href: "/children/new",
    icon: UserPlus,
    color: "#2563EB",
    background: "#DBEAFE",
  },
  {
    title: "Verlaufsnotiz",
    href: "/case-notes/new",
    icon: FileText,
    color: "#16A34A",
    background: "#DCFCE7",
  },
  {
    title: "Dokument",
    href: "/documents/upload",
    icon: FolderPlus,
    color: "#EA580C",
    background: "#FED7AA",
  },
  {
    title: "Vermittlung",
    href: "/placements/new",
    icon: ClipboardPlus,
    color: "#7C3AED",
    background: "#E9D5FF",
  },
];

export function QuickActions() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 28,
        padding: 32,
        boxShadow: "0 4px 12px rgba(0,0,0,.05)",
        marginBottom: 40,
      }}
    >
      <h2
        style={{
          fontSize: 30,
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        Schnellaktionen
      </h2>

      <p
        style={{
          color: "#6B7280",
          marginBottom: 28,
        }}
      >
        Häufig verwendete Aktionen.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap: 20,
        }}
      >
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <a
              key={action.title}
              href={action.href}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  border: "1px solid #E5E7EB",
                  borderRadius: 20,
                  padding: 24,
                  transition: "0.2s",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: action.background,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <Icon
                    size={24}
                    color={action.color}
                  />
                </div>

                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 17,
                  }}
                >
                  {action.title}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}