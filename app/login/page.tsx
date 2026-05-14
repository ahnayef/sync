import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Loop account.",
};

export default function LoginPage() {
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
      {/* Background glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          width: "600px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(79,142,247,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: "420px", position: "relative" }}>
        {/* Logo */}
        <Link
          href="/"
          id="login-logo"
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

        {/* Card */}
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
            Welcome back
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", marginBottom: "32px" }}>
            Log in to access your schedule
          </p>

          <form style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label
                htmlFor="login-email"
                style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: "8px" }}
              >
                Email or Student ID
              </label>
              <input
                id="login-email"
                type="text"
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
                  transition: "border-color 0.2s",
                }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label
                  htmlFor="login-password"
                  style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-text-secondary)" }}
                >
                  Password
                </label>
                <Link href="/forgot-password" style={{ fontSize: "12px", color: "var(--color-accent)", textDecoration: "none" }}>
                  Forgot password?
                </Link>
              </div>
              <input
                id="login-password"
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
              id="login-submit"
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
              Log in
            </button>
          </form>

          <p
            style={{
              marginTop: "24px",
              textAlign: "center",
              fontSize: "13px",
              color: "var(--color-text-muted)",
            }}
          >
            Don&apos;t have an account?{" "}
            <Link href="/signup" style={{ color: "var(--color-accent)", textDecoration: "none", fontWeight: 500 }}>
              Sign up
            </Link>
          </p>
        </div>

        <p style={{ textAlign: "center", fontSize: "12px", color: "var(--color-text-muted)", marginTop: "24px" }}>
          By logging in, you agree to our{" "}
          <Link href="/" style={{ color: "var(--color-text-secondary)", textDecoration: "underline" }}>Terms</Link>
          {" and "}
          <Link href="/" style={{ color: "var(--color-text-secondary)", textDecoration: "underline" }}>Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
