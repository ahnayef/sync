import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const checkAuth = async () => {
  const session = await getServerSession(authOptions);
  return !!session && ["admin", "moderator"].includes((session.user as { role?: string })?.role || "");
};

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [rows] = await db.execute(`
      SELECT
        s.id,
        s.day,
        s.section,
        TIME_FORMAT(s.start_time, '%H:%i:%s') as start_time,
        TIME_FORMAT(s.end_time, '%H:%i:%s') as end_time,
        c.id as course_id,
        c.code as course_code,
        c.name as course_name,
        c.is_lab,
        t.id as teacher_id,
        t.short as teacher_short,
        t.name as teacher_name,
        b.id as batch_id,
        b.name as batch_name,
        b.session as batch_session,
        d.id as department_id,
        d.name as department_name,
        r.id as room_id,
        r.number as room_number,
        r.title as room_title
      FROM schedules s
      LEFT JOIN courses c ON s.course_id = c.id
      LEFT JOIN teachers t ON s.teacher_id = t.id
      LEFT JOIN batches b ON s.batch_id = b.id
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN rooms r ON s.room_id = r.id
      ORDER BY FIELD(s.day, 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday'), s.start_time ASC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Fetch schedules err:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await db.execute("DELETE FROM schedules WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete schedule err:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
