"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiHome, FiRefreshCw } from "react-icons/fi";
import { LogoIcon } from "@/components/Icon";

export default function NotFound() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--color-bg-base)",
      }}
    >
      {/* Ambient glow blobs */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(79,142,247,0.09) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-10%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(163,113,247,0.07) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            left: "-5%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(79,142,247,0.05) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Card */}
      <div
        className={mounted ? "animate-fade-in" : ""}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "520px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            textDecoration: "none",
            padding: "0.5rem 1rem",
            borderRadius: "9999px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
            transition: "border-color 0.2s, background 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LogoIcon />
          </div>
          <span
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "var(--color-text-primary)",
              letterSpacing: "0.02em",
            }}
          >
            Sync
          </span>
        </Link>

        {/* 404 display */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
          <div
            className="animate-float"
            style={{
              fontSize: "clamp(6rem, 20vw, 9rem)",
              fontWeight: 800,
              lineHeight: 1,
              background: "linear-gradient(135deg, #4f8ef7 0%, #a371f7 50%, #4f8ef7 100%)",
              backgroundSize: "200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer 4s linear infinite, float 4s ease-in-out infinite",
              letterSpacing: "-0.04em",
              userSelect: "none",
            }}
          >
            404
          </div>

          {/* Divider line */}
          <div
            style={{
              width: "48px",
              height: "2px",
              borderRadius: "9999px",
              background: "linear-gradient(90deg, #4f8ef7, #a371f7)",
              opacity: 0.6,
            }}
          />
        </div>

        {/* Text content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(1.25rem, 4vw, 1.6rem)",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            Page not found
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "0.95rem",
              color: "var(--color-text-secondary)",
              lineHeight: 1.6,
              maxWidth: "380px",
            }}
          >
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Let&apos;s get you back on track.
          </p>
        </div>

        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            width: "100%",
            maxWidth: "320px",
          }}
        >
          <Link
            href="/"
            id="not-found-home-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, #4f8ef7, #6f6bf7)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "none",
              boxShadow: "0 0 24px rgba(79,142,247,0.28)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 0 36px rgba(79,142,247,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 0 24px rgba(79,142,247,0.28)";
            }}
          >
            <FiHome size={16} />
            Go home
          </Link>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              id="not-found-back-btn"
              onClick={() => router.back()}
              style={{
                flex: 1,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.7rem 1.25rem",
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                color: "var(--color-text-secondary)",
                fontWeight: 500,
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "border-color 0.2s, background 0.2s, color 0.2s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                e.currentTarget.style.color = "var(--color-text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.color = "var(--color-text-secondary)";
              }}
            >
              <FiArrowLeft size={15} />
              Go back
            </button>

            <button
              id="not-found-refresh-btn"
              onClick={() => router.refresh()}
              style={{
                flex: 1,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.7rem 1.25rem",
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                color: "var(--color-text-secondary)",
                fontWeight: 500,
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "border-color 0.2s, background 0.2s, color 0.2s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                e.currentTarget.style.color = "var(--color-text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.color = "var(--color-text-secondary)";
              }}
            >
              <FiRefreshCw size={15} />
              Refresh
            </button>
          </div>
        </div>

        {/* Footer hint */}
        <p
          style={{
            margin: 0,
            fontSize: "0.78rem",
            color: "var(--color-text-muted)",
            letterSpacing: "0.01em",
          }}
        >
          Error code&nbsp;
          <span
            style={{
              color: "var(--color-accent)",
              fontWeight: 500,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            404
          </span>
          &nbsp;· Page not found
        </p>
      </div>
    </div>
  );
}
