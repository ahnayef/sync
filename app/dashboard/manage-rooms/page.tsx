"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function ManageRoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [newNumber, setNewNumber] = useState("");
  const [newBuilding, setNewBuilding] = useState("");
  const [newFloor, setNewFloor] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("classroom");
  const [newCapacity, setNewCapacity] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      if (res.ok) setRooms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const saveRoom = async () => {
    if (!newNumber || !newBuilding || !newFloor || !newCapacity) return;
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const payload = {
        ...(editingId && { id: editingId }),
        number: parseInt(newNumber),
        buildingName: newBuilding,
        floorNumber: parseInt(newFloor),
        title: newTitle,
        roomType: newType,
        capacity: parseInt(newCapacity),
      };
        
      const res = await fetch("/api/rooms", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Failed to save room");
      } else {
        await fetchData();
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const deleteRoom = async (id: number) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    try {
      const res = await fetch(`/api/rooms?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to delete");
      } else {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative p-3 sm:p-4 lg:p-6">
      <div className="relative mx-auto max-w-7xl space-y-4 sm:space-y-6">
        <section className="glass relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--color-border)] p-4 sm:p-5 lg:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.16)]">
          <div className="relative flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-xl sm:text-2xl md:text-[24px] lg:text-[26px] font-bold text-[var(--color-text-primary)]">Room Management</h1>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">{loading ? "Loading rooms..." : `${rooms.length} rooms registered`}</p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:block rounded-lg sm:rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3 py-2 text-xs text-[var(--color-text-secondary)]">
                {rooms.length} rooms
              </div>
              <button
                id="add-room-btn"
                onClick={openAdd}
                className="inline-flex items-center gap-2 rounded-lg sm:rounded-xl bg-[var(--color-accent)] px-2.5 sm:px-4 py-1.5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99]"
              >
                + Add Room
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl sm:rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-3 sm:p-4 lg:p-5 shadow-[0_18px_48px_rgba(0,0,0,0.12)]">
          <div className="relative mb-3 sm:mb-4 max-w-full sm:max-w-[520px]">
            <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
            <input
              id="room-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rooms..."
              className="w-full rounded-lg sm:rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2 sm:py-3 pr-9 sm:pr-12 pl-9 sm:pl-11 text-xs sm:text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] transition-colors focus:border-[rgba(79,142,247,0.35)]"
            />
            {search && (
              <button onClick={() => setSearch("")} title="Clear search" className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-surface)] hover:text-[var(--color-text-primary)]">
                <FiX size={14} />
              </button>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
                  {["Number", "Title", "Building", "Floor", "Type", "Capacity", "Actions"].map(h => (
                    <th key={h} className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={`skeleton-${idx}`} className="border-b border-[var(--color-border)]">
                      <td className="px-3 sm:px-4 py-3"><div className="h-4 w-12 rounded bg-[var(--color-bg-elevated)] animate-pulse" /></td>
                      <td className="px-3 sm:px-4 py-3"><div className="h-4 w-32 rounded bg-[var(--color-bg-elevated)] animate-pulse" /></td>
                      <td className="px-3 sm:px-4 py-3"><div className="h-4 w-24 rounded bg-[var(--color-bg-elevated)] animate-pulse" /></td>
                      <td className="px-3 sm:px-4 py-3"><div className="h-4 w-8 rounded bg-[var(--color-bg-elevated)] animate-pulse" /></td>
                      <td className="px-3 sm:px-4 py-3"><div className="h-4 w-20 rounded bg-[var(--color-bg-elevated)] animate-pulse" /></td>
                      <td className="px-3 sm:px-4 py-3"><div className="h-4 w-8 rounded bg-[var(--color-bg-elevated)] animate-pulse" /></td>
                      <td className="px-3 sm:px-4 py-3" />
                    </tr>
                  ))
                ) : (
                  <>
                    {filtered.map((room, index) => (
                      <tr
                        key={room.id}
                        id={`room-row-${room.id}`}
                        className={`border-b border-[var(--color-border)] ${index % 2 === 0 ? "bg-[var(--color-bg-surface)]" : "bg-[var(--color-bg-elevated)]/40"}`}
                      >
                        <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-[var(--color-accent)]">
                          {room.number}
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[var(--color-text-primary)]">
                          {room.title || "—"}
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[var(--color-text-secondary)]">
                          {room.buildingName}
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[var(--color-text-secondary)]">
                          {room.floorNumber}
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                          <span className={`text-[10px] sm:text-[11px] font-bold tracking-wider px-2 py-0.5 rounded uppercase ${room.roomType === 'lab' ? "text-[var(--color-lab)] bg-[rgba(163,113,247,0.1)] border-[rgba(163,113,247,0.3)]" : "text-[var(--color-text-secondary)] bg-[var(--color-bg-elevated)] border border-[var(--color-border)]"}`}>
                            {room.roomType}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[var(--color-text-secondary)]">
                          {room.capacity}
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                          <div className="flex justify-end gap-1.5 sm:gap-2">
                            <button
                              id={`room-edit-${room.id}`}
                              onClick={() => openEdit(room)}
                              className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-sm sm:rounded-md border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-xs transition-colors hover:bg-[var(--color-bg-elevated)]"
                            >
                              Edit
                            </button>
                            <button
                              id={`room-delete-${room.id}`}
                              onClick={() => deleteRoom(room.id)}
                              className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-sm sm:rounded-md border border-[rgba(248,81,73,0.2)] bg-transparent text-[var(--color-danger)] text-xs transition-colors hover:bg-[rgba(248,81,73,0.06)]"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-3 sm:px-4 py-8 text-center text-xs sm:text-sm text-[var(--color-text-secondary)]">
                          No rooms found.
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden space-y-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={`skeleton-${idx}`} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/50 p-3 space-y-2">
                  <div className="h-4 w-1/2 rounded bg-[var(--color-bg-elevated)] animate-pulse" />
                  <div className="h-3 w-3/4 rounded bg-[var(--color-bg-elevated)] animate-pulse" />
                  <div className="h-3 w-1/3 rounded bg-[var(--color-bg-elevated)] animate-pulse" />
                </div>
              ))
            ) : (
              <>
                {filtered.map((room) => (
                  <div
                    key={room.id}
                    id={`room-card-${room.id}`}
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/40 p-3 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-bold text-[var(--color-accent)]">#{room.number}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${room.roomType === 'lab' ? "text-[var(--color-lab)] bg-[rgba(163,113,247,0.1)]" : "text-[var(--color-text-secondary)] bg-[var(--color-bg-elevated)]"}`}>
                            {room.roomType}
                          </span>
                        </div>
                        {room.title && <p className="text-xs text-[var(--color-text-primary)] mt-1 font-medium">{room.title}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-[var(--color-text-secondary)]">
                      <div>
                        <span className="text-[10px] text-[var(--color-text-muted)]">Building</span>
                        <p className="font-medium text-[var(--color-text-primary)]">{room.buildingName}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--color-text-muted)]">Floor</span>
                        <p className="font-medium text-[var(--color-text-primary)]">{room.floorNumber}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--color-text-muted)]">Capacity</span>
                        <p className="font-medium text-[var(--color-text-primary)]">{room.capacity}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-[var(--color-border)]/50">
                      <button
                        id={`room-edit-mobile-${room.id}`}
                        onClick={() => openEdit(room)}
                        className="flex-1 px-2 py-1.5 rounded-sm border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] text-xs transition-colors hover:bg-[var(--color-bg-elevated)]"
                      >
                        Edit
                      </button>
                      <button
                        id={`room-delete-mobile-${room.id}`}
                        onClick={() => deleteRoom(room.id)}
                        className="flex-1 px-2 py-1.5 rounded-sm border border-[rgba(248,81,73,0.2)] bg-transparent text-[var(--color-danger)] text-xs transition-colors hover:bg-[rgba(248,81,73,0.06)]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {filtered.length === 0 && (
                  <div className="text-center py-8 text-xs text-[var(--color-text-secondary)]">
                    No rooms found.
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="w-full max-w-[500px] rounded-lg sm:rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 sm:p-5 lg:p-6 my-4 sm:my-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-4 sm:mb-6">
              {editingId ? "Edit Room" : "Add Room"}
            </h2>
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 sm:mb-2">Room Number</label>
                  <input type="number" value={newNumber} onChange={(e) => setNewNumber(e.target.value)} placeholder="e.g. 404" className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2 sm:py-2.5 px-3 text-xs sm:text-sm text-[var(--color-text-primary)] outline-none" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 sm:mb-2">Capacity</label>
                  <input type="number" value={newCapacity} onChange={(e) => setNewCapacity(e.target.value)} placeholder="e.g. 60" className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2 sm:py-2.5 px-3 text-xs sm:text-sm text-[var(--color-text-primary)] outline-none" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 sm:mb-2">Building Name</label>
                  <input type="text" value={newBuilding} onChange={(e) => setNewBuilding(e.target.value)} placeholder="e.g. Science Block" className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2 sm:py-2.5 px-3 text-xs sm:text-sm text-[var(--color-text-primary)] outline-none" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 sm:mb-2">Floor Number</label>
                  <input type="number" value={newFloor} onChange={(e) => setNewFloor(e.target.value)} placeholder="e.g. 2" className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2 sm:py-2.5 px-3 text-xs sm:text-sm text-[var(--color-text-primary)] outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 sm:mb-2">Title (Optional)</label>
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Chemistry Lab" className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2 sm:py-2.5 px-3 text-xs sm:text-sm text-[var(--color-text-primary)] outline-none" />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 sm:mb-2">Room Type</label>
                <select value={newType} onChange={(e) => setNewType(e.target.value)} className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2 sm:py-2.5 px-3 text-xs sm:text-sm text-[var(--color-text-primary)] outline-none appearance-none">
                  <option value="classroom">Classroom</option>
                  <option value="lab">Lab</option>
                  <option value="seminar">Seminar</option>
                </select>
              </div>
              
              <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-4">
                <button id="modal-room-cancel" onClick={() => setShowModal(false)} className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-lg border border-[var(--color-border)] bg-transparent text-xs sm:text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)]">Cancel</button>
                <button 
                  id="modal-room-save" 
                  onClick={saveRoom} 
                  disabled={saving || !newNumber || !newBuilding || !newFloor || !newCapacity}
                  className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-lg bg-[var(--color-accent)] text-xs sm:text-sm text-white font-semibold shadow-[0_10px_24px_rgba(79,142,247,0.18)] transition-all duration-200 hover:bg-[#5d95f7] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : (editingId ? "Save Changes" : "Save")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
