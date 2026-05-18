import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Loop team. We're here to help.",
};

const contactItems = [
  {
    label: "Email",
    value: "hello@loop.edu",
    color: "#4f8ef7",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    label: "Address",
    value: "123 Campus Lane, Edu City",
    color: "#a371f7",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    label: "Support Hours",
    value: "Mon–Fri, 9 AM – 6 PM",
    color: "#3fb950",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
];

const nameFields = [
  { id: "contact-first-name", label: "First Name", placeholder: "Jane" },
  { id: "contact-last-name",  label: "Last Name",  placeholder: "Doe" },
];

/* Shared input className */
const inputCls =
  "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] outline-none transition-colors duration-200 focus:border-blue-400/50";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg-base)]">
      <Navbar />

      <main className="flex-1 px-6 py-20">
        <div className="mx-auto max-w-[900px]">

          {/* ── Header ── */}
          <div className="mb-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/[0.08] px-3.5 py-1">
              <span className="text-xs font-semibold tracking-[0.04em] text-[#4f8ef7]">
                Get in touch
              </span>
            </div>

            <h1 className="mb-5 text-[clamp(36px,5vw,56px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[var(--color-text-primary)]">
              We&apos;d love to{" "}
              <span className="gradient-text">hear from you</span>
            </h1>

            <p className="max-w-[500px] text-[17px] leading-[1.7] text-[var(--color-text-secondary)]">
              Have a question, found a bug, or just want to say hello? Drop us a message below.
            </p>
          </div>

          {/* ── Two-column layout ── */}
          <div className="grid items-start gap-8 [grid-template-columns:1fr_1.6fr]">

            {/* Contact info cards */}
            <div className="flex flex-col gap-4">
              {contactItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5"
                >
                  {/* Icon box — dynamic color kept as inline style */}
                  <div
                    className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px]"
                    style={{
                      background: `${item.color}18`,
                      border: `1px solid ${item.color}30`,
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                      {item.label}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact form */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-9">
              <h2 className="mb-6 text-lg font-bold text-[var(--color-text-primary)]">
                Send a message
              </h2>

              <form className="flex flex-col gap-[18px]">
                {/* First / Last name row */}
                <div className="grid grid-cols-2 gap-4">
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

                {/* Email */}
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

                {/* Subject */}
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

                {/* Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-[13px] font-medium text-[var(--color-text-secondary)]"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    placeholder="Describe your question or issue in detail..."
                    className={`${inputCls} resize-y font-[inherit]`}
                  />
                </div>

                {/* Submit */}
                <button
                  id="contact-submit"
                  type="submit"
                  className="cursor-pointer rounded-[9px] border-none bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_0_24px_rgba(79,142,247,0.3)] transition-all duration-200 hover:shadow-[0_0_32px_rgba(79,142,247,0.5)]"
                >
                  Send message →
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
