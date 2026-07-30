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

// Match the print layout splits exactly
const MAX_P1 = 5;
const MAX_P2 = 5;
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"] as const;

// Same row height for both pages — matches print (both 32mm)
const P1_ROW_PX = 120;
const P2_ROW_PX = 120;
const HDR_ROW_PX = 36;
const CELL_PAD_PX = 10; // px padding inside each cell div

function fmt12(t: string): string {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function getSlots(rows: ExportScheduleRow[]) {
  const seen = new Set<string>();
  const out: { s: string; e: string }[] = [];
  for (const r of rows) {
    const k = `${r.start_time}|${r.end_time}`;
    if (!seen.has(k)) { seen.add(k); out.push({ s: r.start_time, e: r.end_time }); }
  }
  return out.sort((a, b) => a.s.localeCompare(b.s));
}

function findEntry(rows: ExportScheduleRow[], day: string, s: string, e: string) {
  return rows.find(
    r => r.day.toLowerCase() === day.toLowerCase()
      && r.start_time === s
      && r.end_time === e,
  );
}

// ─── Cell components ──────────────────────────────────────────────────────────
function TimeCell({ s, e, rowH }: { s: string; e: string; rowH: number }) {
  return (
    <div style={{
      height: rowH,
      boxSizing: "border-box",
      padding: `0 ${CELL_PAD_PX}px`,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "#ebebeb",
    }}>
      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 12, fontWeight: 700, color: "#000", lineHeight: 1.3, textAlign: "center" }}>
        {fmt12(s)}
      </span>
      <span style={{ fontSize: 10, color: "#aaa", margin: "3px 0", textAlign: "center" }}>—</span>
      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 12, fontWeight: 700, color: "#000", lineHeight: 1.3, textAlign: "center" }}>
        {fmt12(e)}
      </span>
    </div>
  );
}

function DataCell({ entry, rowH }: { entry?: ExportScheduleRow; rowH: number }) {
  if (!entry) {
    return (
      <div style={{ height: rowH, boxSizing: "border-box", background: "#f7f7f7", overflow: "hidden" }} />
    );
  }
  return (
    <div style={{
      height: rowH,
      boxSizing: "border-box",
      padding: `${CELL_PAD_PX}px ${CELL_PAD_PX + 2}px`,
      overflow: "hidden",
      background: "#fff",
    }}>
      {/* Course code */}
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, fontWeight: 700, color: "#888", marginBottom: 2, letterSpacing: "0.02em" }}>
        {entry.course_code}
      </div>
      {/* Course title — dominant */}
      <div style={{ fontSize: 14, fontWeight: 800, color: "#000", lineHeight: 1.2, marginBottom: 3 }}>
        {entry.course_name}
      </div>
      {/* Teacher */}
      <div style={{ fontSize: 11, color: "#555", lineHeight: 1.2, marginBottom: 2 }}>
        {entry.teacher_name}
      </div>
      {/* Room */}
      <div style={{ fontSize: 11, fontWeight: 600, color: "#333" }}>
        {entry.room_number ? `Room ${entry.room_number}` : "—"}
      </div>
    </div>
  );
}

// ─── Grid ────────────────────────────────────────────────────────────────────
function TimetableGrid({
  slots,
  rows,
  rowH,
}: {
  slots: { s: string; e: string }[];
  rows: ExportScheduleRow[];
  rowH: number;
}) {
  if (!slots.length) return null;

  const thStyle: React.CSSProperties = {
    height: HDR_ROW_PX,
    padding: "0 4px",
    background: "#111",
    color: "#fff",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textAlign: "center",
    verticalAlign: "middle",
    border: "1px solid #000",
  };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
      <colgroup>
        <col style={{ width: "10%" }} />
        {DAYS.map(d => <col key={d} style={{ width: "18%" }} />)}
      </colgroup>
      <thead>
        <tr>
          <th style={thStyle}>TIME</th>
          {DAYS.map(d => <th key={d} style={thStyle}>{d.toUpperCase()}</th>)}
        </tr>
      </thead>
      <tbody>
        {slots.map(({ s, e }) => (
          <tr key={`${s}-${e}`}>
            <td style={{ padding: 0, border: "1px solid #bbb", verticalAlign: "top" }}>
              <TimeCell s={s} e={e} rowH={rowH} />
            </td>
            {DAYS.map(day => {
              const entry = findEntry(rows, day, s, e);
              return (
                <td key={day} style={{ padding: 0, border: "1px solid #ddd", verticalAlign: "top" }}>
                  <DataCell entry={entry} rowH={rowH} />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── Main exported component ─────────────────────────────────────────────────
interface Props {
  rows: ExportScheduleRow[];
  programName: string;
  batchSession?: string;
  exportDate: string;
}

export function SchedulePrintView({ rows, programName, batchSession, exportDate }: Props) {
  const allSlots = getSlots(rows);
  const p1Slots = allSlots.slice(0, MAX_P1);
  const p2Slots = allSlots.slice(MAX_P1, MAX_P1 + MAX_P2);

  return (
    <div style={{ fontFamily: "Arial, 'Helvetica Neue', sans-serif", color: "#000", background: "#fff" }}>

      {/* Document header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid #000", paddingBottom: 10, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{programName}</div>
          {batchSession && <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>Session: {batchSession}</div>}
          <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>Sync · Weekly Class Schedule</div>
        </div>
        <div style={{ textAlign: "right", fontSize: 10, color: "#777", lineHeight: 1.7 }}>
          Sync · Class Schedule<br />
          <strong style={{ color: "#000", fontSize: 11 }}>{exportDate}</strong>
        </div>
      </div>

      {/* Page 1 grid */}
      <TimetableGrid slots={p1Slots} rows={rows} rowH={P1_ROW_PX} />

      {/* Page-2 divider — visible on screen only */}
      {p2Slots.length > 0 && (
        <div style={{ position: "relative", margin: "20px 0 16px", borderTop: "2px dashed #bbb" }}>
          <span style={{
            position: "absolute",
            top: -10,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: 4,
            padding: "1px 12px",
            fontSize: 10,
            color: "#999",
            whiteSpace: "nowrap",
          }}>
            — Page 2 —
          </span>
        </div>
      )}

      {/* Page 2 grid */}
      {p2Slots.length > 0 && (
        <TimetableGrid slots={p2Slots} rows={rows} rowH={P2_ROW_PX} />
      )}

      {/* Footer */}
      <div style={{ marginTop: 12, borderTop: "1px solid #e0e0e0", paddingTop: 6, display: "flex", justifyContent: "space-between", fontSize: 10, color: "#ccc" }}>
        <span>Generated by Sync · Schedule Management System</span>
        <span>{exportDate}</span>
      </div>
    </div>
  );
}
