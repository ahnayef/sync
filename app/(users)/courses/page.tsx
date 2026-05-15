"use client";

import { useMemo, useState } from "react";
import { FiInbox } from "react-icons/fi";
import UserNavbar from "@/components/UserNavbar";

const AVAILABLE_COURSES = [
  { code: "CSE301", title: "Data Structures", teacher: "Dr. Rahman", isLab: false, section: "A" },
  { code: "CSE301L", title: "Data Structures Lab", teacher: "Dr. Rahman", isLab: true, section: "A" },
  { code: "CSE303", title: "Operating Systems", teacher: "Dr. Karim", isLab: false, section: "B" },
  { code: "CSE315L", title: "OS Lab", teacher: "Ms. Fatima", isLab: true, section: "B" },
  { code: "CSE405", title: "Software Engineering", teacher: "Prof. Hassan", isLab: false, section: "A" },
  { code: "CSE311L", title: "Networks Lab", teacher: "Dr. Islam", isLab: true, section: "A" },
  { code: "MAT201", title: "Discrete Mathematics", teacher: "Prof. Ahmed", isLab: false, section: "C" },
  { code: "HUM201", title: "Technical Writing", teacher: "Ms. Parvin", isLab: false, section: "A" },
  { code: "CSE401", title: "Compiler Design", teacher: "Dr. Chowdhury", isLab: false, section: "B" },
  { code: "CSE411L", title: "Compiler Lab", teacher: "Dr. Chowdhury", isLab: true, section: "B" },
];

const inputCls =
  "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-3 pr-4 pl-11 text-sm text-[var(--color-text-primary)] outline-none transition-colors duration-200 placeholder:text-[var(--color-text-muted)] focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/15";

function courseRowCls(selected: boolean) {
  return [
    "group flex h-full min-h-[172px] w-full cursor-pointer flex-col justify-between gap-3 rounded-xl border px-4 py-4 text-left transition-all duration-200",
    selected
      ? "border-blue-400/30 bg-blue-500/[0.06]"
      : "border-[var(--color-border)] bg-[var(--color-bg-surface)] hover:border-white/10 hover:bg-[var(--color-bg-elevated)]",
  ].join(" ");
}

export default function CoursesPage() {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(["CSE301", "CSE301L", "CSE303", "MAT201"]),
  );
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);
  const selectedCount = selected.size;
  const availableCount = AVAILABLE_COURSES.length;

  const filtered = useMemo(
    () =>
      AVAILABLE_COURSES.filter(
        (c) =>
          c.code.toLowerCase().includes(search.toLowerCase()) ||
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.teacher.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const toggle = (code: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
    setSaved(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)]">
      <UserNavbar />

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
              {selectedCount} selected · {availableCount} available
            </p>
          </div>

          <button
            id="courses-save"
            type="button"
            onClick={() => setSaved(true)}
            className={[
              "inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors sm:w-auto",
              saved
                ? "border-success/30 bg-success/15 text-success"
                : "border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]",
            ].join(" ")}
          >
            {saved ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Saved
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>

        <div className="mb-5 relative">
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
            placeholder="Search courses"
            className={inputCls}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-surface)] px-6 py-12 text-center">
            <div className="mb-3">
              <FiInbox className="mx-auto text-3xl text-[var(--color-text-muted)]" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-[var(--color-text-primary)]">
              No courses match
            </h3>
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-4 text-sm font-medium text-[var(--color-accent)] hover:underline"
              >
                Clear search
              </button>
            ) : null}
          </div>
        ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {filtered.map((course) => {
              const isSelected = selected.has(course.code);
              return (
                <li key={course.code} className="h-full">
                  <button
                    type="button"
                    id={`course-${course.code.toLowerCase()}`}
                    onClick={() => toggle(course.code)}
                    className={courseRowCls(isSelected)}
                    aria-pressed={isSelected}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={[
                            "rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold tracking-wide",
                            course.isLab
                              ? "border-violet-500/30 bg-violet-500/10 text-lab"
                              : "border-blue-400/30 bg-blue-500/10 text-[#6f9ff7]",
                          ].join(" ")}
                        >
                          {course.code}
                        </span>
                        {course.isLab ? (
                          <span className="rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] px-2.5 py-0.5 text-[10px] font-bold tracking-[0.08em] text-white uppercase">
                            Lab
                          </span>
                        ) : null}
                        <span className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-2 py-0.5 text-[11px] text-[var(--color-text-muted)]">
                          Sec {course.section}
                        </span>
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

                    <div className="min-w-0 space-y-1.5">
                      <p className="text-[14px] font-semibold leading-5 text-[var(--color-text-primary)]">
                        {course.title}
                      </p>
                      <p className="flex items-center gap-2 text-[12px] text-[var(--color-text-secondary)]">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-60">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        {course.teacher}
                      </p>
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
