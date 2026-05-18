"use client";

import { useState } from "react";
import { FiRefreshCw } from "react-icons/fi";

type Props = {
  initialStats: any;
  initialPerDay: Record<string, number>;
};

export default function DashboardClient({ initialStats, initialPerDay }: Props) {
  const [stats, setStats] = useState(initialStats);
  const [perDay, setPerDay] = useState<Record<string, number>>(initialPerDay || {});
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Failed to refresh");
      const data = await res.json();
      setStats(data);
      if (data.perDay) setPerDay(data.perDay);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday"];
  const maxVal = Math.max(...days.map((d) => perDay[d] || 0), 1);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-[var(--color-text-secondary)]">Last refreshed: client</div>
        <button onClick={refresh} className="inline-flex items-center gap-2 rounded-md bg-[var(--color-bg-surface)] px-3 py-2 border border-[var(--color-border)] text-sm hover:bg-[var(--color-bg-elevated)]">
          <FiRefreshCw className={loading ? "animate-spin" : ""} /> {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="mt-4">
        <div className="text-xs text-[var(--color-text-muted)]">Schedules per day</div>
        <div className="mt-2 flex items-end gap-2 h-28">
          {days.map((d) => {
            const v = perDay[d] || 0;
            const height = Math.round((v / maxVal) * 100);
            return (
              <div key={d} className="flex flex-col items-center gap-2">
                <div className="w-8 flex items-end">
                  <div style={{ height: `${height}%` }} className="w-full rounded-t bg-gradient-to-t from-[#4f8ef7] to-[#6f6bf7]" title={`${d}: ${v}`} />
                </div>
                <div className="text-[11px] text-[var(--color-text-secondary)]">{d.charAt(0).toUpperCase()}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
