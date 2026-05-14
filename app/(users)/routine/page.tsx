"use client";

import { useState } from "react";
import type { Metadata } from "next";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const ALL_CLASSES: Record<string, {
  courseCode: string;
  courseTitle: string;
  teacher: string;
  startTime: string;
  endTime: string;
  room: string;
  isLab: boolean;
}[]> = {
  Sunday: [
    { courseCode: "CSE301", courseTitle: "Data Structures", teacher: "Dr. Rahman", startTime: "08:00 AM", endTime: "09:30 AM", room: "401", isLab: false },
    { courseCode: "MAT201", courseTitle: "Discrete Mathematics", teacher: "Prof. Ahmed", startTime: "10:00 AM", endTime: "11:30 AM", room: "302", isLab: false },
    { courseCode: "CSE315L", courseTitle: "OS Lab", teacher: "Ms. Fatima", startTime: "01:00 PM", endTime: "03:30 PM", room: "Lab-2", isLab: true },
  ],
  Monday: [
    { courseCode: "CSE303", courseTitle: "Operating Systems", teacher: "Dr. Karim", startTime: "09:00 AM", endTime: "10:30 AM", room: "305", isLab: false },
    { courseCode: "CSE405", courseTitle: "Software Engineering", teacher: "Prof. Hassan", startTime: "11:00 AM", endTime: "12:30 PM", room: "201", isLab: false },
  ],
  Tuesday: [
    { courseCode: "CSE301", courseTitle: "Data Structures", teacher: "Dr. Rahman", startTime: "08:00 AM", endTime: "09:30 AM", room: "401", isLab: false },
    { courseCode: "CSE311L", courseTitle: "Networks Lab", teacher: "Dr. Islam", startTime: "10:00 AM", endTime: "12:30 PM", room: "Lab-1", isLab: true },
    { courseCode: "HUM201", courseTitle: "Technical Writing", teacher: "Ms. Parvin", startTime: "01:30 PM", endTime: "03:00 PM", room: "104", isLab: false },
  ],
  Wednesday: [
    { courseCode: "CSE303", courseTitle: "Operating Systems", teacher: "Dr. Karim", startTime: "09:00 AM", endTime: "10:30 AM", room: "305", isLab: false },
    { courseCode: "MAT201", courseTitle: "Discrete Mathematics", teacher: "Prof. Ahmed", startTime: "11:30 AM", endTime: "01:00 PM", room: "302", isLab: false },
  ],
  Thursday: [
    { courseCode: "CSE405", courseTitle: "Software Engineering", teacher: "Prof. Hassan", startTime: "09:30 AM", endTime: "11:00 AM", room: "201", isLab: false },
    { courseCode: "CSE301L", courseTitle: "Data Structures Lab", teacher: "Dr. Rahman", startTime: "01:00 PM", endTime: "03:30 PM", room: "Lab-3", isLab: true },
  ],
  Friday: [],
  Saturday: [
    { courseCode: "HUM201", courseTitle: "Technical Writing", teacher: "Ms. Parvin", startTime: "10:00 AM", endTime: "11:30 AM", room: "104", isLab: false },
  ],
};

function getGapLabel(endTime: string, startTime: string) {
  const parseTime = (t: string) => {
    const [time, period] = t.split(" ");
    let [h, m] = time.split(":").map(Number);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };
  const gap = parseTime(startTime) - parseTime(endTime);
  if (gap <= 0) return null;
  if (gap < 60) return `${gap} min break`;
  const h = Math.floor(gap / 60);
  const m = gap % 60;
  return m > 0 ? `${h}h ${m}m break` : `${h}h break`;
}

const todayIndex = new Date().getDay(); // 0=Sun

