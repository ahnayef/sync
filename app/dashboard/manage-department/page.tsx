"use client";

import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useToast } from "@/components/Toast";

export default function ManageDepartmentPage() {
  const toast = useToast();
  const [departments, setDepartments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchDepartments = async () => {
    try {
      const res = await fetch("/api/departments");
      const data = await res.json();
      if (res.ok) {
        setDepartments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const departmentCount = departments.length;
  const filtered = departments.filter((d) => {
    return (
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.fullName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const openAdd = () => {
    setEditingId(null);
    setNewName("");
    setNewFullName("");
    setShowModal(true);
  };

  const openEdit = (dept: any) => {
    setEditingId(dept.id);
    setNewName(dept.name);
    setNewFullName(dept.fullName);
    setShowModal(true);
  };

  const saveDepartment = async () => {
    if (!newName || !newFullName) return;
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const payload = editingId
        ? { id: editingId, name: newName, fullName: newFullName }
        : { name: newName, fullName: newFullName };

      const res = await fetch("/api/departments", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "Failed to save department");
      } else {
        await fetchDepartments();
        toast.success(editingId ? "Department updated successfully" : "Department added successfully");
        setNewName("");
        setNewFullName("");
        setEditingId(null);
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const deleteDepartment = async (id: number) => {
    if (!confirm("Are you sure you want to delete this department? This will also delete related courses and batches!")) return;
    try {
      const res = await fetch(`/api/departments?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to delete");
      } else {
        await fetchDepartments();
        toast.success("Department deleted successfully");
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
              <h1 className="text-xl sm:text-2xl md:text-[24px] lg:text-[26px] font-bold text-[var(--color-text-primary)]">Department Management</h1>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">Create and maintain department short names and full names.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="hidden sm:block rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3 sm:px-4 py-2 text-xs sm:text-xs text-[var(--color-text-secondary)]">
                {departmentCount} departments
              </div>
              <button id="add-dept-btn" onClick={openAdd} className="inline-flex items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-[var(--color-accent)] px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99]">
                + Add Department
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl sm:rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-3 sm:p-4 lg:p-5 shadow-[0_18px_48px_rgba(0,0,0,0.12)]">
          <div className="flex flex-col gap-3">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-sm" />
              <input id="dept-search" type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search departments..." className="w-full rounded-lg sm:rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 sm:py-3 pr-3 sm:pr-4 pl-9 sm:pl-11 text-xs sm:text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]" />
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
                  {["Short Name", "Full Name", "Actions"].map((h) => (
                    <th key={h} className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => (
                  <tr key={d.id} id={`dept-row-${d.id}`} className={`border-b-1 border-[var(--color-border)] bg-[var(--color-bg-surface)] transition-colors hover:bg-[var(--color-bg-elevated)]/40`}>
                    <td className="px-3 sm:px-4 py-3">
                      <code className="text-xs font-bold px-2 py-0.5 rounded text-[var(--color-accent)] bg-[var(--color-accent-muted)]">{d.name}</code>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <span className="text-xs sm:text-sm text-[var(--color-text-primary)]">{d.fullName}</span>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex gap-2">
                        <button id={`dept-edit-${d.id}`} onClick={() => openEdit(d)} className="px-2.5 py-1.5 rounded-md border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-xs sm:text-sm transition-colors hover:bg-[var(--color-bg-elevated)]">Edit</button>
                        <button id={`dept-delete-${d.id}`} onClick={() => deleteDepartment(d.id)} className="px-2.5 py-1.5 rounded-md border border-[rgba(248,81,73,0.2)] bg-transparent text-[var(--color-danger)] text-xs sm:text-sm transition-colors hover:bg-[rgba(248,81,73,0.06)]">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-xs sm:text-sm text-[var(--color-text-secondary)]">No departments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View - Cards */}
          <div className="sm:hidden">
            {filtered.length > 0 ? (
              <div className="space-y-3 p-3">
                {filtered.map((d) => (
                  <div key={d.id} id={`dept-row-${d.id}`} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <code className="text-xs font-bold px-2 py-0.5 rounded text-[var(--color-accent)] bg-[var(--color-accent-muted)] inline-block">{d.name}</code>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--color-text-primary)] font-medium">{d.fullName}</p>
                    <div className="flex gap-2 pt-2">
                      <button id={`dept-edit-${d.id}`} onClick={() => openEdit(d)} className="flex-1 px-2 py-1.5 rounded-md border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-xs transition-colors hover:bg-[var(--color-bg-surface)]">Edit</button>
                      <button id={`dept-delete-${d.id}`} onClick={() => deleteDepartment(d.id)} className="flex-1 px-2 py-1.5 rounded-md border border-[rgba(248,81,73,0.2)] bg-transparent text-[var(--color-danger)] text-xs transition-colors hover:bg-[rgba(248,81,73,0.06)]">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-xs text-[var(--color-text-secondary)]">No departments found.</div>
            )}
          </div>
        </section>

        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
            <div className="w-full max-w-xl sm:max-w-2xl rounded-2xl sm:rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 sm:p-5 lg:p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-3 sm:gap-4 border-b border-[var(--color-border)] pb-3 sm:pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)] mb-1">{editingId ? "Edit Department" : "Add Department"}</h2>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">Provide short and full department names.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="rounded-lg p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]" aria-label="Close modal"><FiX size={18} /></button>
              </div>
              <div className="flex flex-col gap-3 sm:gap-4 pt-4 sm:pt-5">
                <div>
                  <label htmlFor="modal-dept-name" className="block text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] mb-2">Short Name</label>
                  <input id="modal-dept-name" type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. CSE" className="w-full rounded-lg sm:rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]" />
                </div>
                <div>
                  <label htmlFor="modal-dept-fullname" className="block text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] mb-2">Full Name</label>
                  <input id="modal-dept-fullname" type="text" value={newFullName} onChange={(e) => setNewFullName(e.target.value)} placeholder="e.g. Computer Science & Engineering" className="w-full rounded-lg sm:rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]" />
                </div>
                <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-3">
                  <button id="modal-dept-cancel" onClick={() => setShowModal(false)} className="flex-1 rounded-lg sm:rounded-xl border border-[var(--color-border)] bg-transparent px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)]">Cancel</button>
                  <button id="modal-dept-save" onClick={saveDepartment} disabled={saving || !newName || !newFullName} className="flex-1 rounded-lg sm:rounded-xl bg-[var(--color-accent)] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed">{saving ? "Saving..." : (editingId ? "Save Changes" : "Save")}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
