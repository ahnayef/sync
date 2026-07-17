import ExcelJS from "exceljs";
import { Readable } from "stream";
import db from "@/lib/db";
import { fetchGoogleSheetBuffer } from "./schedule-parser";
import { RowDataPacket } from "mysql2";

export type EntityType = "batch" | "teacher" | "course" | "room";

export type ParsedRow = {
  sourceRow: number;
  data: any;
  status: "ok" | "error";
  errors: string[];
};

export async function parseEntityWorkbook(buffer: Buffer, fileName: string, entityType: EntityType, programId?: number) {
  const workbook = new ExcelJS.Workbook();
  if (fileName.toLowerCase().endsWith(".csv")) {
    await workbook.csv.read(Readable.from(buffer.toString("utf8")));
  } else {
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
    await workbook.xlsx.load(arrayBuffer, {
      ignoreNodes: ["drawing", "picture", "legacyDrawing", "legacyDrawingHF"],
    });
  }

  const sheet = workbook.worksheets[0];
  if (!sheet) throw new Error("No worksheet found in the uploaded file.");

  // Get headers from first row
  const headerRow = sheet.getRow(1);
  const headers: string[] = [];
  headerRow.eachCell((cell, colNumber) => {
    headers[colNumber] = String(cell.value || "").trim().toLowerCase();
  });

  if (headers.length === 0) {
    throw new Error("Worksheet appears to be empty or has no headers in the first row.");
  }

  const parsedRows: ParsedRow[] = [];

  for (let rowNumber = 2; rowNumber <= Math.min(sheet.rowCount, 1000); rowNumber++) {
    const row = sheet.getRow(rowNumber);
    let isEmpty = true;
    const rowData: any = {};
    
    row.eachCell((cell, colNumber) => {
      const header = headers[colNumber];
      if (header) {
        let val = cell.value;
        if (val && typeof val === "object" && "text" in val) {
          val = (val as any).text;
        } else if (val && typeof val === "object" && "result" in val) {
          val = (val as any).result;
        }
        val = String(val ?? "").trim();
        if (val !== "") isEmpty = false;
        rowData[header] = val;
      }
    });

    if (!isEmpty) {
      parsedRows.push({
        sourceRow: rowNumber,
        data: rowData,
        status: "ok",
        errors: []
      });
    }
  }

  return validateParsedRows(parsedRows, entityType, programId);
}

export async function fetchAndParseEntitySheet(sheetLink: string, entityType: EntityType, programId?: number) {
  const sheet = await fetchGoogleSheetBuffer(sheetLink);
  return parseEntityWorkbook(sheet.buffer, sheet.fileName, entityType, programId);
}

// Map expected column names based on entity type
const EXPECTED_HEADERS: Record<EntityType, string[]> = {
  teacher: ["name", "short name", "department"],
  batch: ["name", "session", "program"],
  course: ["name", "code", "program", "is lab"],
  room: ["number", "building name", "floor number", "room type", "capacity", "title"]
};

