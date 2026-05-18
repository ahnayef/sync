import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";
import { syncDepartmentSchedule } from "@/lib/schedule-parser";

export const dynamic = "force-dynamic";

const checkAuth = async () => {
  const session = await getServerSession(authOptions);
  return !!session && ["admin", "moderator"].includes((session.user as { role?: string })?.role || "");
};

// GET /api/schedules/sync - retrieve configurations and logs
export async function GET(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [depts] = await db.execute(`
      SELECT id, name, full_name, sheet_link, sync_enabled, last_sync_at 
      FROM departments
      ORDER BY name ASC
    `);

    const [logs] = await db.execute(`
      SELECT l.id, l.department_id, d.name as department_name, l.status, l.message, l.created_at
      FROM sheet_sync_logs l
      JOIN departments d ON l.department_id = d.id
      ORDER BY l.created_at DESC
      LIMIT 100
    `);

    return NextResponse.json({ departments: depts, logs });
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
    const { departmentId, sheetLink, syncEnabled, triggerNow } = body;

    if (!departmentId) {
      return NextResponse.json({ error: "Missing departmentId" }, { status: 400 });
    }

    if (triggerNow) {
      // Trigger sync manually right now
      const linkToUse = sheetLink !== undefined ? sheetLink : await getDepartmentLink(departmentId);
      if (!linkToUse) {
        return NextResponse.json({ error: "No Google Sheet link configured for this department." }, { status: 400 });
      }

      const result = await syncDepartmentSchedule(Number(departmentId), linkToUse);
      return NextResponse.json({ success: true, message: `Sync successful! ${result.inserted} schedule items imported.`, result });
    } else {
      // Save configuration settings
      await db.execute(
        `UPDATE departments 
         SET sheet_link = ?, sync_enabled = ?
         WHERE id = ?`,
        [
          sheetLink !== undefined ? (sheetLink === "" ? null : sheetLink) : null,
          syncEnabled !== undefined ? Boolean(syncEnabled) : false,
          Number(departmentId)
        ]
      );

      return NextResponse.json({ success: true, message: "Configuration saved successfully." });
    }
  } catch (error) {
    console.error("Failed to update or run sync:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Sync failed due to an internal error."
    }, { status: 500 });
  }
}

async function getDepartmentLink(departmentId: number): Promise<string | null> {
  const [rows]: any = await db.execute("SELECT sheet_link FROM departments WHERE id = ?", [departmentId]);
  return rows?.[0]?.sheet_link || null;
}
