"use client";

import { useState } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

import { supabase } from "@/lib/supabase";
import { useCase } from "../CaseContext";

interface DocumentModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DocumentModal({
  open,
  onClose,
}: DocumentModalProps) {
  const {
    child,
    loadDocuments,
  } = useCase();

  const [file, setFile] =
    useState<File | null>(null);

  const [documentType, setDocumentType] =
    useState("");

  async function uploadDocument() {
    if (!child || !file) return;

    const filePath =
      `${child.id}/${Date.now()}-${file.name}`;

    const { error: uploadError } =
      await supabase.storage
        .from("documents")
        .upload(
          filePath,
          file
        );

    if (uploadError) {
      console.error(uploadError);
      alert(
        "Fehler beim Upload."
      );
      return;
    }

    const { data, error: insertError } =
  await supabase
    .from("case_documents")
    .insert({
      child_id: child.id,
      file_name: file.name,
      file_path: filePath,
      document_type: documentType,
    })
    .select();

console.log(
  "Document insert result:",
  data
);

console.log(
  "Document insert error:",
  insertError
);

    if (insertError) {
      console.error(insertError);
      alert(
        "Fehler beim Speichern."
      );
      return;
    }

    await loadDocuments(
      child.id
    );

    setFile(null);
    setDocumentType("");

    onClose();
  }

  return (
    <Modal
      open={open}
      title="📄 Dokument hochladen"
      onClose={onClose}
    >
      <div
        style={{
          display: "grid",
          gap: "16px",
        }}
      >
        <select
          value={documentType}
          onChange={(e) =>
            setDocumentType(
              e.target.value
            )
          }
        >
          <option value="">
            Dokumenttyp wählen
          </option>

          <option value="Hilfeplan">
            Hilfeplan
          </option>

          <option value="Bericht">
            Bericht
          </option>

          <option value="Vertrag">
            Vertrag
          </option>

          <option value="Sonstiges">
            Sonstiges
          </option>
        </select>

        <input
          type="file"
          onChange={(e) =>
            setFile(
              e.target.files?.[0] ||
                null
            )
          }
        />

        <Button
          onClick={
            uploadDocument
          }
        >
          Dokument hochladen
        </Button>
      </div>
    </Modal>
  );
}