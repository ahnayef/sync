import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loop — Smart Schedule Management",
  description:
    "Loop is a modern schedule management app for students and administrators. View your routine, manage courses, and stay on track.",
};

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--color-bg-base)",
      }}
    >
      <Navbar />

      {/* Hero */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "120px 24px 100px",
          textAlign: "center",
        }}
      >
        {/* Background glow blobs */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-120px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "500px",
            background:
              "radial-gradient(ellipse at center, rgba(79, 142, 247, 0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "40px",
            left: "20%",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(ellipse at center, rgba(163, 113, 247, 0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", maxWidth: "760px", margin: "0 auto" }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "100px",
              border: "1px solid rgba(79, 142, 247, 0.3)",
              background: "rgba(79, 142, 247, 0.08)",
              marginBottom: "32px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#4f8ef7",
                boxShadow: "0 0 8px #4f8ef7",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#4f8ef7",
                letterSpacing: "0.04em",
              }}
            >
              Smart Schedule Management
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "var(--color-text-primary)",
              marginBottom: "24px",
            }}
          >
            Your schedule,{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #4f8ef7 0%, #a371f7 50%, #4f8ef7 100%)",
                backgroundSize: "200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              perfectly organized
            </span>
          </h1>

          {/* Subheadline */}
          <p
            style={{
              fontSize: "18px",
              lineHeight: 1.7,
              color: "var(--color-text-secondary)",
              marginBottom: "48px",
              maxWidth: "580px",
              margin: "0 auto 48px",
            }}
          >
            Loop keeps students on top of their class routines and gives admins
            powerful tools to manage schedules — all in one minimal, beautiful app.
          </p>

          {/* CTA */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/signup"
              id="hero-cta-signup"
              style={{
                padding: "14px 32px",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "none",
                color: "white",
                background: "linear-gradient(135deg, #4f8ef7, #6f6bf7)",
                boxShadow:
                  "0 0 30px rgba(79, 142, 247, 0.35), 0 4px 20px rgba(0,0,0,0.3)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              Get started free
            </Link>
            <Link
              href="/about"
              id="hero-cta-learn"
              style={{
                padding: "14px 32px",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "none",
                color: "var(--color-text-secondary)",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-elevated)",
                transition: "all 0.2s ease",
              }}
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Mock Dashboard Preview */}
      <section style={{ padding: "0 24px 80px", position: "relative" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div
            style={{
              borderRadius: "16px",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-surface)",
              overflow: "hidden",
              boxShadow: "0 40px 120px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,142,247,0.05)",
            }}
          >
            {/* Mock browser bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 16px",
                borderBottom: "1px solid var(--color-border)",
                background: "var(--color-bg-elevated)",
              }}
            >
              {["#f85149", "#d29922", "#3fb950"].map((c) => (
                <div
                  key={c}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: c,
                    opacity: 0.8,
                  }}
                />
              ))}
              <div
                style={{
                  flex: 1,
                  height: "24px",
                  borderRadius: "6px",
                  background: "var(--color-bg-subtle)",
                  marginLeft: "8px",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "12px",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "var(--color-border)",
                  }}
                />
                <div
                  style={{
                    width: "120px",
                    height: "6px",
                    borderRadius: "3px",
                    background: "var(--color-border)",
                  }}
                />
              </div>
            </div>
            {/* Mock routine preview */}
            <div style={{ display: "flex", height: "320px" }}>
              {/* Sidebar */}
              <div
                style={{
                  width: "180px",
                  borderRight: "1px solid var(--color-border)",
                  background: "var(--color-bg-elevated)",
                  padding: "16px 12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                {["Routine", "Courses", "Profile"].map((label, i) => (
                  <div
                    key={label}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "7px",
                      background: i === 0 ? "var(--color-accent-muted)" : "transparent",
                      border: i === 0 ? "1px solid rgba(79,142,247,0.2)" : "1px solid transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "3px",
                        background: i === 0 ? "#4f8ef7" : "var(--color-border)",
                        opacity: i === 0 ? 1 : 0.5,
                      }}
                    />
                    <div
                      style={{
                        height: "8px",
                        width: `${60 - i * 10}px`,
                        borderRadius: "4px",
                        background: i === 0 ? "#4f8ef7" : "var(--color-border)",
                        opacity: i === 0 ? 1 : 0.4,
                      }}
                    />
                  </div>
                ))}
              </div>
              {/* Content area */}
              <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
                <div
                  style={{
                    height: "20px",
                    width: "160px",
                    borderRadius: "6px",
                    background: "var(--color-bg-subtle)",
                    marginBottom: "16px",
                  }}
                />
                {[
                  { color: "#4f8ef7", width: "80%" },
                  { color: "#3fb950", width: "70%" },
                  { color: "#a371f7", width: "75%" },
                ].map((card, i) => (
                  <div
                    key={i}
                    style={{
                      borderRadius: "10px",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-bg-elevated)",
                      padding: "14px",
                      marginBottom: "10px",
                      borderLeft: `3px solid ${card.color}`,
                    }}
                  >
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                      <div
                        style={{
                          height: "8px",
                          width: "50px",
                          borderRadius: "4px",
                          background: card.color,
                          opacity: 0.8,
                        }}
                      />
                      <div
                        style={{
                          height: "8px",
                          width: card.width,
                          borderRadius: "4px",
                          background: "var(--color-border)",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        height: "6px",
                        width: "60%",
                        borderRadius: "4px",
                        background: "var(--color-bg-subtle)",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "60px 24px 100px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--color-text-primary)",
                marginBottom: "16px",
              }}
            >
              Everything you need
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "var(--color-text-secondary)",
                maxWidth: "480px",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              A complete platform for both students and administrators.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {[
              {
                icon: "📅",
                title: "Daily Routine View",
                desc: "See your class schedule for any day at a glance, with gaps, room info, and teacher details.",
                color: "#4f8ef7",
              },
              {
                icon: "📚",
                title: "Course Selection",
                desc: "Pick the courses that matter to you. Your routine automatically updates to match.",
                color: "#3fb950",
              },
              {
                icon: "⚡",
                title: "Smart Import",
                desc: "Admins can upload Excel sheets and Loop intelligently parses and validates schedule data.",
                color: "#a371f7",
              },
              {
                icon: "👥",
                title: "Multi-role Access",
                desc: "Students get a clean view. Admins get powerful management tools. Everyone gets what they need.",
                color: "#d29922",
              },
              {
                icon: "🏫",
                title: "Room & Teacher Mgmt",
                desc: "Manage all rooms, teachers, and courses from a single clean admin dashboard.",
                color: "#f85149",
              },
              {
                icon: "🌙",
                title: "Dark & Minimal",
                desc: "Beautiful dark interface that's easy on the eyes, whether it's 8 AM or midnight.",
                color: "#4f8ef7",
              },
            ].map((feat) => (
              <div
                key={feat.title}
                style={{
                  borderRadius: "14px",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-bg-surface)",
                  padding: "28px",
                  transition: "border-color 0.2s ease, transform 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    background: `${feat.color}18`,
                    border: `1px solid ${feat.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    marginBottom: "16px",
                  }}
                >
                  {feat.icon}
                </div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    marginBottom: "8px",
                  }}
                >
                  {feat.title}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: "0 24px 100px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div
            style={{
              borderRadius: "20px",
              padding: "60px 48px",
              textAlign: "center",
              background: "linear-gradient(135deg, rgba(79,142,247,0.1) 0%, rgba(163,113,247,0.1) 100%)",
              border: "1px solid rgba(79,142,247,0.2)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "-60px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "400px",
                height: "200px",
                background: "radial-gradient(ellipse, rgba(79,142,247,0.15) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <h2
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--color-text-primary)",
                marginBottom: "16px",
              }}
            >
              Ready to get organized?
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "var(--color-text-secondary)",
                marginBottom: "36px",
                maxWidth: "400px",
                margin: "0 auto 36px",
                lineHeight: 1.6,
              }}
            >
              Join students and administrators already using Loop to stay on schedule.
            </p>
            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/signup"
                id="cta-signup"
                style={{
                  padding: "13px 28px",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: 600,
                  textDecoration: "none",
                  color: "white",
                  background: "linear-gradient(135deg, #4f8ef7, #6f6bf7)",
                  boxShadow: "0 0 30px rgba(79, 142, 247, 0.35)",
                }}
              >
                Create free account
              </Link>
              <Link
                href="/login"
                id="cta-login"
                style={{
                  padding: "13px 28px",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: 600,
                  textDecoration: "none",
                  color: "var(--color-text-secondary)",
                  border: "1px solid var(--color-border)",
                  background: "rgba(13,17,23,0.6)",
                }}
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
