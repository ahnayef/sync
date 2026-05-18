import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Loop — the schedule management app built for modern students and institutions.",
};

const values = [
  {
    title: "Simplicity First",
    desc: "Every design decision is made with one question: does this make things easier?",
    icon: "✦",
    color: "#4f8ef7",
  },
  {
    title: "Student-Centered",
    desc: "We listen to students. The routine page is designed around how students actually think.",
    icon: "◈",
    color: "#3fb950",
  },
  {
    title: "Reliable Data",
    desc: "Smart import, intelligent validation, and preview before save — your data stays clean.",
    icon: "⬡",
    color: "#a371f7",
  },
];

const stats = [
  { value: "2,400+", label: "Students" },
  { value: "180+",   label: "Courses" },
  { value: "40+",    label: "Instructors" },
  { value: "99.9%",  label: "Uptime" },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg-base)]">
      <Navbar />

      <main className="flex-1 px-6 py-20">
        <div className="mx-auto max-w-[900px]">

          {/* ── Header ── */}
          <div className="mb-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/[0.08] px-3.5 py-1">
              <span className="text-xs font-semibold tracking-[0.04em] text-[#4f8ef7]">
                About Loop
              </span>
            </div>

            <h1 className="mb-5 text-[clamp(36px,5vw,56px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[var(--color-text-primary)]">
              Built for students,{" "}
              <span className="gradient-text">loved by admins</span>
            </h1>

            <p className="max-w-[600px] text-[17px] leading-[1.7] text-[var(--color-text-secondary)]">
              Loop was born out of frustration with messy, outdated class scheduling
              systems. We built something minimal, fast, and actually pleasant to use
              every day.
            </p>
          </div>

          {/* ── Mission ── */}
          <div className="mb-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-10">
            <h2 className="mb-4 text-[22px] font-bold text-[var(--color-text-primary)]">
              Our Mission
            </h2>
            <p className="text-[15px] leading-[1.8] text-[var(--color-text-secondary)]">
              We believe every student deserves a clear, up-to-date view of their
              schedule without the friction of outdated portals. Loop makes it
              effortless to know where you need to be and when — with real-time
              information and a clean interface that gets out of your way.
            </p>
          </div>

          {/* ── Values Grid ── */}
          <div className="mb-16 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
            {values.map((val) => (
              <div
                key={val.title}
                className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-7"
              >
                {/* Icon — dynamic glow color kept as inline style */}
                <div
                  className="mb-3.5 text-2xl"
                  style={{
                    color: val.color,
                    filter: `drop-shadow(0 0 8px ${val.color}80)`,
                  }}
                >
                  {val.icon}
                </div>
                <h3 className="mb-2 text-base font-semibold text-[var(--color-text-primary)]">
                  {val.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>

          {/* ── Stats ── */}
          <div className="rounded-2xl border border-blue-400/[0.15] bg-gradient-to-br from-blue-500/[0.06] to-purple-500/[0.06] px-12 py-12 text-center">
            <h2 className="mb-10 text-[22px] font-bold text-[var(--color-text-primary)]">
              Trusted by learners
            </h2>
            <div className="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="gradient-text mb-1.5 text-[32px] font-extrabold tracking-[-0.02em]">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
