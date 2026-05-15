import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiCalendar, FiBook, FiZap, FiUsers, FiHome, FiMoon } from "react-icons/fi";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loop — Smart Schedule Management",
  description:
    "Loop is a modern schedule management app for students and administrators. View your routine, manage courses, and stay on track.",
};

const features = [
  {
    icon: <FiCalendar />,
    title: "Daily Routine View",
    desc: "See your class schedule for any day at a glance, with gaps, room info, and teacher details.",
    color: "#4f8ef7",
  },
  {
    icon: <FiBook />,
    title: "Course Selection",
    desc: "Pick the courses that matter to you. Your routine automatically updates to match.",
    color: "#3fb950",
  },
  {
    icon: <FiZap />,
    title: "Smart Import",
    desc: "Admins can upload Excel sheets and Loop intelligently parses and validates schedule data.",
    color: "#a371f7",
  },
  {
    icon: <FiUsers />,
    title: "Multi-role Access",
    desc: "Students get a clean view. Admins get powerful management tools. Everyone gets what they need.",
    color: "#d29922",
  },
  {
    icon: <FiHome />,
    title: "Room & Teacher Mgmt",
    desc: "Manage all rooms, teachers, and courses from a single clean admin dashboard.",
    color: "#f85149",
  },
  {
    icon: <FiMoon />,
    title: "Dark & Minimal",
    desc: "Beautiful dark interface that's easy on the eyes, whether it's 8 AM or midnight.",
    color: "#4f8ef7",
  },
];

