import type { ExportScheduleRow } from "@/components/SchedulePrintView";

function fmt24to12(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

function renderSlot(slot: ExportScheduleRow, isAlt: boolean): string {
  const labTag = slot.is_lab
    ? `<span style="display:inline-block;border:1px solid #000;font-size:6.5px;font-weight:900;padding:0 2.5px;letter-spacing:0.07em;vertical-align:middle;margin-left:3px;">LAB</span>`
    : "";
  const secTag =
    slot.section && slot.section !== "none"
      ? `<span style="font-size:7px;color:#555;margin-left:4px;">§${slot.section}</span>`
      : "";
  const roomStr = slot.room_number
    ? `<span style="font-size:8px;font-weight:700;color:#333;">Rm ${slot.room_number}${slot.room_title ? ` · ${slot.room_title}` : ""}</span>`
    : "";

  return `
    <div style="
      border:1px solid #ccc;
      border-left:3px solid #000;
      padding:5px 6px;
      margin-bottom:3px;
      background:${isAlt ? "#f5f5f5" : "#fff"};
      page-break-inside:avoid;
    ">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px;">
        <span style="font-family:'Courier New',monospace;font-size:8.5px;font-weight:700;color:#000;">
          ${fmt24to12(slot.start_time)} – ${fmt24to12(slot.end_time)}
        </span>
        ${roomStr}
      </div>
      <div style="font-family:'Courier New',monospace;font-size:7.5px;font-weight:700;color:#444;margin-bottom:2px;letter-spacing:0.04em;">
        ${slot.course_code}${labTag}${secTag}
      </div>
      <div style="font-size:10px;font-weight:800;line-height:1.25;color:#000;margin-bottom:2px;">
        ${slot.course_name}
      </div>
      <div style="font-size:8px;color:#444;">
        ${slot.teacher_name}${slot.teacher_short ? ` <span style="color:#888;">(${slot.teacher_short})</span>` : ""}
      </div>
    </div>`;
}

function renderDay(day: string, rows: ExportScheduleRow[]): string {
  const slots = rows.filter(
    (r) => r.day.toLowerCase() === day.toLowerCase()
  );
  return `
    <div style="flex:1;min-width:0;">
      <div style="
        background:#000;
        color:#fff;
        font-size:9px;
        font-weight:900;
        letter-spacing:0.14em;
        padding:4px 7px;
        margin-bottom:4px;
        text-transform:uppercase;
      ">
        ${day}
        <span style="float:right;font-weight:400;font-size:8px;color:#aaa;">
          ${slots.length === 0 ? "No classes" : `${slots.length} class${slots.length !== 1 ? "es" : ""}`}
        </span>
      </div>
      ${
        slots.length === 0
          ? `<div style="font-size:8px;color:#999;font-style:italic;padding:5px 6px;">No classes scheduled.</div>`
          : slots.map((s, i) => renderSlot(s, i % 2 === 1)).join("")
      }
    </div>`;
}

export function generateSchedulePrintHTML(
  rows: ExportScheduleRow[],
  programName: string,
  batchSession?: string,
  exportDate?: string
): string {
  const date = exportDate ?? new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>${programName} — Class Schedule</title>
  <style>
    @page { size: A4 landscape; margin: 10mm 12mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 9px;
      color: #000;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ── Header ── */
    .doc-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 2px solid #000;
      padding-bottom: 5px;
      margin-bottom: 7px;
    }
    .doc-title { font-size: 16px; font-weight: 900; letter-spacing: -0.02em; }
    .doc-sub   { font-size: 9px; color: #555; margin-top: 2px; }
    .doc-meta  { text-align: right; font-size: 8px; color: #666; line-height: 1.6; }

    /* ── Page rows ── */
    .page-row {
      display: flex;
      gap: 7px;
      align-items: flex-start;
    }
    .page-row-2 {
      display: flex;
      gap: 9px;
      align-items: flex-start;
      page-break-before: always;
    }

    /* ── Footer ── */
    .doc-footer {
      margin-top: 7px;
      border-top: 1px solid #ccc;
      padding-top: 4px;
      display: flex;
      justify-content: space-between;
      font-size: 7px;
      color: #999;
    }
  </style>
</head>
<body>

  <!-- Document header -->
  <div class="doc-header">
    <div>
      <div class="doc-title">${programName}</div>
      ${batchSession ? `<div class="doc-sub">Session: ${batchSession}</div>` : ""}
      <div class="doc-sub" style="margin-top:1px;">Loop · Weekly Class Schedule</div>
    </div>
    <div class="doc-meta">
      Exported<br>
      <strong style="font-size:9px;color:#000;">${date}</strong>
    </div>
  </div>

  <!-- Page 1: Sunday · Monday · Tuesday -->
  <div class="page-row">
    ${renderDay("Sunday", rows)}
    ${renderDay("Monday", rows)}
    ${renderDay("Tuesday", rows)}
  </div>

  <!-- Page 2: Wednesday · Thursday -->
  <div class="page-row-2">
    ${renderDay("Wednesday", rows)}
    ${renderDay("Thursday", rows)}
  </div>

  <!-- Footer -->
  <div class="doc-footer">
    <span>Generated by Loop · Schedule Management System</span>
    <span>${date}</span>
  </div>

  <script>
    window.addEventListener('load', function () {
      setTimeout(function () { window.print(); }, 350);
    });
  </script>
</body>
</html>`;
}
