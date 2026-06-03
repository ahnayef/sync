"use client";

import { useState } from "react";
import { FiClock, FiBook, FiGrid, FiMapPin, FiCheck, FiPlus } from "react-icons/fi";

const tabs = [
  { id: "routine", label: "Routine", icon: FiClock },
  { id: "courses", label: "Courses", icon: FiBook },
  { id: "manage",  label: "Manage",  icon: FiGrid  },
];

export default function HomeMockup() {
  const [active, setActive] = useState<"routine" | "courses" | "manage">("routine");
  const [saved, setSaved] = useState(["CSE 3101", "CSE 3103"]);

  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top,rgba(79,142,247,0.15),transparent_50%)] blur-2xl" />
      <div className="relative overflow-hidden rounded-[26px] border border-[var(--color-border)] bg-[rgba(13,17,23,0.92)] shadow-[0_28px_80px_rgba(0,0,0,0.45)]">

        {/* Browser bar */}
        <div className="flex items-center gap-1.5 border-b border-[var(--color-border)] bg-[rgba(21,28,37,0.85)] px-4 py-2.5">
          {["#f85149","#d29922","#3fb950"].map((c) => (
            <div key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
          ))}
          <div className="ml-2 flex flex-1 items-center gap-2.5 rounded-[8px] border border-[var(--color-border)] bg-[rgba(11,16,21,0.65)] px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-[#4f8ef7]" />
            <div className="h-1.5 w-28 rounded-full bg-[var(--color-border)]" />
          </div>
        </div>

        {/* App shell — always side by side */}
        <div className="flex">

          {/* ── Left Nav ── */}
          <aside className="w-[150px] shrink-0 border-r border-[var(--color-border)] bg-[rgba(17,24,34,0.82)] p-3.5 flex flex-col gap-2">
            {/* Today pill */}
            <div className="flex items-center gap-2.5 rounded-[12px] border border-[var(--color-border)] bg-[rgba(11,16,21,0.5)] p-2.5 mb-1">
              <div className="h-8 w-8 rounded-[10px] bg-[rgba(79,142,247,0.1)] flex items-center justify-center text-[#8fb5ff] shrink-0">
                <FiClock size={13} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[var(--color-text-primary)] leading-none">Today</p>
                <p className="text-[9px] text-[var(--color-text-muted)] mt-0.5">4 classes · 1 gap</p>
              </div>
            </div>

            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = active === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id as any)}
                  className="flex items-center gap-2.5 rounded-[11px] border px-3 py-2 text-xs text-left transition-all duration-150 cursor-pointer hover:scale-[1.02]"
                  style={{
                    background:     isActive ? "rgba(79,142,247,0.1)"  : "rgba(11,16,21,0.35)",
                    borderColor:    isActive ? "rgba(79,142,247,0.22)" : "var(--color-border)",
                  }}
                >
                  <Icon size={13} className={isActive ? "text-[#8fb5ff]" : "text-[var(--color-text-muted)]"} />
                  <span className={isActive ? "font-semibold text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </aside>

          {/* ── Right Content ── */}
          <div className="flex-1 min-w-0 p-4 space-y-3">

            {/* Stat row */}
            <div className="grid grid-cols-3 gap-2.5">
              {(active === "routine"
                ? [{ l: "Today", v: "4", u: "classes" }, { l: "Next", v: "10:00", u: "" }, { l: "Gap", v: "90", u: "min" }]
                : active === "courses"
                ? [{ l: "Saved", v: String(saved.length), u: "courses" }, { l: "Credits", v: String(saved.length * 3), u: "hrs" }, { l: "Conflicts", v: "0", u: "" }]
                : [{ l: "Teachers", v: "12", u: "" }, { l: "Rooms", v: "11", u: "" }, { l: "Schedules", v: "84", u: "slots" }]
              ).map((c) => (
                <div key={c.l} className="rounded-[13px] border border-[var(--color-border)] bg-[rgba(17,23,32,0.75)] px-3 py-2.5">
                  <p className="text-[9px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">{c.l}</p>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-[17px] font-bold tracking-tight text-[var(--color-text-primary)]">{c.v}</span>
                    {c.u && <span className="text-[9px] text-[var(--color-text-secondary)]">{c.u}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Routine ── */}
            {active === "routine" && (
              <div className="rounded-[15px] border border-[var(--color-border)] bg-[rgba(17,23,32,0.8)] p-3">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-[11px] font-semibold text-[var(--color-text-primary)]">Wednesday Schedule</p>
                  <span className="text-[9px] font-semibold rounded-full border border-[#3fb95030] bg-[#3fb95012] px-2 py-0.5 text-[#8ae39d]">Synced</span>
                </div>
                <div className="space-y-2">
                  {[
                    { code:"CSE 3101", name:"Data Structures",   teacher:"Dr. Rahman",  room:"402",   time:"08:30", status:"done"    as const },
                    { code:"CSE 3103", name:"Algorithm Design",  teacher:"Prof. Karim", room:"201",   time:"10:00", status:"ongoing" as const, progress: 58 },
                    { code:"CSE 3107", name:"Operating Systems", teacher:"Ms. Nahar",   room:"Lab 2", time:"13:00", status:"upcoming"as const, isLab: true },
                  ].map((item) => (
                    <div key={item.code}
                      className={`relative rounded-[11px] border p-2.5 transition-all ${
                        item.status === "ongoing"
                          ? "border-[rgba(63,185,80,0.28)] bg-[rgba(63,185,80,0.04)]"
                          : "border-[var(--color-border)] bg-[rgba(11,16,21,0.65)] hover:-translate-y-0.5"
                      }`}>
                      {item.status === "ongoing" && (
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[11px] bg-[#3fb950]" />
                      )}
                      <div className="flex items-center justify-between gap-3 pl-1.5">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[9px] font-mono font-bold text-[var(--color-text-muted)] border border-[var(--color-border)] rounded px-1 py-px bg-[rgba(11,16,21,0.5)]">{item.code}</span>
                            {item.isLab && <span className="text-[7px] font-bold uppercase px-1.5 py-px rounded-full bg-[rgba(163,113,247,0.14)] text-[#b38eff]">LAB</span>}
                            {item.status === "ongoing" && <span className="h-1.5 w-1.5 rounded-full bg-[#3fb950] animate-pulse" />}
                          </div>
                          <p className="text-[12px] font-bold text-[var(--color-text-primary)] truncate">{item.name}</p>
                          <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">{item.teacher}</p>
                        </div>
                        <div className="text-right shrink-0 space-y-1">
                          <p className="text-[11px] font-mono font-bold text-[var(--color-text-primary)]">{item.time}</p>
                          <div className="flex items-center justify-end gap-1 text-[9px] text-[var(--color-text-muted)]">
                            <FiMapPin size={8} /><span>Room {item.room}</span>
                          </div>
                          {item.status === "ongoing" && item.progress != null && (
                            <div className="w-14">
                              <p className="text-[8px] font-bold text-[#3fb950] mb-0.5">{item.progress}% done</p>
                              <div className="h-0.5 rounded-full bg-[var(--color-border)] overflow-hidden">
                                <div className="h-full bg-[#3fb950] rounded-full" style={{ width: `${item.progress}%` }} />
                              </div>
                            </div>
                          )}
                          {item.status === "done"     && <p className="text-[8px] font-bold uppercase text-[var(--color-text-muted)]">Done</p>}
                          {item.status === "upcoming" && <p className="text-[8px] font-bold uppercase text-[#8fb5ff]">Soon</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Courses ── */}
            {active === "courses" && (
              <div className="rounded-[15px] border border-[var(--color-border)] bg-[rgba(17,23,32,0.8)] p-3">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-[11px] font-semibold text-[var(--color-text-primary)]">Course Selection</p>
                  <span className="text-[9px] text-[var(--color-text-muted)]">Routine updates on save</span>
                </div>
                <div className="space-y-2">
                  {[
                    { code:"CSE 3101", name:"Data Structures",  credits:"3 cr", accent:"#6f93da" },
                    { code:"CSE 3103", name:"Algorithm Design",  credits:"3 cr", accent:"#3fb950" },
                    { code:"CSE 3105", name:"Database Systems",  credits:"3 cr", accent:"#a371f7" },
                    { code:"CSE 3107", name:"Operating Systems", credits:"3 cr", accent:"#c59d4a" },
                  ].map((item) => {
                    const isSaved = saved.includes(item.code);
                    return (
                      <button key={item.code}
                        onClick={() => setSaved((p) => isSaved ? p.filter((c) => c !== item.code) : [...p, item.code])}
                        className="w-full flex items-center justify-between rounded-[11px] border px-2.5 py-2 text-left transition-all duration-150 cursor-pointer hover:-translate-y-0.5"
                        style={{
                          background:   isSaved ? `${item.accent}0d` : "rgba(11,16,21,0.65)",
                          borderColor:  isSaved ? `${item.accent}35` : "var(--color-border)",
                        }}>
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-[8px] flex items-center justify-center text-[10px] font-bold shrink-0"
                            style={{ background:`${item.accent}18`, color:item.accent }}>
                            {item.code.split(" ")[1]}
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-[var(--color-text-primary)]">{item.name}</p>
                            <p className="text-[9px] text-[var(--color-text-muted)]">{item.code} · {item.credits}</p>
                          </div>
                        </div>
                        <div className="h-6 w-6 rounded-full border flex items-center justify-center transition-all"
                          style={{ borderColor: isSaved ? item.accent : "var(--color-border)", background: isSaved ? `${item.accent}20` : "transparent" }}>
                          {isSaved ? <FiCheck size={10} style={{ color:item.accent }} /> : <FiPlus size={10} className="text-[var(--color-text-muted)]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Manage ── */}
            {active === "manage" && (
              <div className="rounded-[15px] border border-[var(--color-border)] bg-[rgba(17,23,32,0.8)] p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-[var(--color-text-primary)]">Admin Panel</p>
                  <span className="text-[9px] font-semibold rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[#ffe08a]">Admin Only</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label:"Departments", value:"6",       accent:"#6f93da" },
                    { label:"Batches",     value:"8",       accent:"#9a7bd9" },
                    { label:"Teachers",    value:"12",      accent:"#3fb950" },
                    { label:"Courses",     value:"34",      accent:"#c59d4a" },
                    { label:"Rooms",       value:"11",      accent:"#d96b64" },
                    { label:"Schedules",   value:"84 slots",accent:"#6f93da" },
                  ].map((item) => (
                    <div key={item.label}
                      className="flex items-center gap-2 rounded-[11px] border border-[var(--color-border)] bg-[rgba(11,16,21,0.65)] px-2.5 py-2 hover:-translate-y-0.5 transition-all cursor-pointer">
                      <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background:item.accent }} />
                      <div>
                        <p className="text-[12px] font-bold font-mono text-[var(--color-text-primary)]">{item.value}</p>
                        <p className="text-[9px] text-[var(--color-text-muted)]">{item.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between rounded-[11px] border border-[var(--color-border)] bg-[rgba(11,16,21,0.65)] px-3 py-2">
                  <span className="text-[10px] font-medium text-[var(--color-text-secondary)]">Conflict Resolver</span>
                  <span className="text-[8px] font-bold rounded bg-[rgba(63,185,80,0.12)] text-[#3fb950] px-1.5 py-0.5 border border-[rgba(63,185,80,0.2)]">ON</span>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
