"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiHome, FiWifi } from "react-icons/fi";
import { LogoIcon } from "@/components/Icon";

/* ── Glitch scrambler ─────────────────────────────────────── */
const CHARSET = "!<>-_\\/[]{}—=+*^?#░▒▓@$%";
function useGlitch(target: string) {
  const [text, setText] = useState(target);
  const raf = useRef<number>(0);

  useEffect(() => {
    let solved = 0;
    let frame = 0;

    const tick = () => {
      setText(
        target
          .split("")
          .map((ch, i) =>
            i < solved
              ? ch
              : CHARSET[Math.floor(Math.random() * CHARSET.length)]
          )
          .join("")
      );
      frame++;
      if (frame % 3 === 0 && solved < target.length) solved++;
      if (solved < target.length) raf.current = requestAnimationFrame(tick);
      else setText(target);
    };

    const kickoff = () => {
      solved = 0;
      frame = 0;
      raf.current = requestAnimationFrame(tick);
    };

    const t0 = setTimeout(kickoff, 400);
    const loop = setInterval(kickoff, 5000);
    return () => {
      clearTimeout(t0);
      clearInterval(loop);
      cancelAnimationFrame(raf.current);
    };
  }, [target]);

  return text;
}

/* ── Terminal log lines ───────────────────────────────────── */
const LOG: { text: string; type: "info" | "error" | "warn" | "ok" }[] = [
  { text: "> Initializing route resolver…",    type: "info"  },
  { text: "> Scanning registered paths…",      type: "info"  },
  { text: "> Checking schedule index…",        type: "info"  },
  { text: "! ERROR  Route not registered",     type: "error" },
  { text: "! ERROR  Sync signal lost (0x404)", type: "error" },
  { text: "~ WARN   Attempting auto-recovery", type: "warn"  },
  { text: "> STATUS Recovery failed. Halted.", type: "info"  },
];

