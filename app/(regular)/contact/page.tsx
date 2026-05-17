import type { Metadata } from "next";
import { FiArrowRight, FiClock, FiMail, FiMapPin, FiMessageSquare } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Loop team. We're here to help.",
};

const contactItems = [
  {
    label: "Email",
    value: "hello@loop.edu",
    color: "#4f8ef7",
    icon: FiMail,
  },
  {
    label: "Address",
    value: "123 Campus Lane, Edu City",
    color: "#a371f7",
    icon: FiMapPin,
  },
  {
    label: "Support Hours",
    value: "Mon-Fri, 9 AM - 6 PM",
    color: "#3fb950",
    icon: FiClock,
  },
];

const nameFields = [
  { id: "contact-first-name", label: "First Name", placeholder: "Jane" },
  { id: "contact-last-name", label: "Last Name", placeholder: "Doe" },
];

const quickNotes = [
  "Typical response time: within one business day.",
  "For schedule issues, include the day and course name.",
  "Admins can mention the batch or department for faster routing.",
];

const inputCls =
  "w-full rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-3 text-sm text-[var(--color-text-primary)] outline-none transition-colors duration-200 placeholder:text-[var(--color-text-muted)] focus:border-blue-400/50";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg-base)]">
      <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1180px]">
          <section className="relative overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-[linear-gradient(135deg,rgba(17,23,32,0.95),rgba(21,28,37,0.92))] px-6 py-10 shadow-[0_30px_100px_rgba(0,0,0,0.28)] sm:px-10 sm:py-12 lg:px-12 lg:py-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-[-100px] top-[-100px] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(79,142,247,0.16),transparent_68%)] blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[-70px] bottom-[-90px] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(163,113,247,0.12),transparent_68%)] blur-3xl"
            />

            <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-12">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-[#8ab2ff]">
                  GET IN TOUCH
                </div>

                <h1 className="max-w-3xl text-[clamp(38px,6vw,64px)] font-extrabold leading-[0.98] tracking-[-0.05em] text-[var(--color-text-primary)]">
                  We&apos;d love to <span className="gradient-text">hear from you</span>
                </h1>

                <p className="mt-6 max-w-[560px] text-[17px] leading-8 text-[var(--color-text-secondary)]">
                  Have a question, found a bug, or want help with a schedule issue? Send a message and we&apos;ll route it to the right place.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  {quickNotes.map((note) => (
                    <div
                      key={note}
                      className="rounded-[18px] border border-[var(--color-border)] bg-[rgba(11,16,21,0.55)] px-4 py-3 text-sm leading-6 text-[var(--color-text-secondary)]"
                    >
                      {note}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 rounded-[24px] border border-[var(--color-border)] bg-[rgba(11,16,21,0.62)] p-4 sm:grid-cols-3 lg:grid-cols-1">
                {contactItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-[18px] border border-[var(--color-border)] bg-[rgba(17,23,32,0.85)] p-4"
                    >
                      <div
                        className="mb-4 flex h-11 w-11 items-center justify-center rounded-[14px]"
                        style={{
                          background: `${item.color}18`,
                          border: `1px solid ${item.color}30`,
                          color: item.color,
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#4f8ef718] text-[#8fb5ff]">
                  <FiMessageSquare size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">Support details</p>
                  <p className="text-sm text-[var(--color-text-muted)]">Quick context helps us reply faster.</p>
                </div>
              </div>

              <form className="flex flex-col gap-[18px]">
                <div className="grid gap-4 sm:grid-cols-2">
                  {nameFields.map((field) => (
                    <div key={field.id}>
                      <label
                        htmlFor={field.id}
                        className="mb-2 block text-[13px] font-medium text-[var(--color-text-secondary)]"
                      >
                        {field.label}
                      </label>
                      <input
                        id={field.id}
                        type="text"
                        placeholder={field.placeholder}
                        className={inputCls}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-[13px] font-medium text-[var(--color-text-secondary)]"
                  >
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="jane@university.edu"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="mb-2 block text-[13px] font-medium text-[var(--color-text-secondary)]"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    placeholder="How can we help?"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-[13px] font-medium text-[var(--color-text-secondary)]"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={6}
                    placeholder="Describe your question or issue in detail..."
                    className={`${inputCls} resize-y font-[inherit]`}
                  />
                </div>

                <button
                  id="contact-submit"
                  type="submit"
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_0_24px_rgba(79,142,247,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(79,142,247,0.45)]"
                >
                  Send message
                  <FiArrowRight />
                </button>
              </form>
            </div>

            <div className="rounded-[28px] border border-blue-400/15 bg-[linear-gradient(135deg,rgba(79,142,247,0.08),rgba(163,113,247,0.06))] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9fc0ff]">What happens next</p>
              <h2 className="mt-3 text-[clamp(22px,3vw,34px)] font-bold tracking-[-0.03em] text-[var(--color-text-primary)]">
                We keep the reply simple.
              </h2>

              <div className="mt-6 space-y-4">
                {[
                  "We read the message and identify the right team.",
                  "We reply with the next step or the information we need.",
                  "If it's a bug or schedule issue, we keep the update focused and actionable.",
                ].map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-4 rounded-[20px] border border-[var(--color-border)] bg-[rgba(17,23,32,0.72)] p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4f8ef718] text-sm font-semibold text-[#9fc0ff]">
                      0{index + 1}
                    </div>
                    <p className="text-sm leading-7 text-[var(--color-text-secondary)]">{step}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[20px] border border-[var(--color-border)] bg-[rgba(11,16,21,0.55)] p-4">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">Need urgent help?</p>
                <p className="mt-1 text-sm leading-7 text-[var(--color-text-secondary)]">
                  Include the course, day, and exact issue in the form. That gives us enough context to respond faster.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}