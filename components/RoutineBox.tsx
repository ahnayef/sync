"use client";

import { useEffect, useState } from "react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { RoutineSchema } from "@/app/types/routine";

function fmt24to12(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

function truncate(s: string, max = 28) {
  return s.length > max ? s.slice(0, max).trimEnd() + "..." : s;
}

function minutesOf(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function RoutineBox({
  schedule,
  nextClassAfter,
}: {
  schedule: RoutineSchema;
  nextClassAfter?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [nowTick, setNowTick] = useState(Date.now());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNowTick(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");
    const updateMobile = () => setIsMobile(media.matches);
    updateMobile();

    media.addEventListener("change", updateMobile);
    return () => media.removeEventListener("change", updateMobile);
  }, []);

  const now = new Date(nowTick);
  const currentDay = now.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const start = minutesOf(schedule.start_time);
  const end = minutesOf(schedule.end_time);
  const isActive =
    schedule.day.toLowerCase() === currentDay &&
    currentMinutes >= start &&
    currentMinutes < end;

  const progress = isActive
    ? Math.min(100, Math.round(((currentMinutes - start) / (end - start)) * 100))
    : 0;

  return (
    <div className="w-full">
      <div
        id={`routine-box-${schedule.id}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        tabIndex={0}
        role="article"
        aria-labelledby={`routine-title-${schedule.id}`}
        className={`group relative w-full rounded-xl border px-4 py-4 sm:px-5 sm:py-5 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/25 overflow-hidden ${hovered
          ? "border-blue-400/30 bg-blue-500/[0.03] shadow-[0_10px_30px_rgba(79,142,247,0.06)] -translate-y-0.5"
          : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]"
          }`}
      >
        {isActive && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl border border-blue-400/70 shadow-[0_0_28px_rgba(79,142,247,0.28)] animate-pulse"
          />
        )}

        {/* Top row: course code | badges + timer */}
        <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3 sm:gap-3">
          {/* Course code */}
          <span className="whitespace-nowrap rounded-md border px-2 py-0.5 text-[9.5px] font-mono font-semibold tracking-wider text-[var(--color-text-secondary)] bg-[var(--color-bg-subtle)] border-[var(--color-border)] sm:px-3 sm:py-1 sm:text-[11px]">
            {schedule.course_code}
          </span>

          {/* Right badges */}
          <div className="flex items-center gap-1.5 flex-shrink-0 sm:gap-3">
            {/* Section */}
            {schedule.section && schedule.section !== "none" && (
              <span className="rounded-full bg-[#7c3aed] px-2 py-0.5 text-[9.5px] font-bold text-white sm:px-3 sm:py-1 sm:text-[11px]">
                Sec {schedule.section}
              </span>
            )}

            {/* Lab */}
            {schedule.is_lab && (
              <span className="rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] px-2.5 py-0.5 text-[9.5px] font-bold text-white sm:px-3.5 sm:py-1 sm:text-[11px]">
                LAB
              </span>
            )}

            {/* Countdown / live dot */}
            <CountdownTimer
              startTime={schedule.start_time}
              endTime={schedule.end_time}
              day={schedule.day}
            />
          </div>
        </div>

        {/* Course title */}
        <h2 id={`routine-title-${schedule.id}`} className="mb-1 text-[clamp(16px,4vw,20px)] font-extrabold leading-tight tracking-tight text-[var(--color-text-primary)] sm:mb-1">
          {truncate(schedule.course_name, isMobile ? 25 : 35)}
        </h2>

        {/* Teacher */}
        <p className="mb-3 text-xs text-[var(--color-text-secondary)] sm:mb-4 sm:text-sm">{schedule.teacher_name}</p>

        {/* Bottom: time + room */}
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          {/* Time */}
          <div className="flex items-center gap-2 sm:gap-3">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4f8ef7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="sm:w-[17px] sm:h-[17px]"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-xs font-semibold text-[var(--color-text-primary)] sm:text-sm">
              {fmt24to12(schedule.start_time)} – {fmt24to12(schedule.end_time)}
            </span>
          </div>

          {/* Room */}
          <div className="flex items-center gap-2 sm:gap-3">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4f8ef7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="sm:w-[15px] sm:h-[15px]"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-xs font-semibold text-[var(--color-text-primary)] sm:text-sm">Room {schedule.room_number}</span>
          </div>
        </div>

        {/* Minimal Progress — integrated at bottom edge */}
        {isActive && (
          <div className="absolute bottom-0 left-0 right-0 h-[1.3px] bg-[var(--color-border)]/20">
            <div
              className="relative h-full transition-[width] duration-[30000ms] ease-linear"
              style={{
                width: `${progress}%`,
                backgroundImage: "linear-gradient(90deg, #4f8ef7, #a371f7, #4f8ef7)",
                backgroundSize: "200% 100%",
                animation: "shimmer 2s linear infinite",
              }}
            >
              {/* Minimal White Tip */}
              <div className="absolute right-0 top-0 bottom-0 w-[15px] pointer-events-none">
                <div className="w-full h-full bg-gradient-to-r from-transparent to-white opacity-80 animate-pulse rounded-r-full" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gap to next class */}
      {nextClassAfter && (
        <div className="mt-2 flex items-center justify-center gap-2 py-2 text-[11px] font-medium text-[var(--color-text-muted)] sm:mt-3 sm:gap-2.5 sm:py-3 sm:text-[13px]">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[13px] sm:h-[13px]">
            <line x1="12" y1="2" x2="12" y2="22" />
            <polyline points="8 6 12 2 16 6" />
            <polyline points="8 18 12 22 16 18" />
          </svg>
          {nextClassAfter}
        </div>
      )}
    </div>
  );
}
