"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { FiArrowRight, FiMail } from "react-icons/fi";
import { LogoIcon } from "@/components/Icon";

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "password" | "done">("email");

  const handleEmailSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStep("otp");
  };

  const handleOtpSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStep("password");
  };

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword === confirmPassword) {
      setStep("done");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg-base)] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
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
        className="pointer-events-none absolute left-[12%] top-[20%] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(163,113,247,0.12),transparent_70%)] blur-3xl"
      />

      <div className="relative w-full max-w-[460px]">
        <Link
          href="/"
          id="forgot-password-logo"
          className="mb-8 flex items-center justify-center no-underline"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/5 p-1.5 shadow-[0_0_28px_rgba(79,142,247,0.25)] ring-1 ring-white/10">
            <LogoIcon />
          </div>
        </Link>

        <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-6 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.38)] sm:px-8 sm:py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-[2rem]">
              {step === "done"
                ? "Password updated"
                : step === "password"
                  ? "Set a new password"
                  : step === "otp"
                    ? "Enter the OTP"
                    : "Forgot your password?"}
            </h1>
            <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
              {step === "done"
                ? "You can log in again with the new password."
                : step === "password"
                  ? "Create a new password."
                  : step === "otp"
                    ? "Enter the 6-digit code sent to your email."
                    : "Enter your email to get a code."}
            </p>
          </div>

          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="reset-email"
                  className="mb-2 block text-[13px] font-medium text-[var(--color-text-secondary)]"
                >
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-3 pl-10 pr-3.5 text-sm text-[var(--color-text-primary)] outline-none transition-colors duration-200 placeholder:text-[var(--color-text-muted)] focus:border-blue-400/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_0_24px_rgba(79,142,247,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(79,142,247,0.45)]"
              >
                Send OTP
                <FiArrowRight />
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="reset-otp"
                  className="mb-2 block text-[13px] font-medium text-[var(--color-text-secondary)]"
                >
                  OTP Code
                </label>
                <input
                  id="reset-otp"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  placeholder="123456"
                  className="w-full rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-3 text-center text-sm tracking-[0.35em] text-[var(--color-text-primary)] outline-none transition-colors duration-200 placeholder:text-[var(--color-text-muted)] focus:border-blue-400/50"
                />
              </div>

              <button
                type="submit"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_0_24px_rgba(79,142,247,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(79,142,247,0.45)]"
              >
                Verify OTP
                <FiArrowRight />
              </button>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="new-password"
                  className="mb-2 block text-[13px] font-medium text-[var(--color-text-secondary)]"
                >
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Enter a new password"
                  className="w-full rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-3 text-sm text-[var(--color-text-primary)] outline-none transition-colors duration-200 placeholder:text-[var(--color-text-muted)] focus:border-blue-400/50"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-2 block text-[13px] font-medium text-[var(--color-text-secondary)]"
                >
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm your password"
                  className="w-full rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-3 text-sm text-[var(--color-text-primary)] outline-none transition-colors duration-200 placeholder:text-[var(--color-text-muted)] focus:border-blue-400/50"
                />
              </div>

              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm font-medium text-red-400/80">Passwords do not match</p>
              )}

              <button
                type="submit"
                disabled={newPassword !== confirmPassword || !newPassword || !confirmPassword}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_0_24px_rgba(79,142,247,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(79,142,247,0.45)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:-translate-y-0"
              >
                Set new password
                <FiArrowRight />
              </button>
            </form>
          )}

          {step === "done" && (
            <div className="space-y-4">
              <div className="rounded-[18px] border border-[var(--color-border)] bg-[rgba(11,16,21,0.55)] p-4 text-sm leading-7 text-[var(--color-text-secondary)]">
                Your password has been updated.
              </div>

              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] px-6 py-3 text-[15px] font-semibold text-white no-underline shadow-[0_0_24px_rgba(79,142,247,0.3)] transition-all duration-200 hover:-translate-y-0.5"
              >
                Back to log in
              </Link>
            </div>
          )}

          <p className="mt-6 text-center text-[13px] text-[var(--color-text-muted)]">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-medium text-[var(--color-accent)] no-underline transition-colors hover:text-[#8ab2ff]"
            >
              Back to log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}