"use client";

import { useState } from "react";
import {
  FiSliders,
  FiBook,
  FiUsers,
  FiShield,
  FiClock,
  FiUploadCloud,
  FiPlus,
} from "react-icons/fi";

const tabs = [
  { id: "Routine", label: "Routine", icon: FiSliders },
  { id: "Courses", label: "Courses", icon: FiBook },
  { id: "People", label: "People", icon: FiUsers },
  { id: "Admin", label: "Admin", icon: FiShield },
];

export default function HomeMockup() {
  const [activeTab, setActiveTab] = useState("Routine");

  // Insight cards data based on active tab
  const getInsightCards = () => {
    switch (activeTab) {
      case "Courses":
        return [
          { label: "Selected", value: "6", unit: "modules", hint: "18 credits" },
          { label: "Dept", value: "CSE", unit: "", hint: "Computer Science" },
          { label: "Semester", value: "3rd", unit: "Year", hint: "Spring 2026" },
        ];
      case "People":
        return [
          { label: "Faculty", value: "18", unit: "teachers", hint: "CSE Department" },
          { label: "Students", value: "420", unit: "enrolled", hint: "Batch 2023-26" },
          { label: "Directory", value: "Active", unit: "", hint: "Email synced" },
        ];
      case "Admin":
        return [
          { label: "Uploads", value: "14", unit: "CSV files", hint: "Routine schedules" },
          { label: "Conflicts", value: "0", unit: "errors", hint: "All clean" },
          { label: "System", value: "Healthy", unit: "", hint: "Auto-backup enabled" },
        ];
      case "Routine":
      default:
        return [
          { label: "Today", value: "5", unit: "classes", hint: "2 gaps" },
          { label: "Imported", value: "98%", unit: "", hint: "validated" },
          { label: "Changes", value: "Live", unit: "", hint: "instant sync" },
        ];
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top,rgba(79,142,247,0.15),transparent_48%)] blur-2xl" />
      <div className="relative overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[rgba(13,17,23,0.9)] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
        
        {/* Browser Top Bar */}
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[rgba(21,28,37,0.85)] px-4 py-3">
          {["#f85149", "#d29922", "#3fb950"].map((c) => (
            <div key={c} className="h-2.5 w-2.5 rounded-full opacity-90" style={{ background: c }} />
          ))}
          <div className="ml-2 flex flex-1 items-center gap-3 rounded-[10px] border border-[var(--color-border)] bg-[rgba(11,16,21,0.72)] px-3 py-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#4f8ef7]" />
            <div className="h-2 w-32 rounded-full bg-[var(--color-border)] sm:w-40" />
          </div>
        </div>

        {/* Dashboard Shell Layout */}
        <div className="grid gap-0 lg:grid-cols-[180px_1fr]">
          
          {/* Mock Sidebar */}
          <aside className="border-b border-[var(--color-border)] bg-[rgba(21,28,37,0.82)] p-4 lg:border-b-0 lg:border-r">
            
            {/* Sidebar "Today" Info Card */}
            <div className="mb-4 rounded-[18px] border border-[var(--color-border)] bg-[rgba(11,16,21,0.65)] p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#4f8ef71a] text-[#8fb5ff]">
                  <FiClock />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">Today</p>
                  <p className="text-xs text-[var(--color-text-muted)]">5 classes, 2 gaps</p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="w-full flex items-center gap-3 rounded-[14px] border px-3 py-2.5 text-sm transition-all duration-200 text-left hover:scale-[1.02] cursor-pointer"
                    style={{
                      background: isActive
                        ? "rgba(79,142,247,0.12)"
                        : "rgba(11,16,21,0.4)",
                      borderColor: isActive
                        ? "rgba(79,142,247,0.25)"
                        : "var(--color-border)",
                    }}
                  >
                    <Icon
                      className={isActive ? "text-[#8fb5ff]" : "text-[var(--color-text-muted)]"}
                    />
                    <span
                      className={
                        isActive
                          ? "font-medium text-[var(--color-text-primary)]"
                          : "text-[var(--color-text-secondary)]"
                      }
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="grid gap-4 p-4 sm:p-5">
            
            {/* Stats Grid */}
            <div className="grid gap-3 sm:grid-cols-3">
              {getInsightCards().map((card) => (
                <div
                  key={card.label}
                  className="rounded-[18px] border border-[var(--color-border)] bg-[rgba(17,23,32,0.75)] p-3 flex flex-col justify-between min-h-[84px] transition-all duration-300 hover:border-white/10"
                >
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)] leading-none">{card.label}</div>
                    <div className="mt-1.5 flex items-baseline gap-1 whitespace-nowrap">
                      <span className="text-lg sm:text-xl font-bold tracking-[-0.04em] text-[var(--color-text-primary)]">
                        {card.value}
                      </span>
                      {card.unit && (
                        <span className="text-[10px] font-semibold text-[var(--color-text-secondary)] lowercase">
                          {card.unit}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-1 text-[10px] text-[var(--color-text-secondary)]">{card.hint}</div>
                </div>
              ))}
            </div>

            {/* Dynamic Tab Previews */}
            {activeTab === "Routine" && (
              <div className="rounded-[18px] border border-[var(--color-border)] bg-[rgba(17,23,32,0.8)] p-3.5">
                <div className="mb-3.5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-text-primary)]">Routine preview</p>
                    <p className="text-[11px] text-[var(--color-text-muted)]">A clean, scannable day view</p>
                  </div>
                  <span className="rounded-full border border-[#3fb95033] bg-[#3fb95014] px-2 py-0.5 text-[10px] font-semibold text-[#8ae39d]">
                    Synced
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    { time: "08:30", title: "Discrete Mathematics", meta: "Room 402 · Prof. Karim", accent: "#4f8ef7" },
                    { time: "10:00", title: "Database Systems", meta: "Lab 2 · Dr. Nahar", accent: "#3fb950" },
                    { time: "01:15", title: "Software Engineering", meta: "Room 105 · Team project", accent: "#a371f7" },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[14px] border border-[var(--color-border)] bg-[rgba(11,16,21,0.72)] p-3 transition-transform duration-200 hover:-translate-y-0.5"
                      style={{ boxShadow: `inset 3px 0 0 ${item.accent}` }}
                    >
                      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                            {item.time}
                          </div>
                          <div className="mt-0.5 text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">{item.title}</div>
                          <div className="mt-0.5 text-[11px] text-[var(--color-text-secondary)]">{item.meta}</div>
                        </div>
                        <div className="flex items-center gap-1.5 self-start rounded-full border border-[var(--color-border)] bg-[rgba(21,28,37,0.8)] px-2 py-1 text-[10px] text-[var(--color-text-secondary)] sm:self-center">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: item.accent }} />
                          On track
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Courses" && (
              <div className="rounded-[18px] border border-[var(--color-border)] bg-[rgba(17,23,32,0.8)] p-3.5">
                <div className="mb-3.5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-text-primary)]">Course Catalog</p>
                    <p className="text-[11px] text-[var(--color-text-muted)]">Selected academic modules</p>
                  </div>
                  <button className="flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[rgba(21,28,37,0.8)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] cursor-pointer">
                    <FiPlus className="text-xs" /> Add
                  </button>
                </div>

                <div className="space-y-2">
                  {[
                    { code: "CSE 311", title: "Database Systems", credits: "3.0 Credits", accent: "#3fb950", status: "Core" },
                    { code: "CSE 313", title: "Software Engineering", credits: "3.0 Credits", accent: "#a371f7", status: "Core" },
                    { code: "CSE 315", title: "Discrete Mathematics", credits: "3.0 Credits", accent: "#4f8ef7", status: "Required" },
                  ].map((item) => (
                    <div
                      key={item.code}
                      className="rounded-[14px] border border-[var(--color-border)] bg-[rgba(11,16,21,0.72)] p-3 transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold" style={{ backgroundColor: `${item.accent}15`, color: item.accent }}>
                            {item.code.split(" ")[1]}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[var(--color-text-primary)]">{item.title}</div>
                            <div className="text-[10px] text-[var(--color-text-muted)]">{item.code} · {item.credits}</div>
                          </div>
                        </div>
                        <span className="rounded-full bg-[rgba(255,255,255,0.05)] px-2 py-0.5 text-[9px] font-semibold text-[var(--color-text-secondary)]">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "People" && (
              <div className="rounded-[18px] border border-[var(--color-border)] bg-[rgba(17,23,32,0.8)] p-3.5">
                <div className="mb-3.5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-text-primary)]">People Directory</p>
                    <p className="text-[11px] text-[var(--color-text-muted)]">Teachers and academic roles</p>
                  </div>
                  <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-[#b38eff]">
                    Synced
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    { name: "Dr. Nahar", role: "Associate Professor", email: "nahar@campus.edu", initial: "N", accent: "#a371f7" },
                    { name: "Prof. Karim", role: "Professor", email: "karim@campus.edu", initial: "K", accent: "#4f8ef7" },
                    { name: "Ms. Rahman", role: "Lecturer", email: "rahman@campus.edu", initial: "R", accent: "#3fb950" },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="rounded-[14px] border border-[var(--color-border)] bg-[rgba(11,16,21,0.72)] p-3 transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: item.accent }}>
                            {item.initial}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[var(--color-text-primary)]">{item.name}</div>
                            <div className="text-[10px] text-[var(--color-text-muted)]">{item.role} · {item.email}</div>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-400">
                          Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Admin" && (
              <div className="rounded-[18px] border border-[var(--color-border)] bg-[rgba(17,23,32,0.8)] p-3.5">
                <div className="mb-3.5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-text-primary)]">Admin Controller</p>
                    <p className="text-[11px] text-[var(--color-text-muted)]">Schedules, uploads & conflicts</p>
                  </div>
                  <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-[#ffe08a]">
                    Secured
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="rounded-[14px] border border-dashed border-[var(--color-border)] bg-[rgba(11,16,21,0.3)] p-4 text-center hover:border-amber-500/30 transition-colors cursor-pointer">
                    <FiUploadCloud className="mx-auto text-xl text-amber-500/60 mb-1.5" />
                    <p className="text-[11px] font-bold text-[var(--color-text-primary)]">Import routine CSV</p>
                    <p className="text-[9px] text-[var(--color-text-muted)]">Drag and drop or click to upload</p>
                  </div>

                  <div className="rounded-[14px] border border-[var(--color-border)] bg-[rgba(11,16,21,0.72)] p-2.5 flex items-center justify-between text-xs">
                    <span className="text-[var(--color-text-secondary)] font-medium">Automatic Conflict Resolver</span>
                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">
                      ON
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
