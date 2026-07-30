import type { ExportScheduleRow } from "@/components/SchedulePrintView";

// ─────────────────────────────────────────────────────────────────────────────
// Layout constants  (A4 landscape, 10mm margins → 277 × 190 mm content area)
// ─────────────────────────────────────────────────────────────────────────────
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
const MAX_P1 = 5;   // max time-slot rows on page 1
const MAX_P2 = 5;   // max time-slot rows on page 2

// Both pages use the same row height for visual consistency
//   Page 1: 12 (doc hdr) + 8 (tbl hdr) + 5×32 + 4 (footer) = 184 ≤ 190 ✓
//   Page 2: 8 (tbl hdr) + 5×32 + 4 (footer) = 172 ≤ 190 ✓
const P1_ROW_H = 32;  // mm
const P2_ROW_H = 32;  // mm  — same as P1 for consistent appearance
const TBL_HDR_H = 8;   // mm  — day-name header row
const CELL_PAD = 2.5; // mm  — uniform cell padding (border-box)

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function fmt12(t: string): string {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function getSlots(rows: ExportScheduleRow[]): { s: string; e: string }[] {
  const seen = new Set<string>();
  const out: { s: string; e: string }[] = [];
  for (const r of rows) {
    const k = `${r.start_time}|${r.end_time}`;
    if (!seen.has(k)) { seen.add(k); out.push({ s: r.start_time, e: r.end_time }); }
  }
  return out.sort((a, b) => a.s.localeCompare(b.s));
}

function findEntry(
  rows: ExportScheduleRow[], day: string, s: string, e: string,
): ExportScheduleRow | undefined {
  return rows.find(
    r => r.day.toLowerCase() === day.toLowerCase()
      && r.start_time === s
      && r.end_time === e,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Cell renderers  (height: fixed mm, overflow: hidden → row height is LOCKED)
// ─────────────────────────────────────────────────────────────────────────────
function timeCell(s: string, e: string, rowH: number): string {
  // Flexbox centering works inside a block div with explicit height
  return `
    <div style="
      height:${rowH}mm; box-sizing:border-box;
      padding:0 ${CELL_PAD}mm; overflow:hidden;
      display:flex; flex-direction:column;
      justify-content:center; align-items:center;
      background:#ebebeb;
    ">
      <span style="font:700 9pt/1.3 'Courier New',monospace;color:#000;text-align:center;">
        ${fmt12(s)}
      </span>
      <span style="font:400 7pt/1 Arial;color:#aaa;margin:1mm 0;text-align:center;">—</span>
      <span style="font:700 9pt/1.3 'Courier New',monospace;color:#000;text-align:center;">
        ${fmt12(e)}
      </span>
    </div>`;
}

function dataCell(entry: ExportScheduleRow | undefined, rowH: number): string {
  if (!entry) {
    return `<div style="height:${rowH}mm;box-sizing:border-box;background:#f7f7f7;overflow:hidden;"></div>`;
  }
  return `
    <div style="
      height:${rowH}mm; box-sizing:border-box;
      padding:${CELL_PAD}mm ${CELL_PAD + 0.5}mm;
      overflow:hidden; background:#fff;
    ">
      <div style="font:700 7pt/1.1 'Courier New',monospace;color:#888;margin-bottom:0.4mm;letter-spacing:.02em;">
        ${entry.course_code}
      </div>
      <div style="font:800 10.5pt/1.2 Arial,sans-serif;color:#000;margin-bottom:0.5mm;">
        ${entry.course_name}
      </div>
      <div style="font:400 8.5pt/1.2 Arial,sans-serif;color:#555;margin-bottom:0.4mm;">
        ${entry.teacher_name}
      </div>
      <div style="font:600 7.5pt/1.1 Arial,sans-serif;color:#333;">
        ${entry.room_number ? `Room&nbsp;${entry.room_number}` : "\u2014"}
      </div>
    </div>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Table builder
// ─────────────────────────────────────────────────────────────────────────────
function renderTable(
  slots: { s: string; e: string }[],
  rows: ExportScheduleRow[],
  rowH: number,
): string {
  if (!slots.length) return "";

  const TH = `
    height:${TBL_HDR_H}mm; padding:0;
    background:#111; color:#fff;
    font:700 9.5pt/1 Arial,sans-serif;
    text-align:center; vertical-align:middle;
    border:1pt solid #000; letter-spacing:.06em;`;

  const thead = `
    <thead>
      <tr>
        <th style="${TH} width:10%;">TIME</th>
        ${DAYS.map(d => `<th style="${TH} width:18%;">${d.toUpperCase()}</th>`).join("")}
      </tr>
    </thead>`;

  const tbody = `
    <tbody>
      ${slots.map(({ s, e }) => `
        <tr>
          <td style="padding:0;border:.75pt solid #bbb;vertical-align:top;">
            ${timeCell(s, e, rowH)}
          </td>
          ${DAYS.map(day => {
    const entry = findEntry(rows, day, s, e);
    return `<td style="padding:0;border:.75pt solid #ddd;vertical-align:top;">
              ${dataCell(entry, rowH)}
            </td>`;
  }).join("")}
        </tr>`).join("")}
    </tbody>`;

  return `<table style="width:100%;border-collapse:collapse;table-layout:fixed;">${thead}${tbody}</table>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────
export function generateSchedulePrintHTML(
  rows: ExportScheduleRow[],
  programName: string,
  batchSession?: string,
  exportDate?: string,
): string {
  const date = exportDate
    ?? new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const allSlots = getSlots(rows);
  const p1Slots = allSlots.slice(0, MAX_P1);
  const p2Slots = allSlots.slice(MAX_P1, MAX_P1 + MAX_P2);
  const hasExtra = allSlots.length > MAX_P1 + MAX_P2;

  const footer = (extra = "") => `
    <div style="
      margin-top:2.5mm; border-top:.5pt solid #ccc; padding-top:1.5mm;
      display:flex; justify-content:space-between;
      font:400 6.5pt Arial; color:#ccc;
    ">
      <span>Sync &middot; Schedule Management System</span>
      <span>${date}${extra}</span>
    </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>${programName} \u2014 Schedule</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 10mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      /* NO fixed width \u2014 let @page determine the printable width */
      font-family: Arial, 'Helvetica Neue', sans-serif;
      background: #fff;
      color: #000;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  </style>
</head>
<body>

  <!-- ===== PAGE 1 ===== -->

  <!-- Document header (12 mm) -->
  <div style="
    display:flex; justify-content:space-between; align-items:flex-end;
    border-bottom:2pt solid #000;
    padding-bottom:2.5mm; margin-bottom:3mm;
  ">
    <div>
      <div style="font:900 13pt/1.1 Arial,sans-serif;letter-spacing:-.02em;">
        ${programName}
      </div>
      ${batchSession
      ? `<div style="font:600 8pt/1.4 Arial;color:#555;margin-top:1.5mm;">Session: ${batchSession}</div>`
      : ""}
    </div>
    <div style="text-align:right;font:400 8pt/1.6 Arial;color:#666;">
      Sync &middot; Class Schedule<br>
      <strong style="color:#000;font-size:8.5pt;">${date}</strong>
    </div>
  </div>

  <!-- Grid (page 1) -->
  ${renderTable(p1Slots, rows, P1_ROW_H)}

  ${p2Slots.length === 0 ? footer() : ""}

  <!-- ===== PAGE 2 (if needed) ===== -->
  ${p2Slots.length > 0 ? `
  <div style="page-break-before:always;">
    ${renderTable(p2Slots, rows, P2_ROW_H)}
    ${hasExtra
        ? `<div style="margin-top:2mm;font:400 7pt Arial;color:#c00;">
           \u26a0 Some time slots exceeded the 2-page limit and are not shown.
         </div>`
        : ""}
    ${footer(" \u2014 Page 2")}
  </div>` : ""}

</body>
</html>`;
}
