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
      <span className="relative inline-flex size-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-green-500" />
      </span>
    );
  }

  if (status === "upcoming" && timeLeft) {
    return (
      <span className="min-w-[52px] rounded-[7px] border border-red-400/20 bg-red-500/10 px-[9px] py-[3px] text-center font-mono text-xs font-bold tabular-nums text-red-200/90">
        {timeLeft}
      </span>
    );
  }

  // completed → render nothing
  return null;
}
