"use client";

import { useState } from "react";

const INITIAL = [
  { id: 1, name: "Dr. Aminur Rahman", short: "DR. RAHMAN", dept: "CSE" },
  { id: 2, name: "Prof. Shahidul Ahmed", short: "PROF. AHMED", dept: "MAT" },
  { id: 3, name: "Dr. Karim Hossain", short: "DR. KARIM", dept: "CSE" },
  { id: 4, name: "Ms. Fatima Begum", short: "MS. FATIMA", dept: "ENG" },
  { id: 5, name: "Prof. Hassan Ali", short: "PROF. HASSAN", dept: "EEE" },
  { id: 6, name: "Ms. Parvin Akter", short: "MS. PARVIN", dept: "BBA" },
];

export default function ManageTeachersPage() {
  const [teachers, setTeachers] = useState(INITIAL);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [newName, setNewName] = useState("");
  const [newShort, setNewShort] = useState("");
  const [newDept, setNewDept] = useState("");

  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.short.toLowerCase().includes(search.toLowerCase()) ||
      t.dept.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingId(null);
    setNewName("");
    setNewShort("");
    setNewDept("");
    setShowModal(true);
  };

  const openEdit = (teacher: any) => {
    setEditingId(teacher.id);
    setNewName(teacher.name);
    setNewShort(teacher.short);
    setNewDept(teacher.dept);
    setShowModal(true);
  };

  const saveTeacher = () => {
    if (!newName || !newShort) return;
    if (editingId) {
      setTeachers(
        teachers.map((t) =>
          t.id === editingId
            ? { ...t, name: newName, short: newShort.toUpperCase(), dept: newDept.toUpperCase() }
            : t
        )
      );
    } else {
      setTeachers([
        ...teachers, 
        { 
          id: Date.now(), 
          name: newName, 
          short: newShort.toUpperCase(), 
          dept: newDept.toUpperCase(), 
        }
      ]);
    }
    setNewName(""); 
    setNewShort(""); 
    setNewDept(""); 
    setEditingId(null);
    setShowModal(false);
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
    <div className="p-8">
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[var(--color-text-primary)] mb-1">Teacher Management</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{teachers.length} teachers registered</p>
        </div>
        <button id="add-teacher-btn" onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99]">
          + Add Teacher
        </button>
      </div>

      <div className="relative mb-5 max-w-[400px]">
        <input id="teacher-search" type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search teachers..." className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 pr-4 pl-10 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]" />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
      </div>

      <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
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
                    <div className={`${getAvatarClass(t.id)} w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white`}>{t.name.charAt(0)}</div>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">{t.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <code className="text-xs font-semibold text-[var(--color-accent)] bg-[var(--color-accent-muted)] px-2 py-0.5 rounded">{t.short}</code>
                </td>
                <td className="px-4 py-3">
                  <code className="text-xs font-semibold text-[#a371f7] bg-[rgba(163,113,247,0.1)] px-2 py-0.5 rounded">{t.dept || "—"}</code>
                </td>
                <td className="px-4 py-3 w-[160px]">
                  <div className="flex gap-2">
                    <button id={`teacher-edit-${t.id}`} onClick={() => openEdit(t)} className="px-3 py-1.5 rounded-md border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-sm transition-colors hover:bg-[var(--color-bg-elevated)]">Edit</button>
                    <button id={`teacher-delete-${t.id}`} onClick={() => setTeachers(teachers.filter((x) => x.id !== t.id))} className="px-3 py-1.5 rounded-md border border-[rgba(248,81,73,0.2)] bg-transparent text-[var(--color-danger)] text-sm transition-colors hover:bg-[rgba(248,81,73,0.06)]">Delete</button>
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

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="w-full max-w-[500px] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-8">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-6">{editingId ? "Edit Teacher" : "Add Teacher"}</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Full Name</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Dr. Jane Smith" className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Short Form (Unique)</label>
                  <input type="text" value={newShort} onChange={(e) => setNewShort(e.target.value)} placeholder="e.g. DR. SMITH" className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Department</label>
                  <input type="text" value={newDept} onChange={(e) => setNewDept(e.target.value)} placeholder="e.g. CSE" className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none" />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button id="modal-cancel" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)]">Cancel</button>
                <button id="modal-save" onClick={saveTeacher} className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--color-accent)] text-white font-semibold shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99]">{editingId ? "Save Changes" : "Save"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
