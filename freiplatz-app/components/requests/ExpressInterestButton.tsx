"use client";

import { useState } from "react";
import { expressInterest } from "@/lib/placements/express-interest";

interface Props {
  requestId: string;
}

export default function ExpressInterestButton({
  requestId,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleClick() {
    setLoading(true);

    try {
      await expressInterest(requestId);
      setDone(true);
    } catch (err) {
      console.error(err);
      alert("Interesse konnte nicht gespeichert werden.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <button disabled>
        ✓ Interesse gesendet
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
    >
      {loading
        ? "Speichern..."
        : "Ich habe Interesse"}
    </button>
  );
}