"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import { supabase } from "@/lib/supabase";

import {
  ChildRecord,
  Incident,
  CaseNote,
  CaseDocument,
  AuditLog,
  TimelineItem,
} from "./types";

interface CaseContextType {
  child: ChildRecord | null;
  incidents: Incident[];
  notes: CaseNote[];
  documents: CaseDocument[];
  auditLogs: AuditLog[];
  timeline: TimelineItem[];

  loadCase: (id: string) => Promise<void>;
  loadIncidents: (id: string) => Promise<void>;
  loadNotes: (id: string) => Promise<void>;
  loadDocuments: (id: string) => Promise<void>;
  loadAuditLogs: (id: string) => Promise<void>;
  loadCaseData: (id: string) => Promise<void>;
}

const CaseContext =
  createContext<CaseContextType | null>(
    null
  );

export function CaseProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [child, setChild] =
    useState<ChildRecord | null>(
      null
    );

  const [incidents, setIncidents] =
    useState<Incident[]>([]);

  const [notes, setNotes] =
    useState<any[]>([]);

  const [documents, setDocuments] =
    useState<CaseDocument[]>([]);

  const [auditLogs, setAuditLogs] =
    useState<AuditLog[]>([]);

  const [timeline, setTimeline] =
    useState<TimelineItem[]>([]);

  async function loadCase(
    id: string
  ) {
    
    const { data, error } =
      await supabase
        .from("child_records")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
      console.error(
  "loadCase error:",
  JSON.stringify(error, null, 2)
);
      return;
    }

    setChild(data);
  }

  async function loadIncidents(
    id: string
  ) {
    const { data } =
      await supabase
        .from("child_incidents")
        .select("*")
        .eq("child_id", id)
        .order(
          "incident_date",
          {
            ascending: false,
          }
        );

    setIncidents(data || []);
  }

async function loadNotes(
  id: string
) {
  console.log(
    "Loading notes for child:",
    id
  );

  const { data, error } =
    await supabase
      .from("case_notes")
      .select("*")
      .eq("child_id", id)
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  console.log(
    "Notes query result:",
    data
  );

  console.log(
    "Notes query error:",
    error
  );

  setNotes(data || []);
}

  async function loadDocuments(
    id: string
  ) {
    const { data } =
      await supabase
        .from("case_documents")
        .select("*")
        .eq("child_id", id)
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    setDocuments(data || []);
  }

  async function loadAuditLogs(
    id: string
  ) {
    const { data } =
      await supabase
        .from("audit_logs")
        .select("*")
        .eq("child_id", id)
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    setAuditLogs(data || []);
  }

  async function loadCaseData(
  id: string
) {
  await Promise.all([
    loadCase(id),
    loadIncidents(id),
    loadNotes(id),
    loadDocuments(id),
    loadAuditLogs(id),
  ]);
}

  return (
    <CaseContext.Provider
      value={{
        child,
        incidents,
        notes,
        documents,
        auditLogs,
        timeline,

        loadCase,
        loadIncidents,
        loadNotes,
        loadDocuments,
        loadAuditLogs,
        loadCaseData,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
}

export function useCase() {
  const context =
    useContext(CaseContext);

  if (!context) {
    throw new Error(
      "useCase must be used inside CaseProvider"
    );
  }

  return context;
}