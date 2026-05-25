"use client";

import { useState, FormEvent } from "react";
import { FiArrowRight, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const inputCls =
  "w-full rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2.5 sm:py-3 text-sm text-[var(--color-text-primary)] outline-none transition-colors duration-200 placeholder:text-[var(--color-text-muted)] focus:border-blue-400/50";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setError(data.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[rgba(11,16,21,0.4)] p-6 sm:p-8 backdrop-blur-xs">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {success && (
          <div className="flex items-center gap-3 rounded-xl border border-green-500/25 bg-green-500/10 p-4 text-sm text-green-400">
            <FiCheckCircle size={18} className="shrink-0" />
            <div>
              <p className="font-semibold">Message sent successfully!</p>
              <p className="text-xs text-green-500/80">It has been forwarded to our Telegram channel.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-400">
            <FiAlertCircle size={18} className="shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div>
          <label
            htmlFor="contact-name"
            className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]"
          >
            Full Name
          </label>
          <input
            id="contact-name"
            type="text"
            required
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
            disabled={submitting}
          />
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]"
          >
            Email Address
          </label>
          <input
            id="contact-email"
            type="email"
            required
            placeholder="jane@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
            disabled={submitting}
          />
        </div>

        <div>
          <label
            htmlFor="contact-subject"
            className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]"
          >
            Subject
          </label>
          <input
            id="contact-subject"
            type="text"
            required
            placeholder="How can we help?"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={inputCls}
            disabled={submitting}
          />
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            placeholder="Describe your question or issue in detail..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${inputCls} resize-none font-[inherit]`}
            disabled={submitting}
          />
        </div>

        <button
          id="contact-submit"
          type="submit"
          disabled={submitting}
          className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] px-4 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(79,142,247,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(79,142,247,0.42)] active:scale-95 disabled:pointer-events-none disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Send message"}
          {!submitting && <FiArrowRight />}
        </button>
      </form>
    </div>
  );
}
