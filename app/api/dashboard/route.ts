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

// Bangladesh Time (UTC+6)
const getBangladeshDate = () => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * 6);
};

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const bdDate = getBangladeshDate();
    const daysMap = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    let dayName = daysMap[bdDate.getDay()];
    const currentTime = bdDate.toTimeString().split(" ")[0]; // "HH:MM:SS"

    // If it's Friday or Saturday, let's default dayName to 'sunday' for today's stats/schedule
    // so the dashboard doesn't look empty when evaluated on weekends, but we will pass a flag.
    const isWeekend = dayName === "friday" || dayName === "saturday";
    const queryDay = isWeekend ? "sunday" : dayName;

    // 1. Top Summary Counts
    const [deptCountRows] = await db.execute("SELECT COUNT(*) as count FROM departments");
    const [teacherCountRows] = await db.execute("SELECT COUNT(*) as count FROM teachers");
    const [courseCountRows] = await db.execute("SELECT COUNT(*) as count FROM courses");
    const [batchCountRows] = await db.execute("SELECT COUNT(*) as count FROM batches");
    const [roomCountRows] = await db.execute("SELECT COUNT(*) as count FROM rooms");
    const [weeklyClassesRows] = await db.execute("SELECT COUNT(*) as count FROM schedules");
    
    // Today's classes count
    const [todaysClassesRows] = await db.execute("SELECT COUNT(*) as count FROM schedules WHERE day = ?", [queryDay]);

    // Free Rooms Right Now Count
    const [freeRoomsRows] = await db.execute(`
      SELECT COUNT(*) as count FROM rooms r
      WHERE r.id NOT IN (
        SELECT DISTINCT s.room_id FROM schedules s
        WHERE s.day = ?
          AND s.room_id IS NOT NULL
          AND ? BETWEEN s.start_time AND s.end_time
      )
    `, [queryDay, currentTime]);

    const stats = {
      totalDepartments: Number((deptCountRows as any)[0]?.count || 0),
      totalTeachers: Number((teacherCountRows as any)[0]?.count || 0),
      totalCourses: Number((courseCountRows as any)[0]?.count || 0),
      totalBatches: Number((batchCountRows as any)[0]?.count || 0),
      totalRooms: Number((roomCountRows as any)[0]?.count || 0),
      totalWeeklyClasses: Number((weeklyClassesRows as any)[0]?.count || 0),
      todaysClasses: Number((todaysClassesRows as any)[0]?.count || 0),
      freeRoomsRightNow: Number((freeRoomsRows as any)[0]?.count || 0),
      isWeekend,
      currentDay: dayName,
      evaluationDay: queryDay,
    };

    // 2. Today's Schedule Details
    const [todayScheduleRows] = await db.execute(`
      SELECT s.id, s.day, s.section,
             TIME_FORMAT(s.start_time, '%H:%i') as start_time,
             TIME_FORMAT(s.end_time, '%H:%i') as end_time,
             c.code as course_code, c.name as course_name, c.is_lab,
             t.name as teacher_name, t.short as teacher_short,
             b.name as batch_name, b.session as batch_session,
             r.number as room_number, r.title as room_title, r.room_type, r.capacity,
             d.name as department_name
      FROM schedules s
      LEFT JOIN courses c ON s.course_id = c.id
      LEFT JOIN teachers t ON s.teacher_id = t.id
      LEFT JOIN batches b ON s.batch_id = b.id
      LEFT JOIN rooms r ON s.room_id = r.id
      LEFT JOIN departments d ON s.department_id = d.id
      WHERE s.day = ?
      ORDER BY s.start_time ASC
    `, [queryDay]);

    // 3. Weekly Heatmap Data (Times & Days)
    const [weeklySchedules] = await db.execute(`
      SELECT s.day, TIME_FORMAT(s.start_time, '%H:%i') as start_time, TIME_FORMAT(s.end_time, '%H:%i') as end_time,
             d.name as department_name
      FROM schedules s
      LEFT JOIN departments d ON s.department_id = d.id
    `);

    // 4. Room Analytics
    // Room Weekly Occupancy (minutes)
    const [roomOccupancy] = await db.execute(`
      SELECT r.id, r.number, r.title, r.room_type, r.capacity,
             COALESCE(SUM(TIMESTAMPDIFF(MINUTE, s.start_time, s.end_time)), 0) as total_minutes,
             COUNT(s.id) as class_count
      FROM rooms r
      LEFT JOIN schedules s ON r.id = s.room_id
      GROUP BY r.id
      ORDER BY total_minutes DESC
    `);

    // Room Free/Occupied count today
    const [roomTodayActivity] = await db.execute(`
      SELECT r.id, r.number, r.room_type,
             (SELECT COUNT(*) FROM schedules s WHERE s.room_id = r.id AND s.day = ?) as today_classes
      FROM rooms r
    `, [queryDay]);

    // 5. Teacher Analytics
    // Teacher workload
    const [teacherWorkload] = await db.execute(`
      SELECT t.id, t.name, t.short, d.name as department_name,
             COALESCE(SUM(TIMESTAMPDIFF(MINUTE, s.start_time, s.end_time)), 0) as total_minutes,
             COUNT(s.id) as class_count
      FROM teachers t
      LEFT JOIN schedules s ON t.id = s.teacher_id
      LEFT JOIN departments d ON t.department_id = d.id
      GROUP BY t.id
      ORDER BY total_minutes DESC
    `);

    // Most active teachers today
    const [activeTeachersToday] = await db.execute(`
      SELECT t.id, t.name, t.short, COUNT(s.id) as today_classes
      FROM teachers t
      JOIN schedules s ON t.id = s.teacher_id
      WHERE s.day = ?
      GROUP BY t.id
      ORDER BY today_classes DESC
      LIMIT 6
    `, [queryDay]);

    // Teachers grouped by department
    const [teachersByDept] = await db.execute(`
      SELECT d.id, d.name as department_name, d.full_name, COUNT(t.id) as teacher_count
      FROM departments d
      LEFT JOIN teachers t ON d.id = t.department_id
      GROUP BY d.id
      ORDER BY teacher_count DESC
    `);

    // 6. Department Analytics
    // Classes per department
    const [deptClasses] = await db.execute(`
      SELECT d.id, d.name as department_name, COUNT(s.id) as class_count
      FROM departments d
      LEFT JOIN schedules s ON d.id = s.department_id
      GROUP BY d.id
      ORDER BY class_count DESC
    `);

    // Batches per department
    const [deptBatches] = await db.execute(`
      SELECT d.id, d.name as department_name, COUNT(b.id) as batch_count
      FROM departments d
      LEFT JOIN batches b ON d.id = b.department_id
      GROUP BY d.id
    `);

    // Course Catalog vs Scheduled Routines per department
    const [deptLabTheory] = await db.execute(`
      SELECT d.id, d.name as department_name,
             (SELECT COUNT(*) FROM courses c WHERE c.department_id = d.id) as total_courses,
             (SELECT COUNT(*) FROM schedules s WHERE s.department_id = d.id) as scheduled_classes
      FROM departments d
      ORDER BY scheduled_classes DESC
    `);

    // 7. Time Analytics (Weekly class distribution by day)
    const [dailyDistribution] = await db.execute(`
      SELECT s.day, COUNT(*) as count
      FROM schedules s
      GROUP BY s.day
    `);

    // 8. Recent Activity Panel
    // Fetch recent modifications from Schedules, Rooms, and Teachers
    const [recentSchedules] = await db.execute(`
      SELECT s.id, 'schedule' as type, s.updated_at as timestamp,
             c.code as details1, t.short as details2, r.number as details3, b.name as details4
      FROM schedules s
      LEFT JOIN courses c ON s.course_id = c.id
      LEFT JOIN teachers t ON s.teacher_id = t.id
      LEFT JOIN rooms r ON s.room_id = r.id
      LEFT JOIN batches b ON s.batch_id = b.id
      ORDER BY s.updated_at DESC
      LIMIT 8
    `);

    const [recentRooms] = await db.execute(`
      SELECT r.id, 'room' as type, r.created_at as timestamp,
             CAST(r.number AS CHAR) as details1, r.room_type as details2, r.building_name as details3, '' as details4
      FROM rooms r
      ORDER BY r.created_at DESC
      LIMIT 5
    `);

    const [recentTeachers] = await db.execute(`
      SELECT t.id, 'teacher' as type, t.created_at as timestamp,
             t.name as details1, t.short as details2, d.name as details3, '' as details4
      FROM teachers t
      LEFT JOIN departments d ON t.department_id = d.id
      ORDER BY t.created_at DESC
      LIMIT 5
    `);

    // Combine recent activities and sort by timestamp
    const activities = [
      ...(recentSchedules as any[]).map(x => ({ ...x, timestamp: new Date(x.timestamp).getTime() })),
      ...(recentRooms as any[]).map(x => ({ ...x, timestamp: new Date(x.timestamp).getTime() })),
      ...(recentTeachers as any[]).map(x => ({ ...x, timestamp: new Date(x.timestamp).getTime() })),
    ];
    activities.sort((a, b) => b.timestamp - a.timestamp);
    const recentActivity = activities.slice(0, 10);

    return NextResponse.json({
      stats,
      todaySchedule: todayScheduleRows || [],
      weeklySchedules: weeklySchedules || [],
      roomAnalytics: {
        occupancy: roomOccupancy || [],
        todayActivity: roomTodayActivity || [],
      },
      teacherAnalytics: {
        workload: teacherWorkload || [],
        activeToday: activeTeachersToday || [],
        byDept: teachersByDept || [],
      },
      departmentAnalytics: {
        classes: deptClasses || [],
        batches: deptBatches || [],
        labTheory: deptLabTheory || [],
      },
      timeAnalytics: {
        dailyDistribution: dailyDistribution || [],
      },
      recentActivity,
    });
  } catch (error) {
    console.error("Dashboard deep stats error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
