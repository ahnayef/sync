"use client";

import { useState } from "react";

const INITIAL = [
  {
    id: 1,
    code: "CSE301",
    title: "Data Structures",
    isLab: false,
    credits: 3,
    dept: "CSE",
  },
  {
    id: 2,
    code: "CSE301L",
    title: "Data Structures Lab",
    isLab: true,
    credits: 1,
    dept: "CSE",
  },
  {
    id: 3,
    code: "CSE303",
    title: "Operating Systems",
    isLab: false,
    credits: 3,
    dept: "CSE",
  },
  {
    id: 4,
    code: "CSE315L",
    title: "OS Lab",
    isLab: true,
    credits: 1,
    dept: "CSE",
  },
  {
    id: 5,
    code: "CSE405",
    title: "Software Engineering",
    isLab: false,
    credits: 3,
    dept: "CSE",
  },
  {
    id: 6,
    code: "MAT201",
    title: "Discrete Mathematics",
    isLab: false,
    credits: 3,
    dept: "Math",
  },
  {
    id: 7,
    code: "HUM201",
    title: "Technical Writing",
    isLab: false,
    credits: 2,
    dept: "HUM",
  },
  {
    id: 8,
    code: "CSE311L",
    title: "Networks Lab",
    isLab: true,
    credits: 1,
    dept: "CSE",
  },
];

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState(INITIAL);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newIsLab, setNewIsLab] = useState(false);
  const [filterLab, setFilterLab] = useState<"all" | "lab" | "theory">("all");

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filterLab === "all" ? true : filterLab === "lab" ? c.isLab : !c.isLab;
    return matchSearch && matchFilter;
  });

  const addCourse = () => {
    if (!newCode || !newTitle) return;
    setCourses([
      ...courses,
      {
        id: Date.now(),
        code: newCode.toUpperCase(),
        title: newTitle,
        isLab: newIsLab,
        credits: newIsLab ? 1 : 3,
        dept: "CSE",
      },
    ]);
    setNewCode("");
    setNewTitle("");
    setNewIsLab(false);
    setShowModal(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[var(--color-text-primary)] mb-1">
            Course Management
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {courses.length} courses registered
          </p>
        </div>
        <button
          id="add-course-btn"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] px-4 py-2.5 text-sm font-semibold text-white"
        >
          + Add Course
        </button>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-[400px]">
          <input
            id="course-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 pr-4 pl-10 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <div className="flex gap-2 p-1 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">
          {(["all", "theory", "lab"] as const).map((f) => (
            <button
              key={f}
              id={`filter-${f}`}
              onClick={() => setFilterLab(f)}
              className={`px-3 py-1.5 rounded-md text-sm ${filterLab === f ? "font-semibold text-white bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7]" : "font-normal text-[var(--color-text-secondary)] bg-transparent"}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)]">
              {["Code", "Title", "Type", "Credits", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr
                key={c.id}
                id={`course-row-${c.id}`}
                className={`border-b ${i < filtered.length - 1 ? "border-[var(--color-border)]" : ""} bg-[var(--color-bg-surface)]`}
              >
                <td className="px-4 py-3">
                  <code
                    className={`text-xs font-bold px-2 py-0.5 rounded ${c.isLab ? "text-[var(--color-lab)] bg-[rgba(163,113,247,0.1)]" : "text-[var(--color-accent)] bg-[var(--color-accent-muted)]"}`}
                  >
                    {c.code}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-[var(--color-text-primary)]">
                    {c.title}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[11px] font-bold tracking-wider px-2 py-0.5 rounded uppercase ${c.isLab ? "text-[var(--color-lab)] bg-[rgba(163,113,247,0.1)] border-[rgba(163,113,247,0.3)]" : "text-[var(--color-text-secondary)] bg-[var(--color-bg-elevated)] border border-[var(--color-border)]"}`}
                  >
                    {c.isLab ? "Lab" : "Theory"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {c.credits} cr
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      id={`course-edit-${c.id}`}
                      className="px-3 py-1.5 rounded-md border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-sm"
                    >
                      Edit
                    </button>
                    <button
                      id={`course-delete-${c.id}`}
                      onClick={() =>
                        setCourses(courses.filter((x) => x.id !== c.id))
                      }
                      className="px-3 py-1.5 rounded-md border border-red-300 bg-red-50 text-red-500 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="w-full max-w-[440px] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-8">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-6">
              Add Course
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="modal-course-code"
                  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"
                >
                  Course Code
                </label>
                <input
                  id="modal-course-code"
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. CSE401"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="modal-course-title"
                  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"
                >
                  Course Title
                </label>
                <input
                  id="modal-course-title"
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Compiler Design"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none"
                />
              </div>
              <div
                className={`flex items-center gap-3 p-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] cursor-pointer`}
                onClick={() => setNewIsLab(!newIsLab)}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${newIsLab ? "bg-purple-500 border-0" : "bg-transparent border-2 border-[var(--color-border)]"}`}
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
                <span className="text-sm text-[var(--color-text-primary)]">
                  This is a Lab course
                </span>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  id="modal-course-cancel"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)]"
                >
                  Cancel
                </button>
                <button
                  id="modal-course-save"
                  onClick={addCourse}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] text-white font-semibold"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
