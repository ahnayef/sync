"use client";

import { useState, useEffect, useCallback } from "react";
import { FiInbox, FiStar } from "react-icons/fi";
import UserNavbar from "@/components/UserNavbar";
import { RoutineBox } from "@/components/RoutineBox";
import { RoutineSchema } from "@/app/types/routine";

const navBtnCls = (disabled: boolean) =>
  [
    "flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px] border-0 transition-all duration-200",
    disabled
      ? "cursor-not-allowed bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] shadow-none"
      : "cursor-pointer bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] text-white shadow-[0_0_16px_rgba(79,142,247,0.35)]",
  ].join(" ");

/* ─── Helpers ─── */
function minutesOf(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function gapLabel(endTime: string, nextStart: string): string {
  const gapMin = minutesOf(nextStart) - minutesOf(endTime);
  if (gapMin <= 0) return "No gap";
  if (gapMin < 60) return `${gapMin} min`;
  const h = Math.floor(gapMin / 60);
  const m = gapMin % 60;
  return m === 0 ? `${h} hour` : `${h}:${String(m).padStart(2, "0")} hour`;
}

/* ─── Skeleton ─── */
function Skeleton() {
  return (
    <div className="flex w-full flex-col gap-4">
      {[0, 1].map((i) => (
        <div
          key={i}
          className={[
            "h-40 rounded-[18px] bg-[length:200%_100%] bg-gradient-to-r from-[var(--color-bg-elevated)] via-[var(--color-bg-subtle)] to-[var(--color-bg-elevated)] animate-[shimmer_1.4s_infinite]",
            i === 0 ? "opacity-100" : "opacity-70",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

/* ─── Page ─── */
export default function RoutinePage() {
  const [date] = useState(() => new Date());
  const [today, setToday] = useState(
    date.toLocaleDateString("en-US", { weekday: "long" }),
  );
  const [focusMode, setFocusMode] = useState(false);
  const [changingDay, setChangingDay] = useState(false);
  const [routines, setRoutines] = useState<RoutineSchema[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch routine from backend
  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const res = await fetch("/api/user/routine");
        if (res.ok) {
          const data = await res.json();
          setRoutines(data);
        }
      } catch (err) {
        console.error("Failed to fetch routine:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutine();
  }, []);

  // Restore focus mode from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("focusMode");
    if (stored !== null) setFocusMode(stored === "true");
  }, []);

  const toggleFocusMode = useCallback(() => {
    setFocusMode((prev) => {
      const next = !prev;
      localStorage.setItem("focusMode", String(next));
      return next;
    });
  }, []);

  // Day navigation — bounded Sunday → Thursday
  const handlePrev = useCallback(() => {
    if (today === "Sunday") return;
    setChangingDay(true);
    date.setDate(date.getDate() - 1);
    setToday(date.toLocaleDateString("en-US", { weekday: "long" }));
    setTimeout(() => setChangingDay(false), 280);
  }, [today, date]);

  const handleNext = useCallback(() => {
    if (today === "Thursday") return;
    setChangingDay(true);
    date.setDate(date.getDate() + 1);
    setToday(date.toLocaleDateString("en-US", { weekday: "long" }));
    setTimeout(() => setChangingDay(false), 280);
  }, [today, date]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft"  || e.key === "ArrowDown" || e.key === "p") handlePrev();
      if (e.key === "ArrowRight" || e.key === "ArrowUp"   || e.key === "n") handleNext();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handlePrev, handleNext]);

  const filteredRoutines = routines
    .filter((r) => r.day.toLowerCase() === today.toLowerCase())
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const isWeekend = today === "Friday" || today === "Saturday";
  const atStart   = today === "Sunday";
  const atEnd     = today === "Thursday";

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)]">

      {/* Focus mode FAB */}
      <button
        id="focus-mode-toggle"
        type="button"
        onClick={toggleFocusMode}
        title={focusMode ? "Disable Focus Mode" : "Enable Focus Mode"}
        className="fixed right-6 bottom-6 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-0 bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] text-white shadow-[0_4px_20px_rgba(79,142,247,0.45)] transition-transform duration-150 hover:scale-[1.08]"
      >
        {focusMode ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M3 12h1m16 0h1M12 3v1m0 16v1M5.6 5.6l.7.7m11.4-.7-.7.7M5.6 18.4l.7-.7m11.4.7-.7-.7"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
          </svg>
        )}
      </button>

      <main className="mx-auto max-w-[580px] px-5 pt-11 pb-20">
        {/* Day header — hidden in focus mode */}
        {!focusMode && (
          <div className="mb-9 flex flex-col items-center gap-2">
            <div className="flex items-center gap-[18px]">
              {/* Prev */}
              <button
                id="day-prev"
                type="button"
                onClick={handlePrev}
                disabled={atStart}
                className={navBtnCls(atStart)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>

              <h1 className="m-0 min-w-[190px] text-center text-4xl font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)]">
                {today}
              </h1>

              {/* Next */}
              <button
                id="day-next"
                type="button"
                onClick={handleNext}
                disabled={atEnd}
                className={navBtnCls(atEnd)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>

            <p className="m-0 text-sm font-medium text-[var(--color-text-secondary)]">
              {formattedDate}
            </p>
          </div>
        )}

        {/* Schedule content */}
        {isWeekend ? (
          !focusMode && (
            <div className="mt-8 flex flex-col items-center gap-2.5 text-[17px] font-semibold text-success">
              No classes today <FiStar className="ml-2 text-2xl text-[var(--color-accent)]" />
            </div>
          )
        ) : (loading || changingDay) ? (
          <Skeleton />
        ) : filteredRoutines.length === 0 ? (
          <div className="rounded-[18px] border border-dashed border-[var(--color-border)] bg-[var(--color-bg-surface)] px-8 py-[72px] text-center">
            <div className="mb-3">
              <FiInbox className="mx-auto text-[36px] text-[var(--color-text-muted)]" />
            </div>
            <h3 className="mb-1.5 text-[17px] font-semibold text-[var(--color-text-primary)]">
              No classes on {today}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)]">Nothing scheduled for this day.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredRoutines.map((schedule, idx, arr) => {
              const next = arr[idx + 1];
              const gap = next ? gapLabel(schedule.end_time, next.start_time) : undefined;
              return (
                <RoutineBox key={schedule.id} schedule={schedule} nextClassAfter={gap} />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
