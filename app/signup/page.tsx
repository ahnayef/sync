import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your Loop account.",
};

const nameFields = [
  { id: "signup-first-name", label: "First Name", placeholder: "Jane" },
  { id: "signup-last-name",  label: "Last Name",  placeholder: "Doe" },
];

const inputCls =
  "w-full rounded-[9px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-[11px] text-sm text-[var(--color-text-primary)] outline-none transition-colors duration-200 focus:border-blue-400/50";

const labelCls = "mb-2 block text-[13px] font-medium text-[var(--color-text-secondary)]";

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
            Create your account
          </h1>
          <p className="mb-8 text-sm text-[var(--color-text-secondary)]">
            Join Loop and take control of your schedule
          </p>

          <form className="flex flex-col gap-[18px]">
            {/* First / Last name */}
            <div className="grid grid-cols-2 gap-3.5">
              {nameFields.map((f) => (
                <div key={f.id}>
                  <label htmlFor={f.id} className={labelCls}>{f.label}</label>
                  <input id={f.id} type="text" placeholder={f.placeholder} className={inputCls} />
                </div>
              ))}
            </div>

            {/* Student ID */}
            <div>
              <label htmlFor="signup-student-id" className={labelCls}>Student ID</label>
              <input
                id="signup-student-id"
                type="text"
                placeholder="e.g. STU-2024-001"
                className={inputCls}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="signup-email" className={labelCls}>Email Address</label>
              <input
                id="signup-email"
                type="email"
                placeholder="jane@university.edu"
                className={inputCls}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="signup-password" className={labelCls}>Password</label>
              <input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                className={inputCls}
              />
            </div>

            {/* Submit */}
            <button
              id="signup-submit"
              type="submit"
              className="mt-2 cursor-pointer rounded-[9px] border-none bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] py-[13px] text-[15px] font-semibold text-white shadow-[0_0_24px_rgba(79,142,247,0.3)] transition-all duration-200 hover:shadow-[0_0_32px_rgba(79,142,247,0.5)]"
            >
              Create account
            </button>
          </form>

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
