"use client";

import { useState, useEffect } from "react";

type ClassStatus = "upcoming" | "live" | "completed";

function useClassStatus(
  startTime: string,
  endTime: string,
  day: string,
): { status: ClassStatus; timeLeft: string } {
  const compute = () => {
    const now = new Date();
    const todayName = now
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    if (todayName !== day.toLowerCase())
      return { status: "upcoming" as ClassStatus, timeLeft: "" };

    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    const classStart = new Date(now);
    classStart.setHours(sh, sm, 0, 0);
    const classEnd = new Date(now);
    classEnd.setHours(eh, em, 0, 0);

    if (now < classStart) {
      const diff = classStart.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      let t = "";
      if (h > 0) t += `${h}:`;
      t += `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      return { status: "upcoming" as ClassStatus, timeLeft: t };
    } else if (now < classEnd) {
      return { status: "live" as ClassStatus, timeLeft: "" };
    } else {
      return { status: "completed" as ClassStatus, timeLeft: "" };
    }
  };

  const [state, setState] = useState(compute);
  useEffect(() => {
    const id = setInterval(() => setState(compute()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, endTime, day]);

  return state;
}

export function CountdownTimer({
  startTime,
  endTime,
  day,
}: {
  startTime: string;
  endTime: string;
  day: string;
}) {
  const { status, timeLeft } = useClassStatus(startTime, endTime, day);

  if (status === "live") {
    return (
      <span
        style={{
          position: "relative",
          display: "inline-flex",
          width: "10px",
          height: "10px",
          flexShrink: 0,
        }}
      >
        {/* Ping ring */}
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "#3fb950",
            opacity: 0.75,
            animation: "pulse-dot 2s ease-in-out infinite",
          }}
        />
        {/* Solid dot */}
        <span
          style={{
            position: "relative",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "#3fb950",
            boxShadow: "0 0 8px rgba(63,185,80,0.6)",
            display: "inline-block",
          }}
        />
      </span>
    );
  }

  if (status === "upcoming" && timeLeft) {
    return (
      <span
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: "rgba(255,180,180,0.9)",
          background: "rgba(255,80,80,0.08)",
          border: "1px solid rgba(255,80,80,0.2)",
          padding: "3px 9px",
          borderRadius: "7px",
          fontVariantNumeric: "tabular-nums",
          fontFamily: "monospace",
          minWidth: "52px",
          textAlign: "center",
        }}
      >
        {timeLeft}
      </span>
    );
  }

  // completed → render nothing
  return null;
}
