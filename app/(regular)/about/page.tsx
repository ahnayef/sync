import Link from "next/link";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { FiArrowRight, FiShield, FiUsers, FiLayout } from "react-icons/fi";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Sync — the schedule management app built for modern students and institutions.",
};

const values = [
  {
    title: "Simplicity First",
    desc: "Every design decision is made with one question: does this make things easier?",
    icon: FiLayout,
    color: "#4f8ef7",
  },
  {
    title: "Student-Centered",
    desc: "We listen to students. The routine page is designed around how students actually think.",
    icon: FiUsers,
    color: "#3fb950",
  },
  {
    title: "Reliable Data",
    desc: "Smart import, intelligent validation, and preview before save — your data stays clean.",
    icon: FiShield,
    color: "#a371f7",
  },
];

const heroHighlights = [
  { value: "Clear", label: "student routines" },
  { value: "Fast", label: "admin workflows" },
  { value: "Calm", label: "daily experience" },
];

const stats = [
  { value: "2,400+", label: "Students" },
  { value: "180+", label: "Courses" },
  { value: "40+", label: "Instructors" },
  { value: "99.9%", label: "Uptime" },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg-base)]">

      <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1120px]">
          <section className="relative overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-[linear-gradient(135deg,rgba(17,23,32,0.94),rgba(21,28,37,0.92))] px-6 py-10 shadow-[0_30px_100px_rgba(0,0,0,0.28)] sm:px-10 sm:py-12 lg:px-12 lg:py-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-[-90px] top-[-90px] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(79,142,247,0.18),transparent_68%)] blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[-60px] bottom-[-80px] h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(163,113,247,0.12),transparent_68%)] blur-3xl"
            />

            <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-12">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-[#8ab2ff]">
                  ABOUT Sync
                </div>

                <h1 className="max-w-3xl text-[clamp(26px,6vw,48px)] font-extrabold leading-[0.98] tracking-[-0.05em] text-[var(--color-text-primary)]">
                  Built for students, <span className="gradient-text">trusted by the people who run the schedule</span>
                </h1>

                <p className="mt-6 max-w-2xl text-sm md:text-[17px] leading-8 text-[var(--color-text-secondary)]">
                  Sync was created to replace cluttered, outdated class scheduling systems with something calm, fast, and genuinely useful every day.
                </p>
              </div>

              <div className="grid gap-3 rounded-[24px] border border-[var(--color-border)] bg-[rgba(11,16,21,0.66)] p-3 sm:grid-cols-3 lg:grid-cols-1">
                {heroHighlights.map((highlight) => (
                  <div key={highlight.label} className="rounded-[18px] border border-[var(--color-border)] bg-[rgba(17,23,32,0.8)] p-3 sm:p-4">
                    <p className="gradient-text text-[clamp(22px,3.5vw,30px)] font-extrabold tracking-[-0.03em]">{highlight.value}</p>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">{highlight.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:gap-6">
            <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Our mission</p>
              <h2 className="mt-3 text-[clamp(20px,3vw,30px)] font-bold tracking-[-0.03em] text-[var(--color-text-primary)]">
                Make the schedule obvious.
              </h2>
              <p className="mt-4 text-sm md:text-[15px] leading-7 text-[var(--color-text-secondary)]">
                Every student should be able to see where they need to be without digging through dense portals, confusing tables, or stale information. Sync keeps that answer clear and current.
              </p>
              <p className="mt-4 text-sm md:text-[15px] leading-7 text-[var(--color-text-secondary)]">
                That same clarity matters for admins too. Sync keeps the import, validation, and publishing flow straightforward so schedule updates stay accurate instead of fragile.
              </p>
              <Link
                href="/signup"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-semibold text-white no-underline shadow-[0_18px_40px_rgba(79,142,247,0.24)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Start using Sync
                <FiArrowRight />
              </Link>
            </div>

            <div className="rounded-[28px] border border-[var(--color-border)] bg-[rgba(17,23,32,0.72)] p-6 sm:p-8">
              <div className="mb-6 flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                  Design principles
                </p>
                <h3 className="text-[clamp(22px,3vw,30px)] font-bold tracking-[-0.03em] text-[var(--color-text-primary)]">
                  The ideas behind the product
                </h3>
              </div>

              <div className="divide-y divide-[var(--color-border)] overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-[rgba(11,16,21,0.45)]">
                {values.map((val) => {
                  const Icon = val.icon;
                  return (
                    <div
                      key={val.title}
                      className="group flex gap-4 p-4 sm:gap-5 sm:p-6 transition-colors duration-200 hover:bg-[rgba(21,28,37,0.7)]"
                    >
                      <div
                        className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-[16px] text-[22px] transition-transform duration-200 group-hover:scale-105"
                        style={{
                          background: `${val.color}18`,
                          border: `1px solid ${val.color}2f`,
                          color: val.color,
                          filter: `drop-shadow(0 0 8px ${val.color}40)`,
                        }}
                      >
                        <Icon />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold tracking-[-0.02em] text-[var(--color-text-primary)]">
                          {val.title}
                        </h3>
                        <p className="mt-1 max-w-[34rem] text-sm md:text-base leading-7 text-[var(--color-text-secondary)]">
                          {val.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-[28px] border border-blue-400/15 bg-[linear-gradient(135deg,rgba(79,142,247,0.08),rgba(163,113,247,0.06))] px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex flex-col gap-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9fc0ff]">Trusted by learners</p>
              <h2 className="text-[clamp(22px,3vw,30px)] font-bold tracking-[-0.03em] text-[var(--color-text-primary)]">
                Measurable scale, without the heavy interface.
              </h2>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-[20px] border border-[var(--color-border)] bg-[rgba(17,23,32,0.72)] p-4 sm:p-5 text-center">
                  <p className="gradient-text text-[clamp(20px,4vw,32px)] sm:text-[clamp(24px,4vw,36px)] font-extrabold tracking-[-0.03em]">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
