import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";
import { syncProgramSchedule } from "@/lib/schedule-parser";

export const dynamic = "force-dynamic";

const checkAuth = async () => {
  const session = await getServerSession(authOptions);
  return !!session && ["admin", "moderator"].includes((session.user as { role?: string })?.role || "");
};

// GET /api/schedules/sync - retrieve configurations and logs
export async function GET(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [programs] = await db.execute(`
      SELECT p.id, p.name, d.name as department_name, p.sheet_link, p.sync_enabled, p.last_sync_at 
      FROM programs p
      JOIN departments d ON p.department_id = d.id
      ORDER BY d.name ASC, p.name ASC
    `);

    const [logs] = await db.execute(`
      SELECT l.id, l.program_id, p.name as program_name, d.name as department_name, l.status, l.message, l.created_at
      FROM sheet_sync_logs l
      JOIN programs p ON l.program_id = p.id
      JOIN departments d ON p.department_id = d.id
      ORDER BY l.created_at DESC
      LIMIT 100
    `);

    return NextResponse.json({ programs, logs });
  } catch (error) {
    console.error("Failed to fetch sync configs:", error);
    return NextResponse.json({ error: "Failed to fetch sync configurations." }, { status: 500 });
  }
}

// POST /api/schedules/sync - update configuration or trigger manual sync
export async function POST(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { programId, sheetLink, syncEnabled, triggerNow } = body;

    if (!programId) {
      return NextResponse.json({ error: "Missing programId" }, { status: 400 });
    }

    if (triggerNow) {
      // Trigger sync manually right now
      const linkToUse = sheetLink !== undefined ? sheetLink : await getProgramLink(programId);
      if (!linkToUse) {
        return NextResponse.json({ error: "No Google Sheet link configured for this program." }, { status: 400 });
      }

      const result = await syncProgramSchedule(Number(programId), linkToUse);
      return NextResponse.json({ success: true, message: `Sync successful! ${result.inserted} schedule items imported.`, result });
    } else {
      // Save configuration settings
      await db.execute(
        `UPDATE programs 
         SET sheet_link = ?, sync_enabled = ?
         WHERE id = ?`,
        [
          sheetLink !== undefined ? (sheetLink === "" ? null : sheetLink) : null,
          syncEnabled !== undefined ? Boolean(syncEnabled) : false,
          Number(programId)
        ]
      );

      return NextResponse.json({ success: true, message: "Configuration saved successfully." });
    }
  } catch (error: any) {
    console.error("Failed to update or run sync. Exact error:", error);
    if (error && typeof error === 'object') {
      console.error("Error keys:", Object.keys(error));
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json({
      error: error instanceof Error ? error.message : (error?.message || "Sync failed due to an internal error.")
    }, { status: 500 });
  }
}

async function getProgramLink(programId: number): Promise<string | null> {
  const [rows]: any = await db.execute("SELECT sheet_link FROM programs WHERE id = ?", [programId]);
  return rows?.[0]?.sheet_link || null;
}
