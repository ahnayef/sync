import ExcelJS from "exceljs";
import { Readable } from "stream";
import type { RowDataPacket } from "mysql2";
import db from "@/lib/db";

export type DayName = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";

export type RawScheduleRow = {
  clientId: string;
  sourceRow: number;
  sourceColumn: number;
  start_time: string;
  end_time: string;
  day: DayName;
  section: string;
  course_code: string;
  teacher_short_name: string;
  batch: string;
  room_number: number | null;
};

export type ResolvedScheduleRow = RawScheduleRow & {
  status: "ok" | "warning" | "error";
  errors: string[];
  warnings: string[];
  program_id: number | null;
  course_id: number | null;
  teacher_id: number | null;
  batch_id: number | null;
  room_id: number | null;
  course_name: string | null;
  teacher_name: string | null;
  room_label: string | null;
  is_lab: boolean;
};

type MergeRange = {
  top: number;
  left: number;
  bottom: number;
  right: number;
};

type DepartmentRow = RowDataPacket & {
  id: number;
  name: string;
};

type CourseRow = RowDataPacket & {
  id: number;
  name: string | null;
  code: string;
  is_lab: number | boolean;
};

type TeacherRow = RowDataPacket & {
  id: number;
  name: string;
  short: string;
};

type BatchRow = RowDataPacket & {
  id: number;
  name: string;
  session: string;
  program_id: number;
};

type RoomRow = RowDataPacket & {
  id: number;
  number: number;
  title: string | null;
};

type ScheduleConflictRow = RowDataPacket & {
  id: number;
  teacher_id: number | null;
  room_id: number | null;
  batch_id: number | null;
  section: string | null;
  day: DayName;
  start_time: string;
  end_time: string;
  room_number: number | null;
  course_code: string | null;
  course_name: string | null;
  teacher_short: string | null;
  teacher_name: string | null;
  batch_name: string | null;
  department_name: string | null;
};

type XlsxLoader = (
  data: ArrayBuffer,
  options?: Partial<ExcelJS.XlsxReadOptions>
) => Promise<ExcelJS.Workbook>;

type DownloadedSheet = {
  buffer: Buffer;
  fileName: string;
  gid: string | null;
};

// const dayRanges: Array<{ name: DayName; start: number; end: number }> = [
//   { name: "sunday", start: 3, end: 13 },
//   { name: "monday", start: 14, end: 24 },
//   { name: "tuesday", start: 25, end: 35 },
//   { name: "wednesday", start: 36, end: 46 },
//   { name: "thursday", start: 47, end: 57 },
// ];

const fallbackTimeSlots: Record<number, { start: string; end: string }> = {
  3: { start: "08:30:00", end: "09:55:00" },
  4: { start: "10:00:00", end: "11:25:00" },
  5: { start: "11:30:00", end: "12:55:00" },
  6: { start: "13:00:00", end: "14:25:00" },
  7: { start: "14:30:00", end: "15:55:00" },
  8: { start: "16:00:00", end: "17:25:00" },
};

function normalizeKey(value: string | number | null | undefined) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizeCode(value: string | null | undefined) {
  return String(value ?? "").trim().toUpperCase();
}

function toMinutes(timeText: string) {
  const match = timeText.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  return hour * 60 + minute;
}

function formatMinutes(totalMinutes: number) {
  const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hour = Math.floor(normalized / 60).toString().padStart(2, "0");
  const minute = (normalized % 60).toString().padStart(2, "0");
  return `${hour}:${minute}:00`;
}

function getCellText(cell: ExcelJS.Cell) {
  const value = cell.value;
  if (value && typeof value === "object") {
    if ("text" in value && value.text) return String(value.text).trim();
    if ("result" in value && value.result) return String(value.result).trim();
    if ("richText" in value && Array.isArray(value.richText)) {
      return value.richText.map((part) => part.text).join("").trim();
    }
  }
  let text = "";
  try {
    text = cell.text;
  } catch (e) {
    // Ignore ExcelJS internal errors like "Cannot read properties of null (reading 'toString')"
    // on merged cells that have no text
  }
  return (text || value || "").toString().trim();
}

