"use client";

import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

import { useCase } from "../CaseContext";

export default function DocumentsSection() {
  
  const {
  documents,
  child,
  loadDocuments,
} = useCase();

async function downloadDocument(
  filePath: string
) {
  const { data } =
    supabase.storage
      .from("case_documents")
      .getPublicUrl(filePath);

  window.open(
    data.publicUrl,
    "_blank"
  );
}

async function deleteDocument(
  id: string,
  filePath: string
) {
  const confirmed =
    window.confirm(
      "Dokument wirklich löschen?"
    );

  if (!confirmed) return;

  await supabase.storage
    .from("case_documents")
    .remove([
      filePath,
    ]);

  await supabase
    .from(
      "case_documents"
    )
    .delete()
    .eq("id", id);

  if (child) {
    await loadDocuments(
      child.id
    );
  }
}

  return (
    <div
      style={{
        marginTop: "40px",
      }}
    >
      <SectionHeader
        title="Dokumente"
      />

      {documents.length === 0 ? (
        <EmptyState
          title="Noch keine Dokumente."
        />
      ) : (
        <div
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          {documents.map((doc) => (
            <Card key={doc.id}>
              <h3>{doc.file_name}</h3>

              <p>
                Typ: {doc.document_type}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                <Button
  variant="primary"
  onClick={() =>
    downloadDocument(
      doc.file_path
    )
  }
>
  📥 Download
</Button>

                <Button
  variant="danger"
  onClick={() =>
    deleteDocument(
      doc.id,
      doc.file_path
    )
  }
>
  🗑 Löschen
</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}