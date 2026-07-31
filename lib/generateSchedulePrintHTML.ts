import type { ExportScheduleRow } from "@/components/SchedulePrintView";

// ─────────────────────────────────────────────────────────────────────────────
const DAYS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
const DAYS_ABB = ["SUN", "MON", "TUE", "WED", "THU"];

interface BatchInfo { session: string; key: string; }

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** "08:30" or "08:30:00" → "8:30 AM" */
function fmt12(t: string): string {
  const [hStr, mStr] = t.slice(0, 5).split(":");
  const h = parseInt(hStr, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
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
    // Use session as the primary label; key stays unique by session
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
    const k = `${r.day.toLowerCase()}||${bk}||${r.start_time}||${r.end_time}`;
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
// Column widths (% — adapts to any page width automatically)
// A4 landscape @ 10mm margins: 277mm.  Day≈9mm, Session≈28mm, rest=time cols.
// ─────────────────────────────────────────────────────────────────────────────
function colWidths(nSlots: number) {
  const DAY = 3.25;
  const SESSION = 10.1;
  const TIME = (100 - DAY - SESSION) / Math.max(nSlots, 1);
  return { DAY, SESSION, TIME };
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML generator
// ─────────────────────────────────────────────────────────────────────────────
export function generateSchedulePrintHTML(
  rows: ExportScheduleRow[],
  programName: string,
  batchSession?: string,
  exportDate?: string,
  signerName?: string,
  signerDesignation?: string,
  departmentName?: string,
): string {
  const date = exportDate
    ?? new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  if (!rows.length) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="font-family:Arial;padding:20mm;"><p>No schedule data found.</p></body></html>`;
  }

  const slots = getTimeSlots(rows);
  const lookup = buildLookup(rows);
  const cw = colWidths(slots.length);

  // ── Colgroup ──────────────────────────────────────────────────────────────
  const colgroup = `
    <colgroup>
      <col style="width:${cw.DAY}%"/>
      <col style="width:${cw.SESSION}%"/>
      ${slots.map(() => `<col style="width:${cw.TIME}%"/>`).join("")}
    </colgroup>`;

  // ── Header styles — ink-friendly: light gray bg, dark text, no solid black fill
  const TH = `
    padding:0 1mm; height:8mm;
    background:#f0f0f0; color:#000;
    font:700 7.5pt/1 Arial,sans-serif;
    text-align:center; vertical-align:middle;
    border:0.75pt solid #888;
    letter-spacing:.04em;`;

  const thead = `
    <thead>
      <tr>
        <th style="${TH}">DAY</th>
        <th style="${TH}text-align:left;padding-left:2mm;">SESSION</th>
        ${slots.map(s => `
          <th style="${TH}">
            ${fmt12(s.s)}<br/>${fmt12(s.e)}
          </th>`).join("")}
      </tr>
    </thead>`;

  // ── Day separator tbody ───────────────────────────────────────────────────
  const SEP = `
    <tbody>
      <tr><td colspan="${2 + slots.length}"
        style="height:2mm;padding:0;border:none;background:#ddd;"></td></tr>
    </tbody>`;

  // ── Data rows ─────────────────────────────────────────────────────────────
  const tbodies: string[] = [];

  for (let di = 0; di < DAYS_FULL.length; di++) {
    const day = DAYS_FULL[di];
    const dayAbb = DAYS_ABB[di];
    const batches = getBatchesForDay(rows, day);
    if (!batches.length) continue;

    let tbody = `<tbody style="page-break-inside:avoid;">`;

    for (let bi = 0; bi < batches.length; bi++) {
      const batch = batches[bi];
      const rowBg = bi % 2 === 0 ? "#ffffff" : "#f7f7f7";
      const emptyBg = bi % 2 === 0 ? "#f2f2f2" : "#ebebeb";

      tbody += `<tr>`;

      // Day cell — light gray, no black fill
      if (bi === 0) {
        tbody += `
          <td rowspan="${batches.length}" style="
            padding:0; text-align:center; vertical-align:middle;
            background:#e8e8e8; color:#000;
            font:800 8pt/1 Arial,sans-serif;
            border:0.75pt solid #888;
            letter-spacing:.06em;
          ">${dayAbb}</td>`;
      }

      // Session label
      tbody += `
        <td style="padding:0;border:0.5pt solid #bbb;background:${rowBg};">
          <div style="
            height:6mm;box-sizing:border-box;padding:0.8mm 1.5mm;
            overflow:hidden;font:600 6.5pt/1.1 Arial,sans-serif;color:#222;
          ">${batch.session}</div>
        </td>`;

      // Time slot cells
      for (const slot of slots) {
        const k = `${day.toLowerCase()}||${batch.key}||${slot.s}||${slot.e}`;
        const entry = lookup.get(k);
        const text = cellText(entry);
        const bg = entry ? rowBg : emptyBg;

        tbody += `
          <td style="padding:0;border:0.5pt solid #ccc;background:${bg};">
            <div style="
              height:6mm;box-sizing:border-box;padding:0.8mm 1mm;
              overflow:hidden;font:400 6.5pt/1.1 'Courier New',monospace;
              color:${text ? "#000" : "transparent"};
            ">${text || "."}</div>
          </td>`;
      }

      tbody += `</tr>`;
    }

    tbody += `</tbody>`;
    tbodies.push(tbody);
  }

  const table = `
    <table style="width:100%;border-collapse:collapse;table-layout:fixed;">
      ${colgroup}
      ${thead}
      ${tbodies.join(SEP)}
    </table>`;

  // ── Signature block ───────────────────────────────────────────────────────
  const hasSignature = signerName || signerDesignation || departmentName;
  const signatureBlock = hasSignature ? `
    <div style="
      margin-top:8mm;
      display:flex;
      justify-content:flex-end;
    ">
      <div style="min-width:70mm;text-align:left;">
        <div style="border-top:1pt solid #000;margin-bottom:2mm;"></div>
        ${signerName
      ? `<div style="font:700 9pt/1.5 Arial,sans-serif;color:#000;">${signerName}</div>`
      : ""}
        ${signerDesignation
      ? `<div style="font:400 8pt/1.4 Arial,sans-serif;color:#333;">${signerDesignation}</div>`
      : ""}
        ${departmentName
      ? `<div style="font:400 8pt/1.4 Arial,sans-serif;color:#333;">${departmentName}</div>`
      : ""}
      </div>
    </div>` : "";

  // ── Footer ────────────────────────────────────────────────────────────────
  const footer = `
    <div style="
      margin-top:3mm;border-top:.5pt solid #ccc;padding-top:1.5mm;
      display:flex;justify-content:space-between;font:400 6pt Arial;color:#bbb;
    ">
      <span>Loop &middot; Schedule Management System</span>
      <span>${date}</span>
    </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>${programName} \u2014 Class Schedule</title>
  <style>
    @page { size: A4 landscape; margin: 10mm; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      font-family: Arial, 'Helvetica Neue', sans-serif;
      background: #fff; color: #000;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  </style>
</head>
<body>

  <!-- Document header -->
  <div style="
    display:flex; justify-content:space-between; align-items:flex-end;
    border-bottom:1.5pt solid #000; padding-bottom:2.5mm; margin-bottom:3mm;
  ">
    <div>
      <div style="font:900 13pt/1.1 Arial,sans-serif;letter-spacing:-.02em;">${programName}</div>
      ${batchSession
      ? `<div style="font:400 8pt Arial;color:#555;margin-top:1mm;">Session: ${batchSession}</div>`
      : ""}
    </div>
    <div style="text-align:right;font:400 7.5pt Arial;color:#777;line-height:1.6;">
      Loop &middot; Class Routine<br/>
      <strong style="color:#000;font-size:8pt;">${date}</strong>
    </div>
  </div>

  ${table}
  ${signatureBlock}
  ${footer}

</body>
</html>`;
}
