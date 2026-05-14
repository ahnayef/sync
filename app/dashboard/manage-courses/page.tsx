"use client";

import { useState } from "react";

const INITIAL = [
  { id: 1, code: "CSE301", title: "Data Structures", isLab: false, credits: 3, dept: "CSE" },
  { id: 2, code: "CSE301L", title: "Data Structures Lab", isLab: true, credits: 1, dept: "CSE" },
  { id: 3, code: "CSE303", title: "Operating Systems", isLab: false, credits: 3, dept: "CSE" },
  { id: 4, code: "CSE315L", title: "OS Lab", isLab: true, credits: 1, dept: "CSE" },
  { id: 5, code: "CSE405", title: "Software Engineering", isLab: false, credits: 3, dept: "CSE" },
  { id: 6, code: "MAT201", title: "Discrete Mathematics", isLab: false, credits: 3, dept: "Math" },
  { id: 7, code: "HUM201", title: "Technical Writing", isLab: false, credits: 2, dept: "HUM" },
  { id: 8, code: "CSE311L", title: "Networks Lab", isLab: true, credits: 1, dept: "CSE" },
];

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState(INITIAL);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newIsLab, setNewIsLab] = useState(false);
  const [filterLab, setFilterLab] = useState<"all" | "lab" | "theory">("all");

  const filtered = courses.filter((c) => {
    const matchSearch = c.code.toLowerCase().includes(search.toLowerCase()) || c.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterLab === "all" ? true : filterLab === "lab" ? c.isLab : !c.isLab;
    return matchSearch && matchFilter;
  });

  const addCourse = () => {
    if (!newCode || !newTitle) return;
    setCourses([...courses, { id: Date.now(), code: newCode.toUpperCase(), title: newTitle, isLab: newIsLab, credits: newIsLab ? 1 : 3, dept: "CSE" }]);
    setNewCode(""); setNewTitle(""); setNewIsLab(false); setShowModal(false);
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "9px",
    border: "1px solid var(--color-border)", background: "var(--color-bg-elevated)",
    color: "var(--color-text-primary)", fontSize: "14px", outline: "none",
  };

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em", marginBottom: "6px" }}>
            Course Management
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>{courses.length} courses registered</p>
        </div>
        <button id="add-course-btn" onClick={() => setShowModal(true)}
          style={{ padding: "10px 20px", borderRadius: "9px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 600, color: "white", background: "linear-gradient(135deg, #4f8ef7, #6f6bf7)", display: "flex", alignItems: "center", gap: "8px" }}>
          + Add Course
        </button>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1", minWidth: "240px", maxWidth: "400px" }}>
          <input id="course-search" type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses..."
            style={{ ...inputStyle, paddingLeft: "42px" }} />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <div style={{ display: "flex", gap: "6px", padding: "4px", borderRadius: "9px", background: "var(--color-bg-elevated)", border: "1px solid var(--color-border)" }}>
          {(["all", "theory", "lab"] as const).map((f) => (
            <button key={f} id={`filter-${f}`} onClick={() => setFilterLab(f)}
              style={{ padding: "6px 14px", borderRadius: "7px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: filterLab === f ? 600 : 400,
                color: filterLab === f ? "white" : "var(--color-text-secondary)",
                background: filterLab === f ? "linear-gradient(135deg, #4f8ef7, #6f6bf7)" : "transparent" }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ borderRadius: "14px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--color-bg-elevated)", borderBottom: "1px solid var(--color-border)" }}>
              {["Code", "Title", "Type", "Credits", "Actions"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id} id={`course-row-${c.id}`}
                style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--color-border)" : "none", background: "var(--color-bg-surface)" }}>
                <td style={{ padding: "14px 16px" }}>
                  <code style={{ fontSize: "12px", fontWeight: 700, color: c.isLab ? "#a371f7" : "#4f8ef7", background: c.isLab ? "rgba(163,113,247,0.1)" : "rgba(79,142,247,0.1)", padding: "3px 8px", borderRadius: "5px" }}>
                    {c.code}
                  </code>
                </td>
                <td style={{ padding: "14px 16px" }}><span style={{ fontSize: "14px", color: "var(--color-text-primary)" }}>{c.title}</span></td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: c.isLab ? "#a371f7" : "var(--color-text-secondary)", background: c.isLab ? "rgba(163,113,247,0.1)" : "var(--color-bg-elevated)", border: `1px solid ${c.isLab ? "rgba(163,113,247,0.3)" : "var(--color-border)"}`, padding: "2px 8px", borderRadius: "5px", textTransform: "uppercase" }}>
                    {c.isLab ? "Lab" : "Theory"}
                  </span>
                </td>
                <td style={{ padding: "14px 16px" }}><span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>{c.credits} cr</span></td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button id={`course-edit-${c.id}`} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid var(--color-border)", background: "transparent", color: "var(--color-text-secondary)", fontSize: "12px", cursor: "pointer" }}>Edit</button>
                    <button id={`course-delete-${c.id}`} onClick={() => setCourses(courses.filter((x) => x.id !== c.id))}
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
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "24px" }}>Add Course</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label htmlFor="modal-course-code" style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: "8px" }}>Course Code</label>
                <input id="modal-course-code" type="text" value={newCode} onChange={(e) => setNewCode(e.target.value)} placeholder="e.g. CSE401" style={inputStyle} />
              </div>
              <div>
                <label htmlFor="modal-course-title" style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: "8px" }}>Course Title</label>
                <input id="modal-course-title" type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Compiler Design" style={inputStyle} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", borderRadius: "9px", border: "1px solid var(--color-border)", background: "var(--color-bg-elevated)", cursor: "pointer" }}
                onClick={() => setNewIsLab(!newIsLab)}>
                <div style={{ width: "20px", height: "20px", borderRadius: "6px", border: `2px solid ${newIsLab ? "#a371f7" : "var(--color-border)"}`, background: newIsLab ? "#a371f7" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                  {newIsLab && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <span style={{ fontSize: "14px", color: "var(--color-text-primary)" }}>This is a Lab course</span>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button id="modal-course-cancel" onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: "11px", borderRadius: "9px", border: "1px solid var(--color-border)", background: "transparent", color: "var(--color-text-secondary)", fontSize: "14px", cursor: "pointer" }}>Cancel</button>
                <button id="modal-course-save" onClick={addCourse}
                  style={{ flex: 1, padding: "11px", borderRadius: "9px", border: "none", background: "linear-gradient(135deg, #4f8ef7, #6f6bf7)", color: "white", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
