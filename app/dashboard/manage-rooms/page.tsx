"use client";

import { useState } from "react";

const INITIAL = [
  { id: 1, number: "101" },
  { id: 2, number: "201" },
  { id: 3, number: "302" },
  { id: 4, number: "305" },
  { id: 5, number: "401" },
  { id: 6, number: "Lab-1" },
  { id: 7, number: "Lab-2" },
  { id: 8, number: "Lab-3" },
];

export default function ManageRoomsPage() {
  const [rooms, setRooms] = useState(INITIAL);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newNumber, setNewNumber] = useState("");

  const filtered = rooms.filter(
    (r) => r.number.toLowerCase().includes(search.toLowerCase()),
  );

  const addRoom = () => {
    if (!newNumber) return;
    setRooms([
      ...rooms,
      {
        id: Date.now(),
        number: newNumber,
      },
    ]);
    setNewNumber("");
    setShowModal(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[var(--color-text-primary)] mb-1">
            Room Management
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {rooms.length} rooms registered
          </p>
        </div>
        <button
          id="add-room-btn"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99]"
        >
          + Add Room
        </button>
      </div>

      <div className="relative mb-5 max-w-[400px]">
        <input
          id="room-search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search rooms..."
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 pr-4 pl-10 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                Room Number
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((room, index) => (
              <tr
                key={room.id}
                id={`room-row-${room.id}`}
                className={`border-b border-[var(--color-border)] ${index % 2 === 0 ? "bg-[var(--color-bg-surface)]" : "bg-[var(--color-bg-elevated)]/40"}`}
              >
                <td className="px-4 py-3 text-sm font-medium text-[var(--color-text-primary)]">
                  {room.number}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      id={`room-edit-${room.id}`}
                      className="px-3 py-1.5 rounded-md border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-xs transition-colors hover:bg-[var(--color-bg-elevated)]"
                    >
                      Edit
                    </button>
                    <button
                      id={`room-delete-${room.id}`}
                      onClick={() => setRooms(rooms.filter((r) => r.id !== room.id))}
                      className="px-3 py-1.5 rounded-md border border-[rgba(248,81,73,0.2)] bg-transparent text-[var(--color-danger)] text-xs transition-colors hover:bg-[rgba(248,81,73,0.06)]"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="w-full max-w-[440px] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-8">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-6">
              Add Room
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="modal-room-number"
                  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"
                >
                  Room Number
                </label>
                <input
                  id="modal-room-number"
                  type="text"
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  placeholder="e.g. 404 or Lab-4"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none"
                />
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  id="modal-room-cancel"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)]"
                >
                  Cancel
                </button>
                <button
                  id="modal-room-save"
                  onClick={addRoom}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--color-accent)] text-white font-semibold shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99]"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
