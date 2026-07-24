import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ExportRow extends RowDataPacket {
  day: string;
  start_time: string;
  end_time: string;
  course_code: string;
  course_name: string;
  is_lab: number | boolean;
  section: string;
  teacher_name: string;
  teacher_short: string;
  room_number: number | null;
  room_title: string | null;
  batch_name: string | null;
  batch_session: string | null;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  if (!session || !["admin", "moderator"].includes(role || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const programId = searchParams.get("program_id");
  const batchId = searchParams.get("batch_id");

  if (!programId) {
    return NextResponse.json({ error: "program_id is required" }, { status: 400 });
  }

  try {
    const params: (string | number)[] = [Number(programId)];
    let batchFilter = "";
    if (batchId) {
      batchFilter = "AND s.batch_id = ?";
      params.push(Number(batchId));
    }

    const [rows] = await db.execute<ExportRow[]>(
      `SELECT
         s.day,
         TIME_FORMAT(s.start_time, '%H:%i') AS start_time,
         TIME_FORMAT(s.end_time,   '%H:%i') AS end_time,
         c.code    AS course_code,
         c.name    AS course_name,
         c.is_lab,
         s.section,
         t.name    AS teacher_name,
         t.short   AS teacher_short,
         r.number  AS room_number,
         r.title   AS room_title,
         b.name    AS batch_name,
         b.session AS batch_session
       FROM schedules s
       LEFT JOIN courses  c ON s.course_id  = c.id
       LEFT JOIN teachers t ON s.teacher_id = t.id
       LEFT JOIN rooms    r ON s.room_id    = r.id
       LEFT JOIN batches  b ON s.batch_id   = b.id
       WHERE s.program_id = ?
       ${batchFilter}
       GROUP BY c.id, t.id, s.day, s.start_time, s.end_time, r.id, s.section
       ORDER BY
         FIELD(s.day, 'sunday','monday','tuesday','wednesday','thursday'),
         s.start_time ASC`,
      params
    );

    const formatted = rows.map((r) => ({
      ...r,
      day: r.day.charAt(0).toUpperCase() + r.day.slice(1),
      is_lab: Boolean(r.is_lab),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET /api/schedule/export error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
