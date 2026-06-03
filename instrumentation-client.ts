import posthog from "posthog-js";

if (typeof window !== "undefined") {
  const isDev = process.env.NODE_ENV === "development";
  const token = process.env.NEXT_PUBLIC_POSTHOG_KEY;

  if (isDev) {
    posthog.init(token ?? "dev-placeholder", {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      defaults: "2026-01-30",
      capture_exceptions: false,
      debug: false,
      opt_out_capturing_by_default: true,
      persistence: "memory",
    });
  } else if (token) {
    posthog.init(token, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      defaults: "2026-01-30",
      capture_exceptions: true,
      debug: false,
    });
  }
}
