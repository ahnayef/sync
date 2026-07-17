"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import posthog from "posthog-js";

const inputCls =
  "w-full rounded-[9px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-[11px] text-sm text-[var(--color-text-primary)] outline-none transition-colors duration-200 focus:border-blue-400/50";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      posthog.identify(email, { email });
      posthog.capture("user_signed_in", { method: "credentials" });
      router.push("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
      {error && <div className="text-sm text-[var(--color-danger)] bg-[rgba(248,81,73,0.1)] p-3 rounded-md border border-[rgba(248,81,73,0.2)]">{error}</div>}
      
      {/* Email / Student ID */}
      <div>
        <label
          htmlFor="login-email"
          className="mb-2 block text-[13px] font-medium text-[var(--color-text-secondary)]"
        >
          Admin/Moderator Email
        </label>
        <input
          id="login-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={inputCls}
        />
      </div>

      {/* Submit */}
      <button
        id="login-submit"
        type="submit"
        disabled={loading}
        className="mt-2 cursor-pointer rounded-[9px] border-none bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] py-[13px] text-[15px] font-semibold text-white shadow-[0_0_24px_rgba(79,142,247,0.3)] transition-all duration-200 hover:shadow-[0_0_32px_rgba(79,142,247,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}
