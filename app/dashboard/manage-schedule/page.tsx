"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import {
  FiBarChart2,
  FiArrowLeft,
  FiArrowRight,
  FiAlertCircle,
  FiEdit2,
  FiPlus,
  FiDownloadCloud,
  FiSearch,
  FiChevronDown,
  FiX,
  FiZap,
  FiSettings,
  FiCheckCircle,
  FiRefreshCw,
  FiClock,
} from "react-icons/fi";

type ViewMode = "list" | "upload" | "preview" | "fixing" | "done" | "sync";

export type ScheduleRow = {
  id: number;
  day: string;
  courseCode: string;
  courseTitle: string;
  teacher: string;
  batch: string;
  batchSession?: string | null;
  section: string;
  dept: string;
  startTime: string;
  endTime: string;
  room: string;
  isLab?: boolean;
  status: "ok" | "warning" | "error";
};

type DepartmentOption = {
  id: number;
  name: string;
  fullName?: string;
};

type ImportScheduleRow = {
  clientId: string;
  sourceRow: number;
  sourceColumn: number;
  start_time: string;
  end_time: string;
  day: "sunday" | "monday" | "tuesday" | "wednesday" | "thursday";
  section: string;
  course_code: string;
  teacher_short_name: string;
  batch: string;
  room_number: number | null;
  status: "ok" | "warning" | "error";
  errors: string[];
  warnings: string[];
  department_id: number | null;
  course_id: number | null;
  teacher_id: number | null;
  batch_id: number | null;
  room_id: number | null;
  course_name: string | null;
  teacher_name: string | null;
  room_label: string | null;
  is_lab: boolean;
};

type ScheduleApiRow = {
  id: number;
  day: string;
  section: string;
  start_time: string;
  end_time: string;
  course_code: string | null;
  course_name: string | null;
  is_lab: number | boolean | null;
  teacher_short: string | null;
  teacher_name: string | null;
  batch_name: string | null;
  batch_session: string | null;
  department_name: string | null;
  room_number: number | null;
  room_title: string | null;
};

