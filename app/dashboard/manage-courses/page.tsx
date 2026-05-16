"use client";

import { useState, useEffect } from "react";

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newIsLab, setNewIsLab] = useState(false);
  const [newDeptId, setNewDeptId] = useState<string>("");
  const [filterLab, setFilterLab] = useState<"all" | "lab" | "theory">("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [courseRes, deptRes] = await Promise.all([
        fetch("/api/courses"),
        fetch("/api/departments")
      ]);
      const [courseData, deptData] = await Promise.all([
        courseRes.json(),
        deptRes.json()
      ]);
      if (courseRes.ok) setCourses(courseData);
      if (deptRes.ok) setDepartments(deptData);
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
    const matchSearch =
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dept.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filterLab === "all" ? true : filterLab === "lab" ? c.isLab : !c.isLab;
    return matchSearch && matchFilter;
  });

  const openAdd = () => {
    setEditingId(null);
    setNewCode("");
    setNewName("");
    setNewIsLab(false);
    setNewDeptId(departments[0]?.id || "");
    setShowModal(true);
  };

  const openEdit = (course: any) => {
    setEditingId(course.id);
    setNewCode(course.code);
    setNewName(course.name || "");
    setNewIsLab(course.isLab);
    setNewDeptId(course.department_id);
    setShowModal(true);
  };

  const saveCourse = async () => {
    if (!newCode || !newDeptId) return;
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const payload = editingId 
        ? { id: editingId, code: newCode, name: newName, isLab: newIsLab, departmentId: newDeptId }
        : { code: newCode, name: newName, isLab: newIsLab, departmentId: newDeptId };
        
      const res = await fetch("/api/courses", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Failed to save course");
      } else {
        await fetchData();
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
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
        alert(err.error || "Failed to delete");
      } else {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
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
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99]"
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
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${filterLab === f ? "font-semibold text-[var(--color-accent)] bg-[var(--color-accent-muted)] border border-[rgba(79,142,247,0.2)]" : "font-normal text-[var(--color-text-secondary)] bg-transparent hover:bg-[var(--color-bg-surface)]"}`}
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
              {["Code", "Name", "Type", "Actions"].map((h) => (
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
                    {c.name}
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
                  <div className="flex gap-2">
                    <button
                      id={`course-edit-${c.id}`}
                      onClick={() => openEdit(c)}
                      className="px-3 py-1.5 rounded-md border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-sm"
                    >
                      Edit
                    </button>
                    <button
                      id={`course-delete-${c.id}`}
                      onClick={() => deleteCourse(c.id)}
                      className="px-3 py-1.5 rounded-md border border-[rgba(248,81,73,0.2)] bg-transparent text-[var(--color-danger)] text-sm transition-colors hover:bg-[rgba(248,81,73,0.06)]"
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
              {editingId ? "Edit Course" : "Add Course"}
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
                  htmlFor="modal-course-name"
                  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"
                >
                  Course Name
                </label>
                <input
                  id="modal-course-name"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Compiler Design"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="modal-course-dept"
                  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"
                >
                  Department
                </label>
                <select
                  id="modal-course-dept"
                  value={newDeptId}
                  onChange={(e) => setNewDeptId(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none"
                >
                  <option value="" disabled>Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.fullName})
                    </option>
                  ))}
                </select>
              </div>

              <div
                className={`flex items-center gap-3 p-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] cursor-pointer`}
                onClick={() => setNewIsLab(!newIsLab)}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${newIsLab ? "bg-[#a371f7] border-0" : "bg-transparent border-2 border-[var(--color-border)]"}`}
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
                  onClick={saveCourse}
                  disabled={saving || !newCode || !newDeptId}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--color-accent)] text-white font-semibold shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : (editingId ? "Save Changes" : "Save")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
