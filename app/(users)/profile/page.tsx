"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Jane Doe");
  const [email, setEmail] = useState("jane.doe@university.edu");
  const [studentId] = useState("STU-2024-001");
  const [department] = useState("Computer Science & Engineering");
  const [batch] = useState("2024");

  return (
    <div style={{ padding: "32px", maxWidth: "800px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em", marginBottom: "6px" }}>
          Profile
        </h1>
        <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
          Manage your personal information and account settings
        </p>
      </div>

      {/* Avatar + Info */}
      <div
        style={{
          borderRadius: "16px",
          border: "1px solid var(--color-border)",
          background: "var(--color-bg-surface)",
          padding: "32px",
          marginBottom: "24px",
          display: "flex",
          gap: "28px",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* Avatar */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4f8ef7, #a371f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              fontWeight: 700,
              color: "white",
              boxShadow: "0 0 30px rgba(79,142,247,0.3)",
              flexShrink: 0,
            }}
          >
            {name.charAt(0)}
          </div>
          <button
            id="profile-change-avatar"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border: "2px solid var(--color-bg-base)",
              background: "var(--color-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "white",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>

        {/* Details */}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "4px" }}>
            {name}
          </h2>
          <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", marginBottom: "16px" }}>{email}</p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {[
              { label: studentId, color: "#4f8ef7" },
              { label: batch, color: "#3fb950" },
            ].map((badge) => (
              <span
                key={badge.label}
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: badge.color,
                  background: `${badge.color}15`,
                  border: `1px solid ${badge.color}30`,
                  padding: "4px 10px",
                  borderRadius: "6px",
                }}
              >
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        <button
          id="profile-edit-toggle"
          onClick={() => setEditing(!editing)}
          style={{
            padding: "9px 18px",
            borderRadius: "9px",
            border: "1px solid var(--color-border)",
            background: editing ? "var(--color-accent-muted)" : "var(--color-bg-elevated)",
            color: editing ? "var(--color-accent)" : "var(--color-text-secondary)",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Profile Form */}
      <div
        style={{
          borderRadius: "16px",
          border: "1px solid var(--color-border)",
          background: "var(--color-bg-surface)",
          padding: "32px",
          marginBottom: "24px",
        }}
      >
        <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "24px" }}>
          Personal Information
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { id: "profile-name", label: "Full Name", value: name, onChange: (v: string) => setName(v), type: "text" },
              { id: "profile-student-id", label: "Student ID", value: studentId, onChange: () => {}, type: "text", disabled: true },
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
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled={!editing || field.disabled}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "9px",
                    border: "1px solid var(--color-border)",
                    background: (!editing || field.disabled) ? "var(--color-bg-elevated)" : "var(--color-bg-subtle)",
                    color: (!editing || field.disabled) ? "var(--color-text-secondary)" : "var(--color-text-primary)",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.2s",
                    opacity: field.disabled ? 0.5 : 1,
                    cursor: field.disabled ? "not-allowed" : "auto",
                  }}
                />
              </div>
            ))}
          </div>

          <div>
            <label htmlFor="profile-email" style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: "8px" }}>
              Email Address
            </label>
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!editing}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "9px",
                border: "1px solid var(--color-border)",
                background: !editing ? "var(--color-bg-elevated)" : "var(--color-bg-subtle)",
                color: !editing ? "var(--color-text-secondary)" : "var(--color-text-primary)",
                fontSize: "14px",
                outline: "none",
                transition: "all 0.2s",
              }}
            />
          </div>

          <div>
            <label htmlFor="profile-department" style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: "8px" }}>
              Department
            </label>
            <input
              id="profile-department"
              type="text"
              value={department}
              disabled
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "9px",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-elevated)",
                color: "var(--color-text-secondary)",
                fontSize: "14px",
                outline: "none",
                opacity: 0.5,
                cursor: "not-allowed",
              }}
            />
          </div>

          {editing && (
            <button
              id="profile-save"
              onClick={() => setEditing(false)}
              style={{
                padding: "12px",
                borderRadius: "9px",
                border: "none",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: 600,
                color: "white",
                background: "linear-gradient(135deg, #4f8ef7, #6f6bf7)",
                boxShadow: "0 0 20px rgba(79,142,247,0.3)",
              }}
            >
              Save changes
            </button>
          )}
        </div>
      </div>

      {/* Password */}
      <div
        style={{
          borderRadius: "16px",
          border: "1px solid var(--color-border)",
          background: "var(--color-bg-surface)",
          padding: "32px",
          marginBottom: "24px",
        }}
      >
        <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "24px" }}>
          Change Password
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { id: "profile-current-password", label: "Current Password" },
            { id: "profile-new-password", label: "New Password" },
            { id: "profile-confirm-password", label: "Confirm New Password" },
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
                type="password"
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "9px",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-bg-elevated)",
                  color: "var(--color-text-primary)",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>
          ))}
          <button
            id="profile-update-password"
            style={{
              alignSelf: "flex-start",
              padding: "10px 24px",
              borderRadius: "9px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
              color: "white",
              background: "linear-gradient(135deg, #4f8ef7, #6f6bf7)",
              boxShadow: "0 0 16px rgba(79,142,247,0.25)",
            }}
          >
            Update password
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div
        style={{
          borderRadius: "16px",
          border: "1px solid rgba(248,81,73,0.2)",
          background: "rgba(248,81,73,0.03)",
          padding: "28px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--color-danger)", marginBottom: "4px" }}>
            Delete Account
          </h3>
          <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
            Permanently delete your account and all associated data.
          </p>
        </div>
        <button
          id="profile-delete-account"
          style={{
            padding: "9px 18px",
            borderRadius: "9px",
            border: "1px solid rgba(248,81,73,0.4)",
            background: "rgba(248,81,73,0.08)",
            color: "var(--color-danger)",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
            flexShrink: 0,
          }}
        >
          Delete account
        </button>
      </div>
    </div>
  );
}
