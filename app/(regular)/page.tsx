import Link from "next/link";
import Footer from "@/components/Footer";
import {
  FiCalendar,
  FiBook,
  FiZap,
  FiUsers,
  FiHome,
  FiMoon,
  FiArrowRight,
  FiShield,
  FiClock,
  FiSliders,
} from "react-icons/fi";
import type { Metadata } from "next";
import { LogoIcon } from "@/components/Icon";

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

const stats = [
  { value: "24/7", label: "routine access" },
  { value: "1", label: "dashboard for every role" },
  { value: "Fast", label: "schedule updates" },
];

const routineItems = [
  {
    time: "08:30",
    title: "Discrete Mathematics",
    meta: "Room 402 · Prof. Karim",
    accent: "#4f8ef7",
  },
  {
    time: "10:00",
    title: "Database Systems",
    meta: "Lab 2 · Dr. Nahar",
    accent: "#3fb950",
  },
  {
    time: "01:15",
    title: "Software Engineering",
    meta: "Room 105 · Team project",
    accent: "#a371f7",
  },
];

const insightCards = [
  { label: "Today", value: "5 classes", hint: "2 gaps" },
  { label: "Imported", value: "98%", hint: "validated" },
  { label: "Changes", value: "Live", hint: "instant sync" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg-base)]">
      <section className="relative overflow-hidden px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[-180px] mx-auto h-[520px] w-[920px] max-w-full rounded-full bg-[radial-gradient(circle_at_center,rgba(79,142,247,0.18),transparent_62%)] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[8%] top-[6rem] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(163,113,247,0.11),transparent_68%)] blur-2xl"
        />

        <div className="relative mx-auto max-w-[1180px]">
          {/* <div className="mb-10 flex items-center justify-between rounded-full border border-[var(--color-border)] bg-[rgba(13,17,23,0.72)] px-4 py-3 backdrop-blur md:px-5">
            <div className="flex items-center gap-3">
              <LogoIcon className="h-9 w-9" />
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">Loop</p>
                <p className="text-xs text-[var(--color-text-muted)]">Schedule management for campus teams</p>
              </div>
            </div>
            <div className="hidden items-center gap-6 text-sm text-[var(--color-text-secondary)] md:flex">
              <Link href="/about" className="transition-colors hover:text-[var(--color-text-primary)]">About</Link>
              <Link href="/contact" className="transition-colors hover:text-[var(--color-text-primary)]">Contact</Link>
              <Link href="/login" className="transition-colors hover:text-[var(--color-text-primary)]">Login</Link>
            </div>
          </div> */}

          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-[#8ab2ff]">
                <span className="glow-dot" />
                SMART SCHEDULE MANAGEMENT
              </div>

              <h1 className="text-[clamp(42px,7vw,78px)] font-extrabold leading-[0.98] tracking-[-0.05em] text-[var(--color-text-primary)] animate-fade-in">
                Your routine, shaped into a cleaner workday.
              </h1>

              <p className="mt-6 max-w-[640px] text-base leading-8 text-[var(--color-text-secondary)] sm:text-lg">
                Loop gives students a fast, readable routine view and gives admins the controls to
                import, validate, and manage schedules without turning the dashboard into a maze.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
                <Link
                  href="/signup"
                  id="hero-cta-signup"
                  className="group inline-flex items-center gap-2 rounded-[14px] bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] px-6 py-3.5 text-sm font-semibold text-white no-underline shadow-[0_18px_45px_rgba(79,142,247,0.28)] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Get started
                  <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/about"
                  id="hero-cta-learn"
                  className="inline-flex items-center gap-2 rounded-[14px] border border-[var(--color-border)] bg-[rgba(17,23,32,0.7)] px-6 py-3.5 text-sm font-semibold text-[var(--color-text-secondary)] no-underline transition-colors duration-200 hover:border-white/15 hover:text-[var(--color-text-primary)]"
                >
                  See how it works
                </Link>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[18px] border border-[var(--color-border)] bg-[rgba(17,23,32,0.66)] p-4 text-center shadow-[0_20px_45px_rgba(0,0,0,0.18)] backdrop-blur"
                  >
                    <div className="text-2xl font-bold tracking-[-0.04em] text-[var(--color-text-primary)]">{stat.value}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top,rgba(79,142,247,0.15),transparent_48%)] blur-2xl" />
              <div className="relative overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[rgba(13,17,23,0.9)] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
                <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[rgba(21,28,37,0.85)] px-4 py-3">
                  {["#f85149", "#d29922", "#3fb950"].map((c) => (
                    <div key={c} className="h-2.5 w-2.5 rounded-full opacity-90" style={{ background: c }} />
                  ))}
                  <div className="ml-2 flex flex-1 items-center gap-3 rounded-[10px] border border-[var(--color-border)] bg-[rgba(11,16,21,0.72)] px-3 py-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#4f8ef7]" />
                    <div className="h-2 w-32 rounded-full bg-[var(--color-border)] sm:w-40" />
                  </div>
                </div>

                <div className="grid gap-0 lg:grid-cols-[180px_1fr]">
                  <aside className="border-b border-[var(--color-border)] bg-[rgba(21,28,37,0.82)] p-4 lg:border-b-0 lg:border-r">
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

                    <div className="space-y-2">
                        {[
                          { icon: FiSliders, label: "Routine" },
                          { icon: FiBook, label: "Courses" },
                          { icon: FiUsers, label: "People" },
                          { icon: FiShield, label: "Admin" },
                        ].map(({ icon: Icon, label }, index) => (
                        <div
                          key={label}
                          className="flex items-center gap-3 rounded-[14px] border px-3 py-2.5 text-sm"
                          style={{
                            background:
                              index === 0 ? "var(--color-accent-muted)" : "rgba(11,16,21,0.4)",
                            borderColor:
                              index === 0 ? "rgba(79,142,247,0.22)" : "transparent",
                          }}
                        >
                          <Icon
                            className={index === 0 ? "text-[#8fb5ff]" : "text-[var(--color-text-muted)]"}
                          />
                          <span
                            className={
                              index === 0
                                ? "font-medium text-[var(--color-text-primary)]"
                                : "text-[var(--color-text-secondary)]"
                            }
                          >
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </aside>

                  <div className="grid gap-4 p-4 sm:p-5">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {insightCards.map((card) => (
                        <div key={card.label} className="rounded-[18px] border border-[var(--color-border)] bg-[rgba(17,23,32,0.75)] p-4">
                          <div className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">{card.label}</div>
                          <div className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[var(--color-text-primary)]">{card.value}</div>
                          <div className="mt-1 text-sm text-[var(--color-text-secondary)]">{card.hint}</div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-[22px] border border-[var(--color-border)] bg-[rgba(17,23,32,0.8)] p-4 sm:p-5">
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-[var(--color-text-primary)]">Routine preview</p>
                          <p className="text-sm text-[var(--color-text-muted)]">A clean, scannable day view</p>
                        </div>
                        <span className="rounded-full border border-[#3fb95033] bg-[#3fb95014] px-3 py-1 text-xs font-semibold text-[#8ae39d]">
                          Synced
                        </span>
                      </div>

                      <div className="space-y-3">
                        {routineItems.map((item) => (
                          <div
                            key={item.title}
                            className="rounded-[18px] border border-[var(--color-border)] bg-[rgba(11,16,21,0.72)] p-4 transition-transform duration-200 hover:-translate-y-0.5"
                            style={{ boxShadow: `inset 4px 0 0 ${item.accent}` }}
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                                  {item.time}
                                </div>
                                <div className="mt-1 text-base font-semibold text-[var(--color-text-primary)]">{item.title}</div>
                                <div className="mt-1 text-sm text-[var(--color-text-secondary)]">{item.meta}</div>
                              </div>
                              <div className="flex items-center gap-2 self-start rounded-full border border-[var(--color-border)] bg-[rgba(21,28,37,0.8)] px-3 py-1.5 text-xs text-[var(--color-text-secondary)] sm:self-center">
                                <span className="h-2 w-2 rounded-full" style={{ background: item.accent }} />
                                On track
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-10 flex flex-col gap-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Why it feels better</p>
            <h2 className="text-[clamp(28px,4vw,46px)] font-bold tracking-[-0.03em] text-[var(--color-text-primary)]">
              Focused tools, lighter interface.
            </h2>
            <p className="mx-auto max-w-[620px] text-base leading-7 text-[var(--color-text-secondary)]">
              The experience is designed to keep the important parts obvious: today’s routine, the next action, and the admin tools that actually matter.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="group rounded-[22px] border border-[var(--color-border)] bg-[rgba(17,23,32,0.72)] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-white/10 hover:bg-[rgba(21,28,37,0.92)]"
              >
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-[16px] text-[22px] transition-transform duration-200 group-hover:scale-105"
                  style={{
                    background: `${feat.color}18`,
                    border: `1px solid ${feat.color}2f`,
                    color: feat.color,
                  }}
                >
                  {feat.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold tracking-[-0.02em] text-[var(--color-text-primary)]">{feat.title}</h3>
                <p className="text-sm leading-7 text-[var(--color-text-secondary)]">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <div className="relative overflow-hidden rounded-[28px] border border-blue-400/20 bg-[linear-gradient(135deg,rgba(79,142,247,0.12),rgba(163,113,247,0.1))] px-6 py-10 sm:px-10 sm:py-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-[-80px] top-[-70px] h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(79,142,247,0.2),transparent_68%)] blur-2xl"
            />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9fc0ff]">Ready to get organized?</p>
                <h2 className="mt-3 text-[clamp(28px,4vw,42px)] font-bold tracking-[-0.03em] text-[var(--color-text-primary)]">
                  Make the routine look simple, even when the schedule is not.
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-[var(--color-text-secondary)]">
                  Students get a clear view. Admins get a faster workflow. Everyone gets a calmer interface that is easier to trust.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/signup"
                  id="cta-signup"
                  className="inline-flex items-center justify-center rounded-[14px] bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] px-6 py-3.5 text-sm font-semibold text-white no-underline shadow-[0_18px_45px_rgba(79,142,247,0.24)] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Create free account
                </Link>
                <Link
                  href="/login"
                  id="cta-login"
                  className="inline-flex items-center justify-center rounded-[14px] border border-[var(--color-border)] bg-[rgba(13,17,23,0.7)] px-6 py-3.5 text-sm font-semibold text-[var(--color-text-secondary)] no-underline transition-colors duration-200 hover:border-white/15 hover:text-[var(--color-text-primary)]"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
