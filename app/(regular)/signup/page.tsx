import Link from "next/link";
import type { Metadata } from "next";
import AuthButtons from "@/components/AuthButtons";
import { LogoIcon } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your Loop account with Google.",
};

export default function SignupPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg-base)] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[860px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(163,113,247,0.12) 0%, transparent 68%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(79,142,247,0.1),transparent_70%)] blur-3xl"
      />

      <div className="relative w-full max-w-[440px]">

        {/* Logo */}
        <Link
          href="/"
          id="signup-logo"
          className="mb-6 sm:mb-8 flex items-center justify-center gap-3 no-underline"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/5 p-1.5 shadow-[0_0_28px_rgba(79,142,247,0.25)] ring-1 ring-white/10">
            <LogoIcon />
          </div>
          <div className="leading-tight text-left">
            <span className="block text-lg font-semibold tracking-[-0.02em] text-[var(--color-text-primary)]">
              Loop
            </span>
            <span className="block text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              Smart scheduling
            </span>
          </div>
        </Link>

        {/* Card */}
        <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-5 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.38)] sm:px-8 sm:py-8">
          <div className="mb-6">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-[#8ab2ff]">
              SIGN UP
            </div>

            <h1 className="text-[clamp(20px,5vw,34px)] font-bold tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-[2rem]">
            Sign up with Google
            </h1>
            <p className="mt-2 text-sm md:text-base leading-7 text-[var(--color-text-secondary)]">
            Google is the only supported sign-up method for student accounts.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <AuthButtons isSignup />

            <div className="rounded-[16px] border border-[var(--color-border)] bg-[rgba(79,142,247,0.05)] px-3 py-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              Students sign up with Google only. If you are an admin, use the
              login page with email and password.
            </div>
          </div>

          <p className="mt-6 text-center text-sm md:text-[13px] text-[var(--color-text-muted)]">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[var(--color-accent)] no-underline transition-colors hover:text-[#8ab2ff]">
              Log in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
