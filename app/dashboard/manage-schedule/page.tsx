"use client";

import { useState } from "react";
import {
  FiBarChart2,
  FiArrowLeft,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";

type ImportStep = "upload" | "preview" | "fixing" | "done";

const MOCK_PREVIEW = [
  {
    id: 1,
    day: "Sunday",
    courseCode: "CSE301",
    courseTitle: "Data Structures",
    teacher: "Dr. Rahman",
    batch: "CSE 21",
    section: "A",
    dept: "CSE",
    startTime: "08:00 AM",
    endTime: "09:30 AM",
    room: "401",
    isLab: false,
    status: "ok" as const,
  },
  {
    id: 2,
    day: "Sunday",
    courseCode: "MAT201",
    courseTitle: "Discrete Mathematics",
    teacher: "Prof. Ahmed",
    batch: "CSE 22",
    section: "B",
    dept: "MAT",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    room: "302",
    isLab: false,
    status: "ok" as const,
  },
  {
    id: 3,
    day: "Sunday",
    courseCode: "CSE315L",
    courseTitle: "OS Lab",
    teacher: "",
    batch: "CSE 20",
    section: "A",
    dept: "CSE",
    startTime: "01:00 PM",
    endTime: "03:30 PM",
    room: "Lab-2",
    isLab: true,
    status: "error" as const,
  },
  {
    id: 4,
    day: "Monday",
    courseCode: "CSE303",
    courseTitle: "Operating Systems",
    teacher: "Dr. Karim",
    batch: "CSE 21",
    section: "C",
    dept: "CSE",
    startTime: "09:00 AM",
    endTime: "10:30 AM",
    room: "305",
    isLab: false,
    status: "ok" as const,
  },
  {
    id: 5,
    day: "Monday",
    courseCode: "CSE405",
    courseTitle: "Software Engineering",
    teacher: "Prof. Hassan",
    batch: "CSE 20",
    section: "none",
    dept: "CSE",
    startTime: "11:00 AM",
    endTime: "12:30 PM",
    room: "201",
    isLab: false,
    status: "warning" as const,
  },
  {
    id: 6,
    day: "Tuesday",
    courseCode: "CSE311L",
    courseTitle: "Networks Lab",
    teacher: "Dr. Islam",
    batch: "CSE 21",
    section: "A",
    dept: "CSE",
    startTime: "10:00 AM",
    endTime: "12:30 PM",
    room: "Lab-1",
    isLab: true,
    status: "ok" as const,
  },
];

const STATUS_CONFIG = {
  ok: {
    color: "var(--color-success)",
    label: "Valid",
    bg: "rgba(63,185,80,0.08)",
    border: "rgba(63,185,80,0.2)",
  },
  error: {
    color: "var(--color-danger)",
    label: "Error",
    bg: "rgba(248,81,73,0.08)",
    border: "rgba(248,81,73,0.2)",
  },
  warning: {
    color: "var(--color-warning)",
    label: "Warning",
    bg: "rgba(210,153,34,0.08)",
    border: "rgba(210,153,34,0.2)",
  },
};

export default function ManageSchedulePage() {
  const [step, setStep] = useState<ImportStep>("upload");
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [loadingSheet, setLoadingSheet] = useState(false);
  const [rows, setRows] = useState(MOCK_PREVIEW);
  const [fixingId, setFixingId] = useState<number | null>(null);

  const errorCount = rows.filter((r) => r.status === "error").length;
  const warnCount = rows.filter((r) => r.status === "warning").length;
  const okCount = rows.filter((r) => r.status === "ok").length;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      setTimeout(() => setStep("preview"), 800);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setTimeout(() => setStep("preview"), 800);
    }
  };

  const handleLoadGoogleSheet = () => {
    if (!googleUrl.trim()) return alert("Enter a Google Sheet link or ID");
    // Try to extract a sheet ID from the provided URL (or accept raw ID)
    const idMatch =
      googleUrl.match(/[A-Za-z0-9-_]{44,}/) ||
      googleUrl.match(/[A-Za-z0-9-_]{20,}/);
    const sheetId = idMatch ? idMatch[0] : null;
    if (!sheetId)
      return alert("Couldn't find a valid Google Sheet ID in that input.");

    setLoadingSheet(true);
    setFileName(`Google Sheet • ${sheetId}`);

    // Simulate network fetch and parsing delay, then show preview
    setTimeout(() => {
      // For now reuse MOCK_PREVIEW; in real use we'd fetch via server proxy
      setRows(MOCK_PREVIEW);
      setLoadingSheet(false);
      setStep("preview");
    }, 900);
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] tracking-[-0.02em] mb-2">
          Schedule Import
        </h1>
        <p className="text-base text-[var(--color-text-secondary)] max-w-2xl">
          Upload a pre-formatted Excel or CSV file to automatically extract and
          import schedule data
        </p>
      </div>

      {/* Stepper */}
      <div className="flex gap-0 mb-8 items-center">
        {(["Upload", "Preview", "Fix Errors", "Done"] as const).map(
          (label, i) => {
            const stepMap: Record<string, number> = {
              upload: 0,
              preview: 1,
              fixing: 2,
              done: 3,
            };
            const current = stepMap[step];
            const isDone = i < current;
            const isActive = i === current;
            return (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      isActive
                        ? "border-[#4f8ef7] bg-[rgba(79,142,247,0.15)] shadow-[0_0_12px_rgba(79,142,247,0.2)]"
                        : isDone
                          ? "border-[#3fb950] bg-[rgba(63,185,80,0.12)] shadow-[0_0_12px_rgba(63,185,80,0.15)]"
                          : `border-[var(--color-border)] bg-transparent`
                    }`}
                  >
                    {isDone ? (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#3fb950"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <span
                        className={`text-xs font-bold ${
                          isActive ? "text-[#4f8ef7]" : "text-[var(--color-text-muted)]"
                        }`}
                      >
                        {i + 1}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[11px] whitespace-nowrap ${
                      isActive ? "font-semibold text-[#4f8ef7]" : isDone ? "font-normal text-[#3fb950]" : "font-normal text-[var(--color-text-muted)]"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < 3 && (
                  <div
                    className={`w-[60px] h-px ${
                      isDone ? "bg-[#3fb950]" : "bg-[var(--color-border)]"
                    } mx-2 mb-[22px]`}
                  />
                )}
              </div>
            );
          },
        )}
      </div>

      {/* Upload Step */}
      {step === "upload" && (
        <div
          id="schedule-drop-zone"
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleFileDrop}
          className={`rounded-2xl border-2 border-dashed px-10 py-24 text-center transition-all duration-200 ${
            dragging
              ? "border-[#4f8ef7] bg-[rgba(79,142,247,0.08)] shadow-[inset_0_0_24px_rgba(79,142,247,0.1)]"
              : "border-[var(--color-border)] bg-[var(--color-bg-surface)] hover:border-[var(--color-accent)] hover:bg-[rgba(79,142,247,0.02)]"
          }`}
        >
          <div className="mb-5">
            <FiBarChart2 className="inline text-3xl text-[var(--color-text-muted)] mb-5" />
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2.5">
            Drop your schedule file here
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-8">
            Supports .xlsx, .xls, .csv files. Max size 10MB.
          </p>
          <label
            htmlFor="schedule-file-input"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-[10px] cursor-pointer text-base font-semibold text-white bg-[var(--color-accent)] shadow-[0_10px_24px_rgba(79,142,247,0.18)] hover:bg-[#5d95f7] hover:shadow-[0_14px_30px_rgba(79,142,247,0.22)] transition-all duration-200 active:scale-95"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Browse file
          </label>
          <input
            id="schedule-file-input"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileInput}
            style={{ display: "none" }}
          />
          <p className="mt-6 text-xs text-[var(--color-text-muted)]">
            Need a template?{" "}
            <a
              href="#"
              className="text-[var(--color-accent)] no-underline"
            >
              Download sample file
            </a>
          </p>

          {/* Google Sheet loader */}
          <div className="mt-[18px] flex gap-2 items-center flex-wrap">
            <input
              aria-label="Google Sheet URL"
              placeholder="Paste Google Sheet link or ID"
              value={googleUrl}
              onChange={(e) => setGoogleUrl(e.target.value)}
              className="min-w-[260px] flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[#4f8ef7] focus:ring-offset-1 transition-all"
            />
            <button
              id="load-google-sheet"
              onClick={handleLoadGoogleSheet}
              disabled={loadingSheet}
              className={`px-3.5 py-2 rounded-lg border-none text-white font-semibold transition-all duration-200 ${
                loadingSheet
                  ? "bg-[rgba(79,142,247,0.16)] cursor-wait"
                  : "bg-[var(--color-accent)] cursor-pointer hover:bg-[#5d95f7] hover:shadow-lg active:scale-95"
              }`}
            >
              {loadingSheet ? "Loading…" : "Load from Google Sheet"}
            </button>
          </div>
        </div>
      )}

      {/* Preview Step */}
      {step === "preview" && (
        <div>
          {/* File info bar */}
          <div className="flex items-center justify-between px-6 py-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] mb-6 flex-wrap gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[9px] bg-[rgba(79,142,247,0.12)] border border-[rgba(79,142,247,0.25)] flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4f8ef7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {fileName || "schedule_fall2026.xlsx"}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Parsed {rows.length} schedule entries
                </p>
              </div>
            </div>
            <div className="flex gap-2.5 items-center flex-wrap">
              {[
                { count: okCount, color: "#3fb950", label: "valid" },
                { count: warnCount, color: "#d29922", label: "warnings" },
                { count: errorCount, color: "#f85149", label: "errors" },
              ].map((s) => (
                <span
                  key={s.label}
                  style={{
                    color: s.color,
                    background: `${s.color}15`,
                    borderColor: `${s.color}30`,
                  }}
                  className="text-xs font-semibold px-3 py-1.5 border rounded-lg transition-all"
                >
                  {s.count} {s.label}
                </span>
              ))}
            </div>
          </div>

          {/* Preview table */}
          <div className="rounded-[14px] border border-[var(--color-border)] overflow-hidden mb-6 shadow-sm">
            <div className="overflow-x-auto bg-[var(--color-bg-surface)]">
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)]">
                    {[
                      "Status",
                      "Day",
                      "Course Code",
                      "Title",
                      "Teacher",
                      "Batch",
                      "Sec",
                      "Dept",
                      "Start",
                      "End",
                      "Room",
                      "Type",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3.5 py-[11px] text-left text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[0.06em] whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => {
                    const sc = STATUS_CONFIG[row.status];
                    return (
                      <tr
                        key={row.id}
                        className={`${
                          i < rows.length - 1
                            ? "border-b border-[var(--color-border)]"
                            : ""
                        } ${
                          row.status === "error"
                            ? "bg-[rgba(248,81,73,0.02)]"
                            : "bg-[var(--color-bg-surface)]"
                        }`}
                      >
                        <td className="px-3.5 py-3">
                          <span
                            style={{
                              color: sc.color,
                              background: sc.bg,
                              borderColor: sc.border,
                            }}
                            className="text-[11px] font-semibold px-2.5 py-1 border rounded-lg inline-block"
                          >
                            {sc.label}
                          </span>
                        </td>
                        <td className="px-3.5 py-3 text-sm text-[var(--color-text-secondary)]">
                          {row.day}
                        </td>
                        <td className="px-3.5 py-3">
                          <code
                            className={`text-[11px] font-bold px-1.5 py-[2px] rounded ${
                              row.isLab
                                ? "text-[#a371f7] bg-[rgba(163,113,247,0.1)]"
                                : "text-[#4f8ef7] bg-[rgba(79,142,247,0.1)]"
                            }`}
                          >
                            {row.courseCode}
                          </code>
                        </td>
                        <td className="px-3.5 py-3 text-sm text-[var(--color-text-primary)] whitespace-nowrap">
                          {row.courseTitle}
                        </td>
                        <td className={`px-3.5 py-3 text-sm ${
                          row.teacher
                            ? "text-[var(--color-text-secondary)]"
                            : "text-[var(--color-danger)]"
                        }`}>
                          {row.teacher || (
                            <span className="inline-flex items-center gap-2 text-[var(--color-danger)]">
                              <FiAlertCircle /> Missing
                            </span>
                          )}
                        </td>
                        <td className="px-3.5 py-3 text-sm text-[var(--color-text-primary)]">
                          {row.batch}
                        </td>
                        <td className="px-3.5 py-3 text-sm text-[var(--color-text-secondary)]">
                          {row.section === "none" ? "—" : row.section}
                        </td>
                        <td className="px-3.5 py-3 text-sm text-[var(--color-text-secondary)]">
                          {row.dept}
                        </td>
                        <td className="px-3.5 py-3 text-sm text-[var(--color-text-secondary)] whitespace-nowrap">
                          {row.startTime}
                        </td>
                        <td className="px-3.5 py-3 text-sm text-[var(--color-text-secondary)] whitespace-nowrap">
                          {row.endTime}
                        </td>
                        <td className="px-3.5 py-3 text-sm text-[var(--color-text-secondary)]">
                          {row.room}
                        </td>
                        <td className="px-3.5 py-3">
                          <span className={`text-[10px] font-bold tracking-[0.06em] uppercase ${
                            row.isLab
                              ? "text-[#a371f7]"
                              : "text-[var(--color-text-muted)]"
                          }`}>
                            {row.isLab ? "Lab" : "Theory"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              id="schedule-back"
              onClick={() => setStep("upload")}
              className="px-6 py-[11px] rounded-[9px] border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-sm cursor-pointer hover:bg-[var(--color-bg-surface)] transition-colors duration-200 active:scale-95"
            >
              <span className="inline-flex items-center gap-2">
                <FiArrowLeft /> Back
              </span>
            </button>
            {errorCount > 0 && (
              <button
                id="schedule-fix-errors"
                onClick={() => setStep("fixing")}
                className="px-6 py-[11px] rounded-[9px] border border-[rgba(248,81,73,0.3)] bg-[rgba(248,81,73,0.08)] text-[var(--color-danger)] text-sm font-semibold cursor-pointer hover:bg-[rgba(248,81,73,0.12)] transition-colors duration-200 active:scale-95"
              >
                Fix {errorCount} error{errorCount > 1 ? "s" : ""}
              </button>
            )}
            <button
              id="schedule-import"
              onClick={() => setStep("done")}
              className="px-7 py-[11px] rounded-[9px] border-none bg-[var(--color-accent)] text-white text-sm font-semibold cursor-pointer hover:bg-[#5d95f7] hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              <span className="inline-flex items-center gap-2">
                Import {okCount} valid entries <FiArrowRight />
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Fixing Step */}
      {step === "fixing" && (
        <div>
          <div className="px-6 py-4 rounded-xl border border-[rgba(248,81,73,0.25)] bg-[rgba(248,81,73,0.05)] mb-6 flex items-center gap-3 shadow-sm">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f85149"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-sm text-[#f85149] font-medium">
              {rows.filter((r) => r.status === "error").length} entries need
              attention before import
            </p>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            {rows
              .filter((r) => r.status === "error")
              .map((row) => (
                <div
                  key={row.id}
                  className="rounded-xl border border-[rgba(248,81,73,0.3)] bg-[rgba(248,81,73,0.04)] p-5 transition-all hover:shadow-md hover:border-[rgba(248,81,73,0.4)]"
                >
                  <div className="flex justify-between items-start mb-3.5 flex-wrap gap-2.5">
                    <div>
                      <code className="text-xs font-bold text-[#f85149] bg-[rgba(248,81,73,0.1)] px-[7px] py-[2px] rounded inline-block mr-2">
                        {row.courseCode}
                      </code>
                      <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {row.courseTitle}
                      </span>
                      <p className="text-xs text-[#f85149] mt-1 inline-flex items-center gap-2">
                        <FiAlertCircle /> Teacher name is missing
                      </p>
                    </div>
                    <button
                      id={`fix-row-${row.id}`}
                      onClick={() =>
                        setFixingId(row.id === fixingId ? null : row.id)
                      }
                      className="px-4 py-[7px] rounded-lg border border-[rgba(248,81,73,0.4)] bg-[rgba(248,81,73,0.08)] text-[var(--color-danger)] text-xs font-medium cursor-pointer hover:bg-[rgba(248,81,73,0.12)] transition-colors duration-200 active:scale-95"
                    >
                      {fixingId === row.id ? (
                        "Cancel"
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          Fix <FiArrowRight />
                        </span>
                      )}
                    </button>
                  </div>
                  {fixingId === row.id && (
                    <div className="flex gap-2.5">
                      <input
                        id={`fix-teacher-${row.id}`}
                        type="text"
                        placeholder="Enter teacher name..."
                        className="flex-1 px-3.5 py-2 rounded-lg border border-[rgba(248,81,73,0.4)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] text-sm outline-none focus:ring-2 focus:ring-[#f85149] focus:ring-offset-1 transition-all placeholder-[var(--color-text-muted)]"
                      />
                      <button
                        id={`fix-save-${row.id}`}
                        onClick={() => {
                          const inp = document.getElementById(
                            `fix-teacher-${row.id}`,
                          ) as HTMLInputElement;
                          if (inp?.value) {
                            setRows(
                              rows.map((r) =>
                                r.id === row.id
                                  ? { ...r, teacher: inp.value, status: "ok" }
                                  : r,
                              ),
                            );
                            setFixingId(null);
                          }
                        }}
                        className="px-4.5 py-2 rounded-lg border-none bg-[#3fb950] text-white text-sm font-semibold cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-95"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setStep("preview")}
              className="px-6 py-[11px] rounded-[9px] border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-sm cursor-pointer hover:bg-[var(--color-bg-surface)] transition-colors duration-200 active:scale-95"
            >
              <span className="inline-flex items-center gap-2">
                <FiArrowLeft /> Back to Preview
              </span>
            </button>
            <button
              id="fixing-continue"
              onClick={() => setStep("done")}
              className="px-7 py-[11px] rounded-[9px] border-none bg-[var(--color-accent)] text-white text-sm font-semibold cursor-pointer hover:bg-[#5d95f7] hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              <span className="inline-flex items-center gap-2">
                Continue <FiArrowRight />
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Done Step */}
      {step === "done" && (
        <div className="text-center px-10 py-24 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] shadow-sm">
          <div className="w-18 h-18 rounded-full bg-[rgba(63,185,80,0.12)] border-2 border-[rgba(63,185,80,0.4)] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(63,185,80,0.2)] animate-pulse">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3fb950"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2.5">
            Schedule imported!
          </h2>
          <p className="text-base text-[var(--color-text-secondary)] mb-8">
            {rows.filter((r) => r.status === "ok").length} schedule entries have
            been saved to the database.
          </p>
          <button
            id="schedule-import-again"
            onClick={() => {
              setStep("upload");
              setFileName("");
            }}
            className="px-7 py-3 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] text-base font-medium cursor-pointer hover:bg-[var(--color-bg-surface)] transition-colors duration-200 active:scale-95"
          >
            Import another file
          </button>
        </div>
      )}
    </div>
  );
}
