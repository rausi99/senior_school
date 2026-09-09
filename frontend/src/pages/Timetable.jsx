import { useState, useMemo } from "react";
import { generateTimetable, countWeeklySlots } from "../utils/timetableEngine";
import { useTimetableData } from "../context/TimetableDataContext";
import PrintableTimetable from "../components/PrintableTimetable";

function TimetableGrid({ days, periods, renderCell }) {
  return (
    <div className="timetable-grid-wrapper">
      <table className="timetable-grid">
        <thead>
          <tr><th>Period</th>{days.map((day) => <th key={day}>{day}</th>)}</tr>
        </thead>
        <tbody>
          {periods.map((period) => (
            <tr key={period.id} className={period.isBreak ? "timetable-break-row" : ""}>
              <td className="timetable-period-label">
                {period.isBreak ? (period.breakLabel || "Break") : period.label}
              </td>
              {period.isBreak
                ? days.map((day) => <td key={day} className="timetable-break-cell">—</td>)
                : days.map((_, dayIdx) => (
                    <td key={dayIdx} className="timetable-cell">{renderCell(dayIdx, period.id)}</td>
                  ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Timetable({ onGoToSetup }) {
  const { classes, teachers, subjects, rooms, scheduleConfig, schoolInfo } = useTimetableData();
  const { days, periods } = scheduleConfig;
  const [result, setResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [view, setView] = useState("class");
  const [selectedId, setSelectedId] = useState(null);
  const [printMode, setPrintMode] = useState(null); // null | "current" | "all"

  function subjectName(id) { return subjects.find((s) => s.id === id)?.name ?? id; }
  function teacherName(id) { return teachers.find((t) => t.id === id)?.name ?? id; }
  function className(id) { return classes.find((c) => c.id === id)?.name ?? id; }
  function roomName(id) { return rooms.find((r) => r.id === id)?.name ?? id; }

  const totalSlots = countWeeklySlots(days, periods);
  const unfilledClasses = classes.filter(
    (c) => c.subjects.reduce((sum, s) => sum + s.periodsPerWeek, 0) !== totalSlots
  );
  const hasData = classes.length > 0 && teachers.length > 0 && subjects.length > 0;
  const isReady = hasData && unfilledClasses.length === 0;

  function handleGenerate() {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateTimetable({ classes, teachers, subjects, rooms, days, periods });
      setResult(generated);
      setView("class");
      setSelectedId(classes[0]?.id ?? null);
      setIsGenerating(false);
    }, 50);
  }

  const selectorOptions = view === "class" ? classes : teachers;

  const currentGrid = useMemo(() => {
    if (!result || !selectedId) return null;
    return view === "class" ? result.classGrids[selectedId] : result.teacherGrids[selectedId];
  }, [result, view, selectedId]);

  function renderClassCell(dayIdx, periodId) {
    const entry = currentGrid?.[dayIdx]?.[periodId];
    if (!entry) return <span className="timetable-empty timetable-empty-alert">Unassigned</span>;
    return (
      <div className="timetable-lesson">
        <strong>{subjectName(entry.subjectId)}</strong>
        <span>{teacherName(entry.teacherId)}</span>
        {entry.roomId && <small>{roomName(entry.roomId)}</small>}
      </div>
    );
  }

  function renderTeacherCell(dayIdx, periodId) {
    const entry = currentGrid?.[dayIdx]?.[periodId];
    if (!entry) return <span className="timetable-empty">Free</span>;
    return (
      <div className="timetable-lesson">
        <strong>{subjectName(entry.subjectId)}</strong>
        <span>{className(entry.classId)}</span>
        {entry.roomId && <small>{roomName(entry.roomId)}</small>}
      </div>
    );
  }

  // --- Print-mode cell renderers (grid keyed by class/teacher id passed in) ---
  function makePrintClassCell(grid) {
    return (dayIdx, periodId) => {
      const entry = grid?.[dayIdx]?.[periodId];
      if (!entry) return <span className="print-empty">–</span>;
      return (
        <div className="print-lesson">
          <strong>{subjectName(entry.subjectId)}</strong>
          <span>{teacherName(entry.teacherId)}</span>
          {entry.roomId && <small>{roomName(entry.roomId)}</small>}
        </div>
      );
    };
  }
  function makePrintTeacherCell(grid) {
    return (dayIdx, periodId) => {
      const entry = grid?.[dayIdx]?.[periodId];
      if (!entry) return <span className="print-empty">Free</span>;
      return (
        <div className="print-lesson">
          <strong>{subjectName(entry.subjectId)}</strong>
          <span>{className(entry.classId)}</span>
          {entry.roomId && <small>{roomName(entry.roomId)}</small>}
        </div>
      );
    };
  }

function handlePrint(mode) {
  const originalTitle = document.title;
  document.title = `${schoolInfo.name} - Teaching Timetable`;
  setPrintMode(mode);
  setTimeout(() => {
    window.print();
    document.title = originalTitle;
  }, 100);
}

  return (
    <section className="dashboard-content">
      {/* ===== Normal screen UI (hidden on print via CSS) ===== */}
      <div className="screen-only">
        <div className="page-header">
          <div>
            <h1>Timetable Generator</h1>
            <p>Generate a clash-free weekly timetable from classes, teachers and rooms.</p>
          </div>
          <button className="add-button" onClick={handleGenerate} disabled={isGenerating || !isReady}>
            {isGenerating ? "Generating…" : "Generate Timetable"}
          </button>
        </div>

        {!hasData && (
          <div className="dashboard-panel">
            <p style={{ marginBottom: 15 }}>
              You need at least one class, one teacher, and one subject before generating a timetable.
            </p>
            <button className="add-button" onClick={onGoToSetup}>Go to Timetable Setup</button>
          </div>
        )}

        {hasData && !isReady && (
          <div className="dashboard-panel">
            <p style={{ marginBottom: 15, fontWeight: 600 }}>
              These classes don't have enough (or have too many) periods assigned to fill the week without gaps:
            </p>
            <ul style={{ marginBottom: 15, paddingLeft: 20, fontSize: 13, color: "var(--color-text-muted)" }}>
              {unfilledClasses.map((c) => {
                const assigned = c.subjects.reduce((sum, s) => sum + s.periodsPerWeek, 0);
                return <li key={c.id}>{c.name}: {assigned} / {totalSlots} periods assigned</li>;
              })}
            </ul>
            <button className="add-button" onClick={onGoToSetup}>Go to Timetable Setup</button>
          </div>
        )}

        {isReady && !result && !isGenerating && (
          <div className="dashboard-panel">
            <p>All classes are fully scheduled with no gaps. Click "Generate Timetable" to build it.</p>
          </div>
        )}

        {result && (
          <>
            {!result.success && (
              <div className="timetable-warning">
                {result.unplaced.length} period{result.unplaced.length === 1 ? "" : "s"} could not
                be placed without a clash — usually a teacher availability or room shortage.
                Check the class views below for cells marked "Unassigned", then add another qualified
                teacher or room of the contested type and regenerate.
              </div>
            )}

            <div className="dashboard-panel" style={{ marginBottom: 20 }}>
              <div className="panel-header">
                <div><h3>View</h3><p>Switch between a Grade timetable and a Teacher timetable</p></div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="view-button" onClick={() => handlePrint("current")}>🖨 Print This View</button>
                  <button className="view-button" onClick={() => handlePrint("all")}>🖨 Print All</button>
                </div>
              </div>
              <div className="timetable-controls">
                <div className="timetable-toggle">
                  <button className={view === "class" ? "timetable-toggle-active" : ""}
                    onClick={() => { setView("class"); setSelectedId(classes[0]?.id ?? null); }}>
                    By Grade
                  </button>
                  <button className={view === "teacher" ? "timetable-toggle-active" : ""}
                    onClick={() => { setView("teacher"); setSelectedId(teachers[0]?.id ?? null); }}>
                    By Teacher
                  </button>
                </div>
                <select value={selectedId ?? ""} onChange={(e) => setSelectedId(e.target.value)}>
                  {selectorOptions.map((opt) => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                </select>
              </div>
            </div>

            <div className="dashboard-panel">
              <TimetableGrid
                days={days}
                periods={periods}
                renderCell={view === "class" ? renderClassCell : renderTeacherCell}
              />
            </div>
          </>
        )}
      </div>

      {/* ===== Print-only content ===== */}
      {result && printMode && (
        <div className="print-only">
          <div className="print-toolbar screen-only">
            <button className="add-button" onClick={() => window.print()}>🖨 Print Now</button>
            <button className="cancel-button" onClick={() => setPrintMode(null)}>Close Print View</button>
          </div>

          {printMode === "current" && view === "class" && selectedId && (
            <PrintableTimetable
              schoolInfo={schoolInfo}
              entityLabel="Class"
              entityName={className(selectedId)}
              days={days}
              periods={periods}
              renderCell={makePrintClassCell(result.classGrids[selectedId])}
            />
          )}
          {printMode === "current" && view === "teacher" && selectedId && (
            <PrintableTimetable
              schoolInfo={schoolInfo}
              entityLabel="Teacher"
              entityName={teacherName(selectedId)}
              days={days}
              periods={periods}
              renderCell={makePrintTeacherCell(result.teacherGrids[selectedId])}
            />
          )}

          {printMode === "all" && (
            <>
              {classes.map((c, idx) => (
                <PrintableTimetable
                  key={c.id}
                  schoolInfo={schoolInfo}
                  entityLabel="Class"
                  entityName={c.name}
                  days={days}
                  periods={periods}
                  renderCell={makePrintClassCell(result.classGrids[c.id])}
                  pageBreakAfter
                />
              ))}
              {teachers.map((t, idx) => (
                <PrintableTimetable
                  key={t.id}
                  schoolInfo={schoolInfo}
                  entityLabel="Teacher"
                  entityName={t.name}
                  days={days}
                  periods={periods}
                  renderCell={makePrintTeacherCell(result.teacherGrids[t.id])}
                  pageBreakAfter={idx < teachers.length - 1}
                />
              ))}
            </>
          )}
        </div>
      )}
    </section>
  );
}