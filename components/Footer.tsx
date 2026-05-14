import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-border)",
        background: "var(--color-bg-surface)",
        padding: "40px 24px",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "7px",
              background: "linear-gradient(135deg, #4f8ef7, #a371f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: 700,
              color: "white",
            }}
          >
            L
          </div>
          <span
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "var(--color-text-primary)",
            }}
          >
            Loop
          </span>
        </div>

        <div style={{ display: "flex", gap: "24px" }}>
          {[
            { href: "/", label: "Home" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: "13px",
                color: "var(--color-text-muted)",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p
          style={{
            fontSize: "13px",
            color: "var(--color-text-muted)",
          }}
        >
          © 2026 Loop. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
