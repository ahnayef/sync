"use client";

import { useState } from "react";

const INITIAL = [
  { id: 1, name: "CSE 21", session: "2021-2025", dept: "CSE" },
  { id: 2, name: "CSE 22", session: "2022-2026", dept: "CSE" },
  { id: 3, name: "BBA 20", session: "2020-2024", dept: "BBA" },
  { id: 4, name: "ENG 23", session: "2023-2027", dept: "ENG" },
];

export default function ManageBatchPage() {
  const [batches, setBatches] = useState(INITIAL);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newSession, setNewSession] = useState("");
  const [newDept, setNewDept] = useState("");

  const filtered = batches.filter((b) => {
    return (
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.session.toLowerCase().includes(search.toLowerCase()) ||
      b.dept.toLowerCase().includes(search.toLowerCase())
    );
  });

  const openAdd = () => {
    setEditingId(null);
    setNewName("");
    setNewSession("");
    setNewDept("");
    setShowModal(true);
  };

  const openEdit = (batch: any) => {
    setEditingId(batch.id);
    setNewName(batch.name);
    setNewSession(batch.session);
    setNewDept(batch.dept);
    setShowModal(true);
  };

  const saveBatch = () => {
    if (!newName || !newSession || !newDept) return;
    if (editingId) {
      setBatches(
        batches.map((b) =>
          b.id === editingId
            ? { ...b, name: newName, session: newSession, dept: newDept.toUpperCase() }
            : b
        )
      );
    } else {
      setBatches([
        ...batches,
        {
          id: Date.now(),
          name: newName,
          session: newSession,
          dept: newDept.toUpperCase(),
        },
      ]);
    }
    setNewName("");
    setNewSession("");
    setNewDept("");
    setEditingId(null);
    setShowModal(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[var(--color-text-primary)] mb-1">
            Batch Management
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {batches.length} batches registered
          </p>
        </div>
        <button
          id="add-batch-btn"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99]"
        >
          + Add Batch
        </button>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-[400px]">
          <input
            id="batch-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search batches..."
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
      </div>

      <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)]">
              {["Name", "Session", "Department", "Actions"].map((h) => (
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
            {filtered.map((b, i) => (
              <tr
                key={b.id}
                id={`batch-row-${b.id}`}
                className={`border-b ${i < filtered.length - 1 ? "border-[var(--color-border)]" : ""} bg-[var(--color-bg-surface)]`}
              >
                <td className="px-4 py-3">
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {b.name}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {b.session}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <code className="text-xs font-bold px-2 py-0.5 rounded text-[#a371f7] bg-[rgba(163,113,247,0.1)]">
                    {b.dept}
                  </code>
                </td>
                <td className="px-4 py-3 w-[160px]">
                  <div className="flex gap-2">
                    <button
                      id={`batch-edit-${b.id}`}
                      onClick={() => openEdit(b)}
                      className="px-3 py-1.5 rounded-md border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-sm transition-colors hover:bg-[var(--color-bg-elevated)]"
                    >
                      Edit
                    </button>
                    <button
                      id={`batch-delete-${b.id}`}
                      onClick={() =>
                        setBatches(batches.filter((x) => x.id !== b.id))
                      }
                      className="px-3 py-1.5 rounded-md border border-[rgba(248,81,73,0.2)] bg-transparent text-[var(--color-danger)] text-sm transition-colors hover:bg-[rgba(248,81,73,0.06)]"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--color-text-secondary)]">
                  No batches found.
                </td>
              </tr>
            )}
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
              {editingId ? "Edit Batch" : "Add Batch"}
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="modal-batch-name"
                  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"
                >
                  Batch Name
                </label>
                <input
                  id="modal-batch-name"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. CSE 21"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="modal-batch-session"
                  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"
                >
                  Session
                </label>
                <input
                  id="modal-batch-session"
                  type="text"
                  value={newSession}
                  onChange={(e) => setNewSession(e.target.value)}
                  placeholder="e.g. 2021-2025"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="modal-batch-dept"
                  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"
                >
                  Department
                </label>
                <input
                  id="modal-batch-dept"
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  placeholder="e.g. CSE"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  id="modal-batch-cancel"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="modal-batch-save"
                  onClick={saveBatch}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--color-accent)] text-white font-semibold shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99]"
                >
                  {editingId ? "Save Changes" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
