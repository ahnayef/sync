import Link from "next/link";
import type { Metadata } from "next";
import AuthButtons from "@/components/AuthButtons";
import LoginForm from "@/components/LoginForm";
import { LogoIcon } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Sync account with Google or admin email and password.",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg-base)] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[860px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(79,142,247,0.14) 0%, transparent 68%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[8%] top-[22%] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(163,113,247,0.12),transparent_70%)] blur-3xl"
      />

      <div className="relative w-full max-w-[460px]">
        <Link
          href="/"
          id="login-logo"
          className="mb-6 sm:mb-8 flex items-center justify-center gap-3 no-underline"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/5 p-1.5 shadow-[0_0_28px_rgba(79,142,247,0.25)] ring-1 ring-white/10">
            <LogoIcon />
          </div>
          <div className="leading-tight text-left">
            <span className="block text-lg font-semibold tracking-[-0.02em] text-[var(--color-text-primary)]">
              Sync
            </span>
            <span className="block text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              Smart scheduling
            </span>
          </div>
        </Link>

        <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-5 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.38)] sm:px-8 sm:py-8">
          <div className="mb-6">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-[#8ab2ff]">
              LOG IN
            </div>

            <h1 className="text-[clamp(20px,5vw,32px)] font-bold tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-[2rem]">
              Welcome back
            </h1>
            <p className="mt-2 text-sm md:text-base leading-7 text-[var(--color-text-secondary)]">
              Use Google for student access or email and password for admin login.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <AuthButtons />

            <div className="relative flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              <span className="h-px flex-1 bg-[var(--color-border)]" />
              Admin login below
              <span className="h-px flex-1 bg-[var(--color-border)]" />
            </div>
          </div>

          <div className="mt-6">
            <LoginForm />
          </div>

          <p className="mt-6 text-center text-sm md:text-[13px] text-[var(--color-text-muted)]">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-[var(--color-accent)] no-underline transition-colors hover:text-[#8ab2ff]"
            >
              Sign up
            </Link>
          </p>

          <div className="mt-5 text-center text-xs sm:text-[11px] leading-6 text-[var(--color-text-muted)]">
            By logging in, you agree to our{' '}
            <Link href="/" className="text-[var(--color-text-secondary)] underline decoration-white/20 underline-offset-4">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/" className="text-[var(--color-text-secondary)] underline decoration-white/20 underline-offset-4">
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
