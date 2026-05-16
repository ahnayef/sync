import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";

// GET /api/user/courses
// Returns available unique course-teacher combinations and the user's followed courses
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Get current user ID
    const [userRows] = await db.execute<RowDataPacket[]>(
      "SELECT id FROM users WHERE email = ?",
      [session.user.email]
    );
    const userId = userRows[0]?.id;
    if (!userId) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 2. Fetch unique course-teacher combinations from schedules
    // Joining with courses and teachers to get names and codes
    const [availableRows] = await db.execute<RowDataPacket[]>(`
      SELECT DISTINCT 
        c.id as courseId, 
        c.code as courseCode, 
        c.name as courseTitle, 
        c.is_lab as isLab,
        t.id as teacherId, 
        t.name as teacherName
      FROM schedules s
      JOIN courses c ON s.course_id = c.id
      JOIN teachers t ON s.teacher_id = t.id
      ORDER BY c.code ASC, t.name ASC
    `);

    // 3. Fetch user's currently followed courses
    const [followedRows] = await db.execute<RowDataPacket[]>(
      "SELECT course_id, teacher_id FROM student_courses WHERE student_id = ?",
      [userId]
    );

    return NextResponse.json({
      available: availableRows,
      followed: followedRows.map(f => `${f.course_id}-${f.teacher_id}`)
    });
  } catch (error) {
    console.error("GET /api/user/courses error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/user/courses
// Updates the list of courses followed by the user
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { selections } = await req.json(); // Array of strings like "courseId-teacherId"
    if (!Array.isArray(selections)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // 1. Get current user ID
    const [userRows] = await db.execute<RowDataPacket[]>(
      "SELECT id FROM users WHERE email = ?",
      [session.user.email]
    );
    const userId = userRows[0]?.id;
    if (!userId) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 2. Update selections
    // Simplest way: Delete all and re-insert
    await db.execute("DELETE FROM student_courses WHERE student_id = ?", [userId]);

    if (selections.length > 0) {
      const values = selections.map(s => {
        const [courseId, teacherId] = s.split("-").map(Number);
        return [userId, courseId, teacherId];
      });

      // Bulk insert
      const query = "INSERT INTO student_courses (student_id, course_id, teacher_id) VALUES ?";
      await db.query(query, [values]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/user/courses error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
