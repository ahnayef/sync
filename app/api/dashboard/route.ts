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
    const [usersRows] = await db.execute(`SELECT COUNT(*) as usersCount FROM users`);
    const usersCount = (usersRows as any)[0]?.usersCount ?? 0;

    const [deptRows] = await db.execute(`SELECT COUNT(*) as departmentsCount FROM departments`);
    const departmentsCount = (deptRows as any)[0]?.departmentsCount ?? 0;

    const [teacherRows] = await db.execute(`SELECT COUNT(*) as teachersCount FROM teachers`);
    const teachersCount = (teacherRows as any)[0]?.teachersCount ?? 0;

    const [courseRows] = await db.execute(`SELECT COUNT(*) as coursesCount FROM courses`);
    const coursesCount = (courseRows as any)[0]?.coursesCount ?? 0;

    const [roomRows] = await db.execute(`SELECT COUNT(*) as roomsCount FROM rooms`);
    const roomsCount = (roomRows as any)[0]?.roomsCount ?? 0;

    const [batchRows] = await db.execute(`SELECT COUNT(*) as batchesCount FROM batches`);
    const batchesCount = (batchRows as any)[0]?.batchesCount ?? 0;

    const [scheduleRows] = await db.execute(`SELECT COUNT(*) as schedulesCount FROM schedules`);
    const schedulesCount = (scheduleRows as any)[0]?.schedulesCount ?? 0;

    // recent schedules (next/upcoming 6 by day order then time)
    const [recentRows] = await db.execute(`
      SELECT s.id, s.day, TIME_FORMAT(s.start_time, '%H:%i') as start_time, TIME_FORMAT(s.end_time, '%H:%i') as end_time, c.code as course_code, t.short as teacher_short, b.name as batch_name, r.number as room_number
      FROM schedules s
      LEFT JOIN courses c ON s.course_id = c.id
      LEFT JOIN teachers t ON s.teacher_id = t.id
      LEFT JOIN batches b ON s.batch_id = b.id
      LEFT JOIN rooms r ON s.room_id = r.id
      ORDER BY FIELD(s.day, 'sunday','monday','tuesday','wednesday','thursday'), s.start_time ASC
      LIMIT 6
    `);

    return NextResponse.json({
      users: Number(usersCount || 0),
      departments: Number(departmentsCount || 0),
      teachers: Number(teachersCount || 0),
      courses: Number(coursesCount || 0),
      rooms: Number(roomsCount || 0),
      batches: Number(batchesCount || 0),
      schedules: Number(schedulesCount || 0),
      recent: recentRows || [],
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
