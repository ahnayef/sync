"use client";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"] as const;

export interface ExportScheduleRow {
  day: string;
  start_time: string;
  end_time: string;
  course_code: string;
  course_name: string;
  is_lab: boolean;
  section: string;
  teacher_name: string;
  teacher_short: string;
  room_number: number | null;
  room_title: string | null;
  batch_name: string | null;
  batch_session: string | null;
}

function fmt24to12(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

interface Props {
  rows: ExportScheduleRow[];
  programName: string;
  batchSession?: string;
  exportDate: string;
}

export function SchedulePrintView({ rows, programName, batchSession, exportDate }: Props) {
  const byDay = (day: string) =>
    rows.filter((r) => r.day.toLowerCase() === day.toLowerCase());

  return (
    <>
      {/* ── Print-only global styles ── */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #schedule-print-view,
          #schedule-print-view * { visibility: visible; }
          #schedule-print-view { position: fixed; inset: 0; }

          @page {
            size: A4 landscape;
            margin: 12mm 14mm;
          }

          /* Wednesday always starts a new page */
          .print-page-break { page-break-before: always; }

          /* Never split a row across pages */
          .schedule-row { page-break-inside: avoid; }

          /* Force black & white */
          * {
            color: black !important;
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .day-header-bar {
            background: black !important;
            color: white !important;
          }
          .row-alt { background: #f2f2f2 !important; }
          .lab-tag {
            border: 1px solid black !important;
            background: white !important;
          }
        }
      `}</style>

      <div id="schedule-print-view" className="font-sans text-black bg-white">

        {/* ── Document header ── */}
        <div className="mb-5 border-b-2 border-black pb-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500 mb-0.5">
                Loop · Class Schedule
              </p>
              <h1 className="text-[22px] font-extrabold leading-tight tracking-tight text-black">
                {programName}
              </h1>
              {batchSession && (
                <p className="text-[12px] font-semibold text-gray-600 mt-0.5">
                  Session: {batchSession}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500">Exported</p>
              <p className="text-[12px] font-semibold text-black">{exportDate}</p>
            </div>
          </div>
        </div>

        {/* ── Day sections ── */}
        {DAYS.map((day, idx) => {
          const dayRows = byDay(day);
          const isPageBreak = day === "Wednesday";
          return (
            <div
              key={day}
              className={`mb-6 ${isPageBreak ? "print-page-break" : ""}`}
            >
              {/* Day header bar */}
              <div className="day-header-bar flex items-center gap-3 bg-black px-4 py-2 mb-0">
                <span className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-white">
                  {day}
                </span>
                <span className="text-[10px] font-medium text-gray-300 ml-auto">
                  {dayRows.length === 0
                    ? "No classes"
                    : `${dayRows.length} class${dayRows.length > 1 ? "es" : ""}`}
                </span>
              </div>

              {dayRows.length === 0 ? (
                <div className="border border-t-0 border-black px-4 py-3">
                  <p className="text-[11px] text-gray-400 italic">
                    No classes scheduled for {day}.
                  </p>
                </div>
              ) : (
                <table className="w-full border-collapse border border-t-0 border-black text-black">
                  {/* Table header */}
                  <thead>
                    <tr className="border-b border-black bg-gray-100">
                      <th className="w-[16%] border-r border-black px-3 py-1.5 text-left text-[8.5px] font-bold uppercase tracking-[0.12em] text-gray-600">
                        Time
                      </th>
                      <th className="w-[42%] border-r border-black px-3 py-1.5 text-left text-[8.5px] font-bold uppercase tracking-[0.12em] text-gray-600">
                        Course
                      </th>
                      <th className="w-[28%] border-r border-black px-3 py-1.5 text-left text-[8.5px] font-bold uppercase tracking-[0.12em] text-gray-600">
                        Teacher
                      </th>
                      <th className="w-[14%] px-3 py-1.5 text-left text-[8.5px] font-bold uppercase tracking-[0.12em] text-gray-600">
                        Room
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {dayRows.map((slot, i) => (
                      <tr
                        key={`${slot.course_code}-${slot.start_time}-${i}`}
                        className={`schedule-row border-b border-black last:border-b-0 ${
                          i % 2 === 1 ? "row-alt bg-gray-50" : "bg-white"
                        }`}
                      >
                        {/* TIME column */}
                        <td className="border-r border-black px-3 py-2.5 align-top">
                          <span className="block font-mono text-[11px] font-bold leading-tight text-black">
                            {fmt24to12(slot.start_time)}
                          </span>
                          <span className="block text-[9px] text-gray-400 leading-none mt-0.5">
                            to
                          </span>
                          <span className="block font-mono text-[11px] font-bold leading-tight text-black mt-0.5">
                            {fmt24to12(slot.end_time)}
                          </span>
                        </td>

                        {/* COURSE column */}
                        <td className="border-r border-black px-3 py-2.5 align-top">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span className="inline-block rounded px-1.5 py-0.5 text-[9px] font-mono font-bold bg-gray-100 border border-gray-400 text-gray-700 leading-none">
                              {slot.course_code}
                            </span>
                            {slot.is_lab && (
                              <span className="lab-tag inline-block rounded px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide border border-black text-black leading-none">
                                Lab
                              </span>
                            )}
                            {slot.section && slot.section !== "none" && (
                              <span className="inline-block text-[9px] font-semibold text-gray-500 leading-none">
                                Sec {slot.section}
                              </span>
                            )}
                          </div>
                          <p className="text-[13px] font-bold leading-snug text-black">
                            {slot.course_name}
                          </p>
                        </td>

                        {/* TEACHER column */}
                        <td className="border-r border-black px-3 py-2.5 align-top">
                          <p className="text-[11.5px] font-medium text-black leading-snug">
                            {slot.teacher_name}
                          </p>
                          {slot.teacher_short && (
                            <p className="text-[9px] text-gray-500 mt-0.5">
                              ({slot.teacher_short})
                            </p>
                          )}
                        </td>

                        {/* ROOM column */}
                        <td className="px-3 py-2.5 align-top">
                          <p className="text-[12px] font-bold text-black">
                            {slot.room_number ? `Room ${slot.room_number}` : "—"}
                          </p>
                          {slot.room_title && (
                            <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">
                              {slot.room_title}
                            </p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}

        {/* ── Footer ── */}
        <div className="mt-4 border-t border-gray-300 pt-2 flex justify-between items-center">
          <p className="text-[9px] text-gray-400">
            Generated by Loop · Schedule Management System
          </p>
          <p className="text-[9px] text-gray-400">
            {exportDate}
          </p>
        </div>
      </div>
    </>
  );
}
