"use client";

import { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FiInbox, FiCheck, FiSave, FiSearch, FiUser, FiCalendar, FiSliders, FiX } from "react-icons/fi";
import posthog from "posthog-js";

interface CourseTeacher {
  courseId: number;
  courseCode: string;
  courseTitle: string;
  isLab: boolean;
  teacherId: number;
  teacherName: string;
  deptName: string | null;
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
  const [courses, setCourses] = useState<CourseTeacher[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sorting & Filtering State (Focusing on Session)
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDept, setFilterDept] = useState("all");
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
  const departments = useMemo(() => {
    const depts = new Set<string>();
    courses.forEach((c) => {
      if (c.deptName) {
        depts.add(c.deptName.toUpperCase());
      }
    });
    return Array.from(depts).sort();
  }, [courses]);

  // Extract unique batch sessions dynamically (sorted descending so latest sessions appear first!)
  const sessions = useMemo(() => {
    const sessSet = new Set<string>();
    courses.forEach((c) => {
      if (c.batchSessions) {
        c.batchSessions.split(", ").forEach((s) => {
          if (s.trim()) sessSet.add(s.trim());
        });
      }
    });
    return Array.from(sessSet).sort((a, b) => b.localeCompare(a));
  }, [courses]);

  // Count active filters (to show in a badge)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterDept !== "all") count++;
    if (filterSession !== "all") count++;
    if (filterType !== "all") count++;
    if (filterStatus !== "all") count++;
    return count;
  }, [filterDept, filterSession, filterType, filterStatus]);

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
      result = result.filter((c) => selected.has(`${c.courseId}-${c.teacherId}`));
    } else if (filterStatus === "unselected") {
      result = result.filter((c) => !selected.has(`${c.courseId}-${c.teacherId}`));
    }

    // 4. Department filter (from database deptName)
    if (filterDept !== "all") {
      result = result.filter(
        (c) => c.deptName && c.deptName.toLowerCase() === filterDept.toLowerCase()
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
  }, [courses, search, filterType, filterStatus, filterDept, filterSession, sortBy, selected]);

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
        setTimeout(() => setSaved(false), 2000);
        // Refresh the JWT token so the proxy sees hasSelectedCourses = true
        // immediately without requiring the user to re-login
        if (selected.size > 0) {
          await updateSession({ hasSelectedCourses: true });
        }
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
      filtered.forEach((c) => next.add(`${c.courseId}-${c.teacherId}`));
      return next;
    });
    setSaved(false);
  };

  const clearSelection = () => {
    setSelected(new Set());
    setSaved(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)]">
      <main className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              Student portal
            </p>
            <h1 className="mt-2 text-[clamp(20px,4.5vw,28px)] sm:text-[32px] font-bold tracking-[-0.03em] text-[var(--color-text-primary)]">
              Course Selection
            </h1>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              {selectedCount} selected · {filtered.length} visible of {availableCount} total
            </p>
          </div>

          <div className="flex items-center gap-2 w-auto flex-nowrap">
            <button
              type="button"
              onClick={selectAllVisible}
              aria-label="Select all visible courses"
              className="inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 h-9 bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)]"
            >
              <FiCheck className="text-xl" />
              <span className="text-[11px] text-[var(--color-text-secondary)]">Select All</span>
            </button>

            <button
              type="button"
              onClick={clearSelection}
              aria-label="Clear selection"
              disabled={selected.size === 0}
              className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 h-9 ${selected.size === 0 ? "opacity-50 cursor-not-allowed" : "bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-surface)]"} text-[var(--color-text-secondary)]`}
            >
              <FiX className="text-xl" />
              <span className="text-[11px] text-[var(--color-text-secondary)]">Clear</span>
            </button>

            <button
              id="courses-save"
              type="button"
              aria-label="Save routine selections"
              disabled={saving}
              onClick={saveSelections}
              className={[
                "inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 h-9 text-sm font-medium",
                saved
                  ? "border-green-500/30 bg-green-500/15 text-green-500"
                  : "border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] active:scale-95",
                saving ? "opacity-50 cursor-not-allowed" : "",
              ].join(" ")}
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span className="text-[11px] text-[var(--color-text-secondary)]">Saving</span>
                </>
              ) : saved ? (
                <>
                  <FiCheck className="text-xl" />
                  <span className="text-[11px] text-green-500">Saved</span>
                </>
              ) : (
                <>
                  <FiSave className="opacity-70 text-xl" />
                  <span className="text-[11px] text-[var(--color-text-secondary)]">Save</span>
                </>
              )}
            </button>
          </div>
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

          {/* Collapsible Filters & Sorting Panel */}
          {showFilters && (
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4.5 animate-in slide-in-from-top-3 duration-200">
              <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-5 items-end">
                {/* Dept select */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">Department</label>
                  <select
                    id="filter-dept"
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                    className={selectCls}
                  >
                    <option value="all">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
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
                    {sessions.map((sess) => (
                      <option key={sess} value={sess}>
                        Session {sess}
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
              {(filterDept !== "all" ||
                filterSession !== "all" ||
                filterType !== "all" ||
                filterStatus !== "all" ||
                search !== "") && (
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setFilterDept("all");
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
              {(filterDept !== "all" ||
              filterSession !== "all" ||
              filterType !== "all" ||
              filterStatus !== "all" ||
              search !== "")
                ? "No courses match your selected filter criteria"
                : "No courses available in the schedule"}
            </h3>
            {(filterDept !== "all" ||
              filterSession !== "all" ||
              filterType !== "all" ||
              filterStatus !== "all" ||
              search !== "") && (
              <button
                type="button"
                onClick={() => {
                  setFilterDept("all");
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
              const compoundId = `${course.courseId}-${course.teacherId}`;
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
                      {course.batchSessions ? (
                        <span className="flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-400/20 px-2 py-0.5 text-[9px] font-semibold text-blue-300 truncate max-w-full sm:max-w-[160px]">
                          <FiCalendar size={9} className="shrink-0 text-blue-400" />
                          Session: {course.batchSessions}
                        </span>
                      ) : (
                        <div />
                      )}
                      {course.batchNames && (
                        <span className="text-[9.5px] text-white/30 truncate max-w-full sm:max-w-[120px]" title={course.batchNames}>
                          {course.batchNames}
                        </span>
                      )}
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
