"use client";

import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newIsLab, setNewIsLab] = useState(false);
  const [newProgramId, setNewProgramId] = useState<string>("");
  const [filterLab, setFilterLab] = useState<"all" | "lab" | "theory">("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const programById = useMemo(
    () => new Map(programs.map((program) => [program.id, program])),
    [programs]
  );

  const fetchData = async () => {
    try {
      const [courseRes, progRes] = await Promise.all([
        fetch("/api/courses"),
        fetch("/api/programs")
      ]);
      const [courseData, progData] = await Promise.all([
        courseRes.json(),
        progRes.json()
      ]);
      if (courseRes.ok) setCourses(courseData);
      if (progRes.ok) setPrograms(progData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = courses.filter((c) => {
    const programName = programById.get(c.program_id)?.name || c.program_name || "";
    const departmentName = programById.get(c.program_id)?.department_name || c.dept || "";
    const matchSearch =
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      programName.toLowerCase().includes(search.toLowerCase()) ||
      departmentName.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filterLab === "all" ? true : filterLab === "lab" ? c.isLab : !c.isLab;
    return matchSearch && matchFilter;
  });

  const labCount = courses.filter((course) => course.isLab).length;
  const theoryCount = courses.length - labCount;
  const activeFilterLabel =
    filterLab === "all"
      ? "All courses"
      : filterLab === "lab"
        ? "Lab courses"
        : "Theory courses";

  const openAdd = () => {
    setEditingId(null);
    setNewCode("");
    setNewName("");
    setNewIsLab(false);
    setNewProgramId(programs[0]?.id || "");
    setShowModal(true);
  };

  const openEdit = (course: any) => {
    setEditingId(course.id);
    setNewCode(course.code);
    setNewName(course.name || "");
    setNewIsLab(course.isLab);
    setNewProgramId(course.program_id);
    setShowModal(true);
  };

  const saveCourse = async () => {
    if (!newCode || !newProgramId) return;
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const payload = editingId
        ? { id: editingId, code: newCode, name: newName, isLab: newIsLab, programId: newProgramId }
        : { code: newCode, name: newName, isLab: newIsLab, programId: newProgramId };

      const res = await fetch("/api/courses", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "Failed to save course");
      } else {
        await fetchData();
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = async (id: number) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await fetch(`/api/courses?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to delete");
      } else {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative p-4 sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 sm:h-56 bg-[radial-gradient(circle_at_top_left,rgba(111,147,218,0.16),transparent_36%),radial-gradient(circle_at_top_right,rgba(163,113,247,0.12),transparent_28%)]" />

      <div className="relative mx-auto max-w-7xl space-y-4 sm:space-y-6">
        <section className="glass relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--color-border)] p-4 sm:p-5 lg:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
          <div className="relative flex flex-col gap-4 sm:gap-6">
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-xl sm:text-2xl md:text-[24px] lg:text-[26px] font-bold text-[var(--color-text-primary)]">Course Management</h1>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">Manage course codes, names, and program assignments.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="hidden sm:block rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3 sm:px-4 py-2 text-xs sm:text-xs text-[var(--color-text-secondary)]">
                {courses.length} courses • {programs.length} programs
              </div>
              <button
                id="add-course-btn"
                onClick={openAdd}
                className="inline-flex items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-[var(--color-accent)] px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,142,247,0.22)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99]"
              >
                + Add Course
              </button>
            </div>
          </div>
        </section>

        <section className="glass rounded-2xl sm:rounded-3xl border border-[var(--color-border)] p-3 sm:p-4 lg:p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <div className="flex flex-col gap-3">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-sm" />
              <input
                id="course-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses..."
                className="w-full rounded-lg sm:rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 sm:py-3 pr-3 sm:pr-4 pl-9 sm:pl-11 text-xs sm:text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] transition-colors focus:border-[rgba(79,142,247,0.35)]"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  title="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-surface)] hover:text-[var(--color-text-primary)]"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2 rounded-lg sm:rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-1.5">
              {(["all", "theory", "lab"] as const).map((f) => {
                const isActive = filterLab === f;
                return (
                  <button
                    key={f}
                    id={`filter-${f}`}
                    onClick={() => setFilterLab(f)}
                    className={`rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm transition-all ${isActive ? "bg-[var(--color-accent-muted)] font-semibold text-[var(--color-accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"}`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 text-xs sm:text-xs text-[var(--color-text-secondary)]">
            <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1">
              {activeFilterLabel}
            </span>
            <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1">
              {filtered.length} visible
            </span>
            <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1">
              {programs.length} programs linked
            </span>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] shadow-[0_18px_48px_rgba(0,0,0,0.14)]">
          <div className="hidden sm:block">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]/90">
                    {["Code", "Name", "Type", "Program", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-3 sm:px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, idx) => (
                      <tr key={`skeleton-${idx}`} className="border-b border-[var(--color-border)]">
                        <td className="px-4 py-4"><div className="h-4 w-20 rounded bg-[var(--color-bg-elevated)] animate-pulse" /></td>
                        <td className="px-4 py-4"><div className="h-4 w-56 rounded bg-[var(--color-bg-elevated)] animate-pulse" /></td>
                        <td className="px-4 py-4"><div className="h-4 w-20 rounded bg-[var(--color-bg-elevated)] animate-pulse" /></td>
                        <td className="px-4 py-4"><div className="h-4 w-32 rounded bg-[var(--color-bg-elevated)] animate-pulse" /></td>
                        <td className="px-4 py-4" />
                      </tr>
                    ))
                  ) : filtered.length > 0 ? (
                    filtered.map((c, i) => {
                      const prog = programById.get(c.program_id);
                      const programName = prog ? `${prog.department_name} - ${prog.name}` : c.program_name || c.dept || "—";
                      return (
                        <tr
                          key={c.id}
                          id={`course-row-${c.id}`}
                          className={`border-b border-[var(--color-border)] bg-[var(--color-bg-surface)] transition-colors hover:bg-[var(--color-bg-elevated)]/40`}
                        >
                          <td className="px-3 sm:px-4 py-4 align-top">
                            <code
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold tracking-wide ${c.isLab ? "text-[var(--color-lab)] bg-[rgba(163,113,247,0.1)]" : "text-[var(--color-accent)] bg-[var(--color-accent-muted)]"}`}
                            >
                              {c.code}
                            </code>
                          </td>
                          <td className="px-3 sm:px-4 py-4 align-top">
                            <div className="space-y-1">
                              <div className="text-sm font-semibold text-[var(--color-text-primary)]">
                                {c.name}
                              </div>
                              <div className="text-xs text-[var(--color-text-secondary)]">
                                {c.isLab ? "Hands-on lab section" : "Theory-led course"}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 py-4 align-top">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${c.isLab ? "border-[rgba(163,113,247,0.22)] bg-[rgba(163,113,247,0.1)] text-[var(--color-lab)]" : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]"}`}
                            >
                              {c.isLab ? "Lab" : "Theory"}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 py-4 align-top">
                            <div className="text-sm text-[var(--color-text-primary)]">{programName}</div>
                          </td>
                          <td className="px-3 sm:px-4 py-4 align-top">
                            <div className="flex gap-2">
                              <button
                                id={`course-edit-${c.id}`}
                                onClick={() => openEdit(c)}
                                className="rounded-lg border border-[var(--color-border)] bg-transparent px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
                              >
                                Edit
                              </button>
                              <button
                                id={`course-delete-${c.id}`}
                                onClick={() => deleteCourse(c.id)}
                                className="rounded-lg border border-[rgba(248,81,73,0.2)] bg-transparent px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm text-[var(--color-danger)] transition-colors hover:bg-[rgba(248,81,73,0.08)]"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-[var(--color-text-secondary)]">
                        <div className="mx-auto max-w-sm space-y-2">
                          <div className="text-base font-semibold text-[var(--color-text-primary)]">No courses found</div>
                          <p className="text-sm leading-6">
                            Try a different search term or switch to another filter.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="block sm:hidden p-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={`mob-skel-${idx}`}
                  className="mb-3 rounded-lg sm:rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 sm:p-4 animate-pulse"
                >
                  <div className="h-4 w-20 rounded bg-[var(--color-bg-subtle)]" />
                  <div className="mt-3 h-4 w-3/4 rounded bg-[var(--color-bg-subtle)]" />
                  <div className="mt-3 h-3 w-1/2 rounded bg-[var(--color-bg-subtle)]" />
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-xs sm:text-sm text-[var(--color-text-secondary)]">
                <div className="text-base font-semibold text-[var(--color-text-primary)]">No courses found</div>
                <p className="mt-2 text-sm leading-6">Try a different search term or switch to another filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filtered.map((c) => {
                  const prog = programById.get(c.program_id);
                  const programName = prog ? `${prog.department_name} - ${prog.name}` : c.program_name || c.dept || "—";
                  return (
                    <article
                      key={c.id}
                      className="rounded-lg sm:rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-3 sm:p-4 shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1 space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <code className={`inline-flex rounded-full px-3 py-1 text-xs font-bold tracking-wide ${c.isLab ? "text-[var(--color-lab)] bg-[rgba(163,113,247,0.1)]" : "text-[var(--color-accent)] bg-[var(--color-accent-muted)]"}`}>
                              {c.code}
                            </code>
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${c.isLab ? "border-[rgba(163,113,247,0.22)] bg-[rgba(163,113,247,0.1)] text-[var(--color-lab)]" : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]"}`}
                            >
                              {c.isLab ? "Lab" : "Theory"}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">{c.name}</h3>
                            <p className="text-xs leading-5 text-[var(--color-text-secondary)]">
                              Program: {programName}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-col gap-2">
                          <button
                            onClick={() => openEdit(c)}
                            className="rounded-lg border border-[var(--color-border)] bg-transparent px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteCourse(c.id)}
                            className="rounded-lg border border-[rgba(248,81,73,0.2)] px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-[var(--color-danger)] transition-colors hover:bg-[rgba(248,81,73,0.08)]"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 sm:p-4 md:p-6 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowModal(false);
            }}
          >
            <div className="w-full max-w-xl sm:max-w-2xl rounded-2xl sm:rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] shadow-[0_28px_80px_rgba(0,0,0,0.4)] max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-3 sm:gap-4 border-b border-[var(--color-border)] px-4 sm:px-5 lg:px-6 py-3 sm:py-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
                    {editingId ? "Edit Course" : "Add Course"}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-[var(--color-text-secondary)]">
                    Keep the course code unique and choose the correct program before saving.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-lg p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
                  aria-label="Close modal"
                >
                  <FiX size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="modal-course-code"
                    className="mb-2 block text-xs sm:text-sm font-medium text-[var(--color-text-secondary)]"
                  >
                    Course Code
                  </label>
                  <input
                    id="modal-course-code"
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. CSE401"
                    className="w-full rounded-lg sm:rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-[var(--color-text-primary)] outline-none transition-colors focus:border-[rgba(79,142,247,0.35)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="modal-course-name"
                    className="mb-2 block text-xs sm:text-sm font-medium text-[var(--color-text-secondary)]"
                  >
                    Course Name
                  </label>
                  <input
                    id="modal-course-name"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Compiler Design"
                    className="w-full rounded-lg sm:rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-[var(--color-text-primary)] outline-none transition-colors focus:border-[rgba(79,142,247,0.35)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="modal-course-dept"
                    className="mb-2 block text-xs sm:text-sm font-medium text-[var(--color-text-secondary)]"
                  >
                    Program
                  </label>
                  <select
                    id="modal-course-dept"
                    value={newProgramId}
                    onChange={(e) => setNewProgramId(e.target.value)}
                    className="w-full rounded-lg sm:rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-[var(--color-text-primary)] outline-none transition-colors focus:border-[rgba(79,142,247,0.35)]"
                  >
                    <option value="" disabled>
                      Select Program
                    </option>
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.department_name} - {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  className={`flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-2xl border px-3 sm:px-4 py-2 sm:py-3 text-left transition-colors ${newIsLab ? "border-[rgba(163,113,247,0.24)] bg-[rgba(163,113,247,0.08)]" : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-subtle)]"}`}
                  onClick={() => setNewIsLab(!newIsLab)}
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${newIsLab ? "border-0 bg-[#a371f7]" : "border-2 border-[var(--color-border)] bg-transparent"}`}
                  >
                    {newIsLab && (
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-[var(--color-text-primary)]">
                      This is a Lab course
                    </div>
                    <div className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                      Mark practical or lab-oriented entries.
                    </div>
                  </div>
                </button>

                <div className="md:col-span-2 flex flex-col gap-2 sm:gap-3 pt-2 sm:pt-3 sm:flex-row">
                  <button
                    id="modal-course-cancel"
                    onClick={() => setShowModal(false)}
                    className="flex-1 rounded-lg sm:rounded-xl border border-[var(--color-border)] bg-transparent px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)]"
                  >
                    Cancel
                  </button>
                  <button
                    id="modal-course-save"
                    onClick={saveCourse}
                    disabled={saving || !newCode || !newProgramId}
                    className="flex-1 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-[0_12px_28px_rgba(79,142,247,0.22)] transition-all duration-200 hover:translate-y-[-1px] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {saving ? "Saving..." : editingId ? "Save Changes" : "Save Course"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
