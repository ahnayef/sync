import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Admin dashboard — Loop schedule management overview.",
};

const statCards = [
  {
    label: "Total Students",
    value: "2,418",
    change: "+12%",
    colorClass: "text-blue-400 bg-blue-500/10 border-blue-400/20",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Active Courses",
    value: "48",
    change: "+3",
    colorClass: "text-green-400 bg-green-500/10 border-green-400/20",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    label: "Teachers",
    value: "42",
    change: "+2",
    colorClass: "text-violet-400 bg-violet-500/10 border-violet-400/20",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: "Rooms",
    value: "28",
    change: "0",
    colorClass: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
];

const recentActivity = [
  {
    action: "Schedule imported",
    detail: "Fall 2026 — CSE Dept",
    time: "2 min ago",
    colorClass: "bg-blue-500/20",
  },
  {
    action: "New teacher added",
    detail: "Dr. Sara Ali — Mathematics",
    time: "1 hr ago",
    colorClass: "bg-green-500/20",
  },
  {
    action: "Course updated",
    detail: "CSE405 — Software Engineering",
    time: "3 hr ago",
    colorClass: "bg-violet-500/20",
  },
  {
    action: "Room 404 added",
    detail: "Capacity: 60",
    time: "Yesterday",
    colorClass: "bg-amber-500/20",
  },
  {
    action: "Schedule conflict detected",
    detail: "CSE301 & CSE303 — Room 401",
    time: "Yesterday",
    colorClass: "bg-red-500/20",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[26px] font-bold text-[var(--color-text-primary)] -tracking-[0.02em] mb-1">
          Dashboard
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Overview of Loop — schedule management system
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 mb-8 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
        {statCards.map((card) => (
          <div
            key={card.label}
            id={`stat-${card.label.toLowerCase().replace(/\s+/g, "-")}`}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`${card.colorClass} w-10 h-10 rounded-md flex items-center justify-center border`}
              >
                {card.icon}
              </div>
              <span
                className={`text-xs font-semibold ${card.change.startsWith("+") ? "text-green-400 bg-green-500/10" : card.change === "0" ? "text-[var(--color-text-muted)] bg-transparent" : "text-red-500 bg-red-500/10"} px-2.5 py-1 rounded`}
              >
                {card.change.startsWith("+")
                  ? card.change
                  : card.change === "0"
                    ? "—"
                    : card.change}{" "}
                this month
              </span>
            </div>
            <p className="text-2xl font-extrabold text-[var(--color-text-primary)] tracking-tight mb-1">
              {card.value}
            </p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-5 [grid-template-columns:1.4fr_1fr]">
        {/* Recent Activity */}
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-5">
            Recent Activity
          </h2>
          <div className="flex flex-col gap-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div
                  className={`${item.colorClass} rounded-full w-2.5 h-2.5 mt-1 flex-shrink-0`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] mb-0.5">
                    {item.action}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {item.detail}
                  </p>
                </div>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-5">
            Quick Actions
          </h2>
          <div className="flex flex-col gap-2.5">
            {[
              {
                label: "Import Schedule",
                href: "/dashboard/manage-schedule",
                colorClass: "bg-blue-500/10 border-blue-500/20",
                desc: "Upload Excel file",
              },
              {
                label: "Add Teacher",
                href: "/dashboard/manage-teachers",
                colorClass: "bg-green-500/10 border-green-500/20",
                desc: "New staff member",
              },
              {
                label: "Add Course",
                href: "/dashboard/manage-courses",
                colorClass: "bg-violet-500/10 border-violet-500/20",
                desc: "Create course entry",
              },
              {
                label: "Add Room",
                href: "/dashboard/manage-rooms",
                colorClass: "bg-amber-500/10 border-amber-500/20",
                desc: "Register a room",
              },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                id={`quick-action-${action.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex items-center gap-3 p-3.5 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] no-underline transition-all"
              >
                <div
                  className={`${action.colorClass} w-8 h-8 rounded-md border flex items-center justify-center flex-shrink-0`}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-sm opacity-80"
                    style={{ background: "currentColor" }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)] mb-0.5">
                    {action.label}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {action.desc}
                  </p>
                </div>
                <svg
                  className="ml-auto"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-text-muted)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
