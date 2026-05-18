import type { Metadata } from "next";
import db from "@/lib/db";
import DashboardClient from "./DashboardClient";
import { FiUsers, FiBook, FiMap, FiCalendar, FiHome } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default async function DashboardPage() {
  try {
    const [usersRows] = await db.execute(`SELECT COUNT(*) as usersCount FROM users`);
    const users = (usersRows as any)[0]?.usersCount ?? 0;

    const [deptRows] = await db.execute(`SELECT COUNT(*) as departmentsCount FROM departments`);
    const departments = (deptRows as any)[0]?.departmentsCount ?? 0;

    const [teacherRows] = await db.execute(`SELECT COUNT(*) as teachersCount FROM teachers`);
    const teachers = (teacherRows as any)[0]?.teachersCount ?? 0;

    const [courseRows] = await db.execute(`SELECT COUNT(*) as coursesCount FROM courses`);
    const courses = (courseRows as any)[0]?.coursesCount ?? 0;

    const [roomRows] = await db.execute(`SELECT COUNT(*) as roomsCount FROM rooms`);
    const rooms = (roomRows as any)[0]?.roomsCount ?? 0;

    const [batchRows] = await db.execute(`SELECT COUNT(*) as batchesCount FROM batches`);
    const batches = (batchRows as any)[0]?.batchesCount ?? 0;

    const [scheduleRows] = await db.execute(`SELECT COUNT(*) as schedulesCount FROM schedules`);
    const schedules = (scheduleRows as any)[0]?.schedulesCount ?? 0;

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

    const stats = { users, departments, teachers, courses, rooms, batches, schedules, recent: recentRows };

    // per-day counts for small client chart
    const [perDayRows] = await db.execute(`SELECT day, COUNT(*) as cnt FROM schedules GROUP BY day`);
    const perDayObj: Record<string, number> = {};
    (perDayRows as any[]).forEach((r) => {
      perDayObj[(r.day || "").toLowerCase()] = Number(r.cnt || 0);
    });

    const cards = [
      { key: 'users', label: 'Users', icon: <FiUsers />, color: 'from-[#4f8ef7] to-[#6f6bf7]' },
      { key: 'departments', label: 'Departments', icon: <FiMap />, color: 'from-[#6f6bf7] to-[#a371f7]' },
      { key: 'teachers', label: 'Teachers', icon: <FiUsers />, color: 'from-[#3fb950] to-[#63d07f]' },
      { key: 'courses', label: 'Courses', icon: <FiBook />, color: 'from-[#f7a64f] to-[#f76f6f]' },
      { key: 'rooms', label: 'Rooms', icon: <FiHome />, color: 'from-[#8aa6ff] to-[#4f8ef7]' },
      { key: 'schedules', label: 'Schedules', icon: <FiCalendar />, color: 'from-[#a371f7] to-[#6f6bf7]' },
    ];

    return (
      <div className="relative p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Admin Dashboard</h1>
              <p className="text-sm text-[var(--color-text-secondary)]">Overview of the main entities and recent activity</p>
            </div>
          </header>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {cards.map((c) => (
              <div key={c.key} className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-gradient-to-b from-[var(--color-bg-surface)] to-[var(--color-bg-elevated)] p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={`flex-shrink-0 rounded-full p-3 text-white shadow-md bg-gradient-to-br ${c.color}`}>
                    <div className="w-6 h-6 flex items-center justify-center">{c.icon}</div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">{c.label}</div>
                    <div className="mt-1 flex items-baseline gap-3">
                      <div className="text-2xl font-extrabold leading-tight text-[var(--color-text-primary)]">{(stats as any)[c.key]}</div>
                      <div className="text-sm text-[var(--color-text-secondary)]">{c.key === 'users' ? 'total' : ''}</div>
                    </div>
                  </div>
                </div>

                <div className="absolute right-3 bottom-3 text-[10px] text-[var(--color-text-muted)]">View</div>
              </div>
            ))}
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">Recent schedules</h2>
            {(!stats.recent || (stats.recent as any[]).length === 0) ? (
              <div className="text-sm text-[var(--color-text-secondary)]">No recent schedules</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)]">
                      {['Day','Time','Course','Teacher','Batch','Room'].map(h => (
                        <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(stats.recent as any[]).map((r: any) => (
                      <tr key={r.id} className="border-b border-[var(--color-border)] bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-elevated)]/40">
                        <td className="px-3 py-3 text-sm text-[var(--color-text-primary)]">{r.day}</td>
                        <td className="px-3 py-3 text-sm text-[var(--color-text-secondary)]">{r.start_time} — {r.end_time}</td>
                        <td className="px-3 py-3 text-sm font-semibold text-[var(--color-text-primary)]">{r.course_code}</td>
                        <td className="px-3 py-3 text-sm text-[var(--color-text-secondary)]">{r.teacher_short || '—'}</td>
                        <td className="px-3 py-3 text-sm text-[var(--color-text-secondary)]">{r.batch_name || '—'}</td>
                        <td className="px-3 py-3 text-sm text-[var(--color-text-secondary)]">{r.room_number || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">Live</h2>
            <DashboardClient initialStats={stats} initialPerDay={perDayObj} />
          </section>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Dashboard render error:', error);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">Unable to load stats.</p>
      </div>
    );
  }
}
