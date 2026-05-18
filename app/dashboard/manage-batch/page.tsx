"use client";

import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function ManageBatchPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newSession, setNewSession] = useState("");
  const [newDeptId, setNewDeptId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [batchRes, deptRes] = await Promise.all([
        fetch("/api/batches"),
        fetch("/api/departments")
      ]);
      const [batchData, deptData] = await Promise.all([
        batchRes.json(),
        deptRes.json()
      ]);
      if (batchRes.ok) setBatches(batchData);
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

  const departmentById = useMemo(() => new Map(departments.map((d) => [d.id, d])), [departments]);

  const batchCount = batches.length;
  const departmentCount = departments.length;

  const filtered = batches.filter((b) => {
    const deptName = departmentById.get(b.department_id)?.name || b.dept || "";
    return (
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.session.toLowerCase().includes(search.toLowerCase()) ||
      deptName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const openAdd = () => {
    setEditingId(null);
    setNewName("");
    setNewSession("");
    setNewDeptId(departments[0]?.id || "");
    setShowModal(true);
  };

  const openEdit = (batch: any) => {
    setEditingId(batch.id);
    setNewName(batch.name);
    setNewSession(batch.session);
    setNewDeptId(batch.department_id);
    setShowModal(true);
  };

  const saveBatch = async () => {
    if (!newName || !newSession || !newDeptId) return;
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const payload = editingId 
        ? { id: editingId, name: newName, session: newSession, departmentId: newDeptId }
        : { name: newName, session: newSession, departmentId: newDeptId };
        
      const res = await fetch("/api/batches", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Failed to save batch");
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

  const deleteBatch = async (id: number) => {
    if (!confirm("Are you sure you want to delete this batch? All schedules for this batch will be removed!")) return;
    try {
      const res = await fetch(`/api/batches?id=${id}`, { method: "DELETE" });
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
    <div className="relative p-4 sm:p-6 lg:p-8">
      <div className="relative mx-auto max-w-7xl space-y-6">
        <section className="glass relative overflow-hidden rounded-3xl border border-[var(--color-border)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.16)] sm:p-6 lg:p-7">
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-[26px] font-bold text-[var(--color-text-primary)]">Batch Management</h1>
              <p className="text-sm text-[var(--color-text-secondary)]">Create and manage batches, their sessions, and linked departments.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3 py-2 text-xs text-[var(--color-text-secondary)]">
                {batchCount} batches • {departmentCount} departments
              </div>
              <button id="add-batch-btn" onClick={openAdd} className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99]">
                + Add Batch
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.12)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-[520px]">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input id="batch-search" type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search batches by name, session, or department" className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-3 pr-12 pl-11 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]" />
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
                  {["Name", "Session", "Department", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr key={b.id} id={`batch-row-${b.id}`} className={`border-b ${i < filtered.length - 1 ? "border-[var(--color-border)]" : ""} bg-[var(--color-bg-surface)]`}>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-[var(--color-text-primary)]">{b.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[var(--color-text-secondary)]">{b.session}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-[var(--color-text-primary)]">{departmentById.get(b.department_id)?.name || b.dept || "—"}</div>
                    </td>
                    <td className="px-4 py-3 w-[160px]">
                      <div className="flex gap-2">
                        <button id={`batch-edit-${b.id}`} onClick={() => openEdit(b)} className="px-3 py-1.5 rounded-md border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-sm transition-colors hover:bg-[var(--color-bg-elevated)]">Edit</button>
                        <button id={`batch-delete-${b.id}`} onClick={() => deleteBatch(b.id)} className="px-3 py-1.5 rounded-md border border-[rgba(248,81,73,0.2)] bg-transparent text-[var(--color-danger)] text-sm transition-colors hover:bg-[rgba(248,81,73,0.06)]">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-[var(--color-text-secondary)]">No batches found.</td>
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
                  <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">{editingId ? "Edit Batch" : "Add Batch"}</h2>
                  <p className="text-sm text-[var(--color-text-secondary)]">Provide batch name, session and assign the department.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]" aria-label="Close modal"><FiX /></button>
              </div>
              <div className="flex flex-col gap-4 pt-4">
                <div>
                  <label htmlFor="modal-batch-name" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Batch Name</label>
                  <input id="modal-batch-name" type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. CSE 21" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-3 px-3 text-sm text-[var(--color-text-primary)] outline-none" />
                </div>
                <div>
                  <label htmlFor="modal-batch-session" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Session</label>
                  <input id="modal-batch-session" type="text" value={newSession} onChange={(e) => setNewSession(e.target.value)} placeholder="e.g. 2021-2025" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-3 px-3 text-sm text-[var(--color-text-primary)] outline-none" />
                </div>
                <div>
                  <label htmlFor="modal-batch-dept" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Department</label>
                  <select id="modal-batch-dept" value={newDeptId} onChange={(e) => setNewDeptId(e.target.value)} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-3 px-3 text-sm text-[var(--color-text-primary)] outline-none">
                    <option value="" disabled>Select Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name} ({d.fullName})</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 mt-2">
                  <button id="modal-batch-cancel" onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-[var(--color-border)] bg-transparent px-4 py-3 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)]">Cancel</button>
                  <button id="modal-batch-save" onClick={saveBatch} disabled={saving || !newName || !newSession || !newDeptId} className="flex-1 rounded-xl bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed">{saving ? "Saving..." : (editingId ? "Save Changes" : "Save")}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
