"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import posthog from "posthog-js";

export default function AuthButtons({ isSignup = false }: { isSignup?: boolean }) {
  const handleGoogleSignIn = () => {
    posthog.capture("user_signed_in_google", { method: isSignup ? "signup" : "login" });
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      type="button"
      className="inline-flex items-center justify-center gap-3 w-full rounded-[9px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-[13px] text-[15px] font-semibold text-[var(--color-text-primary)] shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-200 hover:border-[var(--color-accent)] hover:bg-[rgba(79,142,247,0.06)] hover:shadow-[0_14px_34px_rgba(0,0,0,0.22)] active:scale-[0.99]"
    >
      <FcGoogle className="text-2xl" />
      {isSignup ? "Sign up with Google" : "Continue with Google"}
    </button>
  );
}
