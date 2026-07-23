"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { CaseProvider, useCase } from "./CaseContext";

import CaseHeader from "./components/CaseHeader";
import ActionButtons from "./components/ActionButtons";
import TimelineSection from "./components/TimelineSection";
import IncidentSection from "./components/IncidentSection";
import NotesSection from "./components/NotesSection";
import DocumentsSection from "./components/DocumentsSection";
import IncidentModal from "./modals/IncidentModal";
import NoteModal from "./modals/NoteModal";
import DocumentModal from "./modals/DocumentModal";
import AuditModal from "./modals/AuditModal";

function CasePageContent() {
  const params = useParams();

  const {
    child,
    loadCase,
    loadIncidents,
    loadNotes,
    loadDocuments,
    loadAuditLogs,
  } = useCase();

  const [showIncidentModal, setShowIncidentModal] =
    useState(false);

  const [showNoteModal, setShowNoteModal] =
    useState(false);

  const [showDocumentModal, setShowDocumentModal] =
    useState(false);

  const [showAuditModal, setShowAuditModal] =
    useState(false);

  const [generatingReport, setGeneratingReport] =
  useState(false);

  useEffect(() => {
    if (!params?.id) return;

    const id = String(params.id);

    loadCase(id);
    loadIncidents(id);
    loadNotes(id);
    loadDocuments(id);
    loadAuditLogs(id);
  }, [params]);

  if (!child) {
    return (
      <div
        style={{
          padding: "40px",
        }}
      >
        Lade Fallakte...
      </div>
    );
  }

  async function generateReport() {
  if (!child) return;

  const response = await fetch(
    "/api/reports/generate",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        childId: child.id,
      }),
    }
  );

  if (!response.ok) {
  const error =
    await response.text();

  console.error(
    "Report Error:",
    error
  );

  alert(
    `Fehler beim Erstellen des Berichts:\n${error}`
  );

  return;
}

  const blob =
    await response.blob();

  const url =
    window.URL.createObjectURL(
      blob
    );

   const link =
    document.createElement(
      "a"
    );

  link.href = url;

  link.download =
    `Fallbericht_${child.first_name}_${child.last_name}.pdf`;

  document.body.appendChild(
    link
  );

  link.click();

  link.remove();
}

  <NoteModal
  open={showNoteModal}
  onClose={() =>
    setShowNoteModal(false)
  }
/>

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <CaseHeader
        caseNumber={child.case_number}
        firstName={child.first_name}
        lastName={child.last_name}
        placementStatus={child.placement_status}
        dateOfBirth={child.date_of_birth}
        facility={child.assigned_facility}
        jugendamt={child.responsible_jugendamt}
      />

      <ActionButtons
        onIncident={() =>
          setShowIncidentModal(true)
        }
        onNote={() =>
          setShowNoteModal(true)
  }
  onDocument={() =>
    setShowDocumentModal(true)
  }
  onAudit={() =>
    setShowAuditModal(true)
  }
  onReport={() =>
  generateReport()
}
/>

<TimelineSection />

<IncidentSection />

<NotesSection />

<DocumentsSection />

<IncidentModal
  open={showIncidentModal}
  onClose={() =>
    setShowIncidentModal(false)
  }
/>

<NoteModal
  open={showNoteModal}
  onClose={() =>
    setShowNoteModal(false)
  }
/>

<DocumentModal
  open={showDocumentModal}
  onClose={() =>
    setShowDocumentModal(false)
  }
/>

<AuditModal
  open={showAuditModal}
  onClose={() =>
    setShowAuditModal(false)
  }
/>

</div>
);
}

export default function CaseDetailPage() {
  return (
    <CaseProvider>
      <CasePageContent />
    </CaseProvider>
  );
}