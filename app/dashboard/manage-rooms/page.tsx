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

  const filtered = rooms.filter((r) =>
    r.number.toLowerCase().includes(search.toLowerCase()) ||
    r.type.toLowerCase().includes(search.toLowerCase())
  );

  const addRoom = () => {
    if (!newNumber) return;
    setRooms([...rooms, { id: Date.now(), number: newNumber, capacity: parseInt(newCapacity), type: newType, floor: parseInt(newFloor) }]);
    setNewNumber(""); setShowModal(false);
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "9px",
    border: "1px solid var(--color-border)", background: "var(--color-bg-elevated)",
    color: "var(--color-text-primary)", fontSize: "14px", outline: "none",
  };

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em", marginBottom: "6px" }}>
            Room Management
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>{rooms.length} rooms registered</p>
        </div>
        <button id="add-room-btn" onClick={() => setShowModal(true)}
          style={{ padding: "10px 20px", borderRadius: "9px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 600, color: "white", background: "linear-gradient(135deg, #4f8ef7, #6f6bf7)", display: "flex", alignItems: "center", gap: "8px" }}>
          + Add Room
        </button>
      </div>

      <div style={{ position: "relative", marginBottom: "20px", maxWidth: "400px" }}>
        <input id="room-search" type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search rooms..."
          style={{ ...inputStyle, paddingLeft: "42px" }} />
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>

      {/* Room cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "14px" }}>
        {filtered.map((room) => (
          <div key={room.id} id={`room-card-${room.id}`}
            style={{ borderRadius: "12px", border: "1px solid var(--color-border)", background: "var(--color-bg-surface)", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div
                style={{ width: "42px", height: "42px", borderRadius: "10px", background: room.type === "Lab" ? "rgba(163,113,247,0.15)" : "rgba(79,142,247,0.12)", border: `1px solid ${room.type === "Lab" ? "rgba(163,113,247,0.3)" : "rgba(79,142,247,0.25)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={room.type === "Lab" ? "#a371f7" : "#4f8ef7"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: room.type === "Lab" ? "#a371f7" : "#4f8ef7", background: room.type === "Lab" ? "rgba(163,113,247,0.1)" : "rgba(79,142,247,0.1)", border: `1px solid ${room.type === "Lab" ? "rgba(163,113,247,0.3)" : "rgba(79,142,247,0.25)"}`, padding: "3px 8px", borderRadius: "5px", textTransform: "uppercase" }}>
                {room.type}
              </span>
            </div>
            <h3 style={{ fontSize: "22px", fontWeight: 800, color: "var(--color-text-primary)", letterSpacing: "-0.02em", marginBottom: "4px" }}>
              {room.number}
            </h3>
            <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginBottom: "16px" }}>Floor {room.floor} · Capacity: {room.capacity}</p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button id={`room-edit-${room.id}`} style={{ flex: 1, padding: "7px", borderRadius: "7px", border: "1px solid var(--color-border)", background: "transparent", color: "var(--color-text-secondary)", fontSize: "12px", cursor: "pointer" }}>Edit</button>
              <button id={`room-delete-${room.id}`} onClick={() => setRooms(rooms.filter((r) => r.id !== room.id))}
                style={{ flex: 1, padding: "7px", borderRadius: "7px", border: "1px solid rgba(248,81,73,0.3)", background: "rgba(248,81,73,0.06)", color: "var(--color-danger)", fontSize: "12px", cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "24px" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ width: "100%", maxWidth: "440px", borderRadius: "16px", border: "1px solid var(--color-border)", background: "var(--color-bg-surface)", padding: "32px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "24px" }}>Add Room</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label htmlFor="modal-room-number" style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: "8px" }}>Room Number</label>
                <input id="modal-room-number" type="text" value={newNumber} onChange={(e) => setNewNumber(e.target.value)} placeholder="e.g. 404 or Lab-4" style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label htmlFor="modal-room-capacity" style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: "8px" }}>Capacity</label>
                  <input id="modal-room-capacity" type="number" value={newCapacity} onChange={(e) => setNewCapacity(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label htmlFor="modal-room-floor" style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: "8px" }}>Floor</label>
                  <input id="modal-room-floor" type="number" value={newFloor} onChange={(e) => setNewFloor(e.target.value)} style={inputStyle} />
                </div>
              </div>
              <div>
                <label htmlFor="modal-room-type" style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: "8px" }}>Room Type</label>
                <select id="modal-room-type" value={newType} onChange={(e) => setNewType(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="Classroom">Classroom</option>
                  <option value="Lab">Lab</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button id="modal-room-cancel" onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: "11px", borderRadius: "9px", border: "1px solid var(--color-border)", background: "transparent", color: "var(--color-text-secondary)", fontSize: "14px", cursor: "pointer" }}>Cancel</button>
                <button id="modal-room-save" onClick={addRoom}
                  style={{ flex: 1, padding: "11px", borderRadius: "9px", border: "none", background: "linear-gradient(135deg, #4f8ef7, #6f6bf7)", color: "white", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
