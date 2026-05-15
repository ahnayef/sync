"use client";

import { useState } from "react";

type ImportStep = "upload" | "preview" | "fixing" | "done";

const MOCK_PREVIEW = [
  { id: 1, day: "Sunday", courseCode: "CSE301", courseTitle: "Data Structures", teacher: "Dr. Rahman", startTime: "08:00 AM", endTime: "09:30 AM", room: "401", isLab: false, status: "ok" as const },
  { id: 2, day: "Sunday", courseCode: "MAT201", courseTitle: "Discrete Mathematics", teacher: "Prof. Ahmed", startTime: "10:00 AM", endTime: "11:30 AM", room: "302", isLab: false, status: "ok" as const },
  { id: 3, day: "Sunday", courseCode: "CSE315L", courseTitle: "OS Lab", teacher: "", startTime: "01:00 PM", endTime: "03:30 PM", room: "Lab-2", isLab: true, status: "error" as const },
  { id: 4, day: "Monday", courseCode: "CSE303", courseTitle: "Operating Systems", teacher: "Dr. Karim", startTime: "09:00 AM", endTime: "10:30 AM", room: "305", isLab: false, status: "ok" as const },
  { id: 5, day: "Monday", courseCode: "CSE405", courseTitle: "Software Engineering", teacher: "Prof. Hassan", startTime: "11:00 AM", endTime: "12:30 PM", room: "201", isLab: false, status: "warning" as const },
  { id: 6, day: "Tuesday", courseCode: "CSE311L", courseTitle: "Networks Lab", teacher: "Dr. Islam", startTime: "10:00 AM", endTime: "12:30 PM", room: "Lab-1", isLab: true, status: "ok" as const },
];

