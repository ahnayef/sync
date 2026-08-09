import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface RoutineRow extends RowDataPacket {
  id: number;
  course_code: string;
  course_name: string;
  teacher_name: string;
  start_time: string;
  end_time: string;
  room_number: number | null;
  day: string;
  is_lab: number | boolean;
  section: string;
  batch_session: string | null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch schedules matching the student's followed courses/teachers.
    // GROUP BY (course, teacher, day, time, room, section) collapses duplicate
    // rows that exist because a cross-batch course (e.g. ACM) is inserted once
    // per batch even though it is the same physical class.
    const [rows] = await db.execute<RoutineRow[]>(`
      SELECT 
        MIN(s.id) as id,
        c.code as course_code, 
        c.name as course_name, 
        t.name as teacher_name, 
        TIME_FORMAT(s.start_time, '%H:%i') as start_time, 
        TIME_FORMAT(s.end_time, '%H:%i') as end_time, 
        r.number as room_number, 
        s.day, 
        c.is_lab, 
        s.section,
        GROUP_CONCAT(DISTINCT b.session SEPARATOR ', ') as batch_session
      FROM schedules s
      JOIN courses c ON s.course_id = c.id
      JOIN teachers t ON s.teacher_id = t.id
      JOIN rooms r ON s.room_id = r.id
      LEFT JOIN batches b ON s.batch_id = b.id
      JOIN student_courses sc ON (s.course_id = sc.course_id AND s.teacher_id = sc.teacher_id AND (s.batch_id = sc.batch_id OR (s.batch_id IS NULL AND sc.batch_id IS NULL)))
      JOIN users u ON sc.student_id = u.id
      WHERE u.email = ?
      GROUP BY c.id, t.id, s.day, s.start_time, s.end_time, r.id, s.section
      ORDER BY FIELD(s.day, 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday'), s.start_time ASC
    `, [session.user.email]);

    // Capitalize the day names to match frontend expectations
    const formatted = rows.map(r => ({
      ...r,
      day: r.day.charAt(0).toUpperCase() + r.day.slice(1),
      is_lab: Boolean(r.is_lab)
    }));

    // Safety-net dedup: remove any remaining duplicates by logical slot identity
    // (course + teacher + day + start_time). Handles edge cases the GROUP BY
    // might miss (e.g. different room_id for the same physical slot).
    const seen = new Set<string>();
    const deduped = formatted.filter(r => {
      const key = `${r.course_code}|${r.teacher_name}|${r.day}|${r.start_time}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json(deduped);
  } catch (error) {
    console.error("GET /api/user/routine error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
