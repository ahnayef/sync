import type { ExportScheduleRow } from "@/components/SchedulePrintView";

// ─────────────────────────────────────────────────────────────────────────────
const DAYS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
const DAYS_ABB = ["SUN", "MON", "TUE", "WED", "THU"];

interface BatchInfo { name: string; session: string; key: string; }

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

/**
 * Parse session string like "Fall 26", "Fall-26", "Spring 2025" → [fullYear, termPriority]
 * Term priority: Fall=1, Spring=2, Summer=3, Winter=4
 */
function parseBatchSortKey(session: string): [number, number] {
  const termOrder: Record<string, number> = { fall: 1, spring: 2, summer: 3, winter: 4 };
  const m = session.trim().match(/^(\w+)[\s-](\d{2,4})/i);
  if (m) {
    const term = m[1].toLowerCase();
    let year = parseInt(m[2], 10);
    if (year < 100) year += 2000; // "26" → 2026
    return [year, termOrder[term] ?? 99];
  }
  return [0, 99];
}

/** "Fall 26" → "Fall-26",  "Spring 2025" → "Spring-2025" */
function formatSession(s: string): string {
  return s.trim().replace(/^(\w+)\s+(\d+)$/, '$1-$2');
}

function getBatchesForDay(rows: ExportScheduleRow[], day: string): BatchInfo[] {
  const seen = new Set<string>();
  const out: BatchInfo[] = [];
  for (const r of rows) {
    if (r.day.toLowerCase() !== day.toLowerCase()) continue;
    const name = r.batch_name ?? "";
    const session = r.batch_session ?? name;
    const key = `${name}||${session}`;
    if (!seen.has(key)) { seen.add(key); out.push({ name, session, key }); }
  }
  // Sort by session's year DESC, then term order
  return out.sort((a, b) => {
    const [ya, ta] = parseBatchSortKey(a.session);
    const [yb, tb] = parseBatchSortKey(b.session);
    if (yb !== ya) return yb - ya;
    return ta - tb;
  });
}

function buildLookup(rows: ExportScheduleRow[]): Map<string, ExportScheduleRow> {
  const map = new Map<string, ExportScheduleRow>();
  for (const r of rows) {
    const name = r.batch_name ?? "";
    const session = r.batch_session ?? name;
    const bk = `${name}||${session}`;
    const k = `${r.day.toLowerCase()}||${bk}||${r.start_time}||${r.end_time}`;
    if (!map.has(k)) map.set(k, r);
  }
  return map;
}

/**
 * Builds a label map for every batch key → "Fall-26 (1/1)".
 * Collects all batches, sorts globally by year DESC + term, groups by calendar year,
 * then assigns (yearNum/semNum) automatically.
 */
function buildBatchLabels(rows: ExportScheduleRow[]): Map<string, string> {
  const seen = new Set<string>();
  const all: BatchInfo[] = [];
  for (const r of rows) {
    const name = r.batch_name ?? "";
    const session = r.batch_session ?? name;
    const key = `${name}||${session}`;
    if (!seen.has(key)) { seen.add(key); all.push({ name, session, key }); }
  }

  all.sort((a, b) => {
    const [ya, ta] = parseBatchSortKey(a.session);
    const [yb, tb] = parseBatchSortKey(b.session);
    if (yb !== ya) return yb - ya;
    return ta - tb;
  });

  // Group by calendar year (derived from session)
  const yearOrder: number[] = [];
  const yearMap = new Map<number, BatchInfo[]>();
  for (const b of all) {
    const [yr] = parseBatchSortKey(b.session);
    if (!yearMap.has(yr)) { yearMap.set(yr, []); yearOrder.push(yr); }
    yearMap.get(yr)!.push(b);
  }

  const labelMap = new Map<string, string>();
  yearOrder.forEach((yr, yi) => {
    const yearNum = yi + 1;
    yearMap.get(yr)!.forEach((b, si) => {
      labelMap.set(b.key, `${formatSession(b.session)} (${yearNum}/${si + 1})`);
    });
  });
  return labelMap;
}

