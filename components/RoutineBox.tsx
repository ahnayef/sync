"use client";

import { useState } from "react";
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

export function RoutineBox({
  schedule,
  nextClassAfter,
}: {
  schedule: RoutineSchema;
  nextClassAfter?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      <div
        id={`routine-box-${schedule.id}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderRadius: "18px",
          border: `1px solid ${
            hovered ? "rgba(79,142,247,0.25)" : "rgba(255,255,255,0.08)"
          }`,
          background: "var(--color-bg-elevated)",
          padding: "20px 22px",
          transition: "border-color 0.2s, transform 0.15s",
          transform: hovered ? "translateY(-1px)" : "none",
          cursor: "default",
        }}
      >
        {/* Top row: course code | badges + timer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
            gap: "10px",
          }}
        >
          {/* Course code */}
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--color-text-secondary)",
              background: "var(--color-bg-subtle)",
              border: "1px solid var(--color-border)",
              padding: "3px 10px",
              borderRadius: "6px",
              letterSpacing: "0.04em",
              fontFamily: "monospace",
              whiteSpace: "nowrap",
            }}
          >
            {schedule.course_code}
          </span>

          {/* Right badges */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            {/* Section */}
            {schedule.section && schedule.section !== "none" && (
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "white",
                  background: "#7c3aed",
                  padding: "3px 10px",
                  borderRadius: "100px",
                  letterSpacing: "0.06em",
                }}
              >
                Sec {schedule.section}
              </span>
            )}

            {/* Lab */}
            {schedule.is_lab && (
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "white",
                  background: "linear-gradient(135deg, #4f8ef7, #6f6bf7)",
                  padding: "3px 12px",
                  borderRadius: "100px",
                  letterSpacing: "0.07em",
                }}
              >
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
        <h2
          style={{
            fontSize: "21px",
            fontWeight: 700,
            color: "#6f9ff7",
            letterSpacing: "-0.01em",
            marginBottom: "5px",
            lineHeight: 1.25,
          }}
        >
          {truncate(schedule.course_name)}
        </h2>

        {/* Teacher */}
        <p
          style={{
            fontSize: "14px",
            color: "var(--color-text-secondary)",
            marginBottom: "18px",
          }}
        >
          {schedule.teacher_name}
        </p>

        {/* Bottom: time + room */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {/* Time */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
            <span
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "var(--color-text-primary)",
              }}
            >
              {fmt24to12(schedule.start_time)} – {fmt24to12(schedule.end_time)}
            </span>
          </div>

          {/* Room */}
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
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
            <span
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "var(--color-text-primary)",
              }}
            >
              Room {schedule.room_number}
            </span>
          </div>
        </div>
      </div>

      {/* Gap to next class */}
      {nextClassAfter && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "7px",
            padding: "12px 0",
            color: "var(--color-text-muted)",
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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
