"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/routine", label: "Routine" },
  { href: "/courses", label: "Courses" },
  { href: "/profile", label: "Profile" },
];

export default function UserNavbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--color-border)",
        background: "rgba(8, 12, 16, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          id="user-nav-logo"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            flexShrink: 0,
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
            }}
          >
            L
          </div>
          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Loop
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                id={`user-nav-${item.label.toLowerCase()}`}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  textDecoration: "none",
                  color: isActive ? "var(--color-accent)" : "var(--color-text-secondary)",
                  background: isActive ? "var(--color-accent-muted)" : "transparent",
                  border: isActive
                    ? "1px solid rgba(79,142,247,0.2)"
                    : "1px solid transparent",
                  transition: "all 0.2s ease",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* User info + Logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Avatar */}
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4f8ef7, #a371f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: 700,
              color: "white",
              boxShadow: "0 0 12px rgba(79,142,247,0.25)",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            J
          </div>

          {/* Name + ID */}
          <div style={{ lineHeight: 1.3 }}>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--color-text-primary)",
                margin: 0,
              }}
            >
              Jane Doe
            </p>
            <p
              style={{
                fontSize: "11px",
                color: "var(--color-text-muted)",
                margin: 0,
              }}
            >
              STU-2024-001
            </p>
          </div>

          {/* Divider */}
          <div
            style={{
              width: "1px",
              height: "28px",
              background: "var(--color-border)",
            }}
          />

          {/* Logout */}
          <button
            id="user-nav-logout"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "8px",
              border: "1px solid var(--color-border)",
              background: "transparent",
              color: "var(--color-text-secondary)",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}