export default function RoutinePage() {
  const [selectedDay, setSelectedDay] = useState(todayIndex);
  const classes = ALL_CLASSES[DAYS[selectedDay]] || [];

  return (
    <div style={{ padding: "32px", maxWidth: "900px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em", marginBottom: "6px" }}>
          My Routine
        </h1>
        <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
          Your class schedule for the selected day
        </p>
      </div>

      {/* Day Switcher */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "32px",
          flexWrap: "wrap",
          padding: "4px",
          borderRadius: "12px",
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border)",
          width: "fit-content",
        }}
      >
        {DAYS.map((day, i) => {
          const isSelected = i === selectedDay;
          const isToday = i === todayIndex;
          return (
            <button
              key={day}
              id={`day-tab-${day.toLowerCase()}`}
              onClick={() => setSelectedDay(i)}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: isSelected ? 600 : 400,
                color: isSelected ? "white" : isToday ? "var(--color-accent)" : "var(--color-text-secondary)",
                background: isSelected ? "linear-gradient(135deg, #4f8ef7, #6f6bf7)" : "transparent",
                boxShadow: isSelected ? "0 0 16px rgba(79,142,247,0.3)" : "none",
                transition: "all 0.2s ease",
                position: "relative",
              }}
            >
              {day.slice(0, 3)}
              {isToday && !isSelected && (
                <span
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "var(--color-accent)",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Schedule */}
      {classes.length === 0 ? (
        <div
          style={{
            borderRadius: "14px",
            border: "1px dashed var(--color-border)",
            background: "var(--color-bg-surface)",
            padding: "64px 32px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>🎉</div>
          <h3 style={{ fontSize: "17px", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "8px" }}>
            No classes today
          </h3>
          <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
            Enjoy your free day!
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {classes.map((cls, i) => {
            const prev = classes[i - 1];
            const gap = prev ? getGapLabel(prev.endTime, cls.startTime) : null;
            return (
              <div key={`${cls.courseCode}-${i}`}>
                {/* Gap indicator */}
                {gap && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 0",
                    }}
                  >
                    <div style={{ width: "2px", flex: 0, flexBasis: "2px", minWidth: "2px", background: "var(--color-border)", height: "24px", marginLeft: "24px" }} />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "4px 12px",
                        borderRadius: "100px",
                        background: "var(--color-bg-elevated)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span style={{ fontSize: "12px", color: "var(--color-text-muted)", fontWeight: 500 }}>{gap}</span>
                    </div>
                  </div>
                )}

                {/* Class Card */}
                <div
                  id={`class-card-${cls.courseCode.toLowerCase()}-${i}`}
                  style={{
                    borderRadius: "14px",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-bg-surface)",
                    padding: "24px",
                    borderLeft: `3px solid ${cls.isLab ? "#a371f7" : "#4f8ef7"}`,
                    display: "flex",
                    gap: "20px",
                    alignItems: "flex-start",
                    transition: "border-color 0.2s, transform 0.2s",
                  }}
                >
                  {/* Time column */}
                  <div style={{ minWidth: "90px", textAlign: "right", paddingTop: "2px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "4px" }}>
                      {cls.startTime}
                    </p>
                    <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{cls.endTime}</p>
                  </div>

                  {/* Divider */}
                  <div style={{ width: "1px", background: "var(--color-border)", alignSelf: "stretch", flexShrink: 0 }} />

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          color: cls.isLab ? "#a371f7" : "#4f8ef7",
                          background: cls.isLab ? "rgba(163,113,247,0.1)" : "rgba(79,142,247,0.1)",
                          border: `1px solid ${cls.isLab ? "rgba(163,113,247,0.3)" : "rgba(79,142,247,0.3)"}`,
                          padding: "2px 8px",
                          borderRadius: "5px",
                        }}
                      >
                        {cls.courseCode}
                      </span>
                      {cls.isLab && (
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            color: "#a371f7",
                            background: "rgba(163,113,247,0.08)",
                            border: "1px solid rgba(163,113,247,0.25)",
                            padding: "2px 7px",
                            borderRadius: "5px",
                            textTransform: "uppercase",
                          }}
                        >
                          Lab
                        </span>
                      )}
                    </div>
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "var(--color-text-primary)",
                        marginBottom: "10px",
                      }}
                    >
                      {cls.courseTitle}
                    </h3>
                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--color-text-secondary)" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                        {cls.teacher}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--color-text-secondary)" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                        Room {cls.room}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
