import Button from "@/components/ui/Button";

interface ActionButtonsProps {
  onIncident: () => void;
  onNote: () => void;
  onDocument: () => void;
  onAudit: () => void;
  onReport: () => void;
}

export default function ActionButtons({
  onIncident,
  onNote,
  onDocument,
  onAudit,
  onReport

}: ActionButtonsProps) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "15px",
        marginTop: "25px",
        marginBottom: "35px",
      }}
    >
      <Button
  variant="secondary"
  onClick={onAudit}
>
  📋 Audit Log
</Button>

      <button
        onClick={onIncident}
        style={buttonStyle("#1e3a8a")}
      >
        + Vorfall melden
      </button>

      <button
        onClick={onNote}
        style={buttonStyle("#0f172a")}
      >
        + Verlaufsnotiz
      </button>

      <button
        onClick={onDocument}
        style={buttonStyle("#15803d")}
      >
        📎 Dokument
      </button>

      <button
  onClick={onReport}
style={buttonStyle("#1e3a8a")}
>
  📑 Bericht erstellen
</button>

    </div>
  );
}

function buttonStyle(color: string) {
  return {
    background: color,
    color: "white",
    border: "none",
    padding: "14px 22px",
    borderRadius: "14px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 600,
  } as const;
}