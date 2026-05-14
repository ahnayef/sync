"use client";

import { useState } from "react";

const INITIAL = [
  { id: 1, name: "Dr. Aminur Rahman", short: "DR. RAHMAN", dept: "CSE", courses: 3 },
  { id: 2, name: "Prof. Shahidul Ahmed", short: "PROF. AHMED", dept: "Math", courses: 2 },
  { id: 3, name: "Dr. Karim Hossain", short: "DR. KARIM", dept: "CSE", courses: 2 },
  { id: 4, name: "Ms. Fatima Begum", short: "MS. FATIMA", dept: "CSE", courses: 1 },
  { id: 5, name: "Prof. Hassan Ali", short: "PROF. HASSAN", dept: "CSE", courses: 2 },
  { id: 6, name: "Ms. Parvin Akter", short: "MS. PARVIN", dept: "HUM", courses: 1 },
];

export default function ManageTeachersPage() {
  const [teachers, setTeachers] = useState(INITIAL);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newShort, setNewShort] = useState("");
  const [newDept, setNewDept] = useState("CSE");

  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.short.toLowerCase().includes(search.toLowerCase()) ||
      t.dept.toLowerCase().includes(search.toLowerCase())
  );

  const addTeacher = () => {
    if (!newName || !newShort) return;
    setTeachers([...teachers, { id: Date.now(), name: newName, short: newShort.toUpperCase(), dept: newDept, courses: 0 }]);
    setNewName(""); setNewShort(""); setShowModal(false);
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "9px",
    border: "1px solid var(--color-border)",
    background: "var(--color-bg-elevated)",
    color: "var(--color-text-primary)",
    fontSize: "14px",
    outline: "none",
  };

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em", marginBottom: "6px" }}>
            Teacher Management
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>{teachers.length} teachers registered</p>
        </div>
        <button id="add-teacher-btn" onClick={() => setShowModal(true)}
          style={{ padding: "10px 20px", borderRadius: "9px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 600, color: "white", background: "linear-gradient(135deg, #4f8ef7, #6f6bf7)", display: "flex", alignItems: "center", gap: "8px" }}>
          + Add Teacher
        </button>
      </div>

      <div style={{ position: "relative", marginBottom: "20px", maxWidth: "480px" }}>
        <input id="teacher-search" type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search teachers..."
          style={{ ...inputStyle, paddingLeft: "42px" }} />
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>

      <div style={{ borderRadius: "14px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--color-bg-elevated)", borderBottom: "1px solid var(--color-border)" }}>
              {["Name", "Short Form", "Dept", "Courses", "Actions"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <tr key={t.id} id={`teacher-row-${t.id}`}
                style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--color-border)" : "none", background: "var(--color-bg-surface)" }}>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: `hsl(${(t.id * 67) % 360}, 60%, 45%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "white" }}>
                      {t.name.charAt(0)}
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-text-primary)" }}>{t.name}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <code style={{ fontSize: "12px", fontWeight: 600, color: "#4f8ef7", background: "rgba(79,142,247,0.1)", padding: "3px 8px", borderRadius: "5px" }}>{t.short}</code>
                </td>
                <td style={{ padding: "14px 16px" }}><span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>{t.dept}</span></td>
                <td style={{ padding: "14px 16px" }}><span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>{t.courses}</span></td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button id={`teacher-edit-${t.id}`} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid var(--color-border)", background: "transparent", color: "var(--color-text-secondary)", fontSize: "12px", cursor: "pointer" }}>Edit</button>
                    <button id={`teacher-delete-${t.id}`} onClick={() => setTeachers(teachers.filter((x) => x.id !== t.id))}
                      style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid rgba(248,81,73,0.3)", background: "rgba(248,81,73,0.06)", color: "var(--color-danger)", fontSize: "12px", cursor: "pointer" }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "24px" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ width: "100%", maxWidth: "440px", borderRadius: "16px", border: "1px solid var(--color-border)", background: "var(--color-bg-surface)", padding: "32px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "24px" }}>Add Teacher</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[{ id: "modal-teacher-name", label: "Full Name", value: newName, onChange: setNewName, ph: "Dr. Jane Smith" },
                { id: "modal-teacher-short", label: "Short Form", value: newShort, onChange: setNewShort, ph: "DR. SMITH" }].map((f) => (
                <div key={f.id}>
                  <label htmlFor={f.id} style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: "8px" }}>{f.label}</label>
                  <input id={f.id} type="text" value={f.value} onChange={(e) => f.onChange(e.target.value)} placeholder={f.ph} style={inputStyle} />
                </div>
              ))}
              <div>
                <label htmlFor="modal-teacher-dept" style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: "8px" }}>Department</label>
                <select id="modal-teacher-dept" value={newDept} onChange={(e) => setNewDept(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  {["CSE", "EEE", "Math", "HUM", "PHY"].map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button id="modal-cancel" onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: "11px", borderRadius: "9px", border: "1px solid var(--color-border)", background: "transparent", color: "var(--color-text-secondary)", fontSize: "14px", cursor: "pointer" }}>Cancel</button>
                <button id="modal-save" onClick={addTeacher}
                  style={{ flex: 1, padding: "11px", borderRadius: "9px", border: "none", background: "linear-gradient(135deg, #4f8ef7, #6f6bf7)", color: "white", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
