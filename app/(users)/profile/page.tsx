"use client";

import { useState, useEffect } from "react";
import { FiEdit2, FiCamera, FiUser, FiMail, FiHash, FiShield, FiX, FiCheck } from "react-icons/fi";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [studentId, setStudentId] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      setAvatarUrl(session.user.image || "");
      setRole((session.user as any).role || "student");
      setStudentId((session.user as any).student_id || "");
    }
  }, [session]);

  const handleSave = () => {
    // In a real app, this would make an API call
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)]">
      <main className="max-w-[800px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[26px] font-bold text-[var(--color-text-primary)] tracking-tight mb-1.5">
            Profile
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Manage your personal information and account settings
          </p>
        </div>

        {/* Avatar + Info Header */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-8 mb-6 flex flex-wrap items-start gap-7">
          {/* Avatar */}
          <div className="relative group">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover shadow-[0_0_30px_rgba(79,142,247,0.3)]" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#a371f7] flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_30px_rgba(79,142,247,0.3)]">
                {name.charAt(0)}
              </div>
            )}
            <button
              id="profile-change-avatar"
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full border-2 border-[var(--color-bg-surface)] bg-[var(--color-accent)] flex items-center justify-center text-white cursor-pointer hover:bg-[#5d95f7] transition-colors"
            >
              <FiCamera size={13} />
            </button>
          </div>

          {/* Details */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">
              {name}
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">{email}</p>
            <div className="flex gap-2.5 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md capitalize text-[#a371f7] bg-[rgba(163,113,247,0.1)] border border-[rgba(163,113,247,0.3)] inline-flex items-center gap-1.5">
                <FiShield size={12} /> {role}
              </span>
              {role === "student" && studentId && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md text-[#4f8ef7] bg-[rgba(79,142,247,0.1)] border border-[rgba(79,142,247,0.3)] inline-flex items-center gap-1.5">
                  <FiHash size={12} /> {studentId}
                </span>
              )}
            </div>
          </div>

          <button
            id="profile-edit-toggle"
            onClick={() => {
              if (editing) handleSave();
              else setEditing(true);
            }}
            className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 transition-all ${
              editing 
                ? "border-[var(--color-border)] bg-[var(--color-accent-muted)] text-[var(--color-accent)]" 
                : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)]"
            }`}
          >
            {editing ? <><FiCheck /> Save</> : <><FiEdit2 /> Edit</>}
          </button>
        </div>

        {/* Personal Information Form */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-8 mb-6">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-6">
            Personal Information
          </h3>
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="profile-name" className="block text-[13px] font-medium text-[var(--color-text-secondary)] mb-2 flex items-center gap-1.5">
                  <FiUser size={14} /> Full Name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!editing}
                  className={`w-full px-3.5 py-2.5 rounded-lg border border-[var(--color-border)] text-sm outline-none transition-all ${
                    !editing ? "bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] cursor-not-allowed" : "bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                  }`}
                />
              </div>

              <div>
                <label htmlFor="profile-email" className="block text-[13px] font-medium text-[var(--color-text-secondary)] mb-2 flex items-center gap-1.5">
                  <FiMail size={14} /> Email Address
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!editing}
                  className={`w-full px-3.5 py-2.5 rounded-lg border border-[var(--color-border)] text-sm outline-none transition-all ${
                    !editing ? "bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] cursor-not-allowed" : "bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                  }`}
                />
              </div>

              {role === "student" && (
                <div>
                  <label htmlFor="profile-student-id" className="block text-[13px] font-medium text-[var(--color-text-secondary)] mb-2 flex items-center gap-1.5">
                    <FiHash size={14} /> Student ID
                  </label>
                  <input
                    id="profile-student-id"
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    disabled={!editing}
                    className={`w-full px-3.5 py-2.5 rounded-lg border border-[var(--color-border)] text-sm outline-none transition-all ${
                      !editing ? "bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] cursor-not-allowed" : "bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                    }`}
                  />
                </div>
              )}
            </div>
            
            {editing && (
              <button
                id="profile-save"
                onClick={handleSave}
                className="mt-2 w-max px-5 py-2.5 rounded-lg border-none cursor-pointer text-sm font-semibold text-white bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] shadow-[0_0_20px_rgba(79,142,247,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
              >
                Save changes
              </button>
            )}
          </div>
        </div>

        {/* Change Password */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-8 mb-6">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-6">
            Change Password
          </h3>
          <div className="flex flex-col gap-4 max-w-[400px]">
            {[
              { id: "profile-current-password", label: "Current Password" },
              { id: "profile-new-password", label: "New Password" },
              { id: "profile-confirm-password", label: "Confirm New Password" },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-[13px] font-medium text-[var(--color-text-secondary)] mb-2">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] text-sm outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
                />
              </div>
            ))}
            <button
              id="profile-update-password"
              className="mt-2 w-max px-6 py-2.5 rounded-lg border-none cursor-pointer text-sm font-semibold text-white bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] shadow-[0_0_16px_rgba(79,142,247,0.25)] hover:scale-[1.02] active:scale-95 transition-all"
            >
              Update password
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-[rgba(248,81,73,0.2)] bg-[rgba(248,81,73,0.03)] p-7 flex items-center justify-between gap-5 flex-wrap">
          <div>
            <h3 className="text-[15px] font-semibold text-[var(--color-danger)] mb-1">
              Delete Account
            </h3>
            <p className="text-[13px] text-[var(--color-text-muted)]">
              Permanently delete your account and all associated data.
            </p>
          </div>
          <button
            id="profile-delete-account"
            className="shrink-0 px-4 py-2.5 rounded-lg border border-[rgba(248,81,73,0.4)] bg-[rgba(248,81,73,0.08)] text-[var(--color-danger)] text-sm font-semibold cursor-pointer transition-all hover:bg-[rgba(248,81,73,0.15)] active:scale-95"
          >
            Delete account
          </button>
        </div>
      </main>
    </div>
  );
}
