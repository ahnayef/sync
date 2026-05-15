"use client";

import { useState } from "react";

const INITIAL = [
  { id: 1, number: "101", capacity: 40, type: "Classroom", floor: 1 },
  { id: 2, number: "201", capacity: 60, type: "Classroom", floor: 2 },
  { id: 3, number: "302", capacity: 50, type: "Classroom", floor: 3 },
  { id: 4, number: "305", capacity: 45, type: "Classroom", floor: 3 },
  { id: 5, number: "401", capacity: 35, type: "Classroom", floor: 4 },
  { id: 6, number: "Lab-1", capacity: 30, type: "Lab", floor: 1 },
  { id: 7, number: "Lab-2", capacity: 30, type: "Lab", floor: 2 },
  { id: 8, number: "Lab-3", capacity: 28, type: "Lab", floor: 3 },
];

export default function ManageRoomsPage() {
  const [rooms, setRooms] = useState(INITIAL);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const [newCapacity, setNewCapacity] = useState("40");
  const [newType, setNewType] = useState("Classroom");
  const [newFloor, setNewFloor] = useState("1");

  const filtered = rooms.filter(
    (r) =>
      r.number.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase()),
  );

  const addRoom = () => {
    if (!newNumber) return;
    setRooms([
      ...rooms,
      {
        id: Date.now(),
        number: newNumber,
        capacity: parseInt(newCapacity),
        type: newType,
        floor: parseInt(newFloor),
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
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] px-4 py-2.5 text-sm font-semibold text-white"
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

      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-[14px]">
        {filtered.map((room) => (
          <div
            key={room.id}
            id={`room-card-${room.id}`}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5"
          >
            <div className="flex justify-between items-start mb-3">
              <div
                className={`w-11 h-11 rounded-[10px] flex items-center justify-center ${room.type === "Lab" ? "bg-[rgba(163,113,247,0.15)] border border-[rgba(163,113,247,0.3)]" : "bg-[rgba(79,142,247,0.12)] border border-[rgba(79,142,247,0.25)]"}`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={room.type === "Lab" ? "#a371f7" : "#4f8ef7"}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span
                className={`text-[11px] font-bold tracking-[0.08em] px-2 py-0.5 rounded uppercase ${room.type === "Lab" ? "text-[#a371f7] bg-[rgba(163,113,247,0.1)] border border-[rgba(163,113,247,0.3)]" : "text-[var(--color-accent)] bg-[var(--color-accent-muted)] border border-[rgba(79,142,247,0.25)]"}`}
              >
                {room.type}
              </span>
            </div>
            <h3 className="text-[22px] font-black text-[var(--color-text-primary)] mb-1">
              {room.number}
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              Floor {room.floor} · Capacity: {room.capacity}
            </p>
            <div className="flex gap-2">
              <button
                id={`room-edit-${room.id}`}
                className="flex-1 px-2 py-1.5 rounded-md border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-xs"
              >
                Edit
              </button>
              <button
                id={`room-delete-${room.id}`}
                onClick={() => setRooms(rooms.filter((r) => r.id !== room.id))}
                className="flex-1 px-2 py-1.5 rounded-md border border-[rgba(248,81,73,0.3)] bg-[rgba(248,81,73,0.06)] text-[var(--color-danger)] text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="modal-room-capacity"
                    className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"
                  >
                    Capacity
                  </label>
                  <input
                    id="modal-room-capacity"
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="modal-room-floor"
                    className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"
                  >
                    Floor
                  </label>
                  <input
                    id="modal-room-floor"
                    type="number"
                    value={newFloor}
                    onChange={(e) => setNewFloor(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="modal-room-type"
                  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"
                >
                  Room Type
                </label>
                <select
                  id="modal-room-type"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none cursor-pointer"
                >
                  <option value="Classroom">Classroom</option>
                  <option value="Lab">Lab</option>
                </select>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  id="modal-room-cancel"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)]"
                >
                  Cancel
                </button>
                <button
                  id="modal-room-save"
                  onClick={addRoom}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-br from-[#4f8ef7] to-[#6f6bf7] text-white font-semibold"
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
