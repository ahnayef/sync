import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your Loop account.",
};

export default function SignupPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg-base)",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          width: "600px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(163,113,247,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: "440px", position: "relative" }}>
        <Link
          href="/"
          id="signup-logo"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            marginBottom: "40px",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "9px",
              background: "linear-gradient(135deg, #4f8ef7, #a371f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: 700,
              color: "white",
              boxShadow: "0 0 24px rgba(79,142,247,0.4)",
            }}
          >
            L
          </div>
          <span style={{ fontSize: "20px", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>
            Loop
          </span>
        </Link>

        <div
          style={{
            borderRadius: "18px",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-surface)",
            padding: "40px 36px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }}
        >
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "8px", letterSpacing: "-0.02em" }}>
            Create your account
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", marginBottom: "32px" }}>
            Join Loop and take control of your schedule
          </p>

          <form style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              {[
                { id: "signup-first-name", label: "First Name", placeholder: "Jane" },
                { id: "signup-last-name", label: "Last Name", placeholder: "Doe" },
              ].map((f) => (
                <div key={f.id}>
                  <label htmlFor={f.id} style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: "8px" }}>
                    {f.label}
                  </label>
                  <input
                    id={f.id}
                    type="text"
                    placeholder={f.placeholder}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: "9px",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-bg-elevated)",
                      color: "var(--color-text-primary)",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>
              ))}
            </div>

            <div>
              <label htmlFor="signup-student-id" style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: "8px" }}>
                Student ID
              </label>
              <input
                id="signup-student-id"
                type="text"
                placeholder="e.g. STU-2024-001"
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: "9px",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-bg-elevated)",
                  color: "var(--color-text-primary)",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label htmlFor="signup-email" style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: "8px" }}>
                Email Address
              </label>
              <input
                id="signup-email"
                type="email"
                placeholder="jane@university.edu"
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: "9px",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-bg-elevated)",
                  color: "var(--color-text-primary)",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label htmlFor="signup-password" style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: "8px" }}>
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: "9px",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-bg-elevated)",
                  color: "var(--color-text-primary)",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            <button
              id="signup-submit"
              type="submit"
              style={{
                marginTop: "8px",
                padding: "13px",
                borderRadius: "9px",
                border: "none",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: 600,
                color: "white",
                background: "linear-gradient(135deg, #4f8ef7, #6f6bf7)",
                boxShadow: "0 0 24px rgba(79,142,247,0.3)",
              }}
            >
              Create account
            </button>
          </form>

          <p style={{ marginTop: "24px", textAlign: "center", fontSize: "13px", color: "var(--color-text-muted)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--color-accent)", textDecoration: "none", fontWeight: 500 }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
