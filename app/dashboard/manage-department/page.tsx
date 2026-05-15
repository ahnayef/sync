"use client";

import { useState } from "react";

const INITIAL = [
  { id: 1, name: "CSE", fullName: "Computer Science & Engineering" },
  { id: 2, name: "MAT", fullName: "Mathematics" },
  { id: 3, name: "HUM", fullName: "Humanities" },
  { id: 4, name: "EEE", fullName: "Electrical & Electronic Engineering" },
];

export default function ManageDepartmentPage() {
  const [departments, setDepartments] = useState(INITIAL);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newFullName, setNewFullName] = useState("");

  const filtered = departments.filter((d) => {
    return (
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.fullName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const addDepartment = () => {
    if (!newName || !newFullName) return;
    setDepartments([
      ...departments,
      {
        id: Date.now(),
        name: newName.toUpperCase(),
        fullName: newFullName,
      },
    ]);
    setNewName("");
    setNewFullName("");
    setShowModal(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[var(--color-text-primary)] mb-1">
            Department Management
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {departments.length} departments registered
          </p>
        </div>
        <button
          id="add-dept-btn"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99]"
        >
          + Add Department
        </button>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-[400px]">
          <input
            id="dept-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search departments..."
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
              {["Short Name", "Full Name", "Actions"].map((h) => (
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
            {filtered.map((d, i) => (
              <tr
                key={d.id}
                id={`dept-row-${d.id}`}
                className={`border-b ${i < filtered.length - 1 ? "border-[var(--color-border)]" : ""} bg-[var(--color-bg-surface)]`}
              >
                <td className="px-4 py-3">
                  <code className="text-xs font-bold px-2 py-0.5 rounded text-[var(--color-accent)] bg-[var(--color-accent-muted)]">
                    {d.name}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-[var(--color-text-primary)]">
                    {d.fullName}
                  </span>
                </td>
                <td className="px-4 py-3 w-[160px]">
                  <div className="flex gap-2">
                    <button
                      id={`dept-edit-${d.id}`}
                      className="px-3 py-1.5 rounded-md border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-sm transition-colors hover:bg-[var(--color-bg-elevated)]"
                    >
                      Edit
                    </button>
                    <button
                      id={`dept-delete-${d.id}`}
                      onClick={() =>
                        setDepartments(departments.filter((x) => x.id !== d.id))
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
                <td colSpan={3} className="px-4 py-8 text-center text-[var(--color-text-secondary)]">
                  No departments found.
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
              Add Department
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="modal-dept-name"
                  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"
                >
                  Short Name
                </label>
                <input
                  id="modal-dept-name"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. CSE"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="modal-dept-fullname"
                  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"
                >
                  Full Name
                </label>
                <input
                  id="modal-dept-fullname"
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  id="modal-dept-cancel"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="modal-dept-save"
                  onClick={addDepartment}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--color-accent)] text-white font-semibold shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99]"
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
