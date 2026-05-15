"use client";

import { useState } from "react";
import {
  FiBarChart2,
  FiArrowLeft,
  FiArrowRight,
  FiAlertCircle,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiDownloadCloud,
} from "react-icons/fi";

type ViewMode = "list" | "upload" | "preview" | "fixing" | "done";

export type ScheduleRow = {
  id: number;
  day: string;
  courseCode: string;
  courseTitle: string;
  teacher: string;
  batch: string;
  section: string;
  dept: string;
  startTime: string;
  endTime: string;
  room: string;
  isLab: boolean;
  status: "ok" | "warning" | "error";
};

const MOCK_DATA: ScheduleRow[] = [
  {
    id: 1,
    day: "Sunday",
    courseCode: "CSE301",
    courseTitle: "Data Structures",
    teacher: "DR. RAHMAN",
    batch: "CSE 21",
    section: "A",
    dept: "CSE",
    startTime: "08:00 AM",
    endTime: "09:30 AM",
    room: "401",
    isLab: false,
    status: "ok",
  },
  {
    id: 2,
    day: "Sunday",
    courseCode: "MAT201",
    courseTitle: "Discrete Mathematics",
    teacher: "PROF. AHMED",
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
    teacher: "DR. KARIM",
    batch: "CSE 20",
    section: "A",
    dept: "CSE",
    startTime: "01:00 PM",
    endTime: "03:30 PM",
    room: "Lab-2",
    isLab: true,
    status: "ok",
  },
];

