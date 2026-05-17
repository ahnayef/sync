"use client";

import { useMemo, useState, useEffect } from "react";
import { FiInbox, FiCheck, FiSave, FiSearch, FiUser, FiCalendar } from "react-icons/fi";

interface CourseTeacher {
  courseId: number;
  courseCode: string;
  courseTitle: string;
  isLab: boolean;
  teacherId: number;
  teacherName: string;
  batchNames: string | null;
  batchSessions: string | null;
}

const inputCls =
  "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-3 pr-4 pl-11 text-sm text-[var(--color-text-primary)] outline-none transition-colors duration-200 placeholder:text-[var(--color-text-muted)] focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/15";

const selectCls =
  "rounded-xl border border-white/10 bg-[var(--color-bg-elevated)] px-4 py-2.5 text-sm text-[var(--color-text-secondary)] outline-none cursor-pointer transition-all hover:border-white/20 hover:text-[var(--color-text-primary)] focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30";

function courseRowCls(selected: boolean) {
  return [
    "group flex h-full min-h-[176px] w-full cursor-pointer flex-col justify-between gap-3 rounded-xl border px-4 py-4 text-left transition-all duration-200",
    selected
      ? "border-blue-400/30 bg-blue-500/[0.06]"
      : "border-[var(--color-border)] bg-[var(--color-bg-surface)] hover:border-white/10 hover:bg-[var(--color-bg-elevated)]",
  ].join(" ");
}

export default function CoursesPage() {
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

  // Extract unique departments from course code prefixes
  const departments = useMemo(() => {
    const depts = new Set<string>();
    courses.forEach((c) => {
      const match = c.courseCode.match(/^([A-Za-z]+)/);
      if (match) {
        depts.add(match[1].toUpperCase());
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

    // 4. Department Prefix filter
    if (filterDept !== "all") {
      result = result.filter((c) => {
        const match = c.courseCode.match(/^([A-Za-z]+)/);
        return match && match[1].toUpperCase() === filterDept;
      });
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
      if (next.has(id)) next.delete(id);
      else next.add(id);
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
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error("Failed to save selections:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)]">
      <main className="mx-auto max-w-[1100px] px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              Student portal
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-3xl">
              Course Selection
            </h1>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              {selectedCount} selected · {filtered.length} visible of {availableCount} total
            </p>
          </div>

          <button
            id="courses-save"
            type="button"
            disabled={saving}
            onClick={saveSelections}
            className={[
              "inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all sm:w-auto",
              saved
                ? "border-green-500/30 bg-green-500/15 text-green-500"
                : "border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] active:scale-95",
              saving ? "opacity-50 cursor-not-allowed" : "",
            ].join(" ")}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving...
              </span>
            ) : saved ? (
              <>
                <FiCheck className="text-lg" />
                Saved Changes
              </>
            ) : (
              <>
                <FiSave className="opacity-70" />
                Save Routine Selections
              </>
            )}
          </button>
        </div>

        {/* Filtering and Sorting Controls Container */}
        <div className="mb-6 flex flex-col gap-4">
          {/* Search bar */}
          <div className="relative w-full">
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

          {/* Filtering and Sorting Selectors */}
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2.5 col-span-2 sm:col-span-1">
              {/* Dept select */}
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

              {/* Batch Session Filter - Primary Focus */}
              <select
                id="filter-session"
                value={filterSession}
                onChange={(e) => setFilterSession(e.target.value)}
                className={selectCls}
              >
                <option value="all">All Sessions</option>
                {sessions.map((sess) => (
                  <option key={sess} value={sess}>
                    {sess}
                  </option>
                ))}
              </select>

              {/* Class Type select */}
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

              {/* Status select */}
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

            <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1 sm:justify-end">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] hidden lg:inline">
                Sort:
              </span>
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
                    className="rounded-xl border border-dashed border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20 active:scale-95"
                  >
                    Clear Filters
                  </button>
                )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[176px] animate-pulse rounded-xl bg-[var(--color-bg-elevated)]" />
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
                    <div className="flex items-start justify-between gap-3 w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={[
                            "rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold tracking-wide",
                            course.isLab
                              ? "border-violet-500/30 bg-violet-500/10 text-lab"
                              : "border-blue-400/30 bg-blue-500/10 text-[#6f9ff7]",
                          ].join(" ")}
                        >
                          {course.courseCode}
                        </span>
                        {course.isLab ? (
                          <span className="rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] px-2.5 py-0.5 text-[10px] font-bold tracking-[0.08em] text-white uppercase">
                            Lab
                          </span>
                        ) : null}
                      </div>

                      <span
                        className={[
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200",
                          isSelected
                            ? "border-[#4f8ef7] bg-[#4f8ef7]"
                            : "border-[var(--color-border)] bg-transparent group-hover:border-white/20",
                        ].join(" ")}
                        aria-hidden
                      >
                        {isSelected ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : null}
                      </span>
                    </div>

                    <div className="min-w-0 space-y-1.5 w-full">
                      <p className="text-[14px] font-semibold leading-5 text-[var(--color-text-primary)]">
                        {course.courseTitle}
                      </p>

                      {/* Teacher metadata */}
                      <p className="flex items-center gap-2 text-[12px] text-[var(--color-text-secondary)]">
                        <FiUser className="shrink-0 opacity-60 text-blue-400" />
                        {course.teacherName}
                      </p>

                      {/* Prominent Session badge and secondary Batch Name */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5 mt-2 pt-1 border-t border-white/[0.04]">
                        {course.batchSessions && (
                          <span className="flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-400/20 px-2 py-0.5 text-[10px] font-medium text-blue-300">
                            <FiCalendar size={10} className="shrink-0 text-blue-400" />
                            {course.batchSessions}
                          </span>
                        )}
                        {course.batchNames && (
                          <span className="text-[10px] text-white/30 truncate max-w-[150px]">
                            {course.batchNames}
                          </span>
                        )}
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
