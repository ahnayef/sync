import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";
import { ParsedRow, EntityType } from "@/lib/entity-importer";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "moderator"].includes((session.user as any)?.role || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const rows: ParsedRow[] = body.rows;
    const entityType: EntityType = body.entityType;

    if (!rows || !Array.isArray(rows)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const validRows = rows.filter(r => r.status === "ok");
    if (validRows.length === 0) {
      return NextResponse.json({ error: "No valid rows to import." }, { status: 400 });
    }

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      let insertedCount = 0;

      for (const row of validRows) {
        const d = row.data;
        if (entityType === "teacher") {
          await connection.execute(
            "INSERT INTO teachers (name, short, department_id) VALUES (?, ?, ?)",
            [d["name"], d["short name"], d._resolvedDeptId || null]
          );
        } else if (entityType === "batch") {
          await connection.execute(
            "INSERT INTO batches (name, session, program_id) VALUES (?, ?, ?)",
            [d["name"], d["session"], d._resolvedProgId]
          );
        } else if (entityType === "course") {
          await connection.execute(
            "INSERT INTO courses (name, code, is_lab, program_id) VALUES (?, ?, ?, ?)",
            [d["name"], d["code"], d._isLab ? 1 : 0, d._resolvedProgId]
          );
        } else if (entityType === "room") {
          await connection.execute(
            "INSERT INTO rooms (number, building_name, floor_number, room_type, capacity, title) VALUES (?, ?, ?, ?, ?, ?)",
            [d["number"], d["building name"], Number(d["floor number"]), d["room type"], Number(d["capacity"]), d["title"] || null]
          );
        }
        insertedCount++;
      }

      await connection.commit();
      return NextResponse.json({ success: true, inserted: insertedCount });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("Apply error:", error);
    return NextResponse.json({ error: error.message || "Failed to apply import." }, { status: 500 });
  }
}