/**
 * Returns 2-line HTML for a cell:
 *   Line 1: course code
 *   Line 2: teacher short, R-room
 */
function cellHTML(r: ExportScheduleRow | undefined): string {
  if (!r) return "";
  const line1 = r.course_code;
  const line2Parts: string[] = [];
  if (r.teacher_short) line2Parts.push(r.teacher_short);
  if (r.room_number != null) line2Parts.push(`R-${r.room_number}`);
  const line2 = line2Parts.join(", ");
  return line2 ? `${line1}<br/>${line2}` : line1;
}

// ─────────────────────────────────────────────────────────────────────────────
// Column widths (%)
// ─────────────────────────────────────────────────────────────────────────────
function colWidths(nSlots: number) {
  const DAY = 3.25;
  const SESSION = 7.5;
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
  const batchLabels = buildBatchLabels(rows); // "Fall-26 (1/1)" labels for every batch

  // ── Colgroup ──────────────────────────────────────────────────────────────
  const colgroup = `
    <colgroup>
      <col style="width:${cw.DAY}%"/>
      <col style="width:${cw.SESSION}%"/>
      ${slots.map(() => `<col style="width:${cw.TIME}%"/>`).join("")}
    </colgroup>`;

  // ── Header styles — ink-friendly: light gray bg, dark text, no solid black fill
  const TH = `
    padding:0 0.5mm; height:7mm;
    background:#f0f0f0; color:#000;
    font:700 7pt/1 Arial,sans-serif;
    text-align:center; vertical-align:middle;
    border:0.75pt solid #888;
    letter-spacing:.03em;`;

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
        style="height:5mm;padding:0;border:none;background:#fff;"></td></tr>
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

      // Session label — formatted "Fall-26 (1/1)"
      const label = batchLabels.get(batch.key) ?? formatSession(batch.session);
      tbody += `
        <td style="padding:0;border:0.5pt solid #bbb;background:${rowBg};">
          <div style="
            height:6.5mm;box-sizing:border-box;padding:0.5mm 0.8mm;
            overflow:hidden;font:600 6.5pt/1.2 Arial,sans-serif;color:#222;
            display:flex;align-items:center;justify-content:center;text-align:center;
          ">${label}</div>
        </td>`;

      // Time slot cells
      for (const slot of slots) {
        const k = `${day.toLowerCase()}||${batch.key}||${slot.s}||${slot.e}`;
        const entry = lookup.get(k);
        const html = cellHTML(entry);
        const bg = entry ? rowBg : emptyBg;

        tbody += `
          <td style="padding:0;border:0.5pt solid #ccc;background:${bg};">
            <div style="
              height:6.5mm;box-sizing:border-box;padding:0.5mm 0.5mm;
              overflow:hidden;font:400 6.5pt/1.3 'Courier New',monospace;
              color:${html ? "#000" : "transparent"};
              text-align:center;
            ">${html || "."}</div>
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
      margin-top:15mm;
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
      <span>Sync &middot; Schedule Management System</span>
      <span>${date}</span>
    </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>${programName} \u2014 Class Schedule</title>
  <style>
    @page { size: A4 landscape; margin: 6mm; }
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
    display:flex; justify-content:space-between; align-items:center;
    border-bottom:1pt solid #000; padding-bottom:1.5mm; margin-bottom:2mm;
  ">
    <div>
      <div style="font:900 11pt/1.1 Arial,sans-serif;letter-spacing:-.02em;">${programName}</div>
      ${batchSession
      ? `<div style="font:400 7pt Arial;color:#555;margin-top:0.5mm;">Session: ${batchSession}</div>`
      : ""}
    </div>
    <div style="text-align:right;font:400 6.5pt Arial;color:#777;line-height:1.5;">
      Sync &middot; Class Routine &middot;
      <strong style="color:#000;">${date}</strong>
    </div>
  </div>

  ${table}
  ${signatureBlock}
  ${footer}

</body>
</html>`;
}
