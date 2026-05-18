"use client";

import { useState, useEffect, useCallback } from "react";
import UserNavbar from "@/components/UserNavbar";
import { RoutineBox } from "@/components/RoutineBox";
import { RoutineSchema } from "@/app/types/routine";

/* ─── Mock data ─── */
const MOCK_ROUTINES: RoutineSchema[] = [
  { id: 1,  course_code: "CSE-06134024", course_name: "Deep Learning Lab",               teacher_name: "MD Tahidul Islam",                  start_time: "08:30", end_time: "11:25", room_number: "301",   day: "Monday",    is_lab: true,  section: "A" },
  { id: 2,  course_code: "CSE-06134111", course_name: "Software Testing and Management", teacher_name: "Mr. Khadem Mohammad Asif-uz-zaman", start_time: "11:30", end_time: "12:55", room_number: "117",   day: "Monday",    is_lab: false, section: "A" },
  { id: 3,  course_code: "CSE-301",      course_name: "Data Structures",                 teacher_name: "Dr. Rahman",                        start_time: "08:00", end_time: "09:30", room_number: "401",   day: "Sunday",    is_lab: false, section: "B" },
  { id: 4,  course_code: "MAT-201",      course_name: "Discrete Mathematics",            teacher_name: "Prof. Ahmed",                       start_time: "10:00", end_time: "11:30", room_number: "302",   day: "Sunday",    is_lab: false, section: "B" },
  { id: 5,  course_code: "CSE-315L",     course_name: "Operating Systems Lab",           teacher_name: "Ms. Fatima",                        start_time: "13:00", end_time: "15:30", room_number: "Lab-2", day: "Sunday",    is_lab: true,  section: "B" },
  { id: 6,  course_code: "CSE-303",      course_name: "Operating Systems",               teacher_name: "Dr. Karim",                         start_time: "09:00", end_time: "10:30", room_number: "305",   day: "Tuesday",   is_lab: false, section: "A" },
  { id: 7,  course_code: "CSE-311L",     course_name: "Networks Lab",                    teacher_name: "Dr. Islam",                         start_time: "10:30", end_time: "13:00", room_number: "Lab-1", day: "Tuesday",   is_lab: true,  section: "A" },
  { id: 8,  course_code: "CSE-405",      course_name: "Software Engineering",            teacher_name: "Prof. Hassan",                      start_time: "09:30", end_time: "11:00", room_number: "201",   day: "Wednesday", is_lab: false, section: "A" },
  { id: 9,  course_code: "MAT-201",      course_name: "Discrete Mathematics",            teacher_name: "Prof. Ahmed",                       start_time: "11:30", end_time: "13:00", room_number: "302",   day: "Wednesday", is_lab: false, section: "A" },
  { id: 10, course_code: "CSE-301L",     course_name: "Data Structures Lab",             teacher_name: "Dr. Rahman",                        start_time: "13:00", end_time: "15:30", room_number: "Lab-3", day: "Thursday",  is_lab: true,  section: "B" },
  { id: 11, course_code: "HUM-201",      course_name: "Technical Writing",               teacher_name: "Ms. Parvin",                        start_time: "09:30", end_time: "11:00", room_number: "104",   day: "Thursday",  is_lab: false, section: "B" },
];

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
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            borderRadius: "18px",
            height: "160px",
            background:
              "linear-gradient(90deg, var(--color-bg-elevated) 25%, var(--color-bg-subtle) 50%, var(--color-bg-elevated) 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.4s infinite",
            opacity: 1 - i * 0.3,
          }}
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

  const filteredRoutines = MOCK_ROUTINES
    .filter((r) => r.day.toLowerCase() === today.toLowerCase())
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const isWeekend = today === "Friday" || today === "Saturday";
  const atStart   = today === "Sunday";
  const atEnd     = today === "Thursday";

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-base)" }}>
      <UserNavbar />

      {/* Focus mode FAB */}
      <button
        id="focus-mode-toggle"
        onClick={toggleFocusMode}
        title={focusMode ? "Disable Focus Mode" : "Enable Focus Mode"}
        style={{
          position: "fixed",
          right: "24px",
          bottom: "24px",
          zIndex: 50,
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "none",
          background: "linear-gradient(135deg, #4f8ef7, #6f6bf7)",
          color: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(79,142,247,0.45)",
          transition: "transform 0.15s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
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

      <main style={{ maxWidth: "580px", margin: "0 auto", padding: "44px 20px 80px" }}>
        {/* Day header — hidden in focus mode */}
        {!focusMode && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginBottom: "36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              {/* Prev */}
              <button
                id="day-prev"
                onClick={handlePrev}
                disabled={atStart}
                style={{
                  width: "42px", height: "42px", borderRadius: "11px", border: "none",
                  background: atStart ? "var(--color-bg-elevated)" : "linear-gradient(135deg, #4f8ef7, #6f6bf7)",
                  color: atStart ? "var(--color-text-muted)" : "white",
                  cursor: atStart ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: atStart ? "none" : "0 0 16px rgba(79,142,247,0.35)",
                  transition: "all 0.2s", flexShrink: 0,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>

              <h1 style={{ fontSize: "36px", fontWeight: 800, color: "var(--color-text-primary)", letterSpacing: "-0.03em", margin: 0, minWidth: "190px", textAlign: "center" }}>
                {today}
              </h1>

              {/* Next */}
              <button
                id="day-next"
                onClick={handleNext}
                disabled={atEnd}
                style={{
                  width: "42px", height: "42px", borderRadius: "11px", border: "none",
                  background: atEnd ? "var(--color-bg-elevated)" : "linear-gradient(135deg, #4f8ef7, #6f6bf7)",
                  color: atEnd ? "var(--color-text-muted)" : "white",
                  cursor: atEnd ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: atEnd ? "none" : "0 0 16px rgba(79,142,247,0.35)",
                  transition: "all 0.2s", flexShrink: 0,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>

            <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-text-secondary)", margin: 0 }}>
              {formattedDate}
            </p>
          </div>
        )}

        {/* Schedule content */}
        {isWeekend ? (
          !focusMode && (
            <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", color: "#3fb950", fontSize: "17px", fontWeight: 600 }}>
              No classes today <span style={{ fontSize: "28px" }}>🎉</span>
            </div>
          )
        ) : changingDay ? (
          <Skeleton />
        ) : filteredRoutines.length === 0 ? (
          <div style={{ borderRadius: "18px", border: "1px dashed var(--color-border)", background: "var(--color-bg-surface)", padding: "72px 32px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
            <h3 style={{ fontSize: "17px", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "6px" }}>
              No classes on {today}
            </h3>
            <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>Nothing scheduled for this day.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
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