async function validateParsedRows(rows: ParsedRow[], entityType: EntityType, selectedProgramId?: number) {
  // Pre-fetch some db lookup tables to speed up validation
  const [departments] = await db.execute<RowDataPacket[]>("SELECT id, name FROM departments");
  const [programs] = await db.execute<RowDataPacket[]>("SELECT p.id, p.name, p.department_id, d.name as dept_name FROM programs p JOIN departments d ON p.department_id = d.id");
  
  // For unique constraints
  let existingKeys: string[] = [];
  
  if (entityType === "teacher") {
    const [existing] = await db.execute<RowDataPacket[]>("SELECT short FROM teachers");
    existingKeys = existing.map(e => e.short.toLowerCase());
  } else if (entityType === "batch") {
    const [existing] = await db.execute<RowDataPacket[]>("SELECT name FROM batches");
    existingKeys = existing.map(e => e.name.toLowerCase());
  } else if (entityType === "course") {
    const [existing] = await db.execute<RowDataPacket[]>("SELECT code FROM courses");
    existingKeys = existing.map(e => e.code.toLowerCase());
  } else if (entityType === "room") {
    const [existing] = await db.execute<RowDataPacket[]>("SELECT number FROM rooms");
    existingKeys = existing.map(e => String(e.number));
  }

  const deptMap = new Map<string, number>(departments.map(d => [d.name.toLowerCase(), d.id]));
  const progMap = new Map<string, number>(programs.map(p => {
    return [p.name.toLowerCase(), p.id];
  }));
  const fullProgMap = new Map<string, number>(programs.map(p => {
    return [`${p.dept_name.toLowerCase()} - ${p.name.toLowerCase()}`, p.id];
  }));

  const localKeys = new Set<string>();

  for (const row of rows) {
    const d = row.data;
    
    if (entityType === "teacher") {
      const name = d["name"];
      const short = d["short name"];
      const dept = d["department"];

      if (!name) row.errors.push("Name is required.");
      if (!short) row.errors.push("Short Name is required.");
      if (short) {
        if (existingKeys.includes(short.toLowerCase())) row.errors.push(`Short Name '${short}' already exists in DB.`);
        if (localKeys.has(short.toLowerCase())) row.errors.push(`Short Name '${short}' is duplicated in this file.`);
        localKeys.add(short.toLowerCase());
      }
      if (dept && !deptMap.has(dept.toLowerCase())) {
        row.errors.push(`Department '${dept}' not found.`);
      } else if (dept) {
        row.data._resolvedDeptId = deptMap.get(dept.toLowerCase());
      }

    } else if (entityType === "batch") {
      const name = d["name"];
      const session = d["session"];
      const prog = d["program"];
      
      if (!name) row.errors.push("Name is required.");
      if (!session) row.errors.push("Session is required.");
      if (name) {
        if (existingKeys.includes(name.toLowerCase())) row.errors.push(`Batch '${name}' already exists in DB.`);
        if (localKeys.has(name.toLowerCase())) row.errors.push(`Batch '${name}' is duplicated in this file.`);
        localKeys.add(name.toLowerCase());
      }
      
      // Program resolution
      if (selectedProgramId) {
        row.data._resolvedProgId = selectedProgramId;
      } else if (prog) {
        const progLower = prog.toLowerCase();
        let pid = progMap.get(progLower) || fullProgMap.get(progLower);
        if (!pid) {
          row.errors.push(`Program '${prog}' not found.`);
        } else {
          row.data._resolvedProgId = pid;
        }
      } else {
        row.errors.push("Program is required.");
      }

    } else if (entityType === "course") {
      const name = d["name"];
      const code = d["code"];
      const prog = d["program"];
      const isLab = d["is lab"];

      if (!name) row.errors.push("Name is required.");
      if (!code) row.errors.push("Code is required.");
      
      if (code) {
        if (existingKeys.includes(code.toLowerCase())) row.errors.push(`Course Code '${code}' already exists in DB.`);
        if (localKeys.has(code.toLowerCase())) row.errors.push(`Course Code '${code}' is duplicated in this file.`);
        localKeys.add(code.toLowerCase());
      }

      if (selectedProgramId) {
        row.data._resolvedProgId = selectedProgramId;
      } else if (prog) {
        const progLower = prog.toLowerCase();
        let pid = progMap.get(progLower) || fullProgMap.get(progLower);
        if (!pid) {
          row.errors.push(`Program '${prog}' not found.`);
        } else {
          row.data._resolvedProgId = pid;
        }
      } else {
        row.data._resolvedProgId = null; // Courses can theoretically not belong to a strict program, but we'll allow null.
      }

      row.data._isLab = isLab && (isLab.toLowerCase() === "yes" || isLab.toLowerCase() === "true" || isLab === "1") ? true : false;

    } else if (entityType === "room") {
      const num = d["number"];
      const bldg = d["building name"];
      const flr = d["floor number"];
      const type = d["room type"];
      const cap = d["capacity"];
      
      if (!num) row.errors.push("Number is required.");
      if (!bldg) row.errors.push("Building Name is required.");
      if (!flr) row.errors.push("Floor Number is required.");
      if (!type) row.errors.push("Room Type is required.");
      if (!cap) row.errors.push("Capacity is required.");

      if (num) {
        if (existingKeys.includes(String(num))) row.errors.push(`Room Number '${num}' already exists in DB.`);
        if (localKeys.has(String(num))) row.errors.push(`Room Number '${num}' is duplicated in this file.`);
        localKeys.add(String(num));
      }
      
      if (isNaN(Number(flr))) row.errors.push("Floor Number must be a number.");
      if (isNaN(Number(cap))) row.errors.push("Capacity must be a number.");
    }
    
    if (row.errors.length > 0) {
      row.status = "error";
    }
  }

  return rows;
}