const MOCK_DATA: ScheduleRow[] = [
  {
    id: 1,
    day: "Sunday",
    courseCode: "CSE301",
    courseTitle: "Data Structures",
    teacher: "DR. RAHMAN",
    batch: "CSE 21",
    batchSession: "21",
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
    batchSession: "22",
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
    batchSession: "20",
    section: "A",
    dept: "CSE",
    startTime: "01:00 PM",
    endTime: "03:30 PM",
    room: "Lab-2",
    isLab: true,
    status: "ok",
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

// --- Mock Data for Dropdowns ---
const DEPARTMENTS = ["CSE", "MAT", "HUM", "EEE", "BBA"];
const TEACHERS = [
  { id: 1, short: "DR. RAHMAN", name: "Dr. Abdur Rahman" },
  { id: 2, short: "PROF. AHMED", name: "Prof. Tanvir Ahmed" },
  { id: 3, short: "DR. KARIM", name: "Dr. Fazlul Karim" },
  { id: 4, short: "MS. BEGUM", name: "Ms. Nasreen Begum" },
];
const COURSES = [
  { id: 1, code: "CSE301", title: "Data Structures", dept: "CSE", isLab: false },
  { id: 2, code: "CSE315L", title: "OS Lab", dept: "CSE", isLab: true },
  { id: 3, code: "MAT201", title: "Discrete Mathematics", dept: "MAT", isLab: false },
  { id: 4, code: "EEE101", title: "Electrical Circuits", dept: "EEE", isLab: false },
];
const BATCHES = [
  { id: 1, name: "CSE 21", dept: "CSE" },
  { id: 2, name: "CSE 22", dept: "CSE" },
  { id: 3, name: "MAT 15", dept: "MAT" },
  { id: 4, name: "EEE 09", dept: "EEE" },
];
const ROOMS = ["401", "402", "305", "Lab-1", "Lab-2", "Seminar Hall"];

type CourseOption = (typeof COURSES)[number];
type TeacherOption = (typeof TEACHERS)[number];
type BatchOption = (typeof BATCHES)[number];

type SearchableSelectProps<T> = {
  label: string;
  options: T[];
  value: T | null | undefined | "";
  onChange: (value: T) => void;
  placeholder: string;
  displayValue?: (value: T) => ReactNode;
  searchKey?: (value: T) => string;
  renderOption?: (value: T) => ReactNode;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getComparableKey(value: unknown) {
  if (!isRecord(value)) return null;
  return value.id || value.code || value.short || value.name || null;
}

function SearchableSelect<T>({
  label,
  options,
  value,
  onChange,
  placeholder,
  displayValue = (val) => String(val),
  searchKey = (val) => String(val),
  renderOption = (val) => String(val)
}: SearchableSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    searchKey(opt).toLowerCase().includes(search.toLowerCase())
  );

  const hasValue = value !== null && value !== undefined && value !== "";
  const selectedDisplay = hasValue ? displayValue(value as T) : placeholder;

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-[13px] font-medium text-[var(--color-text-secondary)] mb-1.5">{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] cursor-pointer transition-all ${isOpen ? "ring-2 ring-[var(--color-accent)] border-[var(--color-accent)]" : "hover:border-[var(--color-text-muted)]"}`}
      >
        <span className={`text-sm ${hasValue ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"}`}>
          {selectedDisplay}
        </span>
        <FiChevronDown className={`text-[var(--color-text-muted)] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full z-[100] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={14} />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-1.5 rounded-md bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-sm outline-none focus:border-[var(--color-accent)]"
              />
            </div>
          </div>
          <div className="max-h-[200px] overflow-y-auto p-1 custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`px-3 py-2 rounded-md text-sm cursor-pointer transition-colors ${(() => {
                    if (value === null || value === undefined) return false;
                    const valueKey = getComparableKey(value);
                    const optionKey = getComparableKey(opt);
                    if (valueKey !== null && optionKey !== null) return valueKey === optionKey;
                    return value === opt;
                  })()
                    ? "bg-[var(--color-accent-muted)] text-[var(--color-accent)] font-medium"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
                    }`}
                >
                  {renderOption(opt)}
                </div>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-xs text-[var(--color-text-muted)]">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function displayDay(day: string) {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

function displayTime(time: string) {
  const [hourText, minuteText] = time.slice(0, 5).split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return time;
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} ${period}`;
}

function mapScheduleApiRow(row: ScheduleApiRow): ScheduleRow {
  return {
    id: row.id,
    day: displayDay(row.day || ""),
    courseCode: row.course_code || "Unknown",
    courseTitle: row.course_name || "Untitled course",
    teacher: row.teacher_short || row.teacher_name || "",
    batch: row.batch_name || row.batch_session || "",
    batchSession: row.batch_session || null,
    section: row.section || "none",
    dept: row.department_name || "",
    startTime: displayTime(row.start_time || "00:00"),
    endTime: displayTime(row.end_time || "00:00"),
    room: row.room_number ? String(row.room_number) : row.room_title || "",
    isLab: Boolean(row.is_lab),
    status: "ok",
  };
}

function formatBatchSec(row: ScheduleRow) {
  const batchLabel = row.batchSession || row.batch;
  const sectionLabel = row.section && row.section !== "none" ? row.section : "none";

  if (row.dept) {
    return `${row.dept} - ${batchLabel} (${sectionLabel})`;
  }

  return `${batchLabel} (${sectionLabel})`;
}

export default function ManageSchedulePage() {
  const [step, setStep] = useState<ViewMode>("list");

  // List View State
  const [schedules, setSchedules] = useState(MOCK_DATA);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>(COURSES);
  const [teachersList, setTeachersList] = useState<TeacherOption[]>(TEACHERS);
  const [batchesList, setBatchesList] = useState<BatchOption[]>(BATCHES);
  const [roomsList, setRoomsList] = useState<string[]>(ROOMS);
  const [roomsData, setRoomsData] = useState<any[]>([]); // Full room objects with IDs
  const [listLoading, setListLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [selectedDept, setSelectedDept] = useState("All");
  const [dayFilter, setDayFilter] = useState<string | "All">("All");
  const [typeFilter, setTypeFilter] = useState<"All" | "Lab" | "Theory">("All");
  const [sortBy, setSortBy] = useState<"day" | "course" | "time">("day");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const filtersActive = Boolean(
    search.trim() ||
    selectedDept !== "All" ||
    dayFilter !== "All" ||
    typeFilter !== "All" ||
    sortBy !== "day" ||
    sortDir !== "asc"
  );

  // Edit Form State
  const [editData, setEditData] = useState({
    day: "Sunday", courseCode: "", courseTitle: "", teacher: "", batch: "", section: "none", dept: "", startTime: "08:00 AM", endTime: "09:30 AM", room: ""
  });

  // Import Wizard State
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [loadingSheet, setLoadingSheet] = useState(false);
  const [importRows, setImportRows] = useState<ImportScheduleRow[]>([]);
  const [selectedImportDept, setSelectedImportDept] = useState("CSE");
  const [fixingId, setFixingId] = useState<number | null>(null);
  const [importError, setImportError] = useState("");
  const [appliedCount, setAppliedCount] = useState(0);

  // Auto Sync States
  const [syncConfigLoading, setSyncConfigLoading] = useState(false);
  const [syncDepts, setSyncDepts] = useState<any[]>([]);
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [editingSyncLinks, setEditingSyncLinks] = useState<Record<number, string>>({});
  const [syncingDeptId, setSyncingDeptId] = useState<number | null>(null);
  const [savingDeptId, setSavingDeptId] = useState<number | null>(null);
  const [justRefreshed, setJustRefreshed] = useState(false);

  const fetchSyncData = async () => {
    setSyncConfigLoading(true);
    try {
      const res = await fetch(`/api/schedules/sync?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load sync configurations.");
      const data = await res.json();
      setSyncDepts(data.departments || []);
      setSyncLogs(data.logs || []);
      
      const links: Record<number, string> = {};
      data.departments.forEach((d: any) => {
        links[d.id] = d.sheet_link || "";
      });
      setEditingSyncLinks(links);
      
      // Flash success confirmation
      setJustRefreshed(true);
      setTimeout(() => setJustRefreshed(false), 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setSyncConfigLoading(false);
    }
  };

  useEffect(() => {
    if (step === "sync") {
      fetchSyncData();
    }
  }, [step]);

  const handleToggleSync = async (deptId: number, currentEnabled: boolean) => {
    try {
      const newEnabled = !currentEnabled;
      const res = await fetch("/api/schedules/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departmentId: deptId,
          syncEnabled: newEnabled,
          sheetLink: editingSyncLinks[deptId] || null
        })
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update sync setting");
      }
      
      setSyncDepts(prev => prev.map(d => d.id === deptId ? { ...d, sync_enabled: newEnabled } : d));
      await fetchSyncData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to toggle sync.");
    }
  };

  const handleSaveSyncLink = async (deptId: number) => {
    setSavingDeptId(deptId);
    try {
      const link = editingSyncLinks[deptId] || "";
      const res = await fetch("/api/schedules/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departmentId: deptId,
          syncEnabled: syncDepts.find(d => d.id === deptId)?.sync_enabled || false,
          sheetLink: link === "" ? null : link
        })
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save link");
      }
      
      alert("Google Sheet link saved successfully!");
      await fetchSyncData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save link.");
    } finally {
      setSavingDeptId(null);
    }
  };

  const handleTriggerManualSync = async (deptId: number) => {
    setSyncingDeptId(deptId);
    try {
      const link = editingSyncLinks[deptId] || "";
      if (!link) {
        alert("Please enter and save a valid Google Sheet link first.");
        return;
      }
      
      const res = await fetch("/api/schedules/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departmentId: deptId,
          sheetLink: link,
          triggerNow: true
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Sync failed.");
      }
      
      alert(data.message || "Schedules synced successfully!");
      await Promise.all([loadSchedules(), fetchSyncData()]);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Sync failed.");
      await fetchSyncData();
    } finally {
      setSyncingDeptId(null);
    }
  };

  const timeToMinutes = (timeStr: string) => {
    if (!timeStr) return 0;
    // Handle 24h format (HH:mm) from input type="time"
    if (timeStr.match(/^\d{2}:\d{2}$/)) {
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    }
    // Handle AM/PM format (08:00 AM)
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;
    const [, hours, minutes, period] = match;
    let h = parseInt(hours);
    const m = parseInt(minutes);
    if (period.toUpperCase() === "PM" && h !== 12) h += 12;
    if (period.toUpperCase() === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };

  const formatTo12h = (time24: string) => {
    if (!time24) return "";
    const [h, m] = time24.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hours = h % 12 || 12;
    return `${hours.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${period}`;
  };

  const formatTo24h = (time12: string) => {
    if (!time12) return "08:00";
    const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return "08:00";
    const [, h, m, period] = match;
    let hours = parseInt(h);
    if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const departmentNames = departments.length > 0 ? departments.map((dept) => dept.name) : DEPARTMENTS;
  const selectedImportDepartment = departments.find((dept) => dept.name === selectedImportDept);

  const loadSchedules = async () => {
    setListLoading(true);
    try {
      const res = await fetch("/api/schedules", { cache: "no-store" });
      if (!res.ok) throw new Error("Could not load schedules");
      const rows = await res.json();
      setSchedules((rows as ScheduleApiRow[]).map(mapScheduleApiRow));
    } catch (error) {
      console.error(error);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [departmentRes, scheduleRes, coursesRes, teachersRes, batchesRes, roomsRes] = await Promise.all([
          fetch("/api/departments", { cache: "no-store" }),
          fetch("/api/schedules", { cache: "no-store" }),
          fetch("/api/courses", { cache: "no-store" }),
          fetch("/api/teachers", { cache: "no-store" }),
          fetch("/api/batches", { cache: "no-store" }),
          fetch("/api/rooms", { cache: "no-store" }),
        ]);
        if (departmentRes.ok) {
          const rows = (await departmentRes.json()) as DepartmentOption[];
          setDepartments(rows);
          if (rows.length > 0) {
            setSelectedImportDept((current) =>
              rows.some((dept) => dept.name === current) ? current : rows[0].name
            );
          }
        }
        if (scheduleRes.ok) {
          const rows = (await scheduleRes.json()) as ScheduleApiRow[];
          setSchedules(rows.map(mapScheduleApiRow));
        }
        // optional: fetch additional lists, normalize shapes and fall back to demo constants if unavailable
        if (coursesRes && coursesRes.ok) {
          const data = await coursesRes.json();
          if (Array.isArray(data) && data.length) {
            const normalized = data.map((c: any) => {
              // Extract department name from various possible property names
              const deptName = c.dept || c.department || c.department_name || c.dept_name || "";
              return {
                id: c.id,
                code: c.code || c.course_code || c.code_name || c.id || String(c.id || ""),
                title: c.title || c.course_name || c.name || c.course_title || "Untitled",
                dept: deptName,
                isLab: Boolean(c.isLab || c.is_lab || c.lab),
                department_id: c.department_id  // Include this for reference
              };
            });
            setCourses(normalized);
          } else {
            setCourses(COURSES);
          }
        }
        if (teachersRes && teachersRes.ok) {
          const data = await teachersRes.json();
          if (Array.isArray(data) && data.length) {
            const normalized = data.map((t: any) => ({
              id: t.id,
              short: t.short || t.short_name || t.code || t.initials || (t.name ? t.name.split(" ").map((p:string)=>p[0]).join('.') : ""),
              name: t.name || t.full_name || t.teacher_name || t.display_name || ""
            }));
            setTeachersList(normalized);
          } else {
            setTeachersList(TEACHERS);
          }
        }
        if (batchesRes && batchesRes.ok) {
          const data = await batchesRes.json();
          if (Array.isArray(data) && data.length) {
            const normalized = data.map((b: any) => ({
              id: b.id,
              name: b.name || b.batch_name || b.session || (b.label || ""),
              dept: b.dept || b.department || b.department_name || b.department_code || "",
              session: b.session || b.batch_session || null
            }));
            setBatchesList(normalized);
          } else {
            setBatchesList(BATCHES);
          }
        }
        if (roomsRes && roomsRes.ok) {
          const data = await roomsRes.json();
          if (Array.isArray(data) && data.length) {
            // Store full room objects
            setRoomsData(data);
            // Also normalize to strings for display
            const normalized = data.map((r: any) => {
              if (typeof r === "string") {
                const m = String(r).match(/\d+/);
                return m ? m[0] : r;
              }
              const num = r.room_number ?? r.number ?? r.number_string ?? null;
              if (num !== null && num !== undefined) return String(num);
              if (r.room_title) {
                const m = String(r.room_title).match(/\d+/);
                if (m) return m[0];
              }
              return String(r.id ?? r.label ?? r.title ?? "");
            });
            setRoomsList(normalized);
          } else {
            setRoomsList(ROOMS);
            setRoomsData([]);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadInitialData();
  }, []);

  const getTimeValidation = (start: string, end: string) => {
    const startMin = timeToMinutes(start);
    const endMin = timeToMinutes(end);

    if (endMin <= startMin) {
      return { error: "End time must be after start time", warning: "" };
    }

    if (endMin - startMin > 180) {
      return { error: "", warning: "Class duration exceeds 3 hours. Please verify." };
    }
    return { error: "", warning: "" };
  };

  const { error: formError, warning: formWarning } = getTimeValidation(editData.startTime, editData.endTime);

  const errorCount = importRows.filter((r) => r.status === "error").length;
  const warnCount = importRows.filter((r) => r.status === "warning").length;
  const okCount = importRows.filter((r) => r.status === "ok").length;

  const previewImport = async ({ file, googleSheet }: { file?: File; googleSheet?: string }) => {
    setImportError("");
    const formData = new FormData();
    formData.append("action", "preview");
    formData.append("departmentName", selectedImportDept);
    if (selectedImportDepartment) formData.append("departmentId", String(selectedImportDepartment.id));
    if (file) formData.append("file", file);
    if (googleSheet) formData.append("googleSheet", googleSheet);

    const res = await fetch("/api/schedules/import", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not parse schedule");
    setImportRows(data.rows || []);
    setStep("preview");
  };

  // --- List View Methods ---
  const filteredSchedules = (() => {
    const searchLower = search.trim().toLowerCase();
    const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let rows = schedules.filter((s) => {
      const matchesSearch =
        !searchLower ||
        s.courseCode.toLowerCase().includes(searchLower) ||
        s.courseTitle.toLowerCase().includes(searchLower) ||
        s.teacher.toLowerCase().includes(searchLower);

      const matchesDept = selectedDept === "All" || s.dept === selectedDept;
      const matchesDay = dayFilter === "All" || s.day === dayFilter;
      const matchesType = typeFilter === "All" || (typeFilter === "Lab" ? s.isLab : !s.isLab);

      return matchesSearch && matchesDept && matchesDay && matchesType;
    });

    const comparator = (a: ScheduleRow, b: ScheduleRow) => {
      let res = 0;
      if (sortBy === "day") {
        res = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
        if (res === 0) res = timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
      } else if (sortBy === "time") {
        res = timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
        if (res === 0) res = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
      } else if (sortBy === "course") {
        res = a.courseCode.localeCompare(b.courseCode) || a.courseTitle.localeCompare(b.courseTitle);
      }

      return sortDir === "asc" ? res : -res;
    };

    rows.sort(comparator);
    return rows;
  })();

  const openEditModal = (schedule: ScheduleRow) => {
    setEditingId(schedule.id);
    setEditData({ ...schedule });
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    try {
      // Convert day from "Sunday" to "sunday"
      const dayLower = editData.day.toLowerCase();

      // Find IDs from the lists
      const course = (courses.length > 0 ? courses : COURSES).find((c: any) => c.code === editData.courseCode);
      const teacher = (teachersList.length > 0 ? teachersList : TEACHERS).find((t: any) => t.short === editData.teacher);
      const batch = (batchesList.length > 0 ? batchesList : BATCHES).find((b: any) => b.name === editData.batch);
      const dept = departments.find((d) => d.name === editData.dept);
      
      // Find room from roomsData (full objects with ID)
      const room = (roomsData.length > 0 ? roomsData : []).find((r: any) => {
        const roomNumber = String(r.room_number ?? r.number ?? "");
        return roomNumber === String(editData.room);
      });

      // Convert time from "08:00 AM" to "08:00:00" (24-hour format)
      const convertTo24h = (time: string) => {
        if (!time) return "00:00:00";
        // If already in 24h format (HH:MM)
        if (time.match(/^\d{2}:\d{2}$/) && !time.includes(" ")) {
          return time + ":00";
        }
        // Parse AM/PM format
        const match = time.match(/(\d{1,2}):(\d{2})\s(AM|PM)/i);
        if (!match) return "00:00:00";
        const [, hour, minute, period] = match;
        let hours = parseInt(hour);
        if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
        if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
        return `${hours.toString().padStart(2, "0")}:${minute}:00`;
      };

      const payload = {
        day: dayLower,
        start_time: convertTo24h(editData.startTime),
        end_time: convertTo24h(editData.endTime),
        section: editData.section || "none",
        course_id: course?.id,
        teacher_id: teacher?.id || null,
        batch_id: batch?.id || null,
        department_id: dept?.id || null,
        room_id: room?.id || null,
      };

      if (!payload.course_id) {
        alert("Please select a course");
        return;
      }

      if (editingId) {
        // Update existing schedule
        const res = await fetch("/api/schedules", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Failed to update schedule");
        }
      } else {
        // Create new schedule
        const res = await fetch("/api/schedules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Failed to create schedule");
        }
      }

      // Reload schedules from database
      await loadSchedules();
      setShowEditModal(false);
      setEditingId(null);
    } catch (error) {
      console.error("Save schedule error:", error);
      alert(error instanceof Error ? error.message : "Failed to save schedule");
    }
  };

  // --- Import Wizard Methods ---
  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      setLoadingSheet(true);
      try {
        await previewImport({ file });
      } catch (error) {
        setImportError(error instanceof Error ? error.message : "Could not parse schedule");
      } finally {
        setLoadingSheet(false);
      }
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setLoadingSheet(true);
      try {
        await previewImport({ file });
      } catch (error) {
        setImportError(error instanceof Error ? error.message : "Could not parse schedule");
      } finally {
        setLoadingSheet(false);
      }
    }
  };

  const handleLoadGoogleSheet = async () => {
    if (!googleUrl.trim()) return alert("Enter a Google Sheet link or ID");
    const idMatch = googleUrl.match(/[A-Za-z0-9-_]{44,}/) || googleUrl.match(/[A-Za-z0-9-_]{20,}/);
    const sheetId = idMatch ? idMatch[0] : null;
    if (!sheetId) return alert("Couldn't find a valid Google Sheet ID in that input.");

    setLoadingSheet(true);
    setFileName(`Google Sheet • ${sheetId}`);

    try {
      await previewImport({ googleSheet: googleUrl });
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Could not load Google Sheet");
    } finally {
      setLoadingSheet(false);
    }
  };

  const finalizeImport = async () => {
    setImportError("");
    const formData = new FormData();
    formData.append("action", "apply");
    formData.append("departmentName", selectedImportDept);
    if (selectedImportDepartment) formData.append("departmentId", String(selectedImportDepartment.id));
    formData.append("rows", JSON.stringify(importRows));

    const res = await fetch("/api/schedules/import", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (!res.ok) {
      setImportRows(data.rows || importRows);
      setImportError(data.error || "Could not apply schedule");
      if (data.rows) setStep("preview");
      return;
    }

    setAppliedCount(data.inserted || okCount);
    await loadSchedules();
    setStep("done");
  };

  return (
    <div className="p-4 sm:p-8 max-w-[1200px] mx-auto">

      {/* ─── LIST VIEW ──────────────────────────────────────────────────────── */}
      {step === "list" && (
        <>
          <section className="glass relative overflow-hidden rounded-3xl border border-[var(--color-border)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.16)] sm:p-6 lg:p-7 mb-4">
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <h1 className="text-[26px] font-bold text-[var(--color-text-primary)]">Schedule Management</h1>
                <p className="text-sm text-[var(--color-text-secondary)]">{listLoading ? "Loading schedules..." : `${schedules.length} classes scheduled`}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditData({ day: "Sunday", courseCode: "", courseTitle: "", teacher: "", batch: "", section: "none", dept: selectedDept === "All" ? "CSE" : selectedDept, startTime: "08:00", endTime: "09:30", room: "" });
                    setShowEditModal(true);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3 py-2 text-sm font-semibold text-[var(--color-text-primary)] transition-all hover:bg-[var(--color-bg-elevated)]"
                >
                  <FiPlus /> Add Single Class
                </button>
                <button
                  onClick={() => setStep("upload")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-3 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99]"
                >
                  <FiBarChart2 /> Import Schedule
                </button>
                <button
                  onClick={() => setStep("sync")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3 py-2 text-sm font-semibold text-[var(--color-text-primary)] transition-all hover:bg-[var(--color-bg-elevated)] active:scale-[0.99]"
                >
                  <FiZap className="text-[var(--color-accent)] animate-pulse" /> Google Sheets Sync
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.12)] sm:p-5 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full">
              <div className="flex-1 max-w-full sm:max-w-[520px] min-w-0">
                <div className="relative w-full">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2 sm:py-3 pr-10 pl-10 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] transition-colors focus:border-[rgba(79,142,247,0.35)]"
                  />
                  {search && (
                    <button onClick={() => setSearch("")} title="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-surface)] hover:text-[var(--color-text-primary)]">
                      <FiX size={14} />
                    </button>
                  )}
                </div>

                {/* Mobile filters toggle */}
                <div className="sm:hidden mt-2">
                  <button onClick={() => setShowFiltersMobile(!showFiltersMobile)} className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-sm text-[var(--color-text-primary)] font-medium">
                    <span>Filters & Sorting</span>
                    <FiChevronDown className={`text-[var(--color-text-muted)] transition-transform ${showFiltersMobile ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </div>

              <div className={`${showFiltersMobile ? "flex flex-col" : "hidden"} sm:flex sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto`}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 w-full sm:w-auto">
                  <label className="text-xs font-semibold text-[var(--color-text-secondary)] sm:min-w-fit">Department</label>
                  <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="w-full sm:w-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2 px-3 text-sm outline-none focus:border-[var(--color-accent)]">
                    <option value="All">All</option>
                    {departmentNames.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 w-full sm:w-auto">
                  <label className="text-xs font-semibold text-[var(--color-text-secondary)] sm:min-w-fit">Day</label>
                  <select value={dayFilter} onChange={(e) => setDayFilter(e.target.value)} className="w-full sm:w-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2 px-3 text-sm outline-none focus:border-[var(--color-accent)]">
                    <option value="All">All</option>
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 w-full sm:w-auto">
                  <label className="text-xs font-semibold text-[var(--color-text-secondary)] sm:min-w-fit">Type</label>
                  <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} className="w-full sm:w-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2 px-3 text-sm outline-none focus:border-[var(--color-accent)]">
                    <option value="All">All</option>
                    <option value="Lab">Lab</option>
                    <option value="Theory">Theory</option>
                  </select>
                </div>
              </div>

              <div className={`${showFiltersMobile ? "flex flex-col" : "hidden"} sm:flex sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto ml-0 sm:ml-auto`}>
                <div className="flex items-center gap-1 bg-[var(--color-bg-elevated)] rounded-lg px-2 py-1 overflow-x-auto w-full sm:w-auto justify-between sm:justify-start">
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)] sm:hidden px-1">Sort by:</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setSortBy("day")} className={`px-2 py-1 text-sm rounded ${sortBy === "day" ? "bg-[var(--color-accent)] text-white font-medium" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)]"}`}>Day</button>
                    <button onClick={() => setSortBy("time")} className={`px-2 py-1 text-sm rounded ${sortBy === "time" ? "bg-[var(--color-accent)] text-white font-medium" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)]"}`}>Time</button>
                    <button onClick={() => setSortBy("course")} className={`px-2 py-1 text-sm rounded ${sortBy === "course" ? "bg-[var(--color-accent)] text-white font-medium" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)]"}`}>Course</button>
                    <button onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")} title="Toggle sort direction" className="px-2.5 py-1 rounded text-sm border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-colors">{sortDir === "asc" ? "↑" : "↓"}</button>
                  </div>
                </div>

                <button
                  onClick={() => { setSearch(""); setSelectedDept("All"); setDayFilter("All"); setTypeFilter("All"); setSortBy("day"); setSortDir("asc"); }}
                  aria-pressed={filtersActive}
                  title={filtersActive ? "Clear active filters" : "No filters applied"}
                  className={`w-full sm:w-auto ${filtersActive ? "px-5 py-2.5 rounded-lg border-none cursor-pointer text-sm font-semibold text-white bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] shadow-[0_0_20px_rgba(79,142,247,0.3)] hover:scale-[1.02] active:scale-95 transition-all" : "px-3 py-1.5 rounded-lg text-sm transition-all border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]"}`}
                >
                  Clear
                </button>
              </div>
            </div>
          </section>

          <div className="rounded-[14px] border border-[var(--color-border)] overflow-hidden bg-[var(--color-bg-surface)] hidden sm:block">
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
                          {(() => {
                            const isLab = (courses.find(c => c.code === row.courseCode) || COURSES.find(c => c.code === row.courseCode))?.isLab || row.isLab;
                            return (
                              <code className={`text-[11px] font-bold px-1.5 py-[2px] rounded w-fit ${isLab ? "text-[#a371f7] bg-[rgba(163,113,247,0.1)]" : "text-[#4f8ef7] bg-[rgba(79,142,247,0.1)]"}`}>
                                {row.courseCode}
                              </code>
                            );
                          })()}
                          <span className="text-xs text-[var(--color-text-secondary)] truncate max-w-[150px]">{row.courseTitle}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)] whitespace-nowrap">
                        {row.teacher || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                        {formatBatchSec(row)}
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
                          <button onClick={async () => { await fetch(`/api/schedules?id=${row.id}`, { method: "DELETE" }); setSchedules(schedules.filter(s => s.id !== row.id)); }} className="px-3 py-1.5 rounded-md border border-[rgba(248,81,73,0.2)] bg-transparent text-[var(--color-danger)] text-sm transition-colors hover:bg-[rgba(248,81,73,0.06)]">Delete</button>
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

            {/* Mobile Card List */}
            <div className="sm:hidden mt-4 space-y-3.5">
              {filteredSchedules.map((row) => (
                <div key={row.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 shadow-sm hover:shadow-md transition-shadow animate-in fade-in duration-200">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      {(() => {
                        const isLab = (courses.find(c => c.code === row.courseCode) || COURSES.find(c => c.code === row.courseCode))?.isLab || row.isLab;
                        return (
                          <code className={`text-[10px] font-bold px-2 py-0.5 rounded ${isLab ? "text-[#a371f7] bg-[rgba(163,113,247,0.1)]" : "text-[#4f8ef7] bg-[rgba(79,142,247,0.1)]"}`}>
                            {row.courseCode}
                          </code>
                        );
                      })()}
                      <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{row.day}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-[var(--color-text-primary)] bg-[var(--color-bg-surface)] px-2.5 py-1 rounded-lg border border-[var(--color-border)]">
                      Room {row.room}
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-[var(--color-text-primary)] leading-snug mb-1.5">
                    {row.courseTitle}
                  </h3>

                  <div className="space-y-1 mb-3.5">
                    <div className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5">
                      <span className="font-medium text-[var(--color-text-primary)]">{row.teacher || "No Teacher"}</span>
                      <span className="text-[var(--color-text-muted)]">•</span>
                      <span>{formatBatchSec(row)}</span>
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                      <FiClock size={12} className="shrink-0" />
                      <span>{row.startTime} - {row.endTime}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-[var(--color-border)]/50">
                    <button 
                      onClick={() => openEditModal(row)} 
                      className="flex-1 py-2 text-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] text-xs font-semibold transition-colors hover:bg-[var(--color-bg-elevated)]"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={async () => { 
                        if (confirm("Are you sure you want to delete this class?")) {
                          await fetch(`/api/schedules?id=${row.id}`, { method: "DELETE" }); 
                          setSchedules(schedules.filter(s => s.id !== row.id)); 
                        }
                      }} 
                      className="flex-1 py-2 text-center rounded-xl border border-[rgba(248,81,73,0.2)] bg-transparent text-[var(--color-danger)] text-xs font-semibold transition-colors hover:bg-[rgba(248,81,73,0.06)]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {filteredSchedules.length === 0 && (
                <div className="text-center py-12 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] text-sm">
                  No schedules found.
                </div>
              )}
            </div>

          {showEditModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center sm:items-center z-[60] p-3 sm:p-6 overflow-y-auto" onClick={(e) => { if (e.target === e.currentTarget) setShowEditModal(false); }}>
              <div className="w-full max-w-sm sm:max-w-[640px] rounded-xl sm:rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 sm:p-8 my-4 sm:my-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-4 sm:mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-accent-muted)] text-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
                    {editingId ? <FiEdit2 size={16} /> : <FiPlus size={16} />}
                  </div>
                  <span className="truncate">{editingId ? "Edit Class Schedule" : "Add New Class"}</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                  <div className="col-span-2">
                    <SearchableSelect
                      label="Department"
                      options={departmentNames}
                      value={editData.dept}
                      onChange={(dept: string) => setEditData({ ...editData, dept, batch: "", courseCode: "", courseTitle: "" })}
                      placeholder="Select Department"
                    />
                  </div>

                  <div className="col-span-2">
                    <SearchableSelect
                      label="Course"
                      options={courses && courses.length > 0 ? courses : COURSES}
                      value={editData.courseCode ? ((courses && courses.length > 0 ? courses : COURSES).find((c: any) => c.code === editData.courseCode)) || null : null}
                      onChange={(c: CourseOption) => setEditData({ ...editData, courseCode: c.code, courseTitle: c.title })}
                      placeholder="Select Course"
                      displayValue={(c: CourseOption) => `${c.code} — ${c.title}`}
                      searchKey={(c: CourseOption) => `${c.code} ${c.title}`}
                      renderOption={(c: CourseOption) => (
                        <div className="flex flex-col">
                          <span className="font-semibold text-xs">{c.code}</span>
                          <span className="text-[11px] opacity-70">{c.title}</span>
                          <span className="text-[10px] text-[var(--color-text-muted)]">{(c as any).dept || (c as any).department || "no dept"}</span>
                        </div>
                      )}
                    />
                  </div>

                  <div className="col-span-2">
                    <SearchableSelect
                      label="Teacher"
                      options={teachersList.length ? teachersList : TEACHERS}
                      value={editData.teacher ? (teachersList.find(t => t.short === editData.teacher) || TEACHERS.find(t => t.short === editData.teacher)) : null}
                      onChange={(t: TeacherOption) => setEditData({ ...editData, teacher: t.short })}
                      placeholder="Select Teacher"
                      displayValue={(t: TeacherOption) => t.short}
                      searchKey={(t: TeacherOption) => `${t.short} ${t.name}`}
                      renderOption={(t: TeacherOption) => (
                        <div className="flex flex-col">
                          <span className="font-medium text-xs">{t.short}</span>
                          <span className="text-[11px] opacity-70">{t.name}</span>
                        </div>
                      )}
                    />
                  </div>

                  <div>
                    <SearchableSelect
                      label="Batch"
                      options={(batchesList.length ? batchesList : BATCHES).filter((b: any) => ((b.dept || b.department) === editData.dept) || !editData.dept)}
                      value={editData.batch ? (batchesList.find(b => b.name === editData.batch) || BATCHES.find(b => b.name === editData.batch)) : null}
                      onChange={(b: any) => setEditData({ ...editData, batch: b.name })}
                      placeholder="Select Batch"
                      displayValue={(b: any) => `${b.dept ? b.dept + " - " : ""}${b.session || b.name}`}
                      searchKey={(b: any) => `${b.name} ${b.dept || ""} ${b.session || ""}`}
                      renderOption={(b: any) => <span>{b.dept ? `${b.dept} - ${b.session || b.name}` : b.name}</span>}
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[var(--color-text-secondary)] mb-1.5">Section</label>
                    <select
                      value={editData.section}
                      onChange={e => setEditData({ ...editData, section: e.target.value })}
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3.5 text-sm text-[var(--color-text-primary)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                    >
                      <option value="none">None</option>
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[var(--color-text-secondary)] mb-1.5">Start Time</label>
                    <input
                      type="time"
                      value={editData.startTime.includes(" ") ? formatTo24h(editData.startTime) : editData.startTime}
                      onChange={e => setEditData({ ...editData, startTime: e.target.value })}
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3.5 text-sm text-[var(--color-text-primary)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[var(--color-text-secondary)] mb-1.5">End Time</label>
                    <input
                      type="time"
                      value={editData.endTime.includes(" ") ? formatTo24h(editData.endTime) : editData.endTime}
                      onChange={e => setEditData({ ...editData, endTime: e.target.value })}
                      className={`w-full rounded-lg border py-2.5 px-3.5 text-sm outline-none focus:ring-2 transition-all ${formError ? "border-[var(--color-danger)] bg-[rgba(248,81,73,0.05)] focus:ring-[var(--color-danger)]" : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] focus:ring-[var(--color-accent)]"}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[var(--color-text-secondary)] mb-1.5">Day</label>
                    <select
                      value={editData.day}
                      onChange={e => setEditData({ ...editData, day: e.target.value })}
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3.5 text-sm text-[var(--color-text-primary)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                    >
                      <option>Sunday</option><option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option>
                    </select>
                  </div>

                  <div>
                    <SearchableSelect
                      label="Room"
                      options={roomsList.length ? roomsList : ROOMS}
                      value={editData.room}
                      onChange={(room: string) => setEditData({ ...editData, room })}
                      placeholder="Select Room"
                    />
                  </div>
                </div>

                {(formError || formWarning) && (
                  <div className={`mt-6 p-4 rounded-xl border flex gap-3 ${formError ? "bg-[rgba(248,81,73,0.08)] border-[rgba(248,81,73,0.2)] text-[var(--color-danger)]" : "bg-[rgba(210,153,34,0.08)] border-[rgba(210,153,34,0.2)] text-[var(--color-warning)]"}`}>
                    <FiAlertCircle className="mt-0.5 shrink-0" />
                    <p className="text-xs font-medium leading-relaxed">{formError || formWarning}</p>
                  </div>
                )}

                <div className="flex gap-2 sm:gap-3 mt-6 sm:mt-8">
                  <button onClick={() => setShowEditModal(false)} className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-xs sm:text-sm font-semibold transition-colors hover:bg-[var(--color-bg-elevated)]">Cancel</button>
                  <button
                    disabled={!!formError || !editData.courseCode || !editData.teacher || !editData.batch || !editData.room}
                    onClick={saveEdit}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-[var(--color-accent)] text-white font-semibold text-xs sm:text-sm shadow-lg shadow-[var(--color-accent)]/20 transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {editingId ? "Update" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ─── IMPORT WIZARD: HEADER & STEPPER ──────────────────────────────────── */}
      {step !== "list" && step !== "sync" && (
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

          <div className="flex gap-0 mb-6 sm:mb-8 items-center flex-wrap sm:flex-nowrap overflow-x-auto">
            {(["Upload", "Preview", "Fix Errors", "Done"] as const).map((label, i) => {
              const stepMap: Record<string, number> = { upload: 0, preview: 1, fixing: 2, done: 3 };
              const current = stepMap[step];
              const isDone = i < current;
              const isActive = i === current;
              return (
                <div key={label} className="flex items-center w-1/4 sm:w-auto sm:flex-1">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${isActive ? "border-[#4f8ef7] bg-[rgba(79,142,247,0.15)] shadow-[0_0_12px_rgba(79,142,247,0.2)]" : isDone ? "border-[#3fb950] bg-[rgba(63,185,80,0.12)] shadow-[0_0_12px_rgba(63,185,80,0.15)]" : `border-[var(--color-border)] bg-transparent`}`}>
                      {isDone ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> : <span className={`text-[10px] sm:text-xs font-bold ${isActive ? "text-[#4f8ef7]" : "text-[var(--color-text-muted)]"}`}>{i + 1}</span>}
                    </div>
                    <span className={`text-[9px] sm:text-[11px] whitespace-nowrap max-w-[50px] sm:max-w-none text-center ${isActive ? "font-semibold text-[#4f8ef7]" : isDone ? "font-normal text-[#3fb950]" : "font-normal text-[var(--color-text-muted)]"}`}>{label}</span>
                  </div>
                  {i < 3 && <div className={`w-2 sm:w-[60px] h-px ${isDone ? "bg-[#3fb950]" : "bg-[var(--color-border)]"} mx-1 sm:mx-2 mb-[18px] sm:mb-[22px] flex-shrink-0`} />}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ─── GOOGLE SHEETS AUTOMATED SYNC PANEL ───────────────────────────────── */}
      {step === "sync" && (
        <div className="space-y-4 sm:space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-border)] pb-4 sm:pb-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => setStep("list")} 
                className="p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-colors flex-shrink-0"
                title="Back to Schedules"
              >
                <FiArrowLeft size={20} />
              </button>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-3xl font-bold text-[var(--color-text-primary)] tracking-[-0.02em] flex items-center gap-2 flex-wrap">
                  <FiZap className="text-[var(--color-accent)] animate-pulse flex-shrink-0" /> <span className="truncate">Google Sheets Sync</span>
                </h1>
                <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1 line-clamp-1 sm:line-clamp-none">
                  Automate schedule synchronization
                </p>
              </div>
            </div>

            <button 
              onClick={fetchSyncData} 
              disabled={syncConfigLoading || justRefreshed}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 ${
                justRefreshed 
                  ? "border-[#3fb950]/40 bg-[rgba(63,185,80,0.06)] text-[#3fb950]" 
                  : "border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]"
              }`}
            >
              {justRefreshed ? (
                <>
                  <FiCheckCircle className="animate-bounce flex-shrink-0" /> <span className="hidden sm:inline">Status Refreshed!</span><span className="sm:hidden">Done!</span>
                </>
              ) : (
                <>
                  <FiRefreshCw className={`${syncConfigLoading ? "animate-spin" : ""} flex-shrink-0`} /> <span className="hidden sm:inline">Refresh Status</span><span className="sm:hidden">Refresh</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Column: Config Panel */}
            <div className="flex-1 w-full space-y-6">
              {syncConfigLoading && syncDepts.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 glass rounded-3xl border border-[var(--color-border)]">
                  <FiRefreshCw className="animate-spin text-[var(--color-accent)] text-4xl mb-4" />
                  <p className="text-sm text-[var(--color-text-secondary)]">Loading sync configurations...</p>
                </div>
              ) : (
                syncDepts.map((dept) => {
                  const isSyncing = syncingDeptId === dept.id;
                  const isSaving = savingDeptId === dept.id;
                  const currentLink = editingSyncLinks[dept.id] || "";
                  
                  return (
                    <div 
                      key={dept.id} 
                      className="glass rounded-3xl border border-[var(--color-border)] p-6 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4 mb-5">
                        <div>
                          <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-[var(--color-accent-muted)] text-[var(--color-accent)] mb-1">
                            {dept.name}
                          </span>
                          <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                            {dept.full_name || `${dept.name} Department`}
                          </h3>
                        </div>

                        {/* Switch */}
                        <div className="flex items-center gap-2">
                          <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={dept.sync_enabled === 1}
                              onChange={() => handleToggleSync(dept.id, dept.sync_enabled === 1)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-[var(--color-bg-elevated)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent)]"></div>
                            <span className="ml-2 text-xs font-semibold text-[var(--color-text-secondary)]">
                              {dept.sync_enabled === 1 ? "Auto Sync Active" : "Auto Sync Disabled"}
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* URL input */}
                        <div>
                          <label className="block text-[12px] font-semibold text-[var(--color-text-secondary)] mb-1.5">
                            Google Sheet URL / Link
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                            <input
                              type="text"
                              value={currentLink}
                              onChange={(e) => setEditingSyncLinks({
                                ...editingSyncLinks,
                                [dept.id]: e.target.value
                              })}
                              placeholder="Paste shared Google Sheets link"
                              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-xs sm:text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[rgba(79,142,247,0.45)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
                            />
                            <button
                              disabled={isSaving}
                              onClick={() => handleSaveSyncLink(dept.id)}
                              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] hover:bg-[var(--color-bg-surface)] text-xs sm:text-sm font-semibold text-[var(--color-text-primary)] transition-all disabled:opacity-50 whitespace-nowrap"
                            >
                              {isSaving ? "Saving..." : "Save Link"}
                            </button>
                          </div>
                        </div>

                        {/* Status/Actions footer */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-bg-subtle)] rounded-2xl p-4 border border-[var(--color-border)] mt-4">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                            <FiClock className="text-[var(--color-text-muted)]" />
                            <span>Last Synced:</span>
                            <span className="font-semibold text-[var(--color-text-primary)]">
                              {dept.last_sync_at ? new Date(dept.last_sync_at).toLocaleString() : "Never synced"}
                            </span>
                          </div>

                          <button
                            disabled={isSyncing || !currentLink}
                            onClick={() => handleTriggerManualSync(dept.id)}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-xs font-bold text-white shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all hover:bg-[#5d95f7] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                          >
                            {isSyncing ? (
                              <>
                                <FiRefreshCw className="animate-spin" /> Synchronizing...
                              </>
                            ) : (
                              <>
                                <FiZap /> Sync Now
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Column: Sync Logs Console */}
            <div className="w-full lg:w-80 shrink-0 space-y-4">
              <div className="glass rounded-3xl border border-[var(--color-border)] p-5 shadow-lg max-h-[600px] flex flex-col">
                <div className="border-b border-[var(--color-border)] pb-3 mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-[var(--color-text-primary)] flex items-center gap-2 text-base">
                    <FiSettings className="text-[var(--color-text-secondary)]" /> Sync Audit Logs
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]">
                    Recent
                  </span>
                </div>

                <div className="overflow-y-auto space-y-3 custom-scrollbar flex-1 pr-1 max-h-[500px]">
                  {syncLogs.length === 0 ? (
                    <div className="text-center py-10 text-xs text-[var(--color-text-muted)]">
                      No synchronization events recorded.
                    </div>
                  ) : (
                    syncLogs.map((log) => {
                      const isSuccess = log.status === "success";
                      return (
                        <div 
                          key={log.id} 
                          className={`p-3.5 rounded-2xl border text-xs leading-relaxed space-y-1.5 transition-all ${
                            isSuccess 
                              ? "bg-[rgba(63,185,80,0.03)] border-[rgba(63,185,80,0.15)] text-[var(--color-text-primary)]" 
                              : "bg-[rgba(248,81,73,0.03)] border-[rgba(248,81,73,0.15)] text-[var(--color-text-primary)]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)]">
                              {log.department_name}
                            </span>
                            <span 
                              style={{ 
                                color: isSuccess ? "var(--color-success)" : "var(--color-danger)",
                                background: isSuccess ? "rgba(63,185,80,0.1)" : "rgba(248,81,73,0.1)"
                              }} 
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-transparent whitespace-nowrap"
                            >
                              {isSuccess ? "Success" : "Failed"}
                            </span>
                          </div>

                          <p className="text-[11px] text-[var(--color-text-secondary)] break-words">
                            {log.message}
                          </p>

                          <div className="text-[9px] text-[var(--color-text-muted)] flex items-center justify-end gap-1 font-mono pt-1 border-t border-[var(--color-border)]/20">
                            <FiClock size={10} />
                            <span>{new Date(log.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── IMPORT WIZARD: UPLOAD ────────────────────────────────────────────── */}
      {step === "upload" && (
        <div id="schedule-drop-zone" onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleFileDrop} className={`rounded-xl sm:rounded-2xl border-2 border-dashed px-4 sm:px-10 py-12 sm:py-24 text-center transition-all duration-200 ${dragging ? "border-[#4f8ef7] bg-[rgba(79,142,247,0.08)] shadow-[inset_0_0_24px_rgba(79,142,247,0.1)]" : "border-[var(--color-border)] bg-[var(--color-bg-surface)] hover:border-[var(--color-accent)] hover:bg-[rgba(79,142,247,0.02)]"}`}>
          <div className="mb-3 sm:mb-5"><FiBarChart2 className="inline text-2xl sm:text-3xl text-[var(--color-text-muted)] mb-4 sm:mb-5" /></div>
          <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-2">Drop your schedule file here</h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mb-6 sm:mb-8">{loadingSheet ? "Parsing schedule..." : "Supports .xlsx, .xls, .csv files. Max 10MB."}</p>
          <label htmlFor="schedule-file-input" className="inline-flex items-center gap-2 px-7 py-3 rounded-[10px] cursor-pointer text-base font-semibold text-white bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] shadow-[0_0_20px_rgba(79,142,247,0.3)] hover:scale-[1.02] active:scale-95 transition-all duration-200">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg> Browse file
          </label>
          <input id="schedule-file-input" type="file" accept=".xlsx,.xls,.csv" onChange={handleFileInput} style={{ display: "none" }} />
          <p className="mt-6 text-xs text-[var(--color-text-muted)]">Need a template? <a href="#" className="text-[var(--color-accent)] no-underline">Download sample file</a></p>

          <div className="mt-[18px] flex flex-col gap-4 items-center">
            <div className="w-full max-w-[400px]">
              <SearchableSelect
                label="Import for Department"
                options={departmentNames}
                value={selectedImportDept}
                onChange={setSelectedImportDept}
                placeholder="Select Department"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 items-center justify-center w-full">
              <input aria-label="Google Sheet URL" placeholder="Paste Google Sheet link or ID" value={googleUrl} onChange={(e) => setGoogleUrl(e.target.value)} className="w-full sm:flex-1 sm:min-w-[260px] px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[#4f8ef7] focus:ring-offset-1 transition-all text-sm" />
              <button id="load-google-sheet" onClick={handleLoadGoogleSheet} disabled={loadingSheet} title="Load from Google Sheet" className={`p-2.5 rounded-lg border-none text-white font-semibold transition-all duration-200 flex items-center justify-center ${loadingSheet ? "bg-[rgba(79,142,247,0.16)] cursor-wait" : "bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] shadow-[0_0_20px_rgba(79,142,247,0.3)] hover:scale-[1.02] active:scale-95"}`}>
                {loadingSheet ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <FiDownloadCloud size={20} />
                )}
              </button>
            </div>

            {importError && (
              <div className="w-full max-w-[620px] p-3 rounded-lg border border-[rgba(248,81,73,0.25)] bg-[rgba(248,81,73,0.06)] text-[var(--color-danger)] text-sm font-medium">
                {importError}
              </div>
            )}
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
                <p className="text-xs text-[var(--color-text-muted)]">Parsed {importRows.length} entries for <span className="font-bold text-[var(--color-accent)]">{selectedImportDept}</span></p>
              </div>
            </div>
            <div className="flex gap-2.5 items-center flex-wrap">
              {[{ count: okCount, color: "#3fb950", label: "valid" }, { count: warnCount, color: "#d29922", label: "warnings" }, { count: errorCount, color: "#f85149", label: "errors" }].map((s) => (
                <span key={s.label} style={{ color: s.color, background: `${s.color}15`, borderColor: `${s.color}30` }} className="text-xs font-semibold px-3 py-1.5 border rounded-lg transition-all">{s.count} {s.label}</span>
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="rounded-[14px] border border-[var(--color-border)] overflow-hidden mb-6 shadow-sm hidden sm:block">
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
                      <tr key={row.clientId} className={`${i < importRows.length - 1 ? "border-b border-[var(--color-border)]" : ""} ${row.status === "error" ? "bg-[rgba(248,81,73,0.02)]" : "bg-[var(--color-bg-surface)]"}`}>
                        <td className="px-3.5 py-3 align-top">
                          <span style={{ color: sc.color, background: sc.bg, borderColor: sc.border }} className="text-[11px] font-semibold px-2.5 py-1 border rounded-lg inline-block">{sc.label}</span>
                          {(row.errors.length > 0 || row.warnings.length > 0) && (
                            <div className="mt-2 max-w-[220px] text-[11px] leading-relaxed text-[var(--color-danger)]">
                              {[...row.errors, ...row.warnings].join(" ")}
                            </div>
                          )}
                        </td>
                        <td className="px-3.5 py-3 text-sm text-[var(--color-text-secondary)]">{displayDay(row.day)}</td>
                        <td className="px-3.5 py-3">
                          {(() => {
                            return (
                              <code className={`text-[11px] font-bold px-1.5 py-[2px] rounded ${row.is_lab ? "text-[#a371f7] bg-[rgba(163,113,247,0.1)]" : "text-[#4f8ef7] bg-[rgba(79,142,247,0.1)]"}`}>
                                {row.course_code}
                              </code>
                            );
                          })()}
                        </td>
                        <td className="px-3.5 py-3 text-sm text-[var(--color-text-primary)] whitespace-nowrap">{row.course_name || "Unresolved course"}</td>
                        <td className={`px-3.5 py-3 text-sm ${row.teacher_id ? "text-[var(--color-text-secondary)]" : "text-[var(--color-danger)]"}`}>{row.teacher_short_name || <span className="inline-flex items-center gap-2 text-[var(--color-danger)]"><FiAlertCircle /> Missing</span>}</td>
                        <td className="px-3.5 py-3 text-sm text-[var(--color-text-primary)]">{row.batch}</td>
                        <td className="px-3.5 py-3 text-sm text-[var(--color-text-secondary)]">{row.section === "none" ? "—" : row.section}</td>
                        <td className="px-3.5 py-3 text-sm font-medium text-[var(--color-accent)] bg-[var(--color-accent-muted)]/10">{selectedImportDept}</td>
                        <td className="px-3.5 py-3 text-sm text-[var(--color-text-secondary)] whitespace-nowrap">{displayTime(row.start_time)}</td>
                        <td className="px-3.5 py-3 text-sm text-[var(--color-text-secondary)] whitespace-nowrap">{displayTime(row.end_time)}</td>
                        <td className="px-3.5 py-3 text-sm text-[var(--color-text-secondary)]">{row.room_number ?? "—"}</td>
                        <td className="px-3.5 py-3">
                          {(() => {
                            return (
                              <span className={`text-[10px] font-bold tracking-[0.06em] uppercase ${row.is_lab ? "text-[#a371f7]" : "text-[var(--color-text-muted)]"}`}>
                                {row.is_lab ? "Lab" : "Theory"}
                              </span>
                            );
                          })()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card Preview List */}
          <div className="sm:hidden mt-3 mb-6 space-y-4">
            {importRows.map((row) => {
              const sc = STATUS_CONFIG[row.status];
              return (
                <div key={row.clientId} className={`rounded-2xl border p-4 shadow-sm ${row.status === "error" ? "border-[rgba(248,81,73,0.3)] bg-[rgba(248,81,73,0.03)]" : "border-[var(--color-border)] bg-[var(--color-bg-elevated)]"} animate-in fade-in duration-200`}>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span style={{ color: sc.color, background: sc.bg, borderColor: sc.border }} className="text-[10px] font-bold px-2 py-0.5 border rounded-lg uppercase tracking-wider">{sc.label}</span>
                    <span className="text-[11px] font-semibold text-[var(--color-text-muted)] font-mono">{displayDay(row.day)} · {displayTime(row.start_time)} - {displayTime(row.end_time)}</span>
                  </div>
                  
                  <h3 className="text-sm font-bold text-[var(--color-text-primary)] leading-snug mb-2">
                    {row.course_name || "Unresolved course"}
                  </h3>
                  
                  <div className="space-y-1 text-xs text-[var(--color-text-secondary)]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <code className={`text-[10px] font-bold px-1.5 py-[2px] rounded ${row.is_lab ? "text-[#a371f7] bg-[rgba(163,113,247,0.1)]" : "text-[#4f8ef7] bg-[rgba(79,142,247,0.1)]"}`}>
                        {row.course_code}
                      </code>
                      <span className="text-[var(--color-text-muted)]">•</span>
                      <span className={row.teacher_id ? "font-semibold text-[var(--color-text-primary)]" : "text-[var(--color-danger)] font-medium"}>
                        {row.teacher_short_name || "Missing Teacher"}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-[var(--color-text-muted)] mt-1">
                      <span>Batch: <span className="text-[var(--color-text-secondary)] font-medium">{row.batch} ({row.section === "none" ? "—" : row.section})</span></span>
                      <span>•</span>
                      <span>Room: <span className="text-[var(--color-text-secondary)] font-medium">{row.room_number ?? "—"}</span></span>
                      <span>•</span>
                      <span>Dept: <span className="text-[var(--color-text-secondary)] font-medium">{selectedImportDept}</span></span>
                    </div>
                  </div>
                  
                  {(row.errors.length > 0 || row.warnings.length > 0) && (
                    <div className="mt-3 p-3 rounded-xl bg-[rgba(248,81,73,0.05)] border border-[rgba(248,81,73,0.15)] text-xs text-[var(--color-danger)] space-y-1.5">
                      {[...row.errors, ...row.warnings].map((err, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <FiAlertCircle className="mt-0.5 shrink-0 text-[var(--color-danger)]" size={14} />
                          <span className="leading-normal">{err}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {importError && (
            <div className="mb-6 p-4 rounded-xl border border-[rgba(248,81,73,0.25)] bg-[rgba(248,81,73,0.06)] text-[var(--color-danger)] text-sm font-medium flex gap-3">
              <FiAlertCircle className="mt-0.5 shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end mt-6">
            <button id="schedule-back" onClick={() => setStep("upload")} className="w-full sm:w-auto px-6 py-[11px] rounded-[9px] border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-sm cursor-pointer hover:bg-[var(--color-bg-surface)] transition-colors duration-200 active:scale-95"><span className="inline-flex items-center justify-center gap-2 w-full"><FiArrowLeft /> Back</span></button>
            {errorCount > 0 && <button id="schedule-fix-errors" onClick={() => setStep("fixing")} className="w-full sm:w-auto px-6 py-[11px] rounded-[9px] border border-[rgba(248,81,73,0.3)] bg-[rgba(248,81,73,0.08)] text-[var(--color-danger)] text-sm font-semibold cursor-pointer hover:bg-[rgba(248,81,73,0.12)] transition-colors duration-200 active:scale-95">Fix {errorCount} error{errorCount > 1 ? "s" : ""}</button>}
            <button id="schedule-import" disabled={errorCount > 0 || okCount === 0} onClick={finalizeImport} className="w-full sm:w-auto px-7 py-[11px] rounded-[9px] border-none bg-[var(--color-accent)] text-white text-sm font-semibold cursor-pointer hover:bg-[#5d95f7] hover:shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"><span className="inline-flex items-center justify-center gap-2 w-full">Apply {okCount} verified entries <FiArrowRight /></span></button>
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
              <div key={row.clientId} className="rounded-xl border border-[rgba(248,81,73,0.3)] bg-[rgba(248,81,73,0.04)] p-5 transition-all hover:shadow-md hover:border-[rgba(248,81,73,0.4)]">
                <div className="flex justify-between items-start mb-3.5 flex-wrap gap-2.5">
                  <div>
                    <code className="text-xs font-bold text-[#f85149] bg-[rgba(248,81,73,0.1)] px-[7px] py-[2px] rounded inline-block mr-2">{row.course_code}</code>
                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">{row.course_name || "Unresolved course"}</span>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">Sheet row {row.sourceRow}, column {row.sourceColumn}</p>
                  </div>
                  <button id={`fix-row-${row.clientId}`} onClick={() => setFixingId(fixingId === row.sourceRow ? null : row.sourceRow)} className="px-4 py-[7px] rounded-lg border border-[rgba(248,81,73,0.4)] bg-[rgba(248,81,73,0.08)] text-[var(--color-danger)] text-xs font-medium cursor-pointer hover:bg-[rgba(248,81,73,0.12)] transition-colors duration-200 active:scale-95">
                    {fixingId === row.sourceRow ? "Hide details" : <span className="inline-flex items-center gap-2">View details <FiArrowRight /></span>}
                  </button>
                </div>
                {fixingId === row.sourceRow && (
                  <div className="rounded-lg border border-[rgba(248,81,73,0.22)] bg-[var(--color-bg-surface)] p-4">
                    <ul className="m-0 pl-4 text-sm text-[var(--color-danger)]">
                      {row.errors.map((error) => (
                        <li key={error}>{error}</li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
                      Fix the referenced course, teacher, batch, room, or conflict in the database/source sheet, then parse the schedule again.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end mt-6">
            <button onClick={() => setStep("preview")} className="w-full sm:w-auto px-6 py-[11px] rounded-[9px] border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-sm cursor-pointer hover:bg-[var(--color-bg-surface)] transition-colors duration-200 active:scale-95"><span className="inline-flex items-center justify-center gap-2 w-full"><FiArrowLeft /> Back to Preview</span></button>
            <button id="fixing-continue" onClick={finalizeImport} className="w-full sm:w-auto px-7 py-[11px] rounded-[9px] border-none bg-[var(--color-accent)] text-white text-sm font-semibold cursor-pointer hover:bg-[#5d95f7] hover:shadow-lg transition-all duration-200 active:scale-95"><span className="inline-flex items-center justify-center gap-2 w-full">Continue <FiArrowRight /></span></button>
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
          <p className="text-base text-[var(--color-text-secondary)] mb-8">{appliedCount} schedule entries have been saved to the database.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 w-full sm:w-auto max-w-md mx-auto">
            <button id="schedule-import-again" onClick={() => { setStep("upload"); setFileName(""); setImportRows([]); setImportError(""); }} className="w-full sm:w-auto px-7 py-3 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] text-base font-medium cursor-pointer hover:bg-[var(--color-bg-surface)] transition-colors duration-200 active:scale-95">Import another file</button>
            <button onClick={() => setStep("list")} className="w-full sm:w-auto px-7 py-3 rounded-[10px] bg-[var(--color-accent)] text-white text-base font-medium cursor-pointer hover:bg-[#5d95f7] transition-all duration-200 active:scale-95">View Schedule</button>
          </div>
        </div>
      )}

    </div>
  );
}
