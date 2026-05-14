import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Loop team. We're here to help.",
};

export default function ContactPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-bg-base)" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "64px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "5px 14px",
                borderRadius: "100px",
                border: "1px solid rgba(79,142,247,0.3)",
                background: "rgba(79,142,247,0.08)",
                marginBottom: "24px",
              }}
            >
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#4f8ef7", letterSpacing: "0.04em" }}>
                Get in touch
              </span>
            </div>
            <h1
              style={{
                fontSize: "clamp(36px, 5vw, 56px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "var(--color-text-primary)",
                marginBottom: "20px",
                lineHeight: 1.1,
              }}
            >
              We&apos;d love to{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #4f8ef7, #a371f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                hear from you
              </span>
            </h1>
            <p
              style={{
                fontSize: "17px",
                lineHeight: 1.7,
                color: "var(--color-text-secondary)",
                maxWidth: "500px",
              }}
            >
              Have a question, found a bug, or just want to say hello? Drop us a message below.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.6fr",
              gap: "32px",
              alignItems: "start",
            }}
          >
            {/* Contact Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  ),
                  label: "Email",
                  value: "hello@loop.edu",
                  color: "#4f8ef7",
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  ),
                  label: "Address",
                  value: "123 Campus Lane, Edu City",
                  color: "#a371f7",
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  ),
                  label: "Support Hours",
                  value: "Mon–Fri, 9 AM – 6 PM",
                  color: "#3fb950",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    borderRadius: "12px",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-bg-surface)",
                    padding: "20px",
                    display: "flex",
                    gap: "14px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      background: `${item.color}18`,
                      border: `1px solid ${item.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: item.color,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div
              style={{
                borderRadius: "16px",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-surface)",
                padding: "36px",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  marginBottom: "24px",
                }}
              >
                Send a message
              </h2>
              <form style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {[
                    { id: "contact-first-name", label: "First Name", placeholder: "Jane" },
                    { id: "contact-last-name", label: "Last Name", placeholder: "Doe" },
                  ].map((field) => (
                    <div key={field.id}>
                      <label
                        htmlFor={field.id}
                        style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: "8px" }}
                      >
                        {field.label}
                      </label>
                      <input
                        id={field.id}
                        type="text"
                        placeholder={field.placeholder}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          border: "1px solid var(--color-border)",
                          background: "var(--color-bg-elevated)",
                          color: "var(--color-text-primary)",
                          fontSize: "14px",
                          outline: "none",
                          transition: "border-color 0.2s",
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: "8px" }}
                  >
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="jane@university.edu"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-bg-elevated)",
                      color: "var(--color-text-primary)",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: "8px" }}
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    placeholder="How can we help?"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-bg-elevated)",
                      color: "var(--color-text-primary)",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: "8px" }}
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    placeholder="Describe your question or issue in detail..."
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-bg-elevated)",
                      color: "var(--color-text-primary)",
                      fontSize: "14px",
                      outline: "none",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <button
                  id="contact-submit"
                  type="submit"
                  style={{
                    padding: "13px 24px",
                    borderRadius: "9px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "white",
                    background: "linear-gradient(135deg, #4f8ef7, #6f6bf7)",
                    boxShadow: "0 0 24px rgba(79,142,247,0.3)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
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
