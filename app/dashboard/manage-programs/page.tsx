"use client";

import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function ManageProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newDepartmentId, setNewDepartmentId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [progRes, deptRes] = await Promise.all([
        fetch("/api/programs"),
        fetch("/api/departments")
      ]);
      if (progRes.ok) setPrograms(await progRes.json());
      if (deptRes.ok) setDepartments(await deptRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const programCount = programs.length;
  const filtered = programs.filter((p) => {
    return (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.department_name && p.department_name.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const openAdd = () => {
    setEditingId(null);
    setNewName("");
    setNewDepartmentId(departments[0]?.id || "");
    setShowModal(true);
  };

  const openEdit = (prog: any) => {
    setEditingId(prog.id);
    setNewName(prog.name);
    setNewDepartmentId(prog.department_id);
    setShowModal(true);
  };

  const saveProgram = async () => {
    if (!newName || !newDepartmentId) return;
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const payload = editingId
        ? { id: editingId, name: newName, departmentId: newDepartmentId }
        : { name: newName, departmentId: newDepartmentId };

      const res = await fetch("/api/programs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "Failed to save program");
      } else {
        await fetchData();
        toast.success(editingId ? "Program updated successfully" : "Program added successfully");
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const deleteProgram = async (id: number) => {
    if (!confirm("Are you sure you want to delete this program? This will also delete related courses and batches!")) return;
    try {
      const res = await fetch(`/api/programs?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to delete");
      } else {
        await fetchData();
        toast.success("Program deleted successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    }
  };

  return (
    <div className="relative p-4 sm:p-6 md:p-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 sm:h-56 bg-[radial-gradient(circle_at_top_left,rgba(111,147,218,0.16),transparent_36%),radial-gradient(circle_at_top_right,rgba(163,113,247,0.12),transparent_28%)]" />
      <div className="relative mx-auto max-w-7xl space-y-4 sm:space-y-6">
        <section className="glass relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--color-border)] p-4 sm:p-5 lg:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.16)]">
          <div className="relative flex flex-col gap-4 sm:gap-6">
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-xl sm:text-2xl md:text-[24px] lg:text-[26px] font-bold text-[var(--color-text-primary)]">Program Management</h1>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">Create and maintain programs under departments.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="hidden sm:block rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3 sm:px-4 py-2 text-xs sm:text-xs text-[var(--color-text-secondary)]">
                {programCount} programs
              </div>
              <button id="add-prog-btn" onClick={openAdd} className="inline-flex items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-[var(--color-accent)] px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99]">
                + Add Program
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl sm:rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-3 sm:p-4 lg:p-5 shadow-[0_18px_48px_rgba(0,0,0,0.12)]">
          <div className="flex flex-col gap-3">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-sm" />
              <input id="program-search" type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search programs..." className="w-full rounded-lg sm:rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 sm:py-3 pr-3 sm:pr-4 pl-9 sm:pl-11 text-xs sm:text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]" />
              {search && (
                <button onClick={() => setSearch("")} title="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-surface)] hover:text-[var(--color-text-primary)]">
                  <FiX size={16} />
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] shadow-[0_18px_48px_rgba(0,0,0,0.14)]">
          {/* Desktop View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[var(--color-bg-elevated)]/90 border-b border-[var(--color-border)]">
                  {["Name", "Department", "Actions"].map((h) => (
                    <th key={h} className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} id={`prog-row-${p.id}`} className={`border-b-1 border-[var(--color-border)] bg-[var(--color-bg-surface)] transition-colors hover:bg-[var(--color-bg-elevated)]/40`}>
                    <td className="px-3 sm:px-4 py-3">
                      <code className="text-xs font-bold px-2 py-0.5 rounded text-[var(--color-accent)] bg-[var(--color-accent-muted)]">{p.name}</code>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <span className="text-xs sm:text-sm text-[var(--color-text-primary)]">{p.department_name}</span>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex gap-2">
                        <button id={`prog-edit-${p.id}`} onClick={() => openEdit(p)} className="px-2.5 py-1.5 rounded-md border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-xs sm:text-sm transition-colors hover:bg-[var(--color-bg-elevated)]">Edit</button>
                        <button id={`prog-delete-${p.id}`} onClick={() => deleteProgram(p.id)} className="px-2.5 py-1.5 rounded-md border border-[rgba(248,81,73,0.2)] bg-transparent text-[var(--color-danger)] text-xs sm:text-sm transition-colors hover:bg-[rgba(248,81,73,0.06)]">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-xs sm:text-sm text-[var(--color-text-secondary)]">No programs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View - Cards */}
          <div className="sm:hidden">
            {filtered.length > 0 ? (
              <div className="space-y-3 p-3">
                {filtered.map((p) => (
                  <div key={p.id} id={`prog-row-${p.id}`} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <code className="text-xs font-bold px-2 py-0.5 rounded text-[var(--color-accent)] bg-[var(--color-accent-muted)] inline-block">{p.name}</code>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--color-text-primary)] font-medium">{p.department_name}</p>
                    <div className="flex gap-2 pt-2">
                      <button id={`prog-edit-${p.id}`} onClick={() => openEdit(p)} className="flex-1 px-2 py-1.5 rounded-md border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-xs transition-colors hover:bg-[var(--color-bg-surface)]">Edit</button>
                      <button id={`prog-delete-${p.id}`} onClick={() => deleteProgram(p.id)} className="flex-1 px-2 py-1.5 rounded-md border border-[rgba(248,81,73,0.2)] bg-transparent text-[var(--color-danger)] text-xs transition-colors hover:bg-[rgba(248,81,73,0.06)]">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-xs text-[var(--color-text-secondary)]">No programs found.</div>
            )}
          </div>
        </section>

        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
            <div className="w-full max-w-xl sm:max-w-2xl rounded-2xl sm:rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 sm:p-5 lg:p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-3 sm:gap-4 border-b border-[var(--color-border)] pb-3 sm:pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)] mb-1">{editingId ? "Edit Program" : "Add Program"}</h2>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">Provide name and assign to a department.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="rounded-lg p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]" aria-label="Close modal"><FiX size={18} /></button>
              </div>
              <div className="flex flex-col gap-3 sm:gap-4 pt-4 sm:pt-5">
                <div>
                  <label htmlFor="modal-prog-name" className="block text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] mb-2">Program Name</label>
                  <input id="modal-prog-name" type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. B.Sc in CSE" className="w-full rounded-lg sm:rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]" />
                </div>
                <div>
                  <label htmlFor="modal-prog-dept" className="block text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] mb-2">Department</label>
                  <select id="modal-prog-dept" value={newDepartmentId} onChange={(e) => setNewDepartmentId(e.target.value)} className="w-full rounded-lg sm:rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base text-[var(--color-text-primary)] outline-none">
                    <option value="" disabled>Select Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name} ({d.fullName})</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-3">
                  <button id="modal-prog-cancel" onClick={() => setShowModal(false)} className="flex-1 rounded-lg sm:rounded-xl border border-[var(--color-border)] bg-transparent px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)]">Cancel</button>
                  <button id="modal-prog-save" onClick={saveProgram} disabled={saving || !newName || !newDepartmentId} className="flex-1 rounded-lg sm:rounded-xl bg-[var(--color-accent)] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed">{saving ? "Saving..." : (editingId ? "Save Changes" : "Save")}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
