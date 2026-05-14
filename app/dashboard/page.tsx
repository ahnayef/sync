import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Admin dashboard — Loop schedule management overview.",
};

const statCards = [
  { label: "Total Students", value: "2,418", change: "+12%", color: "#4f8ef7", icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )},
  { label: "Active Courses", value: "48", change: "+3", color: "#3fb950", icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  )},
  { label: "Teachers", value: "42", change: "+2", color: "#a371f7", icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )},
  { label: "Rooms", value: "28", change: "0", color: "#d29922", icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )},
];

const recentActivity = [
  { action: "Schedule imported", detail: "Fall 2026 — CSE Dept", time: "2 min ago", color: "#4f8ef7" },
  { action: "New teacher added", detail: "Dr. Sara Ali — Mathematics", time: "1 hr ago", color: "#3fb950" },
  { action: "Course updated", detail: "CSE405 — Software Engineering", time: "3 hr ago", color: "#a371f7" },
  { action: "Room 404 added", detail: "Capacity: 60", time: "Yesterday", color: "#d29922" },
  { action: "Schedule conflict detected", detail: "CSE301 & CSE303 — Room 401", time: "Yesterday", color: "#f85149" },
];

export default function DashboardPage() {
  return (
    <div style={{ padding: "32px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em", marginBottom: "6px" }}>
          Dashboard
        </h1>
        <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
          Overview of Loop — schedule management system
        </p>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {statCards.map((card) => (
          <div
            key={card.label}
            id={`stat-${card.label.toLowerCase().replace(/\s+/g, "-")}`}
            style={{
              borderRadius: "14px",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-surface)",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: `${card.color}18`,
                  border: `1px solid ${card.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: card.color,
                }}
              >
                {card.icon}
              </div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: card.change.startsWith("+") ? "#3fb950" : card.change === "0" ? "var(--color-text-muted)" : "#f85149",
                  background: card.change.startsWith("+") ? "rgba(63,185,80,0.1)" : "rgba(72,79,88,0.2)",
                  padding: "3px 8px",
                  borderRadius: "5px",
                }}
              >
                {card.change.startsWith("+") ? card.change : card.change === "0" ? "—" : card.change} this month
              </span>
            </div>
            <p style={{ fontSize: "28px", fontWeight: 800, color: "var(--color-text-primary)", letterSpacing: "-0.02em", marginBottom: "4px" }}>
              {card.value}
            </p>
            <p style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "20px" }}>
        {/* Recent Activity */}
        <div
          style={{
            borderRadius: "14px",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-surface)",
            padding: "24px",
          }}
        >
          <h2 style={{ fontSize: "15px", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "20px" }}>
            Recent Activity
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {recentActivity.map((item, i) => (
              <div
                key={i}
                style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: item.color,
                    boxShadow: `0 0 8px ${item.color}80`,
                    marginTop: "5px",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-text-primary)", marginBottom: "2px" }}>
                    {item.action}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{item.detail}</p>
                </div>
                <span style={{ fontSize: "11px", color: "var(--color-text-muted)", flexShrink: 0 }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            borderRadius: "14px",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-surface)",
            padding: "24px",
          }}
        >
          <h2 style={{ fontSize: "15px", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "20px" }}>
            Quick Actions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { label: "Import Schedule", href: "/dashboard/manage-schedule", color: "#4f8ef7", desc: "Upload Excel file" },
              { label: "Add Teacher", href: "/dashboard/manage-teachers", color: "#3fb950", desc: "New staff member" },
              { label: "Add Course", href: "/dashboard/manage-courses", color: "#a371f7", desc: "Create course entry" },
              { label: "Add Room", href: "/dashboard/manage-rooms", color: "#d29922", desc: "Register a room" },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                id={`quick-action-${action.label.toLowerCase().replace(/\s+/g, "-")}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px",
                  borderRadius: "10px",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-bg-elevated)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "8px",
                    background: `${action.color}15`,
                    border: `1px solid ${action.color}25`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <div style={{ width: "14px", height: "14px", borderRadius: "3px", background: action.color, opacity: 0.8 }} />
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-text-primary)", marginBottom: "1px" }}>
                    {action.label}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{action.desc}</p>
                </div>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-text-muted)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginLeft: "auto" }}
                >
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
