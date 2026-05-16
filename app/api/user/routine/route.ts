import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch only the schedules that match the courses/teachers the student has followed
    const [rows] = await db.execute<RowDataPacket[]>(`
      SELECT 
        s.id, 
        c.code as course_code, 
        c.name as course_name, 
        t.name as teacher_name, 
        TIME_FORMAT(s.start_time, '%H:%i') as start_time, 
        TIME_FORMAT(s.end_time, '%H:%i') as end_time, 
        r.number as room_number, 
        s.day, 
        c.is_lab, 
        s.section
      FROM schedules s
      JOIN courses c ON s.course_id = c.id
      JOIN teachers t ON s.teacher_id = t.id
      JOIN rooms r ON s.room_id = r.id
      JOIN student_courses sc ON (s.course_id = sc.course_id AND s.teacher_id = sc.teacher_id)
      JOIN users u ON sc.student_id = u.id
      WHERE u.email = ?
      ORDER BY FIELD(s.day, 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday'), s.start_time ASC
    `, [session.user.email]);

    // Capitalize the day names to match frontend expectations
    const formatted = rows.map(r => ({
      ...r,
      day: r.day.charAt(0).toUpperCase() + r.day.slice(1),
      is_lab: Boolean(r.is_lab)
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET /api/user/routine error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
