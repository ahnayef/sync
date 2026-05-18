"use client";

import { useState, useEffect } from "react";
import { FiMail, FiShield, FiTrash2, FiPlus, FiSearch, FiX } from "react-icons/fi";

type Moderator = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

export default function ManageModeratorsPage() {
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchModerators = async () => {
    try {
      const res = await fetch("/api/moderators");
      const data = await res.json();
      setModerators(data);
    } catch (err) {
      console.error("Failed to fetch moderators", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModerators();
  }, []);

  const filtered = moderators.filter((m) =>
    m.email.toLowerCase().includes(search.toLowerCase()) || m.name.toLowerCase().includes(search.toLowerCase())
  );

  const filtering = search.length > 0;

  const openAdd = () => {
    setNewEmail("");
    setError("");
    setShowModal(true);
  };

  const saveModerator = async () => {
    if (!newEmail) {
      setError("Email is required");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/moderators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add moderator");
      }

      await fetchModerators();
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteModerator = async (id: number) => {
    if (!confirm("Are you sure you want to remove this moderator?")) return;
    try {
      await fetch(`/api/moderators?id=${id}`, { method: "DELETE" });
      await fetchModerators();
    } catch (err) {
      console.error("Failed to delete moderator", err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)]">
      <main className="mx-auto max-w-[1000px] px-5 py-8 sm:px-6 sm:py-10">
        {/* Header */}
        <section className="glass relative overflow-hidden rounded-3xl border border-[var(--color-border)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.16)] sm:p-6 lg:p-7 mb-8">
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-[26px] font-bold text-[var(--color-text-primary)]">Moderator Management</h1>
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[var(--color-accent-muted)] text-xs font-bold text-[var(--color-accent)]">
                  {moderators.length}
                </span>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">{loading ? "Loading moderators..." : `${filtering ? `${filtered.length} ` : ""}moderators managing restricted permissions`}</p>
            </div>
            <button
              id="add-mod-btn"
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] transition-all hover:bg-[var(--color-bg-elevated)]"
            >
              <FiPlus /> Add Moderator
            </button>
          </div>
        </section>

        {/* Search */}
        <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.12)] sm:p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <div className="relative flex-1 max-w-full sm:max-w-[520px]">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
              <input
                id="mod-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search email or name..."
                className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-3 pr-12 pl-11 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] transition-colors focus:border-[rgba(79,142,247,0.35)]"
              />
              {search && (
                <button onClick={() => setSearch("")} title="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-surface)] hover:text-[var(--color-text-primary)]">
                  <FiX size={14} />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Table */}
        <section className="rounded-3xl border border-[var(--color-border)] overflow-hidden bg-[var(--color-bg-surface)] shadow-[0_18px_48px_rgba(0,0,0,0.12)]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {["User", "Role", "Added On", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-accent)]/30 border-t-[var(--color-accent)]" />
                      <span className="text-sm text-[var(--color-text-secondary)]">Loading moderators...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="text-2xl opacity-40">👥</div>
                      <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                        {search ? "No moderators match your search" : "No moderators yet"}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {search ? "Try a different search term" : "Add one to get started"}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-elevated)]/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#a371f7] text-sm font-bold text-white">
                          {m.name?.[0]?.toUpperCase() || m.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[var(--color-text-primary)]">{m.name || "Moderator"}</div>
                          <div className="text-xs text-[var(--color-text-muted)]">{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md text-[#a371f7] bg-[rgba(163,113,247,0.1)] border border-[rgba(163,113,247,0.2)]">
                        <FiShield size={12} /> Moderator
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                      {new Date(m.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => deleteModerator(m.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-red-400/20 bg-transparent text-red-400/80 text-xs font-medium transition-all hover:bg-red-500/10 hover:text-red-400 active:scale-95"
                      >
                        <FiTrash2 size={13} /> Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {/* Modal */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget && !submitting) setShowModal(false);
            }}
          >
            <div className="w-full max-w-[440px] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                Add New Moderator
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                Send an invitation to create a new moderator account with restricted admin permissions.
              </p>
              
              {error && (
                <div className="mb-4 text-sm text-red-300 bg-red-500/10 p-3 rounded-lg border border-red-400/20 flex items-center gap-2">
                  <span>⚠️</span>
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="moderator@university.edu"
                      disabled={submitting}
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 pr-4 pl-11 text-sm text-[var(--color-text-primary)] outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] font-medium hover:bg-[var(--color-bg-elevated)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveModerator}
                    disabled={submitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] text-white font-semibold shadow-[0_10px_24px_rgba(79,142,247,0.25)] transition-all duration-200 hover:shadow-[0_12px_32px_rgba(79,142,247,0.35)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Invitation"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
