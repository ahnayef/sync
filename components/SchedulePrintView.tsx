"use client";

export interface ExportScheduleRow {
  day: string;
  start_time: string;
  end_time: string;
  course_code: string;
  course_name: string;
  is_lab: boolean;
  section: string;
  teacher_name: string;
  teacher_short: string;
  room_number: number | null;
  room_title: string | null;
  batch_name: string | null;
  batch_session: string | null;
}

function fmt24to12(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

interface Props {
  rows: ExportScheduleRow[];
  programName: string;
  batchSession?: string;
  exportDate: string;
}

function SlotCard({ slot, isAlt }: { slot: ExportScheduleRow; isAlt: boolean }) {
  return (
    <div
      style={{
        borderLeft: "3px solid #000",
        border: "1px solid #ccc",
        borderLeftWidth: "3px",
        borderLeftColor: "#000",
        padding: "5px 6px",
        marginBottom: "3px",
        backgroundColor: isAlt ? "#f5f5f5" : "#fff",
        pageBreakInside: "avoid",
      }}
    >
      {/* Time + Room */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
        <span style={{ fontFamily: "'Courier New', monospace", fontSize: "8.5px", fontWeight: 700, color: "#000" }}>
          {fmt24to12(slot.start_time)} – {fmt24to12(slot.end_time)}
        </span>
        {slot.room_number && (
          <span style={{ fontSize: "8px", fontWeight: 700, color: "#333" }}>
            Rm {slot.room_number}
            {slot.room_title ? ` · ${slot.room_title}` : ""}
          </span>
        )}
      </div>

      {/* Code + tags */}
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: "7.5px", fontWeight: 700, color: "#444", marginBottom: "2px", letterSpacing: "0.04em" }}>
        {slot.course_code}
        {slot.is_lab && (
          <span style={{ display: "inline-block", border: "1px solid #000", fontSize: "6.5px", fontWeight: 900, padding: "0 2.5px", letterSpacing: "0.07em", verticalAlign: "middle", marginLeft: "3px" }}>
            LAB
          </span>
        )}
        {slot.section && slot.section !== "none" && (
          <span style={{ fontSize: "7px", color: "#555", marginLeft: "4px" }}>§{slot.section}</span>
        )}
      </div>

      {/* Course name — dominant element */}
      <div style={{ fontSize: "10px", fontWeight: 800, lineHeight: 1.25, color: "#000", marginBottom: "2px" }}>
        {slot.course_name}
      </div>

      {/* Teacher */}
      <div style={{ fontSize: "8px", color: "#444" }}>
        {slot.teacher_name}
        {slot.teacher_short && (
          <span style={{ color: "#888", marginLeft: "3px" }}>({slot.teacher_short})</span>
        )}
      </div>
    </div>
  );
}

function DayColumn({ day, rows }: { day: string; rows: ExportScheduleRow[] }) {
  const slots = rows.filter((r) => r.day.toLowerCase() === day.toLowerCase());
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* Day header */}
      <div style={{
        background: "#000",
        color: "#fff",
        fontSize: "9px",
        fontWeight: 900,
        letterSpacing: "0.14em",
        padding: "4px 7px",
        marginBottom: "4px",
        textTransform: "uppercase",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span>{day}</span>
        <span style={{ fontWeight: 400, fontSize: "8px", color: "#aaa" }}>
          {slots.length === 0 ? "No classes" : `${slots.length} class${slots.length !== 1 ? "es" : ""}`}
        </span>
      </div>

      {/* Slots */}
      {slots.length === 0 ? (
        <div style={{ fontSize: "8px", color: "#999", fontStyle: "italic", padding: "5px 6px" }}>
          No classes scheduled.
        </div>
      ) : (
        slots.map((slot, i) => (
          <SlotCard key={`${slot.course_code}-${slot.start_time}-${i}`} slot={slot} isAlt={i % 2 === 1} />
        ))
      )}
    </div>
  );
}

export function SchedulePrintView({ rows, programName, batchSession, exportDate }: Props) {
  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: "9px", color: "#000", background: "#fff" }}>

      {/* ── Document header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid #000", paddingBottom: "5px", marginBottom: "7px" }}>
        <div>
          <div style={{ fontSize: "16px", fontWeight: 900, letterSpacing: "-0.02em" }}>{programName}</div>
          {batchSession && <div style={{ fontSize: "9px", color: "#555", marginTop: "2px" }}>Session: {batchSession}</div>}
          <div style={{ fontSize: "9px", color: "#555", marginTop: "1px" }}>Loop · Weekly Class Schedule</div>
        </div>
        <div style={{ textAlign: "right", fontSize: "8px", color: "#666", lineHeight: 1.6 }}>
          Exported<br />
          <strong style={{ fontSize: "9px", color: "#000" }}>{exportDate}</strong>
        </div>
      </div>

      {/* ── Page 1: Sun · Mon · Tue ── */}
      <div style={{ display: "flex", gap: "7px", alignItems: "flex-start", marginBottom: "12px" }}>
        <DayColumn day="Sunday"  rows={rows} />
        <DayColumn day="Monday"  rows={rows} />
        <DayColumn day="Tuesday" rows={rows} />
      </div>

      {/* ── Page break indicator (screen only) ── */}
      <div style={{ borderTop: "2px dashed #ccc", margin: "8px 0", position: "relative" }}>
        <span style={{
          position: "absolute",
          top: "-9px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#f0f0f0",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "1px 8px",
          fontSize: "8px",
          color: "#999",
          whiteSpace: "nowrap",
          fontFamily: "sans-serif",
        }}>
          — Page 2 —
        </span>
      </div>

      {/* ── Page 2: Wed · Thu ── */}
      <div style={{ display: "flex", gap: "9px", alignItems: "flex-start" }}>
        <DayColumn day="Wednesday" rows={rows} />
        <DayColumn day="Thursday"  rows={rows} />
      </div>

      {/* ── Footer ── */}
      <div style={{ marginTop: "8px", borderTop: "1px solid #ccc", paddingTop: "4px", display: "flex", justifyContent: "space-between", fontSize: "7px", color: "#999" }}>
        <span>Generated by Loop · Schedule Management System</span>
        <span>{exportDate}</span>
      </div>
    </div>
  );
}