const STATUS_CONFIG = {
  ok: { color: "#3fb950", label: "Valid", bg: "rgba(63,185,80,0.08)", border: "rgba(63,185,80,0.25)" },
  error: { color: "#f85149", label: "Error", bg: "rgba(248,81,73,0.08)", border: "rgba(248,81,73,0.25)" },
  warning: { color: "#d29922", label: "Warning", bg: "rgba(210,153,34,0.08)", border: "rgba(210,153,34,0.25)" },
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
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) { setFileName(file.name); setTimeout(() => setStep("preview"), 800); }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setFileName(file.name); setTimeout(() => setStep("preview"), 800); }
  };

  const handleLoadGoogleSheet = () => {
    if (!googleUrl.trim()) return alert("Enter a Google Sheet link or ID");
    // Try to extract a sheet ID from the provided URL (or accept raw ID)
    const idMatch = googleUrl.match(/[A-Za-z0-9-_]{44,}/) || googleUrl.match(/[A-Za-z0-9-_]{20,}/);
    const sheetId = idMatch ? idMatch[0] : null;
    if (!sheetId) return alert("Couldn't find a valid Google Sheet ID in that input.");

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
    <div style={{ padding: "32px", maxWidth: "1100px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em", marginBottom: "6px" }}>
          Schedule Import
        </h1>
        <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
          Upload a pre-formatted Excel or CSV file to automatically extract and import schedule data
        </p>
      </div>

      {/* Stepper */}
      <div style={{ display: "flex", gap: "0", marginBottom: "32px", alignItems: "center" }}>
        {(["Upload", "Preview", "Fix Errors", "Done"] as const).map((label, i) => {
          const stepMap: Record<string, number> = { upload: 0, preview: 1, fixing: 2, done: 3 };
          const current = stepMap[step];
          const isDone = i < current;
          const isActive = i === current;
          return (
            <div key={label} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: `2px solid ${isActive ? "#4f8ef7" : isDone ? "#3fb950" : "var(--color-border)"}`, background: isActive ? "rgba(79,142,247,0.15)" : isDone ? "rgba(63,185,80,0.12)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {isDone ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <span style={{ fontSize: "13px", fontWeight: 700, color: isActive ? "#4f8ef7" : "var(--color-text-muted)" }}>{i + 1}</span>
                  )}
                </div>
                <span style={{ fontSize: "11px", fontWeight: isActive ? 600 : 400, color: isActive ? "#4f8ef7" : isDone ? "#3fb950" : "var(--color-text-muted)", whiteSpace: "nowrap" }}>{label}</span>
              </div>
              {i < 3 && (
                <div style={{ width: "60px", height: "1px", background: isDone ? "#3fb950" : "var(--color-border)", margin: "0 8px", marginBottom: "22px" }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Upload Step */}
      {step === "upload" && (
        <div
          id="schedule-drop-zone"
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleFileDrop}
          style={{
            borderRadius: "16px",
            border: `2px dashed ${dragging ? "#4f8ef7" : "var(--color-border)"}`,
            background: dragging ? "rgba(79,142,247,0.05)" : "var(--color-bg-surface)",
            padding: "80px 40px",
            textAlign: "center",
            transition: "all 0.2s ease",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>📊</div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "10px" }}>
            Drop your schedule file here
          </h2>
          <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", marginBottom: "32px" }}>
            Supports .xlsx, .xls, .csv files. Max size 10MB.
          </p>
          <label htmlFor="schedule-file-input" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 28px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "15px", fontWeight: 600, color: "white", background: "linear-gradient(135deg, #4f8ef7, #6f6bf7)", boxShadow: "0 0 24px rgba(79,142,247,0.3)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Browse file
          </label>
          <input id="schedule-file-input" type="file" accept=".xlsx,.xls,.csv" onChange={handleFileInput} style={{ display: "none" }} />
          <p style={{ marginTop: "24px", fontSize: "13px", color: "var(--color-text-muted)" }}>
            Need a template?{" "}
            <a href="#" style={{ color: "var(--color-accent)", textDecoration: "none" }}>Download sample file</a>
          </p>

          {/* Google Sheet loader */}
          <div style={{ marginTop: "18px", display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <input
              aria-label="Google Sheet URL"
              placeholder="Paste Google Sheet link or ID"
              value={googleUrl}
              onChange={(e) => setGoogleUrl(e.target.value)}
              style={{ minWidth: "260px", flex: "1", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--color-border)", background: "var(--color-bg-elevated)", color: "var(--color-text-primary)" }}
            />
            <button
              id="load-google-sheet"
              onClick={handleLoadGoogleSheet}
              disabled={loadingSheet}
              style={{ padding: "9px 14px", borderRadius: "8px", border: "none", background: loadingSheet ? "rgba(79,142,247,0.16)" : "linear-gradient(135deg, #4f8ef7, #6f6bf7)", color: "white", fontWeight: 600, cursor: loadingSheet ? "wait" : "pointer" }}
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderRadius: "12px", border: "1px solid var(--color-border)", background: "var(--color-bg-elevated)", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "rgba(79,142,247,0.12)", border: "1px solid rgba(79,142,247,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f8ef7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-text-primary)" }}>{fileName || "schedule_fall2026.xlsx"}</p>
                <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>Parsed {rows.length} schedule entries</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              {[{ count: okCount, color: "#3fb950", label: "valid" }, { count: warnCount, color: "#d29922", label: "warnings" }, { count: errorCount, color: "#f85149", label: "errors" }].map((s) => (
                <span key={s.label} style={{ fontSize: "12px", fontWeight: 600, color: s.color, background: `${s.color}15`, border: `1px solid ${s.color}30`, padding: "4px 10px", borderRadius: "6px" }}>
                  {s.count} {s.label}
                </span>
              ))}
            </div>
          </div>

          {/* Preview table */}
          <div style={{ borderRadius: "14px", border: "1px solid var(--color-border)", overflow: "hidden", marginBottom: "20px" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
                <thead>
                  <tr style={{ background: "var(--color-bg-elevated)", borderBottom: "1px solid var(--color-border)" }}>
                    {["Status", "Day", "Course Code", "Title", "Teacher", "Start", "End", "Room", "Type"].map((h) => (
                      <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => {
                    const sc = STATUS_CONFIG[row.status];
                    return (
                      <tr key={row.id}
                        style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--color-border)" : "none", background: row.status === "error" ? "rgba(248,81,73,0.02)" : "var(--color-bg-surface)" }}>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 600, color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`, padding: "3px 8px", borderRadius: "5px" }}>
                            {sc.label}
                          </span>
                        </td>
                        <td style={{ padding: "12px 14px", fontSize: "13px", color: "var(--color-text-secondary)" }}>{row.day}</td>
                        <td style={{ padding: "12px 14px" }}>
                          <code style={{ fontSize: "11px", fontWeight: 700, color: row.isLab ? "#a371f7" : "#4f8ef7", background: row.isLab ? "rgba(163,113,247,0.1)" : "rgba(79,142,247,0.1)", padding: "2px 6px", borderRadius: "4px" }}>{row.courseCode}</code>
                        </td>
                        <td style={{ padding: "12px 14px", fontSize: "13px", color: "var(--color-text-primary)", whiteSpace: "nowrap" }}>{row.courseTitle}</td>
                        <td style={{ padding: "12px 14px", fontSize: "13px", color: row.teacher ? "var(--color-text-secondary)" : "var(--color-danger)" }}>
                          {row.teacher || "⚠ Missing"}
                        </td>
                        <td style={{ padding: "12px 14px", fontSize: "13px", color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>{row.startTime}</td>
                        <td style={{ padding: "12px 14px", fontSize: "13px", color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>{row.endTime}</td>
                        <td style={{ padding: "12px 14px", fontSize: "13px", color: "var(--color-text-secondary)" }}>{row.room}</td>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", color: row.isLab ? "#a371f7" : "var(--color-text-muted)", textTransform: "uppercase" }}>
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
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button id="schedule-back" onClick={() => setStep("upload")}
              style={{ padding: "11px 24px", borderRadius: "9px", border: "1px solid var(--color-border)", background: "transparent", color: "var(--color-text-secondary)", fontSize: "14px", cursor: "pointer" }}>
              ← Back
            </button>
            {errorCount > 0 && (
              <button id="schedule-fix-errors" onClick={() => setStep("fixing")}
                style={{ padding: "11px 24px", borderRadius: "9px", border: "1px solid rgba(248,81,73,0.3)", background: "rgba(248,81,73,0.08)", color: "var(--color-danger)", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                Fix {errorCount} error{errorCount > 1 ? "s" : ""}
              </button>
            )}
            <button id="schedule-import" onClick={() => setStep("done")}
              style={{ padding: "11px 28px", borderRadius: "9px", border: "none", background: "linear-gradient(135deg, #4f8ef7, #6f6bf7)", color: "white", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
              Import {okCount} valid entries →
            </button>
          </div>
        </div>
      )}

      {/* Fixing Step */}
      {step === "fixing" && (
        <div>
          <div style={{ padding: "14px 20px", borderRadius: "12px", border: "1px solid rgba(248,81,73,0.25)", background: "rgba(248,81,73,0.05)", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f85149" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p style={{ fontSize: "14px", color: "#f85149", fontWeight: 500 }}>
              {rows.filter((r) => r.status === "error").length} entries need attention before import
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
            {rows.filter((r) => r.status === "error").map((row) => (
              <div key={row.id} style={{ borderRadius: "12px", border: "1px solid rgba(248,81,73,0.3)", background: "rgba(248,81,73,0.04)", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <code style={{ fontSize: "12px", fontWeight: 700, color: "#f85149", background: "rgba(248,81,73,0.1)", padding: "2px 7px", borderRadius: "4px", marginRight: "8px" }}>{row.courseCode}</code>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-text-primary)" }}>{row.courseTitle}</span>
                    <p style={{ fontSize: "12px", color: "#f85149", marginTop: "4px" }}>⚠ Teacher name is missing</p>
                  </div>
                  <button id={`fix-row-${row.id}`} onClick={() => setFixingId(row.id === fixingId ? null : row.id)}
                    style={{ padding: "7px 16px", borderRadius: "7px", border: "1px solid rgba(248,81,73,0.4)", background: "rgba(248,81,73,0.08)", color: "var(--color-danger)", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
                    {fixingId === row.id ? "Cancel" : "Fix →"}
                  </button>
                </div>
                {fixingId === row.id && (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input id={`fix-teacher-${row.id}`} type="text" placeholder="Enter teacher name..."
                      style={{ flex: 1, padding: "9px 14px", borderRadius: "8px", border: "1px solid rgba(248,81,73,0.4)", background: "var(--color-bg-elevated)", color: "var(--color-text-primary)", fontSize: "14px", outline: "none" }} />
                    <button id={`fix-save-${row.id}`}
                      onClick={() => {
                        const inp = document.getElementById(`fix-teacher-${row.id}`) as HTMLInputElement;
                        if (inp?.value) {
                          setRows(rows.map((r) => r.id === row.id ? { ...r, teacher: inp.value, status: "ok" } : r));
                          setFixingId(null);
                        }
                      }}
                      style={{ padding: "9px 18px", borderRadius: "8px", border: "none", background: "#3fb950", color: "white", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                      Apply
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button onClick={() => setStep("preview")} style={{ padding: "11px 24px", borderRadius: "9px", border: "1px solid var(--color-border)", background: "transparent", color: "var(--color-text-secondary)", fontSize: "14px", cursor: "pointer" }}>
              ← Back to Preview
            </button>
            <button id="fixing-continue" onClick={() => setStep("done")}
              style={{ padding: "11px 28px", borderRadius: "9px", border: "none", background: "linear-gradient(135deg, #4f8ef7, #6f6bf7)", color: "white", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Done Step */}
      {step === "done" && (
        <div style={{ textAlign: "center", padding: "80px 40px", borderRadius: "16px", border: "1px solid var(--color-border)", background: "var(--color-bg-surface)" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(63,185,80,0.12)", border: "2px solid rgba(63,185,80,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 0 30px rgba(63,185,80,0.2)" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "10px" }}>
            Schedule imported!
          </h2>
          <p style={{ fontSize: "15px", color: "var(--color-text-secondary)", marginBottom: "32px" }}>
            {rows.filter((r) => r.status === "ok").length} schedule entries have been saved to the database.
          </p>
          <button id="schedule-import-again" onClick={() => { setStep("upload"); setFileName(""); }}
            style={{ padding: "12px 28px", borderRadius: "10px", border: "1px solid var(--color-border)", background: "var(--color-bg-elevated)", color: "var(--color-text-secondary)", fontSize: "15px", fontWeight: 500, cursor: "pointer" }}>
            Import another file
          </button>
        </div>
      )}
    </div>
  );
}
