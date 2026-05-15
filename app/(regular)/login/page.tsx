import Link from "next/link";
import type { Metadata } from "next";
import { FcGoogle } from "react-icons/fc";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Loop account with Google or admin email and password.",
};

const inputCls =
  "w-full rounded-[9px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-[11px] text-sm text-[var(--color-text-primary)] outline-none transition-colors duration-200 focus:border-blue-400/50";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg-base)] p-6">

      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-[60%]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(79,142,247,0.1) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-[420px]">

        {/* Logo */}
        <Link
          href="/"
          id="login-logo"
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
            Welcome back
          </h1>
          <p className="mb-8 text-sm text-[var(--color-text-secondary)]">
            Use Google for student access or email and password for admin login.
          </p>

          <div className="mb-6 flex flex-col gap-4">
            <button
              id="login-google"
              type="button"
              className="inline-flex items-center justify-center gap-3 rounded-[9px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-[13px] text-[15px] font-semibold text-[var(--color-text-primary)] shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-200 hover:border-[var(--color-accent)] hover:bg-[rgba(79,142,247,0.06)] hover:shadow-[0_14px_34px_rgba(0,0,0,0.22)] active:scale-[0.99]"
            >
              <FcGoogle className="text-2xl" />
              Continue with Google
            </button>

            <div className="relative flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              <span className="h-px flex-1 bg-[var(--color-border)]" />
              Admin login below
              <span className="h-px flex-1 bg-[var(--color-border)]" />
            </div>
          </div>

          <form className="flex flex-col gap-[18px]">
            {/* Email / Student ID */}
            <div>
              <label
                htmlFor="login-email"
                className="mb-2 block text-[13px] font-medium text-[var(--color-text-secondary)]"
              >
                Admin email or Student ID
              </label>
              <input
                id="login-email"
                type="text"
                placeholder="admin@university.edu"
                className={inputCls}
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="text-[13px] font-medium text-[var(--color-text-secondary)]"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[var(--color-accent)] no-underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                className={inputCls}
              />
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              className="mt-2 cursor-pointer rounded-[9px] border-none bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] py-[13px] text-[15px] font-semibold text-white shadow-[0_0_24px_rgba(79,142,247,0.3)] transition-all duration-200 hover:shadow-[0_0_32px_rgba(79,142,247,0.5)]"
            >
              Log in
            </button>
          </form>

          <p className="mt-6 text-center text-[13px] text-[var(--color-text-muted)]">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-[var(--color-accent)] no-underline"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Legal */}
        <p className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
          By logging in, you agree to our{" "}
          <Link href="/" className="text-[var(--color-text-secondary)] underline">
            Terms
          </Link>
          {" and "}
          <Link href="/" className="text-[var(--color-text-secondary)] underline">
            Privacy Policy
          </Link>
        </p>

      </div>
    </div>
  );
}
