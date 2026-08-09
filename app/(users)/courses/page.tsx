"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiInbox, FiCheck, FiSave, FiSearch, FiUser, FiCalendar, FiSliders, FiX } from "react-icons/fi";
import posthog from "posthog-js";
import { truncateText } from "@/lib/truncateText";

const CoursesTour = dynamic(() => import("@/components/CoursesTour"), { ssr: false });

interface CourseTeacher {
  courseId: number;
  courseCode: string;
  courseTitle: string;
  isLab: boolean;
  teacherId: number;
  teacherName: string;
  deptName: string | null;
  programName: string | null;
  batchId: number | null;
  batchNames: string | null;
  batchSessions: string | null;
}

const inputCls =
  "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 sm:py-3 pr-4 pl-10 sm:pl-11 text-sm text-[var(--color-text-primary)] outline-none transition-colors duration-200 placeholder:text-[var(--color-text-muted)] focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/15";

const selectCls =
  "w-full rounded-xl border border-white/10 bg-[var(--color-bg-elevated)] px-3.5 py-2 sm:py-2.5 text-sm text-[var(--color-text-secondary)] outline-none cursor-pointer transition-all hover:border-white/20 hover:text-[var(--color-text-primary)] focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30";

function courseRowCls(selected: boolean) {
  return [
    "group flex h-full min-h-[112px] sm:min-h-[132px] w-full cursor-pointer flex-col justify-between gap-2.5 rounded-xl border px-4 py-3.5 text-left transition-all duration-200",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/30",
    selected
      ? "border-blue-400/35 bg-blue-500/[0.06] shadow-[0_0_12px_rgba(59,130,246,0.03)]"
      : "border-[var(--color-border)] bg-[var(--color-bg-surface)] hover:border-white/10 hover:bg-[var(--color-bg-elevated)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)]",
  ].join(" ");
}

