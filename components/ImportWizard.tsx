"use client";

import { useState, useRef } from "react";
import { FiUploadCloud, FiLink, FiCheckCircle, FiAlertCircle, FiDownload, FiArrowLeft, FiTrash2 } from "react-icons/fi";
import { useToast } from "@/components/Toast";

type EntityType = "batch" | "teacher" | "course" | "room";

interface ImportWizardProps {
  entityType: EntityType;
  programId?: number;
  onClose: () => void;
  onSuccess: () => void;
}

const EXPECTED_HEADERS: Record<EntityType, string[]> = {
  teacher: ["name", "short name", "department"],
  batch: ["name", "session", "program"],
  course: ["name", "code", "program", "is lab"],
  room: ["number", "building name", "floor number", "room type", "capacity", "title"]
};

export default function ImportWizard({ entityType, programId, onClose, onSuccess }: ImportWizardProps) {
  const { toast, error, success } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [sheetLink, setSheetLink] = useState("");
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"input" | "preview">("input");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadDemo = () => {
    const headers = EXPECTED_HEADERS[entityType].join(",");
    let demoRow = "";
    if (entityType === "batch") demoRow = "CSE-31,Spring 23,B.Sc in CSE";
    if (entityType === "teacher") demoRow = "John Doe,JD,Computer Science";
    if (entityType === "course") demoRow = "Data Structures,CSE-101,B.Sc in CSE,No";
    if (entityType === "room") demoRow = "401,Main Building,4,Classroom,50,AI Lab";

    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + demoRow;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `demo_${entityType}_import.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = async () => {
    if (!file && !sheetLink) {
      error("Please provide a file or Google Sheet link.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("entityType", entityType);
      if (programId) formData.append("programId", programId.toString());
      if (file) formData.append("file", file);
      if (sheetLink) formData.append("sheetLink", sheetLink);

      const res = await fetch("/api/imports/preview", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        error(data.error || "Failed to parse file.");
        return;
      }

      setPreviewRows(data.rows || []);
      setStep("preview");
    } catch (err: any) {
      error(err.message || "An error occurred during preview.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/imports/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityType, rows: previewRows }),
      });

      const data = await res.json();
      if (!res.ok) {
        error(data.error || "Failed to apply import.");
        return;
      }

      success(`Successfully imported ${data.inserted} records.`);
      onSuccess();
    } catch (err: any) {
      error(err.message || "An error occurred during import.");
    } finally {
      setLoading(false);
    }
  };

  const validCount = previewRows.filter(r => r.status === "ok").length;
  const errorCount = previewRows.filter(r => r.status === "error").length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-4xl bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[var(--color-border)] shrink-0">
          <div className="flex items-center gap-3">
            {step === "preview" && (
              <button onClick={() => setStep("input")} className="p-2 -ml-2 rounded-lg hover:bg-[var(--color-bg-elevated)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                <FiArrowLeft size={20} />
              </button>
            )}
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] capitalize">Import {entityType}s</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {step === "input" ? "Upload a file or provide a Google Sheet link." : "Review your data before importing."}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleDownloadDemo} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg-elevated)] transition-colors text-sm text-[var(--color-text-primary)] font-medium">
              <FiDownload /> Demo CSV
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {step === "input" && (
            <div className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Upload File (.csv, .xlsx)</label>
                <div 
                  className={`border-2 border-dashed border-[var(--color-border)] rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors ${file ? "bg-[rgba(79,142,247,0.05)] border-[var(--color-accent)]" : "hover:bg-[var(--color-bg-elevated)] cursor-pointer"}`}
                  onClick={() => !file && fileInputRef.current?.click()}
                >
                  <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.xlsx,.xls" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  
                  {file ? (
                    <div className="flex flex-col items-center">
                      <FiCheckCircle className="text-4xl text-[#3fb950] mb-3" />
                      <p className="text-[var(--color-text-primary)] font-medium">{file.name}</p>
                      <button onClick={(e) => { e.stopPropagation(); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="mt-2 text-sm text-[var(--color-danger)] hover:underline flex items-center gap-1">
                        <FiTrash2 /> Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center mb-3">
                        <FiUploadCloud className="text-xl text-[var(--color-text-secondary)]" />
                      </div>
                      <p className="text-[var(--color-text-primary)] font-medium mb-1">Click to browse or drag and drop</p>
                      <p className="text-sm text-[var(--color-text-muted)]">Supported formats: CSV, XLSX, XLS</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-px bg-[var(--color-border)] flex-1" />
                <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">OR</span>
                <div className="h-px bg-[var(--color-border)] flex-1" />
              </div>

              {/* Sheet Link */}
              <div>
                <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Google Sheet Link</label>
                <div className="relative">
                  <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input 
                    type="text" 
                    value={sheetLink} 
                    onChange={(e) => setSheetLink(e.target.value)} 
                    placeholder="https://docs.google.com/spreadsheets/d/..." 
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                  />
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-2">Make sure the sheet is accessible to "Anyone with the link".</p>
              </div>
            </div>
          )}

          {step === "preview" && (
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
                <div className="flex-1 text-center">
                  <div className="text-2xl font-bold text-[var(--color-text-primary)]">{previewRows.length}</div>
                  <div className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Total Rows</div>
                </div>
                <div className="w-px bg-[var(--color-border)]" />
                <div className="flex-1 text-center">
                  <div className="text-2xl font-bold text-[#3fb950]">{validCount}</div>
                  <div className="text-xs font-medium text-[#3fb950] uppercase tracking-wider">Valid Rows</div>
                </div>
                <div className="w-px bg-[var(--color-border)]" />
                <div className="flex-1 text-center">
                  <div className="text-2xl font-bold text-[var(--color-danger)]">{errorCount}</div>
                  <div className="text-xs font-medium text-[var(--color-danger)] uppercase tracking-wider">With Errors</div>
                </div>
              </div>

              {previewRows.length > 0 ? (
                <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] text-[var(--color-text-secondary)]">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Row</th>
                          <th className="px-4 py-3 font-semibold">Status</th>
                          {Object.keys(previewRows[0].data).filter(k => !k.startsWith("_")).map(key => (
                            <th key={key} className="px-4 py-3 font-semibold capitalize">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-border)]">
                        {previewRows.map((row, idx) => (
                          <tr key={idx} className={`bg-[var(--color-bg-surface)] ${row.status === "error" ? "bg-[rgba(248,81,73,0.05)]" : ""}`}>
                            <td className="px-4 py-3 text-[var(--color-text-muted)]">#{row.sourceRow}</td>
                            <td className="px-4 py-3">
                              {row.status === "ok" ? (
                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[rgba(63,185,80,0.1)] text-[#3fb950] text-xs font-medium">
                                  <FiCheckCircle /> Valid
                                </span>
                              ) : (
                                <div className="group relative inline-block">
                                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[rgba(248,81,73,0.1)] text-[var(--color-danger)] text-xs font-medium cursor-help">
                                    <FiAlertCircle /> Errors ({row.errors.length})
                                  </span>
                                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg shadow-xl text-xs text-[var(--color-danger)] z-10 whitespace-normal">
                                    <ul className="list-disc pl-4 space-y-1">
                                      {row.errors.map((e: string, i: number) => <li key={i}>{e}</li>)}
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </td>
                            {Object.entries(row.data).filter(([k]) => !k.startsWith("_")).map(([key, val]) => (
                              <td key={key} className="px-4 py-3 text-[var(--color-text-primary)]">{String(val)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-[var(--color-text-muted)]">No rows found in the provided file.</div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-[var(--color-border)] shrink-0 flex items-center justify-end gap-3 bg-[var(--color-bg-surface)] rounded-b-2xl">
          <button onClick={onClose} disabled={loading} className="px-5 py-2.5 rounded-xl border border-[var(--color-border)] font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-colors disabled:opacity-50">
            Cancel
          </button>
          
          {step === "input" ? (
            <button onClick={handlePreview} disabled={loading || (!file && !sheetLink)} className="px-5 py-2.5 rounded-xl bg-[var(--color-accent)] font-semibold text-white shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2">
              {loading ? "Parsing..." : "Preview Data"}
            </button>
          ) : (
            <button onClick={handleApply} disabled={loading || validCount === 0} className="px-5 py-2.5 rounded-xl bg-[var(--color-accent)] font-semibold text-white shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2">
              {loading ? "Importing..." : (errorCount > 0 ? `Proceed with ${validCount} Valid Rows` : "Complete Import")}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
