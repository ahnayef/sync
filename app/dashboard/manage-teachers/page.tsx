"use client";

import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function ManageTeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [newName, setNewName] = useState("");
  const [newShort, setNewShort] = useState("");
  const [newDeptId, setNewDeptId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [teacherRes, deptRes] = await Promise.all([
        fetch("/api/teachers"),
        fetch("/api/departments")
      ]);
      const [teacherData, deptData] = await Promise.all([
        teacherRes.json(),
        deptRes.json()
      ]);
      if (teacherRes.ok) setTeachers(teacherData);
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

  const departmentById = useMemo(
    () => new Map(departments.map((d) => [d.id, d])),
    [departments]
  );

  const filtered = teachers.filter((t) => {
    const deptName = departmentById.get(t.department_id)?.name || t.dept || "";
    return (
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.short.toLowerCase().includes(search.toLowerCase()) ||
      deptName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const teacherCount = teachers.length;
  const departmentCount = departments.length;

  const openAdd = () => {
    setEditingId(null);
    setNewName("");
    setNewShort("");
    setNewDeptId(departments[0]?.id || "");
    setShowModal(true);
  };

  const openEdit = (teacher: any) => {
    setEditingId(teacher.id);
    setNewName(teacher.name);
    setNewShort(teacher.short);
    setNewDeptId(teacher.department_id);
    setShowModal(true);
  };

  const saveTeacher = async () => {
    if (!newName || !newShort || !newDeptId) return;
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const payload = editingId 
        ? { id: editingId, name: newName, short: newShort, departmentId: newDeptId }
        : { name: newName, short: newShort, departmentId: newDeptId };
        
      const res = await fetch("/api/teachers", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Failed to save teacher");
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

  const deleteTeacher = async (id: number) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;
    try {
      const res = await fetch(`/api/teachers?id=${id}`, { method: "DELETE" });
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
  
  const AVATAR_BG = [
    "bg-[var(--color-accent-muted)] text-[var(--color-accent)]",
    "bg-[rgba(63,185,80,0.1)] text-[var(--color-success)]",
    "bg-[rgba(163,113,247,0.1)] text-[var(--color-lab)]",
    "bg-[rgba(210,153,34,0.1)] text-[var(--color-warning)]",
    "bg-[rgba(248,81,73,0.08)] text-[var(--color-danger)]",
    "bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)]",
  ];
  const getAvatarClass = (id: number) => AVATAR_BG[id % AVATAR_BG.length];

  return (
    <div className="relative p-4 sm:p-6 lg:p-8">
      <div className="relative mx-auto max-w-7xl space-y-6">
        <section className="glass relative overflow-hidden rounded-3xl border border-[var(--color-border)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.16)] sm:p-6 lg:p-7">
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-[26px] font-bold text-[var(--color-text-primary)]">Teacher Management</h1>
              <p className="text-sm text-[var(--color-text-secondary)]">Manage teachers, their short codes, and department assignments.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3 py-2 text-xs text-[var(--color-text-secondary)]">
                {teacherCount} teachers • {departmentCount} departments
              </div>
              <button id="add-teacher-btn" onClick={openAdd} className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99]">
                + Add Teacher
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.12)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-[520px]">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input id="teacher-search" type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search teachers by name, short form, or department" className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-3 pr-12 pl-11 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]" />
              {search && (
                <button onClick={() => setSearch("")} title="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-surface)] hover:text-[var(--color-text-primary)]">
                  <FiX />
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)]">
                  {["Name", "Short Form", "Department", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr key={t.id} id={`teacher-row-${t.id}`} className={`border-b ${i < filtered.length - 1 ? 'border-[var(--color-border)]' : ''} bg-[var(--color-bg-surface)]`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`${getAvatarClass(t.id)} w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white`}>{t.name?.charAt(0) || "?"}</div>
                        <span className="text-sm font-medium text-[var(--color-text-primary)] truncate">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs font-semibold text-[var(--color-accent)] bg-[var(--color-accent-muted)] px-2 py-0.5 rounded">{t.short}</code>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-[var(--color-text-primary)]">{departmentById.get(t.department_id)?.name || t.dept || "—"}</div>
                    </td>
                    <td className="px-4 py-3 w-[160px]">
                      <div className="flex gap-2">
                        <button id={`teacher-edit-${t.id}`} onClick={() => openEdit(t)} className="px-3 py-1.5 rounded-md border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-sm transition-colors hover:bg-[var(--color-bg-elevated)]">Edit</button>
                        <button id={`teacher-delete-${t.id}`} onClick={() => deleteTeacher(t.id)} className="px-3 py-1.5 rounded-md border border-[rgba(248,81,73,0.2)] bg-transparent text-[var(--color-danger)] text-sm transition-colors hover:bg-[rgba(248,81,73,0.06)]">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-[var(--color-text-secondary)]">
                      No teachers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
            <div className="w-full max-w-2xl rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6">
              <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] pb-4">
                <div>
                  <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">{editingId ? "Edit Teacher" : "Add Teacher"}</h2>
                  <p className="text-sm text-[var(--color-text-secondary)]">Provide full name, unique short form, and select department.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]" aria-label="Close modal"><FiX /></button>
              </div>
              <div className="flex flex-col gap-4 pt-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Full Name</label>
                  <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Dr. Jane Smith" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-3 px-3 text-sm text-[var(--color-text-primary)] outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Short Form (Unique)</label>
                    <input type="text" value={newShort} onChange={(e) => setNewShort(e.target.value)} placeholder="e.g. DR. SMITH" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-3 px-3 text-sm text-[var(--color-text-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Department</label>
                    <select value={newDeptId} onChange={(e) => setNewDeptId(e.target.value)} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-3 px-3 text-sm text-[var(--color-text-primary)] outline-none">
                      <option value="" disabled>Select Department</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name} ({d.fullName})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-2">
                  <button id="modal-cancel" onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-[var(--color-border)] bg-transparent px-4 py-3 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)]">Cancel</button>
                  <button id="modal-save" onClick={saveTeacher} disabled={saving || !newName || !newShort || !newDeptId} className="flex-1 rounded-xl bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed">
                    {saving ? "Saving..." : (editingId ? "Save Changes" : "Save")}
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