function detectTimeSlots(sheet: ExcelJS.Worksheet) {
  const timePattern = /(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/;
  let bestRow: number | null = null;
  let bestMatches: Array<{ colNumber: number; start: string; end: string }> = [];

  for (let rowNumber = 1; rowNumber <= Math.min(sheet.rowCount, 15); rowNumber++) {
    const row = sheet.getRow(rowNumber);
    const matches: Array<{ colNumber: number; start: string; end: string }> = [];

    for (let colNumber = 1; colNumber <= sheet.columnCount; colNumber++) {
      const text = getCellText(row.getCell(colNumber));
      const match = text.match(timePattern);
      if (!match) continue;
      matches.push({ colNumber, start: match[1], end: match[2] });
    }

    if (matches.length > bestMatches.length) {
      bestRow = rowNumber;
      bestMatches = matches;
    }
  }

  if (!bestRow || bestMatches.length === 0) return null;

  const timeSlots: Record<number, { start: string; end: string }> = {};
  let offsetMinutes = 0;
  let previousRawStartMinutes: number | null = null;

  for (const slot of bestMatches.sort((a, b) => a.colNumber - b.colNumber)) {
    const rawStartMinutes = toMinutes(slot.start);
    const rawEndMinutes = toMinutes(slot.end);
    if (rawStartMinutes === null || rawEndMinutes === null) continue;

    if (previousRawStartMinutes !== null && rawStartMinutes < previousRawStartMinutes) {
      offsetMinutes += 12 * 60;
    }

    const startMinutes = rawStartMinutes + offsetMinutes;
    const endMinutes = rawEndMinutes + offsetMinutes + (rawEndMinutes < rawStartMinutes ? 12 * 60 : 0);
    timeSlots[slot.colNumber] = {
      start: formatMinutes(startMinutes),
      end: formatMinutes(endMinutes),
    };
    previousRawStartMinutes = rawStartMinutes;
  }

  return timeSlots;
}

function getMergeRanges(sheet: ExcelJS.Worksheet) {
  const rawMerges = (sheet as unknown as { _merges?: Record<string, MergeRange> })._merges || {};
  return Object.values(rawMerges);
}

function findMergeRange(sheet: ExcelJS.Worksheet, row: number, col: number) {
  return getMergeRanges(sheet).find((merge) => merge.top === row && merge.left === col);
}

function cleanBatchName(batchCell: string) {
  return batchCell
    .replace(/\[.*?\]/g, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/-/g, " ")
    .trim();
}

function detectSection(batchCell: string) {
  if (batchCell.includes("[Sec-B]")) return "B";
  if (batchCell.includes("[Sec-A]")) return "A";
  return "none";
}

function formatDay(day: DayName) {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

function formatDisplayTime(timeText: string) {
  const minutes = toMinutes(timeText);
  if (minutes === null) return timeText;

  const hour24 = Math.floor(minutes / 60);
  const minute = (minutes % 60).toString().padStart(2, "0");
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = ((hour24 + 11) % 12) + 1;
  return `${hour12}:${minute} ${suffix}`;
}

function formatTimeRange(startTime: string, endTime: string) {
  return `${formatDisplayTime(startTime)} - ${formatDisplayTime(endTime)}`;
}

function getAppBaseUrl() {
  // const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || process.env.SITE_URL || "";
  // if (!envUrl) return "";
  // if (/^https?:\/\//i.test(envUrl)) return envUrl.replace(/\/$/, "");
  // return `https://${envUrl.replace(/\/$/, "")}`;
  return "";
}

function getDashboardUrl(path: string) {
  const baseUrl = getAppBaseUrl();
  return baseUrl ? `${baseUrl}${path}` : path;
}

function formatScheduleSummary(
  row: Pick<ResolvedScheduleRow, "course_code" | "teacher_short_name" | "batch" | "day" | "start_time" | "end_time">,
  departmentName: string | null
) {
  return `${row.course_code}${row.teacher_short_name ? ` (Teacher: ${row.teacher_short_name})` : ""} at ${formatDay(row.day)}, ${formatTimeRange(row.start_time, row.end_time)}, Batch: ${row.batch}, Dept: ${departmentName || "Unknown"}`;
}

function formatExistingScheduleSummary(
  row: Pick<ScheduleConflictRow, "course_code" | "teacher_short" | "batch_name" | "department_name" | "day" | "start_time" | "end_time" | "room_number">
) {
  const roomPart = row.room_number ? `, Room: ${row.room_number}` : "";
  const batchPart = row.batch_name || "Unknown";
  const deptPart = row.department_name || "Unknown";
  return `${row.course_code || "Unknown course"}${row.teacher_short ? ` (Teacher: ${row.teacher_short})` : ""} at ${formatDay(row.day)}, ${formatTimeRange(row.start_time, row.end_time)}, Batch: ${batchPart}, Dept: ${deptPart}${roomPart}`;
}

function buildValidationMessage(rows: ResolvedScheduleRow[], departmentName: string | null) {
  const rowBySourceRow = new Map(rows.map((row) => [row.sourceRow, row]));
  const pairMessages = new Set<string>();
  const fallbackMessages: string[] = [];

  const formatMissingEntityMessage = (row: ResolvedScheduleRow, entity: string, value: string, solutionPath: string) => {
    const safeValue = value.trim() || "(blank)";
    return `| ${row.sourceRow} | ${entity} **${safeValue}** does not exist. | [Resolve](${getDashboardUrl(solutionPath)}) |`;
  };

  function formatUploadedRowText(r: ResolvedScheduleRow, deptName: string | null) {
    return `**${r.course_code}**<br/>Teacher: ${r.teacher_short_name || r.teacher_name || "N/A"}<br/>${formatDay(r.day)}, ${formatTimeRange(r.start_time, r.end_time)}<br/>Batch: ${r.batch}`;
  }

  function formatExistingRowText(r: ScheduleConflictRow) {
    return `**${r.course_code || "Unknown"}**<br/>Teacher: ${r.teacher_short || r.teacher_name || "N/A"}<br/>${formatDay(r.day)}, ${formatTimeRange(r.start_time, r.end_time)}<br/>Batch: ${r.batch_name || "Unknown"}`;
  }

  for (const row of rows) {
    if (row.errors.length === 0) continue;

    for (const error of row.errors) {
      const uploadedMatch = error.match(/^Teacher conflict with uploaded row (\d+)\.$/);
      if (uploadedMatch) {
        const otherRowNumber = Number(uploadedMatch[1]);
        const otherRow = rowBySourceRow.get(otherRowNumber);
        if (otherRow) {
          const left = row.sourceRow < otherRow.sourceRow ? row : otherRow;
          const right = row.sourceRow < otherRow.sourceRow ? otherRow : row;
          const leftText = `Row ${left.sourceRow}:<br/>` + formatUploadedRowText(left, departmentName);
          const rightText = `Row ${right.sourceRow}:<br/>` + formatUploadedRowText(right, departmentName);
          pairMessages.add(`| ${left.sourceRow}, ${right.sourceRow} | ${leftText} <br/><br/>**conflicts with**<br/><br/> ${rightText} | Remove one |`);
          continue;
        }
      }

      const existingMatch = error.match(/^Teacher conflict with an existing (.+) schedule in room (.+)\.$/);
      if (existingMatch) {
        const rowText = formatUploadedRowText(row, departmentName);
        fallbackMessages.push(`| ${row.sourceRow} | ${rowText} <br/><br/>**conflicts with existing ${existingMatch[1]} schedule in ${existingMatch[2]}** | Update / Remove |`);
        continue;
      }

      const teacherExistingMatch = error.match(/^Teacher conflict with existing schedule: (.+)\.$/);
      if (teacherExistingMatch) {
        const rowText = formatUploadedRowText(row, departmentName);
        fallbackMessages.push(`| ${row.sourceRow} | ${rowText} <br/><br/>**teacher conflict with existing:** ${teacherExistingMatch[1]} | Update / Remove |`);
        continue;
      }

      const roomUploadedMatch = error.match(/^Room conflict with uploaded row (\d+)\.$/);
      if (roomUploadedMatch) {
        const otherRowNumber = Number(roomUploadedMatch[1]);
        const otherRow = rowBySourceRow.get(otherRowNumber);
        if (otherRow) {
          const left = row.sourceRow < otherRow.sourceRow ? row : otherRow;
          const right = row.sourceRow < otherRow.sourceRow ? otherRow : row;
          const leftText = `Row ${left.sourceRow}:<br/>` + formatUploadedRowText(left, departmentName);
          const rightText = `Row ${right.sourceRow}:<br/>` + formatUploadedRowText(right, departmentName);
          pairMessages.add(`| ${left.sourceRow}, ${right.sourceRow} | ${leftText} <br/><br/>**room conflict with**<br/><br/> ${rightText} | Remove one |`);
          continue;
        }
      }

      const roomExistingMatch = error.match(/^Room conflict with existing schedule: (.+)\.$/);
      if (roomExistingMatch) {
        const rowText = formatUploadedRowText(row, departmentName);
        fallbackMessages.push(`| ${row.sourceRow} | ${rowText} <br/><br/>**room conflict with existing:** ${roomExistingMatch[1]} | Update / Remove |`);
        continue;
      }

      const batchUploadedMatch = error.match(/^Batch\/section overlap with uploaded row (\d+)\.$/);
      if (batchUploadedMatch) {
        const otherRowNumber = Number(batchUploadedMatch[1]);
        const otherRow = rowBySourceRow.get(otherRowNumber);
        if (otherRow) {
          const left = row.sourceRow < otherRow.sourceRow ? row : otherRow;
          const right = row.sourceRow < otherRow.sourceRow ? otherRow : row;
          const leftText = `Row ${left.sourceRow}:<br/>` + formatUploadedRowText(left, departmentName);
          const rightText = `Row ${right.sourceRow}:<br/>` + formatUploadedRowText(right, departmentName);
          pairMessages.add(`| ${left.sourceRow}, ${right.sourceRow} | ${leftText} <br/><br/>**batch/section overlap with**<br/><br/> ${rightText} | Remove one |`);
          continue;
        }
      }

      const batchExistingMatch = error.match(/^Batch\/section overlap with existing schedule: (.+)\.$/);
      if (batchExistingMatch) {
        const rowText = formatUploadedRowText(row, departmentName);
        fallbackMessages.push(`| ${row.sourceRow} | ${rowText} <br/><br/>**batch/section overlap with existing:** ${batchExistingMatch[1]} | Update / Remove |`);
        continue;
      }

      const courseMatch = error.match(/^Course (.+) was not found\.$/);
      if (courseMatch) {
        fallbackMessages.push(formatMissingEntityMessage(row, "Course", courseMatch[1], "/dashboard/manage-courses"));
        continue;
      }

      const teacherMatch = error.match(/^Teacher (.+) was not found\.$/);
      if (teacherMatch) {
        fallbackMessages.push(formatMissingEntityMessage(row, "Teacher", teacherMatch[1], "/dashboard/manage-teachers"));
        continue;
      }

      const batchMatch = error.match(/^Batch (.+) was not found in (.+)\.$/);
      if (batchMatch) {
        fallbackMessages.push(formatMissingEntityMessage(row, "Batch", batchMatch[1], "/dashboard/manage-batch"));
        continue;
      }

      const roomMatch = error.match(/^Room (.+) was not found\.$/);
      if (roomMatch) {
        fallbackMessages.push(formatMissingEntityMessage(row, "Room", roomMatch[1], "/dashboard/manage-rooms"));
        continue;
      }

      const departmentMatch = error.match(/^Department was not found\.$/);
      if (departmentMatch) {
        fallbackMessages.push(
          `| ${row.sourceRow} | Department does not exist. | [Resolve](${getDashboardUrl("/dashboard/manage-department")}) |`
        );
        continue;
      }

      fallbackMessages.push(`| ${row.sourceRow} | ${formatScheduleSummary(row, departmentName)}<br/>${error} | Review |`);
    }
  }

  let finalMarkdown = "";
  const allMessages = [...pairMessages, ...fallbackMessages];
  if (allMessages.length > 0) {
    finalMarkdown += "\n| Row | Issue | Solution |\n|---|---|---|\n";
    finalMarkdown += allMessages.slice(0, 10).join("\n");
    if (allMessages.length > 10) {
      finalMarkdown += `\n| ... | *...and ${allMessages.length - 10} more errors* | |`;
    }
  }

  return finalMarkdown;
}

function getDayName(text: string): DayName | null {
  const t = text.toLowerCase().trim();
  if (t.startsWith("sun")) return "sunday";
  if (t.startsWith("mon")) return "monday";
  if (t.startsWith("tue")) return "tuesday";
  if (t.startsWith("wed")) return "wednesday";
  if (t.startsWith("thu")) return "thursday";
  if (t.startsWith("fri")) return "friday";
  if (t.startsWith("sat")) return "saturday";
  return null;
}

export function parseWorksheet(sheet: ExcelJS.Worksheet) {
  const result: RawScheduleRow[] = [];
  const timeSlots = detectTimeSlots(sheet) || fallbackTimeSlots;

  let currentDay: DayName | null = null;

  for (let row = 3; row <= sheet.rowCount; row++) {
    // 1. Resolve Day Name from Column A
    const dayCell = sheet.getCell(`A${row}`);
    const effectiveDayCell = dayCell.isMerged ? dayCell.master : dayCell;
    const parsedDay = getDayName(getCellText(effectiveDayCell));
    if (parsedDay) {
      currentDay = parsedDay;
    }

    if (!currentDay) continue;

    // 2. Validate Batch Cell (Column B)
    const batchCell = sheet.getCell(`B${row}`);
    const batchText = getCellText(batchCell);

    // Ignore explicit "Other Dept" text
    if (batchText.toLowerCase().includes("other")) continue;

    // Ignore empty batch cells (we need a batch name!)
    if (!batchText) continue;

    // Ignore Grayed Out Rows
    let isGray = false;
    if (batchCell.fill && batchCell.fill.type === "pattern" && batchCell.fill.pattern === "solid") {
      const argb = batchCell.fill.fgColor?.argb?.toUpperCase();
      if (argb && argb !== "FFFFFFFF" && argb !== "00000000") {
        isGray = true;
      } else if (batchCell.fill.fgColor?.theme !== undefined) {
        // If it's using a theme color that typically indicates a highlight (like Google Sheets often exports)
        isGray = true;
      }
    }

    if (isGray) continue;

    // 3. Process Schedule Slots (Columns C-H)
    for (let col = 3; col <= 8; col++) {
      const cell = sheet.getRow(row).getCell(col);
      if (!cell.value) continue;
      if (cell.isMerged && cell.master.address !== cell.address) continue;

      const mergeRange = cell.isMerged ? findMergeRange(sheet, row, col) : null;
      const startCol = mergeRange?.left || col;
      const endCol = mergeRange?.right || col;
      const timeStart = timeSlots[startCol]?.start;
      const timeEnd = timeSlots[endCol]?.end;
      if (!timeStart || !timeEnd) continue;

      const rawText = getCellText(cell);
      const parts = rawText.split(",").map((value) => value.trim());
      if (parts.length < 3) continue;

      const roomNumber = Number(parts[2].replace(/[^\d]/g, ""));
      result.push({
        clientId: `${currentDay}-${row}-${col}`,
        sourceRow: row,
        sourceColumn: col,
        start_time: timeStart,
        end_time: timeEnd,
        day: currentDay,
        section: detectSection(batchText),
        course_code: parts[0],
        teacher_short_name: parts[1],
        batch: cleanBatchName(batchText),
        room_number: Number.isNaN(roomNumber) ? null : roomNumber,
      });

      col = endCol;
    }
  }

  return result;
}

export async function parseWorkbook(buffer: Buffer, fileName: string, worksheetGid?: string | null) {
  const workbook = new ExcelJS.Workbook();
  if (fileName.toLowerCase().endsWith(".csv")) {
    await workbook.csv.read(Readable.from(buffer.toString("utf8")));
  } else {
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
    const loadXlsx = workbook.xlsx.load.bind(workbook.xlsx) as unknown as XlsxLoader;
    await loadXlsx(arrayBuffer, {
      ignoreNodes: ["drawing", "picture", "legacyDrawing", "legacyDrawingHF"],
    });
  }

  const sheet = worksheetGid ? workbook.getWorksheet(Number(worksheetGid)) || workbook.worksheets[0] : workbook.worksheets[0];
  if (!sheet) throw new Error("No worksheet found in the uploaded file.");
  return parseWorksheet(sheet);
}

function extractGoogleSheetId(value: string) {
  const match = value.match(/\/spreadsheets\/d\/([A-Za-z0-9-_]+)/) || value.match(/[A-Za-z0-9-_]{20,}/);
  return match ? match[1] || match[0] : null;
}

function extractGoogleSheetGid(value: string) {
  return value.match(/[?&#]gid=(\d+)/)?.[1] || null;
}

function looksLikeXlsx(buffer: Buffer) {
  return buffer.length > 4 && buffer[0] === 0x50 && buffer[1] === 0x4b;
}

function looksLikeHtml(buffer: Buffer) {
  return buffer.subarray(0, 300).toString("utf8").toLowerCase().includes("<html");
}

async function fetchGoogleExport(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
    redirect: "follow",
    headers: {
      "User-Agent": "Mozilla/5.0 SyncScheduleImporter/1.0",
      Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,*/*",
    },
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  return {
    ok: response.ok,
    status: response.status,
    contentType: response.headers.get("content-type") || "",
    buffer,
  };
}

export async function fetchGoogleSheetBuffer(input: string): Promise<DownloadedSheet> {
  const sheetId = extractGoogleSheetId(input);
  if (!sheetId) throw new Error("Could not find a valid Google Sheet ID.");
  const gid = extractGoogleSheetGid(input);
  const encodedId = encodeURIComponent(sheetId);
  const xlsxUrls = [
    `https://docs.google.com/spreadsheets/d/${encodedId}/export?format=xlsx${gid ? `&gid=${encodeURIComponent(gid)}` : ""}`,
    `https://docs.google.com/spreadsheets/d/${encodedId}/export?format=xlsx`,
  ];

  for (const url of xlsxUrls) {
    const sheet = await fetchGoogleExport(url);
    if (sheet.ok && looksLikeXlsx(sheet.buffer)) {
      return { buffer: sheet.buffer, fileName: "google-sheet.xlsx", gid };
    }
  }

  if (gid) {
    const csvSheet = await fetchGoogleExport(
      `https://docs.google.com/spreadsheets/d/${encodedId}/export?format=csv&gid=${encodeURIComponent(gid)}`
    );

    if (csvSheet.ok && !looksLikeHtml(csvSheet.buffer)) {
      return { buffer: csvSheet.buffer, fileName: "google-sheet.csv", gid };
    }
  }

  throw new Error(
    "Could not download the Google Sheet as a spreadsheet. Make sure the sheet is shared with anyone who has the link."
  );
}

function timesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  const startA = toMinutes(aStart);
  const endA = toMinutes(aEnd);
  const startB = toMinutes(bStart);
  const endB = toMinutes(bEnd);
  if (startA === null || endA === null || startB === null || endB === null) return false;
  return startA < endB && endA > startB;
}

function isSameRoom(
  left: Pick<ResolvedScheduleRow, "room_id" | "room_number">,
  right: Pick<ResolvedScheduleRow | ScheduleConflictRow, "room_id" | "room_number">
) {
  if (left.room_id !== null && right.room_id !== null && String(left.room_id) === String(right.room_id)) {
    return true;
  }

  if (
    left.room_number !== null &&
    right.room_number !== null &&
    String(left.room_number) === String(right.room_number)
  ) {
    return true;
  }

  return false;
}

export async function resolveRows(rawRows: RawScheduleRow[], programIdInput: number | null, programNameInput: string | null) {
  const [programRows] = await db.execute<any[]>(
    "SELECT p.id, p.name, d.name as department_name FROM programs p JOIN departments d ON p.department_id = d.id WHERE p.id = ? OR UPPER(p.name) = ? LIMIT 1",
    [programIdInput || 0, normalizeCode(programNameInput)]
  );
  const program = programRows[0] || null;
  const programId = program?.id || null;

  const [courseRows] = await db.execute<CourseRow[]>("SELECT id, name, code, is_lab FROM courses");
  const [teacherRows] = await db.execute<TeacherRow[]>("SELECT id, name, short FROM teachers");
  const [batchRows] = await db.execute<BatchRow[]>(
    "SELECT id, name, session, program_id FROM batches WHERE program_id = ?",
    [programId || 0]
  );
  const [roomRows] = await db.execute<RoomRow[]>("SELECT id, number, title FROM rooms");

  const coursesByCode = new Map(courseRows.map((course) => [normalizeCode(course.code), course]));
  const teachersByShort = new Map(teacherRows.map((teacher) => [normalizeCode(teacher.short), teacher]));
  const roomsByNumber = new Map(roomRows.map((room) => [String(room.number), room]));
  const batchesByName = new Map<string, BatchRow>();

  for (const batch of batchRows) {
    batchesByName.set(normalizeKey(batch.name), batch);
    batchesByName.set(normalizeKey(batch.session), batch);
  }

  const resolved: ResolvedScheduleRow[] = rawRows.map((row) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const course = coursesByCode.get(normalizeCode(row.course_code)) || null;
    const teacher = teachersByShort.get(normalizeCode(row.teacher_short_name)) || null;
    const batch = batchesByName.get(normalizeKey(row.batch)) || null;
    const room = row.room_number === null ? null : roomsByNumber.get(String(row.room_number)) || null;

    if (!programId) errors.push("Program was not found.");
    if (!course) errors.push(`Course ${row.course_code} was not found.`);
    if (!teacher) errors.push(`Teacher ${row.teacher_short_name || "(blank)"} was not found.`);
    if (!batch) errors.push(`Batch ${row.batch} was not found in ${program?.name || "the selected program"}.`);
    if (!room) errors.push(`Room ${row.room_number ?? "(blank)"} was not found.`);

    return {
      ...row,
      status: errors.length > 0 ? "error" : "ok",
      errors,
      warnings,
      program_id: programId,
      course_id: course?.id || null,
      teacher_id: teacher?.id || null,
      batch_id: batch?.id || null,
      room_id: room?.id || null,
      course_name: course?.name || null,
      teacher_name: teacher?.name || null,
      room_label: room ? `${room.number}${room.title ? ` - ${room.title}` : ""}` : null,
      is_lab: Boolean(course?.is_lab),
    };
  });

  await applyConflictChecks(resolved);
  return resolved.map((row) => {
    const status: ResolvedScheduleRow["status"] =
      row.errors.length > 0 ? "error" : row.warnings.length > 0 ? "warning" : "ok";
    return { ...row, status };
  });
}

async function applyConflictChecks(rows: ResolvedScheduleRow[]) {
  const validTeacherIds = Array.from(
    new Set(rows.map((row) => row.teacher_id).filter((id): id is number => typeof id === "number"))
  );
  const validRoomIds = Array.from(
    new Set(rows.map((row) => row.room_id).filter((id): id is number => typeof id === "number"))
  );
  const validBatchIds = Array.from(
    new Set(rows.map((row) => row.batch_id).filter((id): id is number => typeof id === "number"))
  );
  const replacingProgramIds = Array.from(
    new Set(rows.map((row) => row.program_id).filter((id): id is number => typeof id === "number"))
  );

  const programFilter =
    replacingProgramIds.length > 0
      ? `AND (s.program_id IS NULL OR s.program_id NOT IN (${replacingProgramIds.map(() => "?").join(",")}))`
      : "";

  // Build a combined OR query covering teacher, room, and batch IDs
  const orConditions: string[] = [];
  const orParams: number[] = [];

  if (validTeacherIds.length > 0) {
    orConditions.push(`s.teacher_id IN (${validTeacherIds.map(() => "?").join(",")})`);
    orParams.push(...validTeacherIds);
  }
  if (validRoomIds.length > 0) {
    orConditions.push(`s.room_id IN (${validRoomIds.map(() => "?").join(",")})`);
    orParams.push(...validRoomIds);
  }
  if (validBatchIds.length > 0) {
    orConditions.push(`s.batch_id IN (${validBatchIds.map(() => "?").join(",")})`);
    orParams.push(...validBatchIds);
  }

  let existingRows: ScheduleConflictRow[] = [];
  if (orConditions.length > 0) {
    const [fetched] = await db.execute<ScheduleConflictRow[]>(
      `
        SELECT s.id, s.teacher_id, s.room_id, s.batch_id, s.section, s.day,
          TIME_FORMAT(s.start_time, '%H:%i:%s') as start_time,
          TIME_FORMAT(s.end_time, '%H:%i:%s') as end_time,
          r.number as room_number,
          c.code as course_code,
          c.name as course_name,
          t.short as teacher_short,
          t.name as teacher_name,
          b.name as batch_name,
          d.name as department_name
        FROM schedules s
        LEFT JOIN courses c ON s.course_id = c.id
        LEFT JOIN teachers t ON s.teacher_id = t.id
        LEFT JOIN batches b ON s.batch_id = b.id
        LEFT JOIN programs p ON s.program_id = p.id
        LEFT JOIN departments d ON p.department_id = d.id
        LEFT JOIN rooms r ON s.room_id = r.id
        WHERE (${orConditions.join(" OR ")})
        ${programFilter}
      `,
      [...orParams, ...replacingProgramIds]
    );
    existingRows = fetched;
  }

  // --- Teacher conflicts vs existing DB schedules ---
  for (const row of rows) {
    if (!row.teacher_id) continue;
    const conflict = existingRows.find(
      (existing) =>
        existing.teacher_id === row.teacher_id &&
        existing.day === row.day &&
        timesOverlap(row.start_time, row.end_time, existing.start_time, existing.end_time)
    );
    if (conflict) {
      row.errors.push(`Teacher conflict with existing schedule: ${formatExistingScheduleSummary(conflict)}.`);
    }
  }

  // --- Room conflicts vs existing DB schedules ---
  for (const row of rows) {
    if (!row.room_id) continue;
    const conflict = existingRows.find(
      (existing) =>
        existing.room_id !== null &&
        existing.room_id === row.room_id &&
        existing.day === row.day &&
        timesOverlap(row.start_time, row.end_time, existing.start_time, existing.end_time)
    );
    if (conflict) {
      row.errors.push(`Room conflict with existing schedule: ${formatExistingScheduleSummary(conflict)}.`);
    }
  }

  // --- Batch/section conflicts vs existing DB schedules ---
  for (const row of rows) {
    if (!row.batch_id) continue;
    const section = row.section || "none";
    const conflict = existingRows.find(
      (existing) =>
        existing.batch_id !== null &&
        existing.batch_id === row.batch_id &&
        (existing.section || "none") === section &&
        existing.day === row.day &&
        timesOverlap(row.start_time, row.end_time, existing.start_time, existing.end_time)
    );
    if (conflict) {
      row.errors.push(`Batch/section overlap with existing schedule: ${formatExistingScheduleSummary(conflict)}.`);
    }
  }

  // --- Intra-upload conflict checks ---
  for (let i = 0; i < rows.length; i++) {
    const left = rows[i];
    for (let j = i + 1; j < rows.length; j++) {
      const right = rows[j];
      if (left.day !== right.day) continue;
      if (!timesOverlap(left.start_time, left.end_time, right.start_time, right.end_time)) continue;

      // Teacher conflict
      if (left.teacher_id && right.teacher_id && left.teacher_id === right.teacher_id) {
        left.errors.push(`Teacher conflict with uploaded row ${right.sourceRow}.`);
        right.errors.push(`Teacher conflict with uploaded row ${left.sourceRow}.`);
      }

      // Room conflict
      if (left.room_id && right.room_id && left.room_id === right.room_id) {
        left.errors.push(`Room conflict with uploaded row ${right.sourceRow}.`);
        right.errors.push(`Room conflict with uploaded row ${left.sourceRow}.`);
      }

      // Batch/section conflict
      if (
        left.batch_id &&
        right.batch_id &&
        left.batch_id === right.batch_id &&
        (left.section || "none") === (right.section || "none")
      ) {
        left.errors.push(`Batch/section overlap with uploaded row ${right.sourceRow}.`);
        right.errors.push(`Batch/section overlap with uploaded row ${left.sourceRow}.`);
      }
    }
  }
}

export async function applyRows(rows: ResolvedScheduleRow[]) {
  const invalidRows = rows.filter((row) => row.status === "error");
  if (invalidRows.length > 0) {
    return { inserted: 0, errors: invalidRows.length };
  }

  const programIds = Array.from(
    new Set(rows.map((row) => row.program_id).filter((id): id is number => typeof id === "number"))
  );
  if (programIds.length !== 1) {
    throw new Error("Imported schedules must resolve to exactly one program before applying.");
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute("DELETE FROM schedules WHERE program_id = ?", [programIds[0]]);

    for (const row of rows) {
      await connection.execute(
        `
          INSERT INTO schedules
            (course_id, teacher_id, batch_id, section, program_id, room_id, start_time, end_time, day)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          row.course_id,
          row.teacher_id,
          row.batch_id,
          row.section || "none",
          row.program_id,
          row.room_id,
          row.start_time,
          row.end_time,
          row.day,
        ]
      );
    }
    await connection.commit();
    return { inserted: rows.length, errors: 0 };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export interface ManualConflictInfo {
  type: "teacher" | "room" | "batch";
  message: string;
}

/**
 * Checks for schedule conflicts against the existing database for a manual add or edit.
 * Pass `excludeId` when editing so the row being updated does not conflict with itself.
 */
export async function checkManualScheduleConflicts(params: {
  day: string;
  start_time: string;
  end_time: string;
  teacher_id?: number | null;
  room_id?: number | null;
  batch_id?: number | null;
  section?: string | null;
  excludeId?: number | null;
}): Promise<ManualConflictInfo[]> {
  const { day, start_time, end_time, teacher_id, room_id, batch_id, section, excludeId } = params;

  const orConditions: string[] = [];
  const orParams: (number | string)[] = [];

  if (teacher_id) {
    orConditions.push(`s.teacher_id = ?`);
    orParams.push(teacher_id);
  }
  if (room_id) {
    orConditions.push(`s.room_id = ?`);
    orParams.push(room_id);
  }
  if (batch_id) {
    orConditions.push(`(s.batch_id = ? AND s.section = ?)`);
    orParams.push(batch_id, section || "none");
  }

  if (orConditions.length === 0) return [];

  // Overlap condition: new.start_time < existing.end_time AND new.end_time > existing.start_time
  let sql = `
    SELECT s.id, s.teacher_id, s.room_id, s.batch_id, s.section, s.day,
      TIME_FORMAT(s.start_time, '%H:%i:%s') as start_time,
      TIME_FORMAT(s.end_time, '%H:%i:%s') as end_time,
      r.number as room_number,
      c.code as course_code,
      c.name as course_name,
      t.short as teacher_short,
      t.name as teacher_name,
      b.name as batch_name,
      d.name as department_name
    FROM schedules s
    LEFT JOIN courses c ON s.course_id = c.id
    LEFT JOIN teachers t ON s.teacher_id = t.id
    LEFT JOIN batches b ON s.batch_id = b.id
    LEFT JOIN programs p ON s.program_id = p.id
    LEFT JOIN departments d ON p.department_id = d.id
    LEFT JOIN rooms r ON s.room_id = r.id
    WHERE s.day = ?
      AND s.start_time < ?
      AND s.end_time > ?
      AND (${orConditions.join(" OR ")})
  `;
  const allParams: (number | string)[] = [day, end_time, start_time, ...orParams];

  if (excludeId) {
    sql += ` AND s.id != ?`;
    allParams.push(excludeId);
  }

  const [existingRows] = await db.execute<ScheduleConflictRow[]>(sql, allParams);
  const conflicts: ManualConflictInfo[] = [];

  for (const existing of existingRows) {
    if (teacher_id && existing.teacher_id === teacher_id) {
      conflicts.push({
        type: "teacher",
        message: `Teacher already scheduled: ${formatExistingScheduleSummary(existing)}.`,
      });
    }
    if (room_id && existing.room_id === room_id) {
      conflicts.push({
        type: "room",
        message: `Room already booked: ${formatExistingScheduleSummary(existing)}.`,
      });
    }
    if (batch_id && existing.batch_id === batch_id && (existing.section || "none") === (section || "none")) {
      conflicts.push({
        type: "batch",
        message: `Batch/section already has a class at this time: ${formatExistingScheduleSummary(existing)}.`,
      });
    }
  }

  return conflicts;
}

export async function syncProgramSchedule(programId: number, sheetLink: string) {
  if (!sheetLink || !sheetLink.trim()) {
    throw new Error("Sheet link is empty.");
  }

  try {
    const [programRows] = await db.execute<any[]>("SELECT p.id, p.name, d.name as department_name FROM programs p JOIN departments d ON p.department_id = d.id WHERE p.id = ? LIMIT 1", [programId]);
    const programName = programRows[0] ? `${programRows[0].department_name} - ${programRows[0].name}` : null;

    // 1. Download sheet
    const sheet = await fetchGoogleSheetBuffer(sheetLink);

    // 2. Parse workbook
    const rawRows = await parseWorkbook(sheet.buffer, sheet.fileName, sheet.gid);

    // 3. Resolve rows for this program
    const rows = await resolveRows(rawRows, programId, null);

    // 4. Check for errors
    const errorRows = rows.filter(r => r.status === "error");
    if (errorRows.length > 0) {
      const totalErrors = errorRows.length;
      const errorMsg = buildValidationMessage(errorRows, programName) || "Validation errors were found.";
      const fullMsg = `**Sync failed.** Found **${totalErrors}** validation errors.\n\n${errorMsg}`;

      await db.execute(
        "INSERT INTO sheet_sync_logs (program_id, status, message) VALUES (?, 'error', ?)",
        [programId, fullMsg]
      );

      throw new Error(fullMsg);
    }

    // 5. Apply rows (replaces old schedules for this program)
    const applied = await applyRows(rows);

    // 6. Update last_sync_at
    await db.execute(
      "UPDATE programs SET last_sync_at = CURRENT_TIMESTAMP WHERE id = ?",
      [programId]
    );

    // 7. Write success to sync logs
    const warningRows = rows.filter((r) => r.status === "warning");
    const warningDetail =
      warningRows.length > 0
        ? `\n\n### Warnings\n${buildValidationMessage(warningRows, programName)}`
        : "";
    const successMsg =
      `✅ Sync successful — **${applied.inserted} schedule${applied.inserted !== 1 ? "s" : ""}** imported.\n\n` +
      `| Stat | Count |\n|---|---|\n` +
      `| Total rows | ${rows.length} |\n` +
      `| Imported | ${applied.inserted} |\n` +
      `| Warnings | ${warningRows.length} |\n` +
      `| Errors | 0 |` +
      warningDetail;
    await db.execute(
      "INSERT INTO sheet_sync_logs (program_id, status, message) VALUES (?, 'success', ?)",
      [programId, successMsg]
    );

    return { success: true, inserted: applied.inserted };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "An unknown error occurred during sync.";

    // Write error to sync logs
    try {
      await db.execute(
        "INSERT INTO sheet_sync_logs (program_id, status, message) VALUES (?, 'error', ?)",
        [programId, `Sync failed: ${errorMsg}`]
      );
    } catch (dbErr) {
      console.error("Failed to write error log to db:", dbErr);
    }

    throw error;
  }
}

