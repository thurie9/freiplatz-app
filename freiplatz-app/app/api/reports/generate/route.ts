export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin }
  from "@/lib/supabase-admin";

import { generateCaseReport } from "@/lib/reports/case-report";

export async function POST(
  request: NextRequest
) {
  try {
    const {
      childId,
    } = await request.json();

    console.log(
      "Generating report for:",
      childId
    );

    const {
      data: child,
      error: childError,
    } = await supabaseAdmin
      .from("child_records")
      .select("*")
      .eq("id", childId)
      .single();

    if (
      childError ||
      !child
    ) {
      throw new Error(
        "Child record not found"
      );
    }

    const {
      data: incidents,
    } = await supabaseAdmin
      .from("child_incidents")
      .select("*")
      .eq(
        "child_id",
        childId
      );

    const {
      data: notes,
    } = await supabaseAdmin
      .from("case_notes")
      .select("*")
      .eq(
        "child_id",
        childId
      );

    const {
      data: documents,
    } = await supabaseAdmin
      .from("case_documents")
      .select("*")
      .eq(
        "child_id",
        childId
      );

    console.log(
      "Data loaded successfully"
    );

    const report = {
  child,

  incidents: incidents ?? [],

  notes: notes ?? [],

  documents: documents ?? [],

  timeline: [],
};

const pdfBytes =
  await generateCaseReport(
    report
  );

    return new NextResponse(
      Buffer.from(
        pdfBytes
      ),
      {
        headers: {
          "Content-Type":
            "application/pdf",
          "Content-Disposition":
            `attachment; filename="Fallbericht_${child.case_number}.pdf"`,
        },
      }
    );
  } catch (
    error: any
  ) {
    console.error(
      "REPORT ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          error?.message,
        stack:
          error?.stack,
      },
      {
        status: 500,
      }
    );
  }
}