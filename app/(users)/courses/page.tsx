"use client";

import { useState } from "react";

const AVAILABLE_COURSES = [
  { code: "CSE301", title: "Data Structures", teacher: "Dr. Rahman", isLab: false, section: "A" },
  { code: "CSE301L", title: "Data Structures Lab", teacher: "Dr. Rahman", isLab: true, section: "A" },
  { code: "CSE303", title: "Operating Systems", teacher: "Dr. Karim", isLab: false, section: "B" },
  { code: "CSE315L", title: "OS Lab", teacher: "Ms. Fatima", isLab: true, section: "B" },
  { code: "CSE405", title: "Software Engineering", teacher: "Prof. Hassan", isLab: false, section: "A" },
  { code: "CSE311L", title: "Networks Lab", teacher: "Dr. Islam", isLab: true, section: "A" },
  { code: "MAT201", title: "Discrete Mathematics", teacher: "Prof. Ahmed", isLab: false, section: "C" },
  { code: "HUM201", title: "Technical Writing", teacher: "Ms. Parvin", isLab: false, section: "A" },
  { code: "CSE401", title: "Compiler Design", teacher: "Dr. Chowdhury", isLab: false, section: "B" },
  { code: "CSE411L", title: "Compiler Lab", teacher: "Dr. Chowdhury", isLab: true, section: "B" },
];

export default function CoursesPage() {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(["CSE301", "CSE301L", "CSE303", "MAT201"])
  );
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);

  const filtered = AVAILABLE_COURSES.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.teacher.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (code: string) => {
    const next = new Set(selected);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    setSelected(next);
    setSaved(false);
  };

  return (
    <div style={{ padding: "32px", maxWidth: "900px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em", marginBottom: "6px" }}>
          Course Selection
        </h1>
        <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
          Choose the courses you&apos;re enrolled in — they&apos;ll appear on your routine page.
        </p>
      </div>

      {/* Stats + Save */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", gap: "16px" }}>
          <div
            style={{
              padding: "8px 16px",
              borderRadius: "9px",
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border)",
            }}
          >
            <span style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>Selected: </span>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-accent)" }}>
              {selected.size}
            </span>
            <span style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>/{AVAILABLE_COURSES.length}</span>
          </div>
        </div>
        <button
          id="courses-save"
          onClick={() => setSaved(true)}
          style={{
            padding: "10px 24px",
            borderRadius: "9px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 600,
            color: "white",
            background: saved ? "#3fb950" : "linear-gradient(135deg, #4f8ef7, #6f6bf7)",
            boxShadow: saved ? "0 0 16px rgba(63,185,80,0.3)" : "0 0 16px rgba(79,142,247,0.3)",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {saved ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Saved!
            </>
          ) : (
            "Save changes"
          )}
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "20px" }}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-text-muted)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
        >
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          id="courses-search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses, teachers..."
          style={{
            width: "100%",
            padding: "11px 14px 11px 42px",
            borderRadius: "10px",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-elevated)",
            color: "var(--color-text-primary)",
            fontSize: "14px",
            outline: "none",
          }}
        />
      </div>

      {/* Course List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {filtered.map((course) => {
          const isSelected = selected.has(course.code);
          return (
            <div
              key={course.code}
              id={`course-${course.code.toLowerCase()}`}
              onClick={() => toggle(course.code)}
              style={{
                borderRadius: "12px",
                border: `1px solid ${isSelected ? "rgba(79,142,247,0.3)" : "var(--color-border)"}`,
                background: isSelected ? "rgba(79,142,247,0.05)" : "var(--color-bg-surface)",
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {/* Checkbox */}
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "6px",
                  border: `2px solid ${isSelected ? "#4f8ef7" : "var(--color-border)"}`,
                  background: isSelected ? "#4f8ef7" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                }}
              >
                {isSelected && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      color: course.isLab ? "#a371f7" : "#4f8ef7",
                      background: course.isLab ? "rgba(163,113,247,0.1)" : "rgba(79,142,247,0.1)",
                      border: `1px solid ${course.isLab ? "rgba(163,113,247,0.3)" : "rgba(79,142,247,0.3)"}`,
                      padding: "2px 7px",
                      borderRadius: "5px",
                    }}
                  >
                    {course.code}
                  </span>
                  {course.isLab && (
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color: "#a371f7",
                        background: "rgba(163,113,247,0.08)",
                        border: "1px solid rgba(163,113,247,0.25)",
                        padding: "2px 7px",
                        borderRadius: "5px",
                        textTransform: "uppercase",
                      }}
                    >
                      Lab
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--color-text-muted)",
                      background: "var(--color-bg-elevated)",
                      border: "1px solid var(--color-border)",
                      padding: "2px 7px",
                      borderRadius: "5px",
                    }}
                  >
                    Sec {course.section}
                  </span>
                </div>
                <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "2px" }}>
                  {course.title}
                </p>
                <p style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>{course.teacher}</p>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#4f8ef7",
                    background: "rgba(79,142,247,0.1)",
                    border: "1px solid rgba(79,142,247,0.2)",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    flexShrink: 0,
                  }}
                >
                  Added
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