export default function NotFound() {
  const router = useRouter();
  const code = useGlitch("404");
  const [lines, setLines] = useState<number[]>([]);
  const [cursor, setCursor] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    LOG.forEach((_, i) =>
      setTimeout(() => setLines((p) => [...p, i]), 300 + i * 420)
    );

    const blink = setInterval(() => setCursor((v) => !v), 530);
    return () => clearInterval(blink);
  }, []);

  const lineColor = {
    info:  "text-text-secondary",
    error: "text-[#d96b64]",
    warn:  "text-[#c59d4a]",
    ok:    "text-[#67b66b]",
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg-base px-4 py-10">

      {/* ── dot-grid bg ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0
          [background-image:radial-gradient(rgba(79,142,247,0.18)_1px,transparent_1px)]
          [background-size:28px_28px]
          [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]
          opacity-40"
      />

      {/* ── ambient glows ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-0 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle,rgba(79,142,247,0.13)_0%,transparent_65%)] blur-[70px]" />
        <div className="absolute bottom-0 right-0 h-[380px] w-[380px] translate-x-1/4 translate-y-1/4 rounded-full bg-[radial-gradient(circle,rgba(163,113,247,0.1)_0%,transparent_65%)] blur-[60px]" />
      </div>

      {/* ── orbital rings ── */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 z-0">
        {/* outer */}
        <div className="animate-orbit-cw-slow absolute h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(79,142,247,0.06)]">
          {/* dot on ring */}
          <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#4f8ef7] shadow-[0_0_10px_#4f8ef7] opacity-70" />
        </div>
        {/* mid */}
        <div className="animate-orbit-ccw-med absolute h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(163,113,247,0.07)]">
          <div className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#a371f7] shadow-[0_0_8px_#a371f7] opacity-70" />
        </div>
        {/* inner */}
        <div className="animate-orbit-cw-fast absolute h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(79,142,247,0.05)]">
          <div className="absolute left-0 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6f93da] shadow-[0_0_6px_#6f93da] opacity-60" />
        </div>
      </div>

      {/* ── main card ── */}
      <div
        className={`relative z-10 flex w-full max-w-[540px] flex-col items-center gap-7 text-center
          transition-[opacity,transform] duration-700 ease-out
          ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >

        {/* logo pill */}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 no-underline backdrop-blur-sm transition-all duration-200 hover:border-white/[0.18] hover:bg-white/[0.06]"
        >
          <div className="flex h-6 w-6 items-center justify-center">
            <LogoIcon />
          </div>
          <span className="text-sm font-semibold tracking-wide text-text-primary">Sync</span>
          <div className="flex items-center gap-1 rounded-full border border-[rgba(217,107,100,0.3)] bg-[rgba(217,107,100,0.1)] px-2 py-0.5">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d96b64] shadow-[0_0_5px_#d96b64]" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#d96b64]">offline</span>
          </div>
        </Link>

        {/* glitch 404 */}
        <div className="relative flex flex-col items-center gap-3">
          <div className="relative select-none">
            {/* glitch shadow layers */}
            <span
              aria-hidden
              className="glitch-layer-1 absolute inset-0 text-[clamp(5.5rem,20vw,9rem)] font-black leading-none tracking-tighter text-[#4f8ef7]"
            >
              {code}
            </span>
            <span
              aria-hidden
              className="glitch-layer-2 absolute inset-0 text-[clamp(5.5rem,20vw,9rem)] font-black leading-none tracking-tighter text-[#a371f7]"
            >
              {code}
            </span>
            {/* primary */}
            <span className="gradient-text relative text-[clamp(5.5rem,20vw,9rem)] font-black leading-none tracking-tighter">
              {code}
            </span>
          </div>

          {/* status badge */}
          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 backdrop-blur-sm">
            <span className="text-xs font-mono font-medium text-text-muted">SYNC_ERRNO</span>
            <span className="text-text-muted/50">·</span>
            <span className="text-xs font-mono font-semibold text-[#d96b64]">0x404</span>
            <span className="text-text-muted/50">·</span>
            <span className="text-xs font-mono font-medium text-text-muted">ROUTE_NOT_FOUND</span>
          </div>
        </div>

        {/* terminal */}
        <div className="w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[rgba(8,12,16,0.85)] backdrop-blur-xl">
          {/* title bar */}
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
            <div className="h-2.5 w-2.5 rounded-full bg-[#d96b64]/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#c59d4a]/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#67b66b]/80" />
            <span className="ml-2 flex-1 text-center text-[11px] font-medium text-text-muted">
              sync — route-resolver — zsh
            </span>
          </div>

          {/* log body */}
          <div className="space-y-1.5 px-5 py-4 font-mono text-[12.5px] leading-relaxed">
            {LOG.map((line, i) => (
              <p
                key={i}
                className={`m-0 transition-all duration-300 ${lineColor[line.type]}
                  ${lines.includes(i) ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}
              >
                {line.text}
              </p>
            ))}

            {/* blinking cursor */}
            {lines.length === LOG.length && (
              <div className="flex items-center gap-1 text-text-secondary">
                <span>&gt;</span>
                <span
                  className={`inline-block h-[1em] w-[7px] rounded-[1px] bg-accent transition-opacity duration-75
                    ${cursor ? "opacity-100" : "opacity-0"}`}
                />
              </div>
            )}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex w-full max-w-[300px] flex-col gap-3">
          <Link
            href="/"
            id="not-found-home-btn"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] px-6 py-3 text-sm font-semibold text-white no-underline shadow-[0_0_24px_rgba(79,142,247,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(79,142,247,0.45)]"
          >
            <FiHome size={15} />
            Reconnect — Go Home
          </Link>

          <div className="flex gap-2.5">
            <button
              id="not-found-back-btn"
              onClick={() => router.back()}
              className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-text-secondary transition-all duration-200 hover:border-white/[0.18] hover:bg-white/[0.07] hover:text-text-primary"
            >
              <FiArrowLeft size={14} />
              Go back
            </button>
            <button
              id="not-found-retry-btn"
              onClick={() => router.refresh()}
              className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-text-secondary transition-all duration-200 hover:border-white/[0.18] hover:bg-white/[0.07] hover:text-text-primary"
            >
              <FiWifi size={14} />
              Retry sync
            </button>
          </div>
        </div>

        {/* footnote */}
        <p className="m-0 text-[11px] tracking-wide text-text-muted">
          HTTP&nbsp;
          <span className="font-semibold tabular-nums text-accent">404</span>
          &nbsp;·&nbsp;This route does not exist
        </p>
      </div>
    </div>
  );
}
