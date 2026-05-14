"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
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
          id="nav-logo"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
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
          {publicLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                id={`nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  textDecoration: "none",
                  color: isActive
                    ? "var(--color-accent)"
                    : "var(--color-text-secondary)",
                  background: isActive ? "var(--color-accent-muted)" : "transparent",
                  transition: "all 0.2s ease",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Auth Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link
            href="/login"
            id="nav-login"
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              color: "var(--color-text-secondary)",
              border: "1px solid var(--color-border)",
              background: "transparent",
              transition: "all 0.2s ease",
            }}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            id="nav-signup"
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
              color: "white",
              background: "linear-gradient(135deg, #4f8ef7, #6f6bf7)",
              boxShadow: "0 0 20px rgba(79, 142, 247, 0.25)",
              transition: "all 0.2s ease",
            }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
}
