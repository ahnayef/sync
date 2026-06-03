"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiHome, FiRefreshCw } from "react-icons/fi";
import { LogoIcon } from "@/components/Icon";

export default function NotFound() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg-base px-4 py-8">

      {/* Ambient glow blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-[-10%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(79,142,247,0.09)_0%,transparent_70%)] blur-[40px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(163,113,247,0.07)_0%,transparent_70%)] blur-[40px]" />
        <div className="absolute bottom-[20%] left-[-5%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(79,142,247,0.05)_0%,transparent_70%)] blur-[40px]" />
      </div>

      {/* Card */}
      <div
        className={`relative z-10 flex w-full max-w-[520px] flex-col items-center gap-8 text-center ${mounted ? "animate-fade-in" : "opacity-0"}`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 no-underline transition-all duration-200 hover:border-white/15 hover:bg-white/[0.05]"
        >
          <div className="flex h-7 w-7 items-center justify-center">
            <LogoIcon />
          </div>
          <span className="text-sm font-semibold tracking-wide text-text-primary">
            Sync
          </span>
        </Link>

        {/* 404 display */}
        <div className="flex flex-col items-center gap-3">
          <span
            className="gradient-text animate-float select-none text-[clamp(6rem,20vw,9rem)] font-extrabold leading-none tracking-tighter"
          >
            404
          </span>

          <div className="h-0.5 w-12 rounded-full bg-gradient-to-r from-[#4f8ef7] to-[#a371f7] opacity-60" />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <h1 className="m-0 text-[clamp(1.25rem,4vw,1.6rem)] font-bold tracking-tight text-text-primary">
            Page not found
          </h1>
          <p className="mx-auto m-0 max-w-[380px] text-[0.95rem] leading-relaxed text-text-secondary">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Let&apos;s get you back on track.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex w-full max-w-xs flex-col gap-3">
          <Link
            href="/"
            id="not-found-home-btn"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] px-6 py-3 text-sm font-semibold text-white no-underline shadow-[0_0_24px_rgba(79,142,247,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(79,142,247,0.45)]"
          >
            <FiHome size={16} />
            Go home
          </Link>

          <div className="flex gap-3">
            <button
              id="not-found-back-btn"
              onClick={() => router.back()}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-text-secondary transition-all duration-200 hover:border-white/[0.18] hover:bg-white/[0.07] hover:text-text-primary"
            >
              <FiArrowLeft size={15} />
              Go back
            </button>

            <button
              id="not-found-refresh-btn"
              onClick={() => router.refresh()}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-text-secondary transition-all duration-200 hover:border-white/[0.18] hover:bg-white/[0.07] hover:text-text-primary"
            >
              <FiRefreshCw size={15} />
              Refresh
            </button>
          </div>
        </div>

        {/* Footer hint */}
        <p className="m-0 text-xs tracking-wide text-text-muted">
          Error code&nbsp;
          <span className="font-medium tabular-nums text-accent">404</span>
          &nbsp;· Page not found
        </p>
      </div>
    </div>
  );
}
