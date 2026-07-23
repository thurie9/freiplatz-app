"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useCase } from "../CaseContext";

interface IncidentModalProps {
  open: boolean;
  onClose: () => void;
}

export default function IncidentModal({
  open,
  onClose,
}: IncidentModalProps) {

  const {
  child,
  loadIncidents,
} = useCase();

  const [incidentDate, setIncidentDate] =
  useState("");

const [incidentTime, setIncidentTime] =
  useState("");

const [incidentType, setIncidentType] =
  useState("");

const [severity, setSeverity] =
  useState("Niedrig");

const [description, setDescription] =
  useState("");

const [actionTaken, setActionTaken] =
  useState("");

const [staffMember, setStaffMember] =
  useState("");

  async function createIncident() {
  if (!child) return;

  const { error } =
    await supabase
      .from("child_incidents")
      .insert({
        child_id: child.id,

        incident_date:
          incidentDate,

        incident_time:
          incidentTime,

        incident_type:
          incidentType,

        severity,

        description,

        staff_member:
          staffMember,

        action_taken:
          actionTaken,
      });

  if (error) {
    console.error(error);
    alert(
      "Fehler beim Speichern."
    );
    return;
  }

  await loadIncidents(
  child.id
);
setIncidentDate("");
setIncidentTime("");
setIncidentType("");
setSeverity("Niedrig");
setDescription("");
setActionTaken("");
setStaffMember("");

onClose();
}

  return (
    <Modal
      open={open}
      title="⚠ Neuer Vorfall"
      onClose={onClose}
    >
      <div
  style={{
    display: "grid",
    gap: "16px",
  }}
>
  <input
  type="date"
  value={incidentDate}
  onChange={(e) =>
    setIncidentDate(
      e.target.value
    )
  }
/>

  <input
  type="time"
  value={incidentTime}
  onChange={(e) =>
    setIncidentTime(
      e.target.value
    )
  }
/>

  <input
  placeholder="Kategorie"
  value={incidentType}
  onChange={(e) =>
    setIncidentType(
      e.target.value
    )
  }
/>

  <select
  value={severity}
  onChange={(e) =>
    setSeverity(
      e.target.value
    )
  }
>
    <option>
      Niedrig
    </option>

    <option>
      Mittel
    </option>

    <option>
      Hoch
    </option>
  </select>

  <textarea
  placeholder="Beschreibung"
  rows={6}
  value={description}
  onChange={(e) =>
    setDescription(
      e.target.value
    )
  }
/>

 <textarea
  placeholder="Maßnahmen"
  rows={4}
  value={actionTaken}
  onChange={(e) =>
    setActionTaken(
      e.target.value
    )
  }
/>

<input
  placeholder="Diensthabende Person"
  value={staffMember}
  onChange={(e) =>
    setStaffMember(
      e.target.value
    )
  }
/>

  <Button
  onClick={createIncident}
>
  Vorfall speichern
</Button>

</div>
    </Modal>
  );
}