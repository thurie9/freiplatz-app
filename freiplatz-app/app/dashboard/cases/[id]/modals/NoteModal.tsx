"use client";

import { useState } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

import { supabase } from "@/lib/supabase";
import { useCase } from "../CaseContext";

interface NoteModalProps {
  open: boolean;
  onClose: () => void;
}

export default function NoteModal({
  open,
  onClose,
}: NoteModalProps) {
  const {
    child,
    loadNotes,
  } = useCase();

  const [note, setNote] =
    useState("");

  async function createNote() {
    if (!child) return;

    const { error } =
      await supabase
        .from("case_notes")
        .insert({
          child_id: child.id,
          note,
        });

    if (error) {
      console.error(error);
      alert(
        "Fehler beim Speichern."
      );
      return;
    }

    await loadNotes(
      child.id
    );

    setNote("");

    onClose();
  }

  return (
    <Modal
      open={open}
      title="📝 Neue Verlaufsnotiz"
      onClose={onClose}
    >
      <div
        style={{
          display: "grid",
          gap: "16px",
        }}
      >
        <textarea
          rows={8}
          placeholder="Verlaufsnotiz eingeben..."
          value={note}
          onChange={(e) =>
            setNote(
              e.target.value
            )
          }
        />

        <Button
          onClick={createNote}
        >
          Notiz speichern
        </Button>
      </div>
    </Modal>
  );
}