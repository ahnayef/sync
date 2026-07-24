"use client";

import { useState, useEffect, useCallback } from "react";
import { FiPrinter, FiLoader, FiAlertCircle, FiFileText } from "react-icons/fi";
import { SchedulePrintView, ExportScheduleRow } from "@/components/SchedulePrintView";
import { generateSchedulePrintHTML } from "@/lib/generateSchedulePrintHTML";

interface Program {
  id: number;
  name: string;
  department_name: string;
}

interface Batch {
  id: number;
  name: string;
  session: string;
  program_id: number;
}

const selectCls =
  "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] outline-none cursor-pointer transition-all hover:border-white/20 focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30";

export default function ScheduleExportPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [allBatches, setAllBatches] = useState<Batch[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>("");
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [scheduleRows, setScheduleRows] = useState<ExportScheduleRow[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch programs and all batches on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [progRes, batchRes] = await Promise.all([
          fetch("/api/programs"),
          fetch("/api/batches"),
        ]);
        if (progRes.ok) setPrograms(await progRes.json());
        if (batchRes.ok) setAllBatches(await batchRes.json());
      } catch {
        setError("Failed to load programs.");
      } finally {
        setLoadingPrograms(false);
      }
    };
    fetchInitialData();
  }, []);

  // Filter batches client-side when program changes
  useEffect(() => {
    if (!selectedProgramId) {
      setBatches([]);
      setSelectedBatchId("");
      setScheduleRows([]);
      return;
    }
    const filtered = allBatches.filter(
      (b) => String(b.program_id) === selectedProgramId
    );
    setBatches(filtered);
    setSelectedBatchId("");
  }, [selectedProgramId, allBatches]);

  // Fetch schedule data
  const fetchSchedule = useCallback(async () => {
    if (!selectedProgramId) return;
    setLoadingSchedule(true);
    setError(null);
    try {
      const params = new URLSearchParams({ program_id: selectedProgramId });
      if (selectedBatchId) params.set("batch_id", selectedBatchId);
      const res = await fetch(`/api/schedule/export?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load schedule.");
      const data = await res.json();
      setScheduleRows(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoadingSchedule(false);
    }
  }, [selectedProgramId, selectedBatchId]);

  // Auto-fetch when both selectors are ready
  useEffect(() => {
    if (selectedProgramId) fetchSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProgramId, selectedBatchId]);

  const selectedProgram = programs.find((p) => String(p.id) === selectedProgramId);
  const selectedBatch = batches.find((b) => String(b.id) === selectedBatchId);

  const exportDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handlePrint = () => {
    const html = generateSchedulePrintHTML(
      scheduleRows,
      selectedProgram?.name ?? "",
      selectedBatch?.session,
      exportDate
    );
    const blob = new Blob([html], { type: "text/html" });
    const url  = URL.createObjectURL(blob);
    const win  = window.open(url, "_blank");
    // Revoke the blob URL after the new window has loaded it
    if (win) {
      win.addEventListener("load", () => URL.revokeObjectURL(url), { once: true });
    } else {
      // fallback: revoke after a delay if pop-up was blocked
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)]">
      {/* ── No-print page chrome ── */}
      <div className="no-print mx-auto max-w-[900px] px-4 py-8 sm:px-6 sm:py-10">

        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
            Admin Tools
          </p>
          <h1 className="mt-1.5 text-[clamp(22px,4.5vw,30px)] font-bold tracking-[-0.03em] text-[var(--color-text-primary)]">
            Schedule Export
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Select a program to preview and export the full weekly class schedule as a PDF.
          </p>
        </div>

        {/* Controls card */}
        <div className="mb-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {/* Program selector */}
            <div className="space-y-1.5 lg:col-span-1">
              <label
                htmlFor="export-program-select"
                className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]"
              >
                Program *
              </label>
              {loadingPrograms ? (
                <div className="h-10 animate-pulse rounded-xl bg-[var(--color-bg-elevated)]" />
              ) : (
                <select
                  id="export-program-select"
                  value={selectedProgramId}
                  onChange={(e) => setSelectedProgramId(e.target.value)}
                  className={selectCls}
                >
                  <option value="">— Select a program —</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                      {p.department_name ? ` · ${p.department_name}` : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Batch selector (optional) */}
            <div className="space-y-1.5 lg:col-span-1">
              <label
                htmlFor="export-batch-select"
                className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]"
              >
                Batch Session{" "}
                <span className="normal-case font-normal text-[10px] text-[var(--color-text-muted)]">
                  (optional)
                </span>
              </label>
              <select
                id="export-batch-select"
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                disabled={!selectedProgramId || batches.length === 0}
                className={`${selectCls} disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <option value="">All batches</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.session})
                  </option>
                ))}
              </select>
            </div>

            {/* Export button */}
            <div className="flex items-end lg:col-span-1">
              <button
                id="export-pdf-btn"
                type="button"
                onClick={handlePrint}
                disabled={scheduleRows.length === 0 || loadingSchedule}
                className={[
                  "flex w-full items-center justify-center gap-2.5 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all duration-200",
                  scheduleRows.length > 0 && !loadingSchedule
                    ? "border-blue-400/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400/50 active:scale-95 cursor-pointer"
                    : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] cursor-not-allowed opacity-50",
                ].join(" ")}
              >
                <FiPrinter className="text-base" />
                Export as PDF
              </button>
            </div>
          </div>

          {/* Status row */}
          {selectedProgramId && (
            <div className="mt-4 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
              {loadingSchedule ? (
                <>
                  <FiLoader className="animate-spin" />
                  <span>Loading schedule…</span>
                </>
              ) : error ? (
                <>
                  <FiAlertCircle className="text-red-400" />
                  <span className="text-red-400">{error}</span>
                </>
              ) : scheduleRows.length > 0 ? (
                <>
                  <FiFileText />
                  <span>
                    {scheduleRows.length} class slot{scheduleRows.length !== 1 ? "s" : ""} loaded
                    {selectedBatch ? ` · ${selectedBatch.session}` : ""}
                  </span>
                </>
              ) : (
                <span>No schedule data found for the selected filters.</span>
              )}
            </div>
          )}
        </div>

        {/* ── Preview area (screen-only wrapper) ── */}
        {scheduleRows.length > 0 && !loadingSchedule && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                Print Preview
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                A4 Landscape · Max 2 pages
              </p>
            </div>

            {/* White paper preview */}
            <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
              <div className="bg-white p-8 sm:p-10">
                <SchedulePrintView
                  rows={scheduleRows}
                  programName={selectedProgram?.name ?? ""}
                  batchSession={selectedBatch?.session}
                  exportDate={exportDate}
                />
              </div>
            </div>

            <p className="mt-3 text-center text-[11px] text-[var(--color-text-muted)]">
              Click{" "}
              <strong className="text-[var(--color-text-secondary)]">Export as PDF</strong>{" "}
              — a new window will open and the print dialog will appear automatically.
              Choose <em>Save as PDF</em> as the destination.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!selectedProgramId && (
          <div className="mt-2 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-surface)] px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
              <FiPrinter className="text-2xl text-[var(--color-text-muted)]" />
            </div>
            <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
              Select a program to get started
            </h3>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Choose a program from the dropdown above to preview and export its schedule.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
