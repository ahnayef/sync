"use client";

import { useState } from "react";

const INITIAL = [
  { id: 1, number: 101, buildingName: "Main Building", floorNumber: 1, title: "Lecture Hall A", roomType: "classroom", capacity: 60 },
  { id: 2, number: 201, buildingName: "Science Block", floorNumber: 2, title: "Chemistry Lab", roomType: "lab", capacity: 40 },
  { id: 3, number: 302, buildingName: "Main Building", floorNumber: 3, title: "Seminar Room 1", roomType: "seminar", capacity: 30 },
];

export default function ManageRoomsPage() {
  const [rooms, setRooms] = useState(INITIAL);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [newNumber, setNewNumber] = useState("");
  const [newBuilding, setNewBuilding] = useState("");
  const [newFloor, setNewFloor] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("classroom");
  const [newCapacity, setNewCapacity] = useState("");

  const filtered = rooms.filter(
    (r) => 
      r.number.toString().includes(search) || 
      r.buildingName.toLowerCase().includes(search.toLowerCase()) ||
      (r.title && r.title.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => {
    setEditingId(null);
    setNewNumber("");
    setNewBuilding("");
    setNewFloor("");
    setNewTitle("");
    setNewType("classroom");
    setNewCapacity("");
    setShowModal(true);
  };

  const openEdit = (room: any) => {
    setEditingId(room.id);
    setNewNumber(room.number.toString());
    setNewBuilding(room.buildingName);
    setNewFloor(room.floorNumber.toString());
    setNewTitle(room.title || "");
    setNewType(room.roomType);
    setNewCapacity(room.capacity.toString());
    setShowModal(true);
  };

  const saveRoom = () => {
    if (!newNumber || !newBuilding || !newFloor || !newCapacity) return;
    if (editingId) {
      setRooms(
        rooms.map((r) =>
          r.id === editingId
            ? {
                ...r,
                number: parseInt(newNumber),
                buildingName: newBuilding,
                floorNumber: parseInt(newFloor),
                title: newTitle,
                roomType: newType,
                capacity: parseInt(newCapacity),
              }
            : r
        )
      );
    } else {
      setRooms([
        ...rooms,
        {
          id: Date.now(),
          number: parseInt(newNumber),
          buildingName: newBuilding,
          floorNumber: parseInt(newFloor),
          title: newTitle,
          roomType: newType,
          capacity: parseInt(newCapacity),
        },
      ]);
    }
    setNewNumber("");
    setNewBuilding("");
    setNewFloor("");
    setNewTitle("");
    setNewType("classroom");
    setNewCapacity("");
    setEditingId(null);
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
          onClick={openAdd}
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
              {["Number", "Title", "Building", "Floor", "Type", "Capacity", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((room, index) => (
              <tr
                key={room.id}
                id={`room-row-${room.id}`}
                className={`border-b border-[var(--color-border)] ${index % 2 === 0 ? "bg-[var(--color-bg-surface)]" : "bg-[var(--color-bg-elevated)]/40"}`}
              >
                <td className="px-4 py-3 text-sm font-bold text-[var(--color-accent)]">
                  {room.number}
                </td>
                <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">
                  {room.title || "—"}
                </td>
                <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                  {room.buildingName}
                </td>
                <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                  {room.floorNumber}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-bold tracking-wider px-2 py-0.5 rounded uppercase ${room.roomType === 'lab' ? "text-[var(--color-lab)] bg-[rgba(163,113,247,0.1)] border-[rgba(163,113,247,0.3)]" : "text-[var(--color-text-secondary)] bg-[var(--color-bg-elevated)] border border-[var(--color-border)]"}`}>
                    {room.roomType}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                  {room.capacity}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      id={`room-edit-${room.id}`}
                      onClick={() => openEdit(room)}
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="w-full max-w-[500px] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-8 my-8">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-6">
              {editingId ? "Edit Room" : "Add Room"}
            </h2>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Room Number</label>
                  <input type="number" value={newNumber} onChange={(e) => setNewNumber(e.target.value)} placeholder="e.g. 404" className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Capacity</label>
                  <input type="number" value={newCapacity} onChange={(e) => setNewCapacity(e.target.value)} placeholder="e.g. 60" className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Building Name</label>
                  <input type="text" value={newBuilding} onChange={(e) => setNewBuilding(e.target.value)} placeholder="e.g. Science Block" className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Floor Number</label>
                  <input type="number" value={newFloor} onChange={(e) => setNewFloor(e.target.value)} placeholder="e.g. 2" className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Title (Optional)</label>
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Chemistry Lab" className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Room Type</label>
                <select value={newType} onChange={(e) => setNewType(e.target.value)} className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2.5 px-3 text-sm text-[var(--color-text-primary)] outline-none appearance-none">
                  <option value="classroom">Classroom</option>
                  <option value="lab">Lab</option>
                  <option value="seminar">Seminar</option>
                </select>
              </div>
              
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)]">Cancel</button>
                <button onClick={saveRoom} className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--color-accent)] text-white font-semibold shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99]">
                  {editingId ? "Save Changes" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