export default function CoursesPage() {
  const { update: updateSession } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<CourseTeacher[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sorting & Filtering State (Focusing on Session)
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProgram, setFilterProgram] = useState("all");
  const [filterSession, setFilterSession] = useState("all");
  const [sortBy, setSortBy] = useState("code-asc");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/user/courses");
        if (res.ok) {
          const data = await res.json();
          setCourses(data.available);
          setSelected(new Set(data.followed));
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const selectedCount = selected.size;
  const availableCount = courses.length;

  // Extract unique departments from API deptName directly
  const programsList = useMemo(() => {
    const progs = new Set<string>();
    courses.forEach((c) => {
      if (c.programName) {
        progs.add(c.programName.toUpperCase());
      }
    });
    return Array.from(progs).sort();
  }, [courses]);

  // Extract unique batch sessions and associate a department label for display
  const sessionOptions = useMemo(() => {
    const map = new Map<string, Set<string>>();
    courses.forEach((c) => {
      if (c.batchSessions) {
        c.batchSessions.split(", ").forEach((s) => {
          const sess = s.trim();
          if (!sess) return;
          const prog = c.programName ? c.programName.toUpperCase() : "";
          if (!map.has(sess)) map.set(sess, new Set());
          if (prog) map.get(sess)!.add(prog);
        });
      }
    });
    const arr = Array.from(map.entries()).map(([sess, progsSet]) => {
      const progs = Array.from(progsSet).sort();
      const programLabel = progs.length === 0 ? "General" : progs.length === 1 ? progs[0] : "Multiple";
      return { sess, programLabel };
    });
    return arr.sort((a, b) => b.sess.localeCompare(a.sess));
  }, [courses]);

  // Count active filters (to show in a badge)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterProgram !== "all") count++;
    if (filterSession !== "all") count++;
    if (filterType !== "all") count++;
    if (filterStatus !== "all") count++;
    return count;
  }, [filterProgram, filterSession, filterType, filterStatus]);

  // Dynamic filter and sort application
  const filtered = useMemo(() => {
    let result = [...courses];

    // 1. Search Query filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.courseCode.toLowerCase().includes(q) ||
          c.courseTitle.toLowerCase().includes(q) ||
          c.teacherName.toLowerCase().includes(q)
      );
    }

    // 2. Class Type filter
    if (filterType === "theory") {
      result = result.filter((c) => !c.isLab);
    } else if (filterType === "lab") {
      result = result.filter((c) => c.isLab);
    }

    // 3. Selection Status filter
    if (filterStatus === "selected") {
      result = result.filter((c) => selected.has(`${c.courseId}-${c.teacherId}-${c.batchId ?? 'null'}`));
    } else if (filterStatus === "unselected") {
      result = result.filter((c) => !selected.has(`${c.courseId}-${c.teacherId}-${c.batchId ?? 'null'}`));
    }

    
    // 4. Program filter (from database programName)
    if (filterProgram !== "all") {
      result = result.filter(
        (c) => c.programName && c.programName.toLowerCase() === filterProgram.toLowerCase()
      );
    }

    // 5. Batch Session filter
    if (filterSession !== "all") {
      result = result.filter(
        (c) =>
          c.batchSessions &&
          c.batchSessions
            .split(", ")
            .some((s) => s.trim().toLowerCase() === filterSession.trim().toLowerCase())
      );
    }

    // 6. Apply Sorting
    result.sort((a, b) => {
      if (sortBy === "code-asc") {
        return a.courseCode.localeCompare(b.courseCode);
      } else if (sortBy === "code-desc") {
        return b.courseCode.localeCompare(a.courseCode);
      } else if (sortBy === "title-asc") {
        return a.courseTitle.localeCompare(b.courseTitle);
      } else if (sortBy === "teacher-asc") {
        return a.teacherName.localeCompare(b.teacherName);
      }
      return 0;
    });

    return result;
  }, [courses, search, filterType, filterStatus, filterProgram, filterSession, sortBy, selected]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      const adding = !next.has(id);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      posthog.capture("course_toggled", { course_id: id, action: adding ? "selected" : "deselected" });
      return next;
    });
    setSaved(false);
    setHasUnsavedChanges(true);
  };

  const saveSelections = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selections: Array.from(selected) }),
      });
      if (res.ok) {
        posthog.capture("courses_saved", { selected_count: selected.size });
        setSaved(true);
        setHasUnsavedChanges(false);
        // Refresh the JWT token so the proxy sees hasSelectedCourses = true
        // immediately without requiring the user to re-login
        if (selected.size > 0) {
          await updateSession({ hasSelectedCourses: true });
        }
        // Force a hard navigation to routine page after successful save 
        // to bypass any Next.js client-side router caching of the middleware redirect
        window.location.href = "/routine";
        return;
      }
    } catch (err) {
      posthog.captureException(err);
      console.error("Failed to save selections:", err);
    } finally {
      setSaving(false);
    }
  };

  const selectAllVisible = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      filtered.forEach((c) => next.add(`${c.courseId}-${c.teacherId}-${c.batchId ?? 'null'}`));
      return next;
    });
    setSaved(false);
  };

  const clearSelection = () => {
    setSelected(new Set());
    setSaved(false);
    setHasUnsavedChanges(true);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)]">
      <CoursesTour filtersButtonId="courses-filters-toggle" />
      <main className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              Student portal
            </p>
            <h1 className="mt-2 text-[clamp(20px,4.5vw,28px)] sm:text-[32px] font-bold tracking-[-0.03em] text-[var(--color-text-primary)]">
              Course Selection
            </h1>
            <div className="mt-2 flex flex-col gap-1">
              <p className="text-sm text-[var(--color-text-secondary)]">
                {selectedCount} selected · {filtered.length} visible of {availableCount} total
              </p>
              <p className="text-[13px] font-medium text-blue-400">
                Step 1: Select your courses below &nbsp;&rarr;&nbsp; Step 2: Click Save to generate your routine
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Top Action Bar */}
        <div className="sticky top-0 z-40 -mx-4 px-4 py-3 sm:-mx-6 sm:px-6 mb-6 bg-[var(--color-bg-base)]/90 backdrop-blur-xl border-b border-white/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <span className="text-sm sm:text-base font-bold text-white">
                {selectedCount} Selected
              </span>
              {hasUnsavedChanges && (
                <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-orange-400 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                  </span>
                  Unsaved changes
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={selectAllVisible}
                aria-label="Select all visible courses"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/10 hover:text-white transition-colors"
              >
                <FiCheck className="text-sm" />
                Select All Visible
              </button>
              <button
                type="button"
                onClick={clearSelection}
                aria-label="Clear selection"
                disabled={selected.size === 0}
                className={`inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium transition-colors ${
                  selected.size === 0 
                    ? "bg-white/5 text-white/30 cursor-not-allowed" 
                    : "bg-white/5 text-white/90 hover:bg-white/10 hover:text-white"
                }`}
              >
                <FiX className="text-sm" />
                Clear
              </button>
            </div>
          </div>
          <button
            onClick={saveSelections}
            disabled={saving}
            id="courses-save"
            className={`flex shrink-0 w-full sm:w-auto justify-center items-center gap-2 rounded-xl px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-bold text-white shadow-lg transition-all ${
              saving 
                ? "bg-blue-600/50 cursor-not-allowed" 
                : saved && !hasUnsavedChanges
                  ? "bg-green-600 hover:bg-green-500"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 hover:shadow-blue-500/25 active:scale-95"
            }`}
          >
            {saving ? (
              <>
                <div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : saved && !hasUnsavedChanges ? (
              <>
                <FiCheck className="text-lg" />
                Saved Routine
              </>
            ) : (
              <>
                <FiSave className="text-lg" />
                Save & View Routine &rarr;
              </>
            )}
          </button>
        </div>

        {/* Dynamic Filtering and Sorting Controls Container */}
        <div className="mb-6 flex flex-col gap-3">
          {/* Main search and Filters Toggle Row */}
          <div className="flex gap-2.5 items-center w-full">
            <div className="relative flex-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[var(--color-text-muted)]"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
                <input
                id="courses-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses by code, title, or teacher..."
                className={inputCls}
              />
            </div>

            {/* Premium collapsible filter toggle */}
            <button
              id="courses-filters-toggle"
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={[
                "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer h-[46px]",
                showFilters || activeFilterCount > 0
                  ? "border-blue-400/30 bg-blue-500/10 text-blue-300"
                  : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)] hover:text-white",
              ].join(" ")}
            >
              <FiSliders className="shrink-0" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white shadow-md">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick Batch Filter Pills */}
          <div className="w-full overflow-x-auto pb-1 scrollbar-hide">
            <div className="flex gap-2 w-max">
              {sessionOptions.slice(0, 6).map(({ sess }) => (
                <button
                  key={sess}
                  onClick={() => {
                    setFilterSession(sess);
                    setShowFilters(true);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                    filterSession === sess
                      ? "border-blue-500 bg-blue-500/20 text-blue-300"
                      : "border-white/10 bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:border-white/30 hover:text-white"
                  }`}
                >
                  {sess}
                </button>
              ))}
              {sessionOptions.length > 6 && (
                <button
                  onClick={() => setShowFilters(true)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full border border-white/10 bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:border-white/30 hover:text-white"
                >
                  View all...
                </button>
              )}
            </div>
          </div>

          {/* Collapsible Filters & Sorting Panel */}
          {showFilters && (
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4.5 animate-in slide-in-from-top-3 duration-200">
              <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-5 items-end">
                {/* Dept select */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">Department</label>
                  <select
                    id="filter-dept"
                    value={filterProgram}
                    onChange={(e) => setFilterProgram(e.target.value)}
                    className={selectCls}
                  >
                    <option value="all">All Programs</option>
                    {programsList.map((prog) => (
                      <option key={prog} value={prog}>
                        {prog}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Batch Session Filter - Primary Focus */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">Batch Session</label>
                  <select
                    id="filter-session"
                    value={filterSession}
                    onChange={(e) => setFilterSession(e.target.value)}
                    className={selectCls}
                  >
                    <option value="all">All Sessions</option>
                    {sessionOptions.map(({ sess, programLabel }) => (
                      <option key={sess} value={sess}>
                        {sess} - {programLabel}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Class Type select */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">Class Type</label>
                  <select
                    id="filter-type"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className={selectCls}
                  >
                    <option value="all">All Class Types</option>
                    <option value="theory">Theory Classes</option>
                    <option value="lab">Lab Sessions</option>
                  </select>
                </div>

                {/* Status select */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">Selection Status</label>
                  <select
                    id="filter-status"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className={selectCls}
                  >
                    <option value="all">All Statuses</option>
                    <option value="selected">Selected (Followed)</option>
                    <option value="unselected">Not Selected</option>
                  </select>
                </div>

                {/* Sort Order dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">Sort By</label>
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={selectCls}
                  >
                    <option value="code-asc">Code: A to Z</option>
                    <option value="code-desc">Code: Z to A</option>
                    <option value="title-asc">Title: A to Z</option>
                    <option value="teacher-asc">Teacher: A to Z</option>
                  </select>
                </div>
              </div>

              {/* Action row at bottom of expanded panel */}
              {(filterProgram !== "all" ||
                filterSession !== "all" ||
                filterType !== "all" ||
                filterStatus !== "all" ||
                search !== "") && (
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setFilterProgram("all");
                      setFilterSession("all");
                      setFilterType("all");
                      setFilterStatus("all");
                      setSearch("");
                    }}
                    className="rounded-xl border border-dashed border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-red-400 transition-all hover:bg-red-500/20 active:scale-95 cursor-pointer"
                  >
                    Reset Active Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[132px] animate-pulse rounded-xl bg-[var(--color-bg-elevated)]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-surface)] px-6 py-12 text-center">
            <div className="mb-3">
              <FiInbox className="mx-auto text-3xl text-[var(--color-text-muted)]" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-[var(--color-text-primary)]">
              {(filterProgram !== "all" ||
              filterSession !== "all" ||
              filterType !== "all" ||
              filterStatus !== "all" ||
              search !== "")
                ? "No courses match your selected filter criteria"
                : "No courses available in the schedule"}
            </h3>
            {(filterProgram !== "all" ||
              filterSession !== "all" ||
              filterType !== "all" ||
              filterStatus !== "all" ||
              search !== "") && (
              <button
                type="button"
                onClick={() => {
                  setFilterProgram("all");
                  setFilterSession("all");
                  setFilterType("all");
                  setFilterStatus("all");
                  setSearch("");
                }}
                className="mt-4 text-sm font-medium text-[var(--color-accent)] hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {filtered.map((course) => {
              const compoundId = `${course.courseId}-${course.teacherId}-${course.batchId ?? 'null'}`;
              const isSelected = selected.has(compoundId);
              return (
                <li key={compoundId} className="h-full">
                  <button
                    type="button"
                    id={`course-${compoundId}`}
                    onClick={() => toggle(compoundId)}
                    className={courseRowCls(isSelected)}
                    aria-pressed={isSelected}
                  >
                    {/* Top Row: Course Code & Lab Status, along with Checkbox Selector */}
                    <div className="flex items-center justify-between gap-3 w-full">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={[
                            "rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold tracking-wide",
                            course.isLab
                              ? "border-violet-500/30 bg-violet-500/10 text-lab"
                              : "border-blue-400/30 bg-blue-500/10 text-[#6f9ff7]",
                          ].join(" ")}
                        >
                          {course.courseCode}
                        </span>
                        {course.isLab ? (
                          <span className="rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] px-2 py-0.5 text-[9px] font-bold tracking-[0.08em] text-white uppercase">
                            Lab
                          </span>
                        ) : null}
                      </div>

                      <span
                          className={[
                              "flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200",
                              isSelected
                                ? "border-[#4f8ef7] bg-[#4f8ef7]"
                                : "border-[var(--color-border)] bg-transparent group-hover:border-white/20",
                            ].join(" ")}
                        aria-hidden
                      >
                        {isSelected ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : null}
                      </span>
                    </div>

                    {/* Middle Section: Course Title & Instructor */}
                    <div className="min-w-0 space-y-1 w-full mt-1">
                      <p className="text-sm sm:text-[13.5px] font-semibold leading-snug text-[var(--color-text-primary)] line-clamp-2">
                        {course.courseTitle}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs sm:text-[11.5px] text-[var(--color-text-secondary)]">
                        <FiUser className="shrink-0 opacity-60 text-blue-400" />
                        {course.teacherName}
                      </p>
                    </div>

                    {/* Bottom Row: Dynamic Batch Session Pill & Cohort Label */}
                    <div className="flex flex-col sm:flex-row sm:items-center items-start justify-between gap-2 w-full mt-2 pt-2 border-t border-white/[0.04]">
                      <div className="flex items-center gap-2 w-full">
                        {course.batchSessions ? (
                          <span className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[rgba(79,142,247,0.06)] to-[rgba(111,107,247,0.04)] px-3 py-1 text-[11px] font-semibold text-[var(--color-text-primary)] max-w-full sm:max-w-[220px]">
                            <FiCalendar size={14} className="shrink-0 text-blue-400" />
                            <span className="truncate text-wrap">{truncateText(course.batchSessions, 20)}</span>
                          </span>
                        ) : null}

                        {course.programName ? (
                          <span className="ml-auto rounded-md bg-[rgba(255,255,255,0.02)] px-2 py-0.5 text-[10px] font-semibold text-white/60 uppercase">{course.programName}</span>
                        ) : null}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </main>


    </div>
  );
}
