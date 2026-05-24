import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  fetchGoogleSheetBuffer,
  parseWorkbook,
  resolveRows,
  applyRows,
  type RawScheduleRow
} from "@/lib/schedule-parser";
import { getPostHogClient } from "@/lib/posthog-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const checkAuth = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const role = (session.user as { role?: string })?.role || "";
  return ["admin", "moderator"].includes(role) ? session : null;
};

export async function POST(req: Request) {
  const session = await checkAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const action = String(formData.get("action") || "preview");
    const departmentIdValue = formData.get("departmentId");
    const departmentNameValue = formData.get("departmentName");
    const departmentId = departmentIdValue ? Number(departmentIdValue) : null;
    const departmentName = departmentNameValue ? String(departmentNameValue) : null;
    let rawRows: RawScheduleRow[] = [];

    if (action === "apply") {
      const rowsJson = formData.get("rows");
      if (!rowsJson) return NextResponse.json({ error: "Missing parsed rows." }, { status: 400 });
      rawRows = JSON.parse(String(rowsJson)) as RawScheduleRow[];
    } else {
      const file = formData.get("file");
      const googleSheet = formData.get("googleSheet");

      if (file instanceof File) {
        rawRows = await parseWorkbook(Buffer.from(await file.arrayBuffer()), file.name);
      } else if (googleSheet) {
        const sheet = await fetchGoogleSheetBuffer(String(googleSheet));
        rawRows = await parseWorkbook(sheet.buffer, sheet.fileName, sheet.gid);
      } else {
        return NextResponse.json({ error: "Upload a file or provide a Google Sheet link." }, { status: 400 });
      }
    }

    const rows = await resolveRows(rawRows, Number.isNaN(departmentId) ? null : departmentId, departmentName);
    const summary = {
      total: rows.length,
      ok: rows.filter((row) => row.status === "ok").length,
      warnings: rows.filter((row) => row.status === "warning").length,
      errors: rows.filter((row) => row.status === "error").length,
    };

    if (action === "apply") {
      if (summary.errors > 0) {
        return NextResponse.json(
          { error: "Resolve schedule import errors before applying.", rows, summary },
          { status: 409 }
        );
      }

      const applied = await applyRows(rows);
      const posthog = getPostHogClient();
      const distinctId = (session.user as { email?: string })?.email ?? "unknown";
      posthog.capture({
        distinctId,
        event: "schedule_imported",
        properties: {
          total_rows: summary.total,
          ok_rows: summary.ok,
          warning_rows: summary.warnings,
          department_name: departmentName,
        },
      });
      return NextResponse.json({ success: true, rows, summary, ...applied });
    }

    return NextResponse.json({ rows, summary });
  } catch (error) {
    console.error("Schedule import error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not import schedule." },
      { status: 500 }
    );
  }
}
