"use client";

import { useState, useEffect } from "react";
import { FiMail, FiShield, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";

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
    <div className="p-8">
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[var(--color-text-primary)] mb-1">
            Moderator Management
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Manage admin-level delegates with restricted permissions
          </p>
        </div>
        <button
          id="add-mod-btn"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99]"
        >
          <FiPlus /> Add Moderator
        </button>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-[400px]">
          <input
            id="mod-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email..."
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 pr-4 pl-10 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] transition-colors"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
        </div>
      </div>

      <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)]">
              {["User", "Role", "Added On", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--color-text-secondary)]">
                  Loading moderators...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--color-text-secondary)]">
                  No moderators found.
                </td>
              </tr>
            ) : (
              filtered.map((m, i) => (
                <tr
                  key={m.id}
                  className={`border-b ${i < filtered.length - 1 ? "border-[var(--color-border)]" : ""} bg-[var(--color-bg-surface)]`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#a371f7] text-xs font-bold text-white">
                        {m.name?.[0]?.toUpperCase() || m.email[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[var(--color-text-primary)]">{m.name || "Moderator"}</div>
                        <div className="text-xs text-[var(--color-text-muted)]">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md text-[#a371f7] bg-[rgba(163,113,247,0.1)] border border-[rgba(163,113,247,0.3)]">
                      <FiShield size={12} /> Moderator
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                    {new Date(m.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 w-[120px]">
                    <button
                      onClick={() => deleteModerator(m.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[rgba(248,81,73,0.2)] bg-transparent text-[var(--color-danger)] text-xs font-medium transition-colors hover:bg-[rgba(248,81,73,0.06)]"
                    >
                      <FiTrash2 size={13} /> Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget && !submitting) setShowModal(false);
          }}
        >
          <div className="w-full max-w-[440px] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-8">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
              Add New Moderator
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              An account will be created automatically and an email will be sent with their login credentials.
            </p>
            
            {error && <div className="mb-4 text-sm text-[var(--color-danger)] bg-[rgba(248,81,73,0.1)] p-3 rounded-md border border-[rgba(248,81,73,0.2)]">{error}</div>}

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="moderator@university.edu"
                    disabled={submitting}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 pr-4 pl-10 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)] transition-colors disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveModerator}
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--color-accent)] text-white font-semibold shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    "Send Invitation"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