const MOCK_IMPORT: ScheduleRow[] = [
  ...MOCK_DATA,
  {
    id: 4,
    day: "Monday",
    courseCode: "CSE303",
    courseTitle: "Operating Systems",
    teacher: "",
    batch: "CSE 21",
    section: "C",
    dept: "CSE",
    startTime: "09:00 AM",
    endTime: "10:30 AM",
    room: "305",
    isLab: false,
    status: "error",
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
  const [step, setStep] = useState<ViewMode>("list");
  
  // List View State
  const [schedules, setSchedules] = useState(MOCK_DATA);
  const [search, setSearch] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Edit Form State
  const [editData, setEditData] = useState({
    day: "", courseCode: "", courseTitle: "", teacher: "", batch: "", section: "", dept: "", startTime: "", endTime: "", room: "", isLab: false
  });

  // Import Wizard State
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [loadingSheet, setLoadingSheet] = useState(false);
  const [importRows, setImportRows] = useState<ScheduleRow[]>(MOCK_IMPORT);
  const [fixingId, setFixingId] = useState<number | null>(null);

  const errorCount = importRows.filter((r) => r.status === "error").length;
  const warnCount = importRows.filter((r) => r.status === "warning").length;
  const okCount = importRows.filter((r) => r.status === "ok").length;

  // --- List View Methods ---
  const filteredSchedules = schedules.filter(s => 
    s.courseCode.toLowerCase().includes(search.toLowerCase()) || 
    s.courseTitle.toLowerCase().includes(search.toLowerCase()) || 
    s.teacher.toLowerCase().includes(search.toLowerCase())
  );

  const openEditModal = (schedule: any) => {
    setEditingId(schedule.id);
    setEditData({ ...schedule });
    setShowEditModal(true);
  };

  const saveEdit = () => {
    if (editingId) {
      setSchedules(schedules.map(s => s.id === editingId ? { ...s, ...editData } : s));
    } else {
      setSchedules([...schedules, { id: Date.now(), ...editData, status: "ok" }]);
    }
    setShowEditModal(false);
    setEditingId(null);
  };

  // --- Import Wizard Methods ---
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
    const idMatch = googleUrl.match(/[A-Za-z0-9-_]{44,}/) || googleUrl.match(/[A-Za-z0-9-_]{20,}/);
    const sheetId = idMatch ? idMatch[0] : null;
    if (!sheetId) return alert("Couldn't find a valid Google Sheet ID in that input.");

    setLoadingSheet(true);
    setFileName(`Google Sheet • ${sheetId}`);

    setTimeout(() => {
      setImportRows(MOCK_IMPORT);
      setLoadingSheet(false);
      setStep("preview");
    }, 900);
  };

  const finalizeImport = () => {
    const validRows = importRows.filter(r => r.status === "ok");
    setSchedules([...schedules, ...validRows]);
    setStep("done");
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      
      {/* ─── LIST VIEW ──────────────────────────────────────────────────────── */}
      {step === "list" && (
        <>
          <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-[26px] font-bold text-[var(--color-text-primary)] mb-1">
                Schedule Management
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {schedules.length} classes scheduled
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditingId(null);
                  setEditData({ day: "Sunday", courseCode: "", courseTitle: "", teacher: "", batch: "", section: "", dept: "", startTime: "", endTime: "", room: "", isLab: false });
                  setShowEditModal(true);
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] transition-all hover:bg-[var(--color-bg-elevated)]"
              >
                <FiPlus /> Add Single Class
              </button>
              <button
                onClick={() => setStep("upload")}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99]"
              >
                <FiBarChart2 /> Import Schedule
              </button>
            </div>
          </div>

          <div className="relative mb-5 max-w-[400px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by course, teacher..."
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 pr-4 pl-10 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </div>

          <div className="rounded-[14px] border border-[var(--color-border)] overflow-hidden bg-[var(--color-bg-surface)]">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)]">
                    {["Day", "Course", "Teacher", "Batch/Sec", "Time", "Room", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[0.06em] whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.map((row, i) => (
                    <tr key={row.id} className={`${i < filteredSchedules.length - 1 ? "border-b border-[var(--color-border)]" : ""} bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-elevated)]/50 transition-colors`}>
                      <td className="px-4 py-3 text-sm font-medium text-[var(--color-text-primary)]">
                        {row.day}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          <code className={`text-[11px] font-bold px-1.5 py-[2px] rounded w-fit ${row.isLab ? "text-[#a371f7] bg-[rgba(163,113,247,0.1)]" : "text-[#4f8ef7] bg-[rgba(79,142,247,0.1)]"}`}>
                            {row.courseCode}
                          </code>
                          <span className="text-xs text-[var(--color-text-secondary)] truncate max-w-[150px]">{row.courseTitle}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)] whitespace-nowrap">
                        {row.teacher || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                        {row.batch} ({row.section})
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)] whitespace-nowrap">
                        {row.startTime} - {row.endTime}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                        {row.room}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEditModal(row)} className="px-3 py-1.5 rounded-md border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-sm transition-colors hover:bg-[var(--color-bg-elevated)]">Edit</button>
                          <button onClick={() => setSchedules(schedules.filter(s => s.id !== row.id))} className="px-3 py-1.5 rounded-md border border-[rgba(248,81,73,0.2)] bg-transparent text-[var(--color-danger)] text-sm transition-colors hover:bg-[rgba(248,81,73,0.06)]">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredSchedules.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-[var(--color-text-secondary)]">
                        No schedules found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {showEditModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6 overflow-y-auto" onClick={(e) => { if (e.target === e.currentTarget) setShowEditModal(false); }}>
              <div className="w-full max-w-[600px] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-8 my-8">
                <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-6">{editingId ? "Edit Class" : "Add Single Class"}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Course Code</label>
                    <input type="text" value={editData.courseCode} onChange={e => setEditData({...editData, courseCode: e.target.value})} className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none" placeholder="e.g. CSE301" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Day</label>
                    <select value={editData.day} onChange={e => setEditData({...editData, day: e.target.value})} className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none">
                      <option>Sunday</option><option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Teacher (Short Form)</label>
                    <input type="text" value={editData.teacher} onChange={e => setEditData({...editData, teacher: e.target.value})} className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none" placeholder="e.g. DR. RAHMAN" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Batch</label>
                    <input type="text" value={editData.batch} onChange={e => setEditData({...editData, batch: e.target.value})} className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none" placeholder="e.g. CSE 21" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Section</label>
                    <input type="text" value={editData.section} onChange={e => setEditData({...editData, section: e.target.value})} className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none" placeholder="e.g. A" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Start Time</label>
                    <input type="text" value={editData.startTime} onChange={e => setEditData({...editData, startTime: e.target.value})} className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none" placeholder="e.g. 08:00 AM" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">End Time</label>
                    <input type="text" value={editData.endTime} onChange={e => setEditData({...editData, endTime: e.target.value})} className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none" placeholder="e.g. 09:30 AM" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Room</label>
                    <input type="text" value={editData.room} onChange={e => setEditData({...editData, room: e.target.value})} className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none" placeholder="e.g. 401" />
                  </div>
                  <div className="flex items-center pt-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editData.isLab} onChange={e => setEditData({...editData, isLab: e.target.checked})} className="rounded border-[var(--color-border)] bg-[var(--color-bg-elevated)]" />
                      <span className="text-sm font-medium text-[var(--color-text-secondary)]">Is Lab Class</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)]">Cancel</button>
                  <button onClick={saveEdit} className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--color-accent)] text-white font-semibold shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99]">{editingId ? "Save Changes" : "Save Class"}</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ─── IMPORT WIZARD: HEADER & STEPPER ──────────────────────────────────── */}
      {step !== "list" && (
        <>
          <div className="mb-10 flex items-start gap-4">
            <button onClick={() => setStep("list")} className="mt-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
              <FiArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)] tracking-[-0.02em] mb-2">Schedule Import Wizard</h1>
              <p className="text-base text-[var(--color-text-secondary)] max-w-2xl">Upload a pre-formatted file to automatically extract and import schedule data</p>
            </div>
          </div>

          <div className="flex gap-0 mb-8 items-center">
            {(["Upload", "Preview", "Fix Errors", "Done"] as const).map((label, i) => {
              const stepMap: Record<string, number> = { upload: 0, preview: 1, fixing: 2, done: 3 };
              const current = stepMap[step];
              const isDone = i < current;
              const isActive = i === current;
              return (
                <div key={label} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isActive ? "border-[#4f8ef7] bg-[rgba(79,142,247,0.15)] shadow-[0_0_12px_rgba(79,142,247,0.2)]" : isDone ? "border-[#3fb950] bg-[rgba(63,185,80,0.12)] shadow-[0_0_12px_rgba(63,185,80,0.15)]" : `border-[var(--color-border)] bg-transparent`}`}>
                      {isDone ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> : <span className={`text-xs font-bold ${isActive ? "text-[#4f8ef7]" : "text-[var(--color-text-muted)]"}`}>{i + 1}</span>}
                    </div>
                    <span className={`text-[11px] whitespace-nowrap ${isActive ? "font-semibold text-[#4f8ef7]" : isDone ? "font-normal text-[#3fb950]" : "font-normal text-[var(--color-text-muted)]"}`}>{label}</span>
                  </div>
                  {i < 3 && <div className={`w-[60px] h-px ${isDone ? "bg-[#3fb950]" : "bg-[var(--color-border)]"} mx-2 mb-[22px]`} />}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ─── IMPORT WIZARD: UPLOAD ────────────────────────────────────────────── */}
      {step === "upload" && (
        <div id="schedule-drop-zone" onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleFileDrop} className={`rounded-2xl border-2 border-dashed px-10 py-24 text-center transition-all duration-200 ${dragging ? "border-[#4f8ef7] bg-[rgba(79,142,247,0.08)] shadow-[inset_0_0_24px_rgba(79,142,247,0.1)]" : "border-[var(--color-border)] bg-[var(--color-bg-surface)] hover:border-[var(--color-accent)] hover:bg-[rgba(79,142,247,0.02)]"}`}>
          <div className="mb-5"><FiBarChart2 className="inline text-3xl text-[var(--color-text-muted)] mb-5" /></div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2.5">Drop your schedule file here</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-8">Supports .xlsx, .xls, .csv files. Max size 10MB.</p>
          <label htmlFor="schedule-file-input" className="inline-flex items-center gap-2 px-7 py-3 rounded-[10px] cursor-pointer text-base font-semibold text-white bg-[var(--color-accent)] shadow-[0_10px_24px_rgba(79,142,247,0.18)] hover:bg-[#5d95f7] hover:shadow-[0_14px_30px_rgba(79,142,247,0.22)] transition-all duration-200 active:scale-95">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg> Browse file
          </label>
          <input id="schedule-file-input" type="file" accept=".xlsx,.xls,.csv" onChange={handleFileInput} style={{ display: "none" }} />
          <p className="mt-6 text-xs text-[var(--color-text-muted)]">Need a template? <a href="#" className="text-[var(--color-accent)] no-underline">Download sample file</a></p>

          <div className="mt-[18px] flex gap-2 items-center flex-wrap justify-center">
            <input aria-label="Google Sheet URL" placeholder="Paste Google Sheet link or ID" value={googleUrl} onChange={(e) => setGoogleUrl(e.target.value)} className="min-w-[260px] px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[#4f8ef7] focus:ring-offset-1 transition-all" />
            <button id="load-google-sheet" onClick={handleLoadGoogleSheet} disabled={loadingSheet} title="Load from Google Sheet" className={`p-2.5 rounded-lg border-none text-white font-semibold transition-all duration-200 flex items-center justify-center ${loadingSheet ? "bg-[rgba(79,142,247,0.16)] cursor-wait" : "bg-[var(--color-accent)] cursor-pointer hover:bg-[#5d95f7] hover:shadow-lg active:scale-95"}`}>
              {loadingSheet ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <FiDownloadCloud size={20} />
              )}
            </button>
          </div>
        </div>
      )}

      {/* ─── IMPORT WIZARD: PREVIEW ───────────────────────────────────────────── */}
      {step === "preview" && (
        <div>
          <div className="flex items-center justify-between px-6 py-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] mb-6 flex-wrap gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[9px] bg-[rgba(79,142,247,0.12)] border border-[rgba(79,142,247,0.25)] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f8ef7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{fileName || "schedule_fall2026.xlsx"}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Parsed {importRows.length} schedule entries</p>
              </div>
            </div>
            <div className="flex gap-2.5 items-center flex-wrap">
              {[{ count: okCount, color: "#3fb950", label: "valid" }, { count: warnCount, color: "#d29922", label: "warnings" }, { count: errorCount, color: "#f85149", label: "errors" }].map((s) => (
                <span key={s.label} style={{ color: s.color, background: `${s.color}15`, borderColor: `${s.color}30` }} className="text-xs font-semibold px-3 py-1.5 border rounded-lg transition-all">{s.count} {s.label}</span>
              ))}
            </div>
          </div>

          <div className="rounded-[14px] border border-[var(--color-border)] overflow-hidden mb-6 shadow-sm">
            <div className="overflow-x-auto bg-[var(--color-bg-surface)]">
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)]">
                    {["Status", "Day", "Course Code", "Title", "Teacher", "Batch", "Sec", "Dept", "Start", "End", "Room", "Type"].map((h) => (
                      <th key={h} className="px-3.5 py-[11px] text-left text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[0.06em] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {importRows.map((row, i) => {
                    const sc = STATUS_CONFIG[row.status];
                    return (
                      <tr key={row.id} className={`${i < importRows.length - 1 ? "border-b border-[var(--color-border)]" : ""} ${row.status === "error" ? "bg-[rgba(248,81,73,0.02)]" : "bg-[var(--color-bg-surface)]"}`}>
                        <td className="px-3.5 py-3"><span style={{ color: sc.color, background: sc.bg, borderColor: sc.border }} className="text-[11px] font-semibold px-2.5 py-1 border rounded-lg inline-block">{sc.label}</span></td>
                        <td className="px-3.5 py-3 text-sm text-[var(--color-text-secondary)]">{row.day}</td>
                        <td className="px-3.5 py-3"><code className={`text-[11px] font-bold px-1.5 py-[2px] rounded ${row.isLab ? "text-[#a371f7] bg-[rgba(163,113,247,0.1)]" : "text-[#4f8ef7] bg-[rgba(79,142,247,0.1)]"}`}>{row.courseCode}</code></td>
                        <td className="px-3.5 py-3 text-sm text-[var(--color-text-primary)] whitespace-nowrap">{row.courseTitle}</td>
                        <td className={`px-3.5 py-3 text-sm ${row.teacher ? "text-[var(--color-text-secondary)]" : "text-[var(--color-danger)]"}`}>{row.teacher || <span className="inline-flex items-center gap-2 text-[var(--color-danger)]"><FiAlertCircle /> Missing</span>}</td>
                        <td className="px-3.5 py-3 text-sm text-[var(--color-text-primary)]">{row.batch}</td>
                        <td className="px-3.5 py-3 text-sm text-[var(--color-text-secondary)]">{row.section === "none" ? "—" : row.section}</td>
                        <td className="px-3.5 py-3 text-sm text-[var(--color-text-secondary)]">{row.dept}</td>
                        <td className="px-3.5 py-3 text-sm text-[var(--color-text-secondary)] whitespace-nowrap">{row.startTime}</td>
                        <td className="px-3.5 py-3 text-sm text-[var(--color-text-secondary)] whitespace-nowrap">{row.endTime}</td>
                        <td className="px-3.5 py-3 text-sm text-[var(--color-text-secondary)]">{row.room}</td>
                        <td className="px-3.5 py-3"><span className={`text-[10px] font-bold tracking-[0.06em] uppercase ${row.isLab ? "text-[#a371f7]" : "text-[var(--color-text-muted)]"}`}>{row.isLab ? "Lab" : "Theory"}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button id="schedule-back" onClick={() => setStep("upload")} className="px-6 py-[11px] rounded-[9px] border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-sm cursor-pointer hover:bg-[var(--color-bg-surface)] transition-colors duration-200 active:scale-95"><span className="inline-flex items-center gap-2"><FiArrowLeft /> Back</span></button>
            {errorCount > 0 && <button id="schedule-fix-errors" onClick={() => setStep("fixing")} className="px-6 py-[11px] rounded-[9px] border border-[rgba(248,81,73,0.3)] bg-[rgba(248,81,73,0.08)] text-[var(--color-danger)] text-sm font-semibold cursor-pointer hover:bg-[rgba(248,81,73,0.12)] transition-colors duration-200 active:scale-95">Fix {errorCount} error{errorCount > 1 ? "s" : ""}</button>}
            <button id="schedule-import" onClick={finalizeImport} className="px-7 py-[11px] rounded-[9px] border-none bg-[var(--color-accent)] text-white text-sm font-semibold cursor-pointer hover:bg-[#5d95f7] hover:shadow-lg transition-all duration-200 active:scale-95"><span className="inline-flex items-center gap-2">Import {okCount} valid entries <FiArrowRight /></span></button>
          </div>
        </div>
      )}

      {/* ─── IMPORT WIZARD: FIXING ──────────────────────────────────────────── */}
      {step === "fixing" && (
        <div>
          <div className="px-6 py-4 rounded-xl border border-[rgba(248,81,73,0.25)] bg-[rgba(248,81,73,0.05)] mb-6 flex items-center gap-3 shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f85149" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            <p className="text-sm text-[#f85149] font-medium">{importRows.filter((r) => r.status === "error").length} entries need attention before import</p>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            {importRows.filter((r) => r.status === "error").map((row) => (
                <div key={row.id} className="rounded-xl border border-[rgba(248,81,73,0.3)] bg-[rgba(248,81,73,0.04)] p-5 transition-all hover:shadow-md hover:border-[rgba(248,81,73,0.4)]">
                  <div className="flex justify-between items-start mb-3.5 flex-wrap gap-2.5">
                    <div>
                      <code className="text-xs font-bold text-[#f85149] bg-[rgba(248,81,73,0.1)] px-[7px] py-[2px] rounded inline-block mr-2">{row.courseCode}</code>
                      <span className="text-sm font-semibold text-[var(--color-text-primary)]">{row.courseTitle}</span>
                      <p className="text-xs text-[#f85149] mt-1 inline-flex items-center gap-2"><FiAlertCircle /> Teacher name is missing</p>
                    </div>
                    <button id={`fix-row-${row.id}`} onClick={() => setFixingId(row.id === fixingId ? null : row.id)} className="px-4 py-[7px] rounded-lg border border-[rgba(248,81,73,0.4)] bg-[rgba(248,81,73,0.08)] text-[var(--color-danger)] text-xs font-medium cursor-pointer hover:bg-[rgba(248,81,73,0.12)] transition-colors duration-200 active:scale-95">
                      {fixingId === row.id ? "Cancel" : <span className="inline-flex items-center gap-2">Fix <FiArrowRight /></span>}
                    </button>
                  </div>
                  {fixingId === row.id && (
                    <div className="flex gap-2.5">
                      <input id={`fix-teacher-${row.id}`} type="text" placeholder="Enter teacher name..." className="flex-1 px-3.5 py-2 rounded-lg border border-[rgba(248,81,73,0.4)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] text-sm outline-none focus:ring-2 focus:ring-[#f85149] focus:ring-offset-1 transition-all placeholder-[var(--color-text-muted)]" />
                      <button id={`fix-save-${row.id}`} onClick={() => { const inp = document.getElementById(`fix-teacher-${row.id}`) as HTMLInputElement; if (inp?.value) { setImportRows(importRows.map((r) => r.id === row.id ? { ...r, teacher: inp.value, status: "ok" } : r)); setFixingId(null); } }} className="px-4.5 py-2 rounded-lg border-none bg-[#3fb950] text-white text-sm font-semibold cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-95">Apply</button>
                    </div>
                  )}
                </div>
              ))}
          </div>

          <div className="flex gap-3 justify-end">
            <button onClick={() => setStep("preview")} className="px-6 py-[11px] rounded-[9px] border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-sm cursor-pointer hover:bg-[var(--color-bg-surface)] transition-colors duration-200 active:scale-95"><span className="inline-flex items-center gap-2"><FiArrowLeft /> Back to Preview</span></button>
            <button id="fixing-continue" onClick={finalizeImport} className="px-7 py-[11px] rounded-[9px] border-none bg-[var(--color-accent)] text-white text-sm font-semibold cursor-pointer hover:bg-[#5d95f7] hover:shadow-lg transition-all duration-200 active:scale-95"><span className="inline-flex items-center gap-2">Continue <FiArrowRight /></span></button>
          </div>
        </div>
      )}

      {/* ─── IMPORT WIZARD: DONE ──────────────────────────────────────────────── */}
      {step === "done" && (
        <div className="text-center px-10 py-24 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] shadow-sm">
          <div className="w-18 h-18 rounded-full bg-[rgba(63,185,80,0.12)] border-2 border-[rgba(63,185,80,0.4)] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(63,185,80,0.2)] animate-pulse">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2.5">Schedule imported!</h2>
          <p className="text-base text-[var(--color-text-secondary)] mb-8">{importRows.filter((r) => r.status === "ok").length} schedule entries have been saved to the database.</p>
          <div className="flex justify-center gap-3">
            <button id="schedule-import-again" onClick={() => { setStep("upload"); setFileName(""); }} className="px-7 py-3 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] text-base font-medium cursor-pointer hover:bg-[var(--color-bg-surface)] transition-colors duration-200 active:scale-95">Import another file</button>
            <button onClick={() => setStep("list")} className="px-7 py-3 rounded-[10px] bg-[var(--color-accent)] text-white text-base font-medium cursor-pointer hover:bg-[#5d95f7] transition-all duration-200 active:scale-95">View Schedule</button>
          </div>
        </div>
      )}

    </div>
  );
}
