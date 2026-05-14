"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/(users)/routine",
    label: "Routine",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    href: "/(users)/courses",
    label: "Courses",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    href: "/(users)/profile",
    label: "Profile",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

export default function UserSidebar() {
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
        id="sidebar-logo"
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
        <span
          style={{
            fontSize: "17px",
            fontWeight: 700,
            color: "var(--color-text-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          Loop
        </span>
      </Link>

      {/* Section Label */}
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
        Student
      </p>

      {/* Nav Items */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              id={`sidebar-${item.label.toLowerCase()}`}
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

      {/* Bottom: Public Links + Logout */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "24px",
          borderTop: "1px solid var(--color-border)",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        {[
          { href: "/about", label: "About Us" },
          { href: "/contact", label: "Contact Us" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "13px",
              color: "var(--color-text-muted)",
              transition: "color 0.2s ease",
            }}
          >
            {link.label}
          </Link>
        ))}
        <button
          id="sidebar-logout"
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
