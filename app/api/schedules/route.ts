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
        p.id as program_id,
        p.name as program_name,
        d.id as department_id,
        d.name as department_name,
        r.id as room_id,
        r.number as room_number,
        r.title as room_title
      FROM schedules s
      LEFT JOIN courses c ON s.course_id = c.id
      LEFT JOIN teachers t ON s.teacher_id = t.id
      LEFT JOIN batches b ON s.batch_id = b.id
      LEFT JOIN programs p ON s.program_id = p.id
      LEFT JOIN departments d ON p.department_id = d.id
      LEFT JOIN rooms r ON s.room_id = r.id
      ORDER BY FIELD(s.day, 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday'), s.start_time ASC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Fetch schedules err:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const {
      day,
      start_time,
      end_time,
      section,
      course_id,
      teacher_id,
      batch_id,
      program_id,
      room_id,
    } = await req.json();

    if (!day || !start_time || !end_time || !course_id) {
      return NextResponse.json(
        { error: "Missing required fields: day, start_time, end_time, course_id" },
        { status: 400 }
      );
    }

    const [result]: any = await db.execute(
      `INSERT INTO schedules 
       (day, start_time, end_time, section, course_id, teacher_id, batch_id, program_id, room_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [day, start_time, end_time, section || "none", course_id, teacher_id || null, batch_id || null, program_id || null, room_id || null]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error: any) {
    console.error("Create schedule err:", error);
    return NextResponse.json({ error: error.message || "Database error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const {
      id,
      day,
      start_time,
      end_time,
      section,
      course_id,
      teacher_id,
      batch_id,
      program_id,
      room_id,
    } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing schedule ID" }, { status: 400 });
    }

    await db.execute(
      `UPDATE schedules 
       SET day = ?, start_time = ?, end_time = ?, section = ?, course_id = ?, teacher_id = ?, batch_id = ?, program_id = ?, room_id = ?
       WHERE id = ?`,
      [day, start_time, end_time, section || "none", course_id, teacher_id || null, batch_id || null, program_id || null, room_id || null, id]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update schedule err:", error);
    return NextResponse.json({ error: error.message || "Database error" }, { status: 500 });
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
