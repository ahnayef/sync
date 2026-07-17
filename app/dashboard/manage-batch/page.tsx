"use client";

import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiX, FiDownloadCloud } from "react-icons/fi";
import ImportWizard from "@/components/ImportWizard";

export default function ManageBatchPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newSession, setNewSession] = useState("");
  const [newProgramId, setNewProgramId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [batchRes, progRes] = await Promise.all([
        fetch("/api/batches"),
        fetch("/api/programs")
      ]);
      const [batchData, progData] = await Promise.all([
        batchRes.json(),
        progRes.json()
      ]);
      if (batchRes.ok) setBatches(batchData);
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

  const programById = useMemo(() => new Map(programs.map((p) => [p.id, p])), [programs]);

  const batchCount = batches.length;
  const programCount = programs.length;

  const filtered = batches.filter((b) => {
    const progName = programById.get(b.program_id)?.name || b.program_name || "";
    return (
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.session.toLowerCase().includes(search.toLowerCase()) ||
      progName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const openAdd = () => {
    setEditingId(null);
    setNewName("");
    setNewSession("");
    setNewProgramId(programs[0]?.id || "");
    setShowModal(true);
  };

  const openEdit = (batch: any) => {
    setEditingId(batch.id);
    setNewName(batch.name);
    setNewSession(batch.session);
    setNewProgramId(batch.program_id);
    setShowModal(true);
  };

  const saveBatch = async () => {
    if (!newName || !newSession || !newProgramId) return;
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const payload = editingId
        ? { id: editingId, name: newName, session: newSession, programId: newProgramId }
        : { name: newName, session: newSession, programId: newProgramId };

      const res = await fetch("/api/batches", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "Failed to save batch");
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

  const deleteBatch = async (id: number) => {
    if (!confirm("Are you sure you want to delete this batch? All schedules for this batch will be removed!")) return;
    try {
      const res = await fetch(`/api/batches?id=${id}`, { method: "DELETE" });
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
    <div className="relative p-4 sm:p-6 md:p-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 sm:h-56 bg-[radial-gradient(circle_at_top_left,rgba(111,147,218,0.16),transparent_36%),radial-gradient(circle_at_top_right,rgba(163,113,247,0.12),transparent_28%)]" />

      <div className="relative mx-auto max-w-7xl space-y-4 sm:space-y-6">
        <section className="glass relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--color-border)] p-4 sm:p-5 lg:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.16)]">
          <div className="relative flex flex-col gap-4 sm:gap-6">
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-xl sm:text-2xl md:text-[24px] lg:text-[26px] font-bold text-[var(--color-text-primary)]">Batch Management</h1>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">Create and manage batches, their sessions, and linked programs.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="hidden sm:block rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3 sm:px-4 py-2 text-xs sm:text-xs text-[var(--color-text-secondary)]">
                {batchCount} batches • {programCount} programs
              </div>
              <button id="import-batch-btn" onClick={() => setShowImportModal(true)} className="inline-flex items-center justify-center gap-2 rounded-lg sm:rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-colors">
                <FiDownloadCloud size={16} /> Import
              </button>
              <button id="add-batch-btn" onClick={openAdd} className="inline-flex items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-[var(--color-accent)] px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99]">
                + Add Batch
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl sm:rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-3 sm:p-4 lg:p-5 shadow-[0_18px_48px_rgba(0,0,0,0.12)]">
          <div className="flex flex-col gap-3">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-sm" />
              <input id="batch-search" type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search batches..." className="w-full rounded-lg sm:rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 sm:py-3 pr-3 sm:pr-4 pl-9 sm:pl-11 text-xs sm:text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]" />
              {search && (
                <button onClick={() => setSearch("")} title="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-surface)] hover:text-[var(--color-text-primary)]">
                  <FiX size={16} />
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] shadow-[0_18px_48px_rgba(0,0,0,0.14)]">
          {/* Desktop View - Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[var(--color-bg-elevated)]/90 border-b border-[var(--color-border)]">
                  {["Name", "Session", "Program", "Actions"].map((h) => (
                    <th key={h} className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <tr key={`skeleton-${idx}`} className="border-b border-[var(--color-border)]">
                      <td className="px-4 py-3"><div className="h-4 w-24 rounded bg-[var(--color-bg-elevated)] animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-28 rounded bg-[var(--color-bg-elevated)] animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-32 rounded bg-[var(--color-bg-elevated)] animate-pulse" /></td>
                      <td className="px-4 py-3" />
                    </tr>
                  ))
                ) : filtered.length > 0 ? (
                  filtered.map((b, i) => (
                    <tr key={b.id} id={`batch-row-${b.id}`} className={`border-b border-[var(--color-border)] bg-[var(--color-bg-surface)] transition-colors hover:bg-[var(--color-bg-elevated)]/40`}>
                      <td className="px-3 sm:px-4 py-3">
                        <span className="text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">{b.name}</span>
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <span className="text-xs sm:text-sm text-[var(--color-text-secondary)]">{b.session}</span>
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <div className="text-xs sm:text-sm text-[var(--color-text-primary)]">
                          {programById.get(b.program_id)?.department_name ? `${programById.get(b.program_id)?.department_name} - ` : ""}
                          {programById.get(b.program_id)?.name || b.program_name || "—"}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <div className="flex gap-2">
                          <button id={`batch-edit-${b.id}`} onClick={() => openEdit(b)} className="px-2.5 py-1.5 rounded-md border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-xs sm:text-sm transition-colors hover:bg-[var(--color-bg-elevated)]">Edit</button>
                          <button id={`batch-delete-${b.id}`} onClick={() => deleteBatch(b.id)} className="px-2.5 py-1.5 rounded-md border border-[rgba(248,81,73,0.2)] bg-transparent text-[var(--color-danger)] text-xs sm:text-sm transition-colors hover:bg-[rgba(248,81,73,0.06)]">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-xs sm:text-sm text-[var(--color-text-secondary)]">No batches found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View - Cards */}
          <div className="sm:hidden">
            {loading ? (
              <div className="space-y-3 p-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={`skeleton-${idx}`} className="rounded-lg border border-[var(--color-border)] p-3 space-y-2">
                    <div className="h-4 w-32 rounded bg-[var(--color-bg-elevated)] animate-pulse" />
                    <div className="h-3 w-24 rounded bg-[var(--color-bg-elevated)] animate-pulse" />
                  </div>
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="space-y-3 p-3">
                {filtered.map((b) => (
                  <div key={b.id} id={`batch-row-${b.id}`} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{b.name}</p>
                        <p className="text-xs text-[var(--color-text-secondary)]">{b.session}</p>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      <span className="font-medium">Program:</span> {programById.get(b.program_id)?.department_name ? `${programById.get(b.program_id)?.department_name} - ` : ""}{programById.get(b.program_id)?.name || b.program_name || "—"}
                    </p>
                    <div className="flex gap-2 pt-2">
                      <button id={`batch-edit-${b.id}`} onClick={() => openEdit(b)} className="flex-1 px-2 py-1.5 rounded-md border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-xs transition-colors hover:bg-[var(--color-bg-surface)]">Edit</button>
                      <button id={`batch-delete-${b.id}`} onClick={() => deleteBatch(b.id)} className="flex-1 px-2 py-1.5 rounded-md border border-[rgba(248,81,73,0.2)] bg-transparent text-[var(--color-danger)] text-xs transition-colors hover:bg-[rgba(248,81,73,0.06)]">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-xs text-[var(--color-text-secondary)]">No batches found.</div>
            )}
          </div>
        </section>

        {showImportModal && (
          <ImportWizard 
            entityType="batch" 
            onClose={() => setShowImportModal(false)} 
            onSuccess={() => { setShowImportModal(false); fetchData(); }} 
          />
        )}

        {showImportModal && (
          <ImportWizard 
            entityType="batch" 
            onClose={() => setShowImportModal(false)} 
            onSuccess={() => { setShowImportModal(false); fetchData(); }} 
          />
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
            <div className="w-full max-w-xl sm:max-w-2xl rounded-2xl sm:rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 sm:p-5 lg:p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-3 sm:gap-4 border-b border-[var(--color-border)] pb-3 sm:pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)] mb-1">{editingId ? "Edit Batch" : "Add Batch"}</h2>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">Provide batch name, session and assign the program.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="rounded-lg p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]" aria-label="Close modal"><FiX size={18} /></button>
              </div>
              <div className="flex flex-col gap-3 sm:gap-4 pt-4 sm:pt-5">
                <div>
                  <label htmlFor="modal-batch-name" className="block text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] mb-2">Batch Name</label>
                  <input id="modal-batch-name" type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. CSE-31" className="w-full rounded-lg sm:rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]" />
                </div>
                <div>
                  <label htmlFor="modal-batch-session" className="block text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] mb-2">Session</label>
                  <input id="modal-batch-session" type="text" value={newSession} onChange={(e) => setNewSession(e.target.value)} placeholder="e.g. Spring 23" className="w-full rounded-lg sm:rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]" />
                </div>
                <div>
                  <label htmlFor="modal-batch-dept" className="block text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] mb-2">Program</label>
                  <select id="modal-batch-dept" value={newProgramId} onChange={(e) => setNewProgramId(e.target.value)} className="w-full rounded-lg sm:rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base text-[var(--color-text-primary)] outline-none">
                    <option value="" disabled>Select Program</option>
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>{p.department_name} - {p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-3">
                  <button id="modal-batch-cancel" onClick={() => setShowModal(false)} className="flex-1 rounded-lg sm:rounded-xl border border-[var(--color-border)] bg-transparent px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)]">Cancel</button>
                  <button id="modal-batch-save" onClick={saveBatch} disabled={saving || !newName || !newSession || !newProgramId} className="flex-1 rounded-lg sm:rounded-xl bg-[var(--color-accent)] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed">{saving ? "Saving..." : (editingId ? "Save Changes" : "Save")}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
