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

// ─────────────────────────────────────────────────────────────────────────────
const DAYS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
const DAYS_ABB  = ["SUN",    "MON",    "TUE",     "WED",       "THU"    ];

const ROW_H_PX  = 32;
const HDR_H_PX  = 40;
const CELL_PX   = 10;

interface BatchInfo { session: string; key: string; }

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
/** "08:30" → "8:30 AM" */
function fmt12(t: string): string {
  const [hStr, mStr] = t.slice(0, 5).split(":");
  const h    = parseInt(hStr, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12  = h % 12 || 12;
  return `${h12}:${mStr} ${ampm}`;
}

function getTimeSlots(rows: ExportScheduleRow[]): Array<{ s: string; e: string }> {
  const seen = new Set<string>();
  const out: Array<{ s: string; e: string }> = [];
  for (const r of rows) {
    const k = `${r.start_time}|${r.end_time}`;
    if (!seen.has(k)) { seen.add(k); out.push({ s: r.start_time, e: r.end_time }); }
  }
  return out.sort((a, b) => a.s.localeCompare(b.s));
}

function getBatchesForDay(rows: ExportScheduleRow[], day: string): BatchInfo[] {
  const seen = new Set<string>();
  const out: BatchInfo[] = [];
  for (const r of rows) {
    if (r.day.toLowerCase() !== day.toLowerCase()) continue;
    const session = r.batch_session ?? r.batch_name ?? "";
    const key = `${r.batch_name ?? ""}||${session}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push({ session, key });
    }
  }
  return out.sort((a, b) => a.session.localeCompare(b.session));
}

function buildLookup(rows: ExportScheduleRow[]): Map<string, ExportScheduleRow> {
  const map = new Map<string, ExportScheduleRow>();
  for (const r of rows) {
    const session = r.batch_session ?? r.batch_name ?? "";
    const bk = `${r.batch_name ?? ""}||${session}`;
    const k  = `${r.day.toLowerCase()}||${bk}||${r.start_time}||${r.end_time}`;
    if (!map.has(k)) map.set(k, r);
  }
  return map;
}

function cellText(r: ExportScheduleRow | undefined): string {
  if (!r) return "";
  const parts: string[] = [r.course_code];
  if (r.teacher_short) parts.push(r.teacher_short);
  if (r.room_number != null) parts.push(`R-${r.room_number}`);
  return parts.join(", ");
}


// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────
function TimeHeader({ slots }: { slots: Array<{ s: string; e: string }> }) {
  const thBase: React.CSSProperties = {
    height: HDR_H_PX,
    padding: "0 6px",
    background: "#f0f0f0",
    color: "#000",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textAlign: "center",
    verticalAlign: "middle",
    border: "1px solid #888",
  };

  return (
    <tr>
      <th style={thBase}>DAY</th>
      <th style={{ ...thBase, textAlign: "left", paddingLeft: 8 }}>SESSION</th>
      {slots.map(s => (
        <th key={`${s.s}-${s.e}`} style={thBase}>
          <div>{fmt12(s.s)}</div>
          <div>{fmt12(s.e)}</div>
        </th>
      ))}
    </tr>
  );
}

function DaySection({
  day,
  dayAbb,
  batches,
  slots,
  lookup,
}: {
  day: string;
  dayAbb: string;
  batches: BatchInfo[];
  slots: Array<{ s: string; e: string }>;
  lookup: Map<string, ExportScheduleRow>;
}) {
  return (
    <>
      {batches.map((batch, bi) => {
        const isFirst = bi === 0;
        const rowBg   = bi % 2 === 0 ? "#ffffff" : "#f5f5f5";
        const emptyBg = bi % 2 === 0 ? "#f2f2f2" : "#ebebeb";

        return (
          <tr key={batch.key}>
            {/* Day cell — rowspan, light gray (ink-friendly) */}
            {isFirst && (
              <td
                rowSpan={batches.length}
                style={{
                  padding: 0,
                  textAlign: "center",
                  verticalAlign: "middle",
                  background: "#e8e8e8",
                  color: "#000",
                  fontWeight: 800,
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  border: "1px solid #888",
                  whiteSpace: "nowrap",
                }}
              >
                {dayAbb}
              </td>
            )}

            {/* Batch session label */}
            <td style={{ padding: 0, border: "1px solid #bbb", background: rowBg }}>
              <div style={{
                height: ROW_H_PX,
                boxSizing: "border-box",
                padding: `${CELL_PX / 2}px ${CELL_PX}px`,
                overflow: "hidden",
                fontSize: 10,
                fontWeight: 600,
                color: "#333",
                lineHeight: 1.3,
                display: "flex",
                alignItems: "center",
              }}>
                {batch.session}
              </div>
            </td>

            {/* Time slot cells */}
            {slots.map(slot => {
              const k     = `${day.toLowerCase()}||${batch.key}||${slot.s}||${slot.e}`;
              const entry = lookup.get(k);
              const text  = cellText(entry);

              return (
                <td key={`${slot.s}-${slot.e}`} style={{
                  padding: 0,
                  border: "1px solid #ddd",
                  background: entry ? rowBg : emptyBg,
                }}>
                  <div style={{
                    height: ROW_H_PX,
                    boxSizing: "border-box",
                    padding: `${CELL_PX / 2}px ${CELL_PX / 2 + 2}px`,
                    overflow: "hidden",
                    fontFamily: "'Courier New', monospace",
                    fontSize: 9.5,
                    color: text ? "#000" : "transparent",
                    lineHeight: 1.3,
                    display: "flex",
                    alignItems: "center",
                  }}>
                    {text || "."}
                  </div>
                </td>
              );
            })}
          </tr>
        );
      })}

      {/* Day separator row */}
      <tr>
        <td
          colSpan={2 + slots.length}
          style={{ height: 6, padding: 0, background: "#d8d8d8", border: "none" }}
        />
      </tr>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main exported component
// ─────────────────────────────────────────────────────────────────────────────
interface Props {
  rows: ExportScheduleRow[];
  programName: string;
  batchSession?: string;
  exportDate: string;
  signerName?: string;
  signerDesignation?: string;
  departmentName?: string;
}

export function SchedulePrintView({ rows, programName, batchSession, exportDate, signerName, signerDesignation, departmentName }: Props) {
  const slots   = getTimeSlots(rows);
  const lookup  = buildLookup(rows);
  const nSlots  = slots.length;

  // Column widths (matching print percentages)
  const DAY_W   = "3.25%";
  const BATCH_W = "10.1%";
  const TIME_W  = `${(100 - 3.25 - 10.1) / Math.max(nSlots, 1)}%`;

  return (
    <div style={{ fontFamily: "Arial, 'Helvetica Neue', sans-serif", color: "#000", background: "#fff" }}>

      {/* Document header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid #000", paddingBottom: 10, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{programName}</div>
          {batchSession && <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>Session: {batchSession}</div>}
        </div>
        <div style={{ textAlign: "right", fontSize: 10, color: "#777", lineHeight: 1.7 }}>
          Loop · Class Schedule<br />
          <strong style={{ color: "#000", fontSize: 11 }}>{exportDate}</strong>
        </div>
      </div>

      {/* Timetable */}
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: DAY_W }} />
          <col style={{ width: BATCH_W }} />
          {slots.map((s, i) => <col key={i} style={{ width: TIME_W }} />)}
        </colgroup>

        <thead>
          <TimeHeader slots={slots} />
        </thead>

        <tbody>
          {DAYS_FULL.map((day, di) => {
            const batches = getBatchesForDay(rows, day);
            if (!batches.length) return null;
            return (
              <DaySection
                key={day}
                day={day}
                dayAbb={DAYS_ABB[di]}
                batches={batches}
                slots={slots}
                lookup={lookup}
              />
            );
          })}
        </tbody>
      </table>

      {/* Signature block */}
      {(signerName || signerDesignation || departmentName) && (
        <div style={{ marginTop: 28, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ minWidth: 220, textAlign: "left" }}>
            <div style={{ borderTop: "1px solid #000", marginBottom: 6 }} />
            {signerName && (
              <div style={{ fontSize: 12, fontWeight: 700, color: "#000", lineHeight: 1.5 }}>{signerName}</div>
            )}
            {signerDesignation && (
              <div style={{ fontSize: 11, color: "#444", lineHeight: 1.4 }}>{signerDesignation}</div>
            )}
            {departmentName && (
              <div style={{ fontSize: 11, color: "#444", lineHeight: 1.4 }}>{departmentName}</div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 10, borderTop: "1px solid #e0e0e0", paddingTop: 6, display: "flex", justifyContent: "space-between", fontSize: 10, color: "#ccc" }}>
        <span>Generated by Loop · Schedule Management System</span>
        <span>{exportDate}</span>
      </div>
    </div>
  );
}
