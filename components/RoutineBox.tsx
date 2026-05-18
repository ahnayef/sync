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

  useEffect(() => {
    const timer = setInterval(() => setNowTick(Date.now()), 30_000);
    return () => clearInterval(timer);
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
        className={`group relative w-full rounded-[18px] border px-5 py-5 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/25 ${
          hovered
            ? "border-blue-400/30 bg-blue-500/[0.03] shadow-[0_10px_30px_rgba(79,142,247,0.06)] -translate-y-0.5"
            : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]"
        }`}
      >
        {isActive && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[18px] border border-blue-400/70 shadow-[0_0_28px_rgba(79,142,247,0.28)] animate-pulse"
          />
        )}

        {/* Top row: course code | badges + timer */}
        <div className="mb-3 flex items-center justify-between gap-3">
          {/* Course code */}
          <span className="whitespace-nowrap rounded-md border px-3 py-1 text-[11px] font-mono font-semibold tracking-wider text-[var(--color-text-secondary)] bg-[var(--color-bg-subtle)] border-[var(--color-border)]">
            {schedule.course_code}
          </span>

          {/* Right badges */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Section */}
            {schedule.section && schedule.section !== "none" && (
                <span className="rounded-full bg-[#7c3aed] px-3 py-1 text-[11px] font-bold text-white">
                  Sec {schedule.section}
                </span>
            )}

            {/* Lab */}
            {schedule.is_lab && (
                <span className="rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] px-3.5 py-1 text-[11px] font-bold text-white">
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
        <h2 id={`routine-title-${schedule.id}`} className="mb-1 text-[20px] font-extrabold leading-tight tracking-tight text-[var(--color-text-primary)]">
          {truncate(schedule.course_name)}
        </h2>

        {/* Teacher */}
        <p className="mb-4 text-sm text-[var(--color-text-secondary)]">{schedule.teacher_name}</p>

        {/* Bottom: time + room */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Time */}
          <div className="flex items-center gap-3">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4f8ef7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              {fmt24to12(schedule.start_time)} – {fmt24to12(schedule.end_time)}
            </span>
          </div>

          {/* Room */}
          <div className="flex items-center gap-3">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4f8ef7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">Room {schedule.room_number}</span>
          </div>
        </div>
      </div>

      {/* Gap to next class */}
      {nextClassAfter && (
        <div className="mt-3 flex items-center justify-center gap-2.5 py-3 text-[13px] font-medium text-[var(--color-text-muted)]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
