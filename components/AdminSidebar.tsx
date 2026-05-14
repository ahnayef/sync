"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminNavItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/manage-teachers",
    label: "Teachers",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/manage-courses",
    label: "Courses",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/manage-rooms",
    label: "Rooms",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/manage-schedule",
    label: "Schedule",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "240px",
        minHeight: "100vh",
        borderRight: "1px solid var(--color-border)",
        background: "var(--color-bg-surface)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 12px",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        id="admin-sidebar-logo"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none",
          padding: "8px 12px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #4f8ef7, #a371f7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: 700,
            color: "white",
            boxShadow: "0 0 20px rgba(79, 142, 247, 0.3)",
            flexShrink: 0,
          }}
        >
          L
        </div>
        <div>
          <span
            style={{
              fontSize: "17px",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              letterSpacing: "-0.02em",
              display: "block",
            }}
          >
            Loop
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "var(--color-accent)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Admin
          </span>
        </div>
      </Link>

      {/* Nav Items */}
      <p
        style={{
          fontSize: "10px",
          fontWeight: 600,
          color: "var(--color-text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          padding: "0 12px",
          marginBottom: "8px",
        }}
      >
        Management
      </p>
      <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {adminNavItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              id={`admin-nav-${item.label.toLowerCase()}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
                color: isActive ? "var(--color-accent)" : "var(--color-text-secondary)",
                background: isActive ? "var(--color-accent-muted)" : "transparent",
                transition: "all 0.2s ease",
                border: isActive ? "1px solid rgba(79, 142, 247, 0.2)" : "1px solid transparent",
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "24px",
          borderTop: "1px solid var(--color-border)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* Admin badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 12px",
            borderRadius: "8px",
            background: "var(--color-bg-subtle)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4f8ef7, #a371f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: 700,
              color: "white",
              flexShrink: 0,
            }}
          >
            A
          </div>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text-primary)" }}>
              Admin
            </p>
            <p style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>admin@loop.edu</p>
          </div>
        </div>
        <button
          id="admin-logout"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 12px",
            borderRadius: "8px",
            background: "transparent",
            border: "none",
            color: "var(--color-danger)",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s ease",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Log out
        </button>
      </div>
    </aside>
  );
}
