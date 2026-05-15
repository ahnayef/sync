import Link from "next/link";
import type { Metadata } from "next";
import AuthButtons from "@/components/AuthButtons";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your Loop account with Google.",
};

export default function SignupPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg-base)] p-6">

      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-[60%]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(163,113,247,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-[440px]">

        {/* Logo */}
        <Link
          href="/"
          id="signup-logo"
          className="mb-10 flex items-center justify-center gap-2.5 no-underline"
        >
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-gradient-to-br from-[#4f8ef7] to-[#a371f7] text-lg font-bold text-white shadow-[0_0_24px_rgba(79,142,247,0.4)]">
            L
          </div>
          <span className="text-xl font-bold tracking-[-0.02em] text-[var(--color-text-primary)]">
            Loop
          </span>
        </Link>

        {/* Card */}
        <div className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-9 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <h1 className="mb-2 text-2xl font-bold tracking-[-0.02em] text-[var(--color-text-primary)]">
            Sign up with Google
          </h1>
          <p className="mb-8 text-sm text-[var(--color-text-secondary)]">
            Google is the only supported sign-up method for student accounts.
          </p>

          <div className="flex flex-col gap-4">
            <AuthButtons isSignup />

            <div className="rounded-[14px] border border-[var(--color-border)] bg-[rgba(79,142,247,0.05)] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
              Students sign up with Google only. If you are an admin, use the
              login page with email and password.
            </div>
          </div>

          <p className="mt-6 text-center text-[13px] text-[var(--color-text-muted)]">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[var(--color-accent)] no-underline">
              Log in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
