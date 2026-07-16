"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import posthog from "posthog-js";
import { ToastProvider } from "./Toast";

/**
 * Runs inside SessionProvider so it can access the NextAuth session.
 * Identifies the user in PostHog as soon as a session is available,
 * using their email as the stable distinct_id.
 * PostHog automatically captures the client IP on every event — no
 * extra work is needed for IP-based identification.
 */
function PostHogIdentifier() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return; // wait until session is resolved

    if (status === "authenticated" && session?.user?.email) {
      const email = session.user.email;
      posthog.identify(email, {
        email,
        name: session.user.name ?? undefined,
      });
    } else if (status === "unauthenticated") {
      // Clear identity so anonymous events don't bleed into the previous user
      posthog.reset();
    }
  }, [status, session]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Register service worker
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Service Worker registered successfully:", reg.scope);
        })
        .catch((err) => {
          console.error("[PWA] Service Worker registration failed:", err);
        });
    }
  }, []);

  return (
    <SessionProvider>
      <ToastProvider>
        <PostHogIdentifier />
        {children}
      </ToastProvider>
    </SessionProvider>
  );
}