const sidebarItems = ["Routine", "Courses", "Profile"];
const previewCards = [
  { color: "#4f8ef7", width: "80%" },
  { color: "#3fb950", width: "70%" },
  { color: "#a371f7", width: "75%" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg-base)]">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-6 pb-[100px] pt-[120px] text-center">
        {/* Glow blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-120px] h-[500px] w-[800px] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(79,142,247,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[20%] top-[40px] h-[400px] w-[400px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(163,113,247,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-[760px]">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/[0.08] px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#4f8ef7] shadow-[0_0_8px_#4f8ef7]" />
            <span className="text-xs font-semibold tracking-[0.04em] text-[#4f8ef7]">
              Smart Schedule Management
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-[clamp(40px,6vw,72px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[var(--color-text-primary)]">
            Your schedule,{" "}
            <span className="gradient-text">perfectly organized</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-12 max-w-[580px] text-lg leading-[1.7] text-[var(--color-text-secondary)]">
            Loop keeps students on top of their class routines and gives admins
            powerful tools to manage schedules — all in one minimal, beautiful app.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              id="hero-cta-signup"
              className="rounded-[10px] bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] px-8 py-3.5 text-[15px] font-semibold text-white no-underline shadow-[0_0_30px_rgba(79,142,247,0.35),0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-200 hover:shadow-[0_0_40px_rgba(79,142,247,0.5)]"
            >
              Get started free
            </Link>
            <Link
              href="/about"
              id="hero-cta-learn"
              className="rounded-[10px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-8 py-3.5 text-[15px] font-semibold text-[var(--color-text-secondary)] no-underline transition-all duration-200 hover:border-white/20 hover:text-white/80"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* ── Mock Dashboard Preview ── */}
      <section className="relative px-6 pb-20">
        <div className="mx-auto max-w-[1000px]">
          <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] shadow-[0_40px_120px_rgba(0,0,0,0.5),0_0_0_1px_rgba(79,142,247,0.05)]">

            {/* Mock browser bar */}
            <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3">
              {["#f85149", "#d29922", "#3fb950"].map((c) => (
                <div
                  key={c}
                  className="h-2.5 w-2.5 rounded-full opacity-80"
                  style={{ background: c }}
                />
              ))}
              <div className="ml-2 flex flex-1 items-center gap-2 rounded-[6px] bg-[var(--color-bg-subtle)] py-1 pl-3">
                <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-border)]" />
                <div className="h-1.5 w-[120px] rounded-[3px] bg-[var(--color-border)]" />
              </div>
            </div>

            {/* Mock routine preview */}
            <div className="flex h-80">
              {/* Sidebar */}
              <div className="flex w-[180px] shrink-0 flex-col gap-1.5 border-r border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3">
                {sidebarItems.map((label, i) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-[7px] px-2.5 py-2"
                    style={{
                      background: i === 0 ? "var(--color-accent-muted)" : "transparent",
                      border: i === 0
                        ? "1px solid rgba(79,142,247,0.2)"
                        : "1px solid transparent",
                    }}
                  >
                    <div
                      className="h-3.5 w-3.5 rounded-[3px]"
                      style={{
                        background: i === 0 ? "#4f8ef7" : "var(--color-border)",
                        opacity: i === 0 ? 1 : 0.5,
                      }}
                    />
                    <div
                      className="h-2 rounded"
                      style={{
                        width: `${60 - i * 10}px`,
                        background: i === 0 ? "#4f8ef7" : "var(--color-border)",
                        opacity: i === 0 ? 1 : 0.4,
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Content area */}
              <div className="flex-1 overflow-y-auto p-5">
                <div className="mb-4 h-5 w-40 rounded-[6px] bg-[var(--color-bg-subtle)]" />
                {previewCards.map((card, i) => (
                  <div
                    key={i}
                    className="mb-2.5 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3.5"
                    style={{ borderLeft: `3px solid ${card.color}` }}
                  >
                    <div className="mb-2 flex gap-2">
                      <div
                        className="h-2 w-[50px] rounded opacity-80"
                        style={{ background: card.color }}
                      />
                      <div
                        className="h-2 rounded bg-[var(--color-border)]"
                        style={{ width: card.width }}
                      />
                    </div>
                    <div className="h-1.5 w-[60%] rounded bg-[var(--color-bg-subtle)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 pb-24 pt-16">
        <div className="mx-auto max-w-[1100px]">
          {/* Section header */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-[clamp(28px,4vw,44px)] font-bold tracking-[-0.02em] text-[var(--color-text-primary)]">
              Everything you need
            </h2>
            <p className="mx-auto max-w-[480px] text-base leading-relaxed text-[var(--color-text-secondary)]">
              A complete platform for both students and administrators.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/10"
              >
                {/* Icon box — dynamic color per card */}
                <div
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-[10px] text-[22px]"
                  style={{
                    background: `${feat.color}18`,
                    border: `1px solid ${feat.color}30`,
                  }}
                >
                  {feat.icon}
                </div>
                <h3 className="mb-2 text-base font-semibold text-[var(--color-text-primary)]">
                  {feat.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-[800px]">
          <div className="relative overflow-hidden rounded-[20px] border border-blue-400/20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 px-12 py-16 text-center">
            {/* Inner glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[-60px] h-[200px] w-[400px] -translate-x-1/2"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(79,142,247,0.15) 0%, transparent 70%)",
              }}
            />

            <h2 className="relative mb-4 text-[clamp(24px,3vw,36px)] font-bold tracking-[-0.02em] text-[var(--color-text-primary)]">
              Ready to get organized?
            </h2>
            <p className="relative mx-auto mb-9 max-w-[400px] text-base leading-relaxed text-[var(--color-text-secondary)]">
              Join students and administrators already using Loop to stay on schedule.
            </p>

            <div className="relative flex flex-wrap justify-center gap-4">
              <Link
                href="/signup"
                id="cta-signup"
                className="rounded-[10px] bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] px-7 py-3 text-[15px] font-semibold text-white no-underline shadow-[0_0_30px_rgba(79,142,247,0.35)] transition-all duration-200 hover:shadow-[0_0_40px_rgba(79,142,247,0.5)]"
              >
                Create free account
              </Link>
              <Link
                href="/login"
                id="cta-login"
                className="rounded-[10px] border border-[var(--color-border)] bg-[rgba(13,17,23,0.6)] px-7 py-3 text-[15px] font-semibold text-[var(--color-text-secondary)] no-underline transition-all duration-200 hover:border-white/20 hover:text-white/80"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
