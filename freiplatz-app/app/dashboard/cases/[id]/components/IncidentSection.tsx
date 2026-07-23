"use client";

import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeader from "@/components/ui/SectionHeader";

import { useCase } from "../CaseContext";

export default function IncidentSection() {

  const {
    incidents,
  } = useCase();
}