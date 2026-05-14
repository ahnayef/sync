import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Loop — the schedule management app built for modern students and institutions.",
};

export default function AboutPage() {
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
                About Loop
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
              Built for students,{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #4f8ef7, #a371f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                loved by admins
              </span>
            </h1>
            <p
              style={{
                fontSize: "17px",
                lineHeight: 1.7,
                color: "var(--color-text-secondary)",
                maxWidth: "600px",
              }}
            >
              Loop was born out of frustration with messy, outdated class scheduling systems. We
              built something minimal, fast, and actually pleasant to use every day.
            </p>
          </div>

          {/* Mission */}
          <div
            style={{
              borderRadius: "16px",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-surface)",
              padding: "40px",
              marginBottom: "32px",
            }}
          >
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "16px" }}>
              Our Mission
            </h2>
            <p style={{ fontSize: "15px", lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
              We believe every student deserves a clear, up-to-date view of their schedule without
              the friction of outdated portals. Loop makes it effortless to know where you need to
              be and when — with real-time information and a clean interface that gets out of your way.
            </p>
          </div>

          {/* Values Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px",
              marginBottom: "64px",
            }}
          >
            {[
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
            ].map((val) => (
              <div
                key={val.title}
                style={{
                  borderRadius: "14px",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-bg-surface)",
                  padding: "28px",
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    color: val.color,
                    marginBottom: "14px",
                    filter: `drop-shadow(0 0 8px ${val.color}80)`,
                  }}
                >
                  {val.icon}
                </div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    marginBottom: "8px",
                  }}
                >
                  {val.title}
                </h3>
                <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                  {val.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Team / Stats */}
          <div
            style={{
              borderRadius: "16px",
              border: "1px solid rgba(79,142,247,0.15)",
              background: "linear-gradient(135deg, rgba(79,142,247,0.06) 0%, rgba(163,113,247,0.06) 100%)",
              padding: "48px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "var(--color-text-primary)",
                marginBottom: "40px",
              }}
            >
              Trusted by learners
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "32px",
              }}
            >
              {[
                { value: "2,400+", label: "Students" },
                { value: "180+", label: "Courses" },
                { value: "40+", label: "Instructors" },
                { value: "99.9%", label: "Uptime" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p
                    style={{
                      fontSize: "32px",
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      background: "linear-gradient(135deg, #4f8ef7, #a371f7)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      marginBottom: "6px",
                    }}
                  >
                    {stat.value}
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>{stat.label}</p>
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
