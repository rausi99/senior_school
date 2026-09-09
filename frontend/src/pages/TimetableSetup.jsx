import { useState, useEffect } from "react";
import { useTimetableData } from "../context/TimetableDataContext";
import { countWeeklySlots } from "../utils/timetableEngine";
import { mockClasses, mockTeachers, mockSubjects, mockRooms } from "../data/timetableMockData";

const TABS = [
  { id: "teachers", label: "Teachers" },
  { id: "subjects", label: "Subjects" },
  { id: "rooms", label: "Rooms" },
  { id: "classes", label: "Classes" },
  { id: "schedule", label: "Schedule" },
  { id: "school", label: "School" },
];

function Modal({ title, onClose, children, wide }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="student-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: wide ? 600 : 500 }}>
        <div className="modal-header">
          <div><h2>{title}</h2></div>
          <button className="close-modal" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function TeacherModal({ subjects, existing, onSave, onClose }) {
  const [name, setName] = useState(existing?.name || "");
  const [maxPeriodsPerDay, setMaxPeriodsPerDay] = useState(existing?.maxPeriodsPerDay || 6);
  const [subjectIds, setSubjectIds] = useState(existing?.subjectIds || []);

  function toggleSubject(id) {
    setSubjectIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  return (
    <Modal title={existing ? "Edit Teacher" : "Add Teacher"} onClose={onClose}>
      <div className="form-grid">
        <div className="form-group full-width">
          <label>Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mr. Otieno" />
        </div>
        <div className="form-group full-width">
          <label>Max Periods per Day</label>
          <input type="number" min={1} max={12} value={maxPeriodsPerDay}
            onChange={(e) => setMaxPeriodsPerDay(Number(e.target.value))} />
        </div>
        <div className="form-group full-width">
          <label>Subjects this teacher can teach</label>
          {subjects.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
              Add subjects first, then come back to assign them here.
            </p>
          ) : (
            <div className="checkbox-list">
              {subjects.map((s) => (
                <label key={s.id} className="checkbox-list-item">
                  <input type="checkbox" checked={subjectIds.includes(s.id)}
                    onChange={() => toggleSubject(s.id)} />
                  {s.name}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="modal-actions">
        <button className="cancel-button" onClick={onClose}>Cancel</button>
        <button className="save-button" onClick={() => {
          if (!name.trim()) return;
          onSave({ name: name.trim(), maxPeriodsPerDay, subjectIds });
          onClose();
        }}>Save</button>
      </div>
    </Modal>
  );
}

function SubjectModal({ onSave, onClose }) {
  const [name, setName] = useState("");
  return (
    <Modal title="Add Subject" onClose={onClose}>
      <div className="form-grid">
        <div className="form-group full-width">
          <label>Subject Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mathematics" />
        </div>
      </div>
      <div className="modal-actions">
        <button className="cancel-button" onClick={onClose}>Cancel</button>
        <button className="save-button" onClick={() => {
          if (!name.trim()) return;
          onSave({ name: name.trim() });
          onClose();
        }}>Save</button>
      </div>
    </Modal>
  );
}

function RoomModal({ onSave, onClose }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("classroom");
  return (
    <Modal title="Add Room" onClose={onClose}>
      <div className="form-grid">
        <div className="form-group full-width">
          <label>Room Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Chemistry Lab" />
        </div>
        <div className="form-group full-width">
          <label>Room Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="classroom">Classroom</option>
            <option value="lab">Lab</option>
            <option value="computer">Computer Lab</option>
            <option value="hall">Hall</option>
          </select>
        </div>
      </div>
      <div className="modal-actions">
        <button className="cancel-button" onClick={onClose}>Cancel</button>
        <button className="save-button" onClick={() => {
          if (!name.trim()) return;
          onSave({ name: name.trim(), type });
          onClose();
        }}>Save</button>
      </div>
    </Modal>
  );
}

function ClassModal({ onSave, onClose }) {
  const [name, setName] = useState("");
  return (
    <Modal title="Add Class" onClose={onClose}>
      <div className="form-grid">
        <div className="form-group full-width">
          <label>Class / Stream Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Form 2 East" />
        </div>
      </div>
      <div className="modal-actions">
        <button className="cancel-button" onClick={onClose}>Cancel</button>
        <button className="save-button" onClick={() => {
          if (!name.trim()) return;
          onSave({ name: name.trim(), subjects: [] });
          onClose();
        }}>Save</button>
      </div>
    </Modal>
  );
}

function ClassSubjectsPanel({ cls, subjects, teachers, rooms, totalSlots, onAdd, onRemove }) {
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [teacherId, setTeacherId] = useState("");
  const [periodsPerWeek, setPeriodsPerWeek] = useState(4);
  const [isDouble, setIsDouble] = useState(false);
  const [roomType, setRoomType] = useState("");
  const roomTypes = [...new Set(rooms.map((r) => r.type))];

  const qualifiedTeachers = teachers.filter((t) => (t.subjectIds || []).includes(subjectId));

  useEffect(() => {
    setTeacherId(qualifiedTeachers[0]?.id ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId]);

  function handleAdd() {
    if (!subjectId || !teacherId) return;
    onAdd(cls.id, {
      subjectId, teacherId,
      periodsPerWeek: Number(periodsPerWeek),
      isDouble, roomType: roomType || null,
    });
  }

  const assigned = cls.subjects.reduce((sum, s) => sum + s.periodsPerWeek, 0);
  const isFull = assigned === totalSlots;
  const isOver = assigned > totalSlots;

  return (
    <div className="dashboard-panel" style={{ marginTop: 12 }}>
      <div className="panel-header">
        <div>
          <h3>{cls.name} — Subject Requirements</h3>
          <p>What this class needs to be taught each week</p>
        </div>
        <span className={`period-badge ${isFull ? "period-badge-ok" : isOver ? "period-badge-over" : "period-badge-under"}`}>
          {assigned} / {totalSlots} periods assigned
        </span>
      </div>

      {!isFull && (
        <div className="timetable-warning" style={{ marginBottom: 15 }}>
          {isOver
            ? `This class has ${assigned - totalSlots} more period(s) assigned than the week has slots for. Remove some, or add more periods in Schedule.`
            : `This class still has ${totalSlots - assigned} period(s) per week unassigned. Every slot needs a subject or students will have free lessons.`}
        </div>
      )}

      {cls.subjects.length === 0 ? (
        <p style={{ color: "var(--color-text-muted)", fontSize: 13, marginBottom: 15 }}>
          No subjects added yet for this class.
        </p>
      ) : (
        <table className="students-table" style={{ marginBottom: 15 }}>
          <thead>
            <tr><th>Subject</th><th>Teacher</th><th>Periods/Week</th><th>Double?</th><th>Room Type</th><th></th></tr>
          </thead>
          <tbody>
            {cls.subjects.map((req) => (
              <tr key={req.reqId}>
                <td>{subjects.find((s) => s.id === req.subjectId)?.name ?? "—"}</td>
                <td>{teachers.find((t) => t.id === req.teacherId)?.name ?? "—"}</td>
                <td>{req.periodsPerWeek}</td>
                <td>{req.isDouble ? "Yes" : "No"}</td>
                <td>{req.roomType || "—"}</td>
                <td><button className="action-button" onClick={() => onRemove(cls.id, req.reqId)}>🗑</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {subjects.length === 0 || teachers.length === 0 ? (
        <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
          Add at least one subject and one teacher before assigning requirements.
        </p>
      ) : (
        <div className="form-grid">
          <div className="form-group">
            <label>Subject</label>
            <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Teacher</label>
            {qualifiedTeachers.length === 0 ? (
              <select disabled><option>No teacher assigned to this subject</option></select>
            ) : (
              <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
                {qualifiedTeachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            )}
          </div>
          <div className="form-group">
            <label>Periods / Week</label>
            <input type="number" min={1} max={12} value={periodsPerWeek}
              onChange={(e) => setPeriodsPerWeek(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Room Type (optional)</label>
            <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
              <option value="">None</option>
              {roomTypes.map((rt) => <option key={rt} value={rt}>{rt}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" checked={isDouble} onChange={(e) => setIsDouble(e.target.checked)}
                style={{ marginRight: 8 }} />
              Schedule as double lessons
            </label>
          </div>
          <div className="form-group" style={{ justifyContent: "flex-end" }}>
            <button className="add-button" type="button" disabled={qualifiedTeachers.length === 0} onClick={handleAdd}>
              + Add Requirement
            </button>
          </div>
        </div>
      )}

      {qualifiedTeachers.length === 0 && subjects.length > 0 && teachers.length > 0 && (
        <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 8 }}>
          No teacher is assigned to teach "{subjects.find((s) => s.id === subjectId)?.name}" yet.
          Edit a teacher to add this subject to what they teach.
        </p>
      )}
    </div>
  );
}

function ScheduleTab({ scheduleConfig, onSave }) {
  const [days, setDays] = useState(scheduleConfig.days);
  const [periods, setPeriods] = useState(scheduleConfig.periods);
  const dirty = JSON.stringify(days) !== JSON.stringify(scheduleConfig.days) ||
    JSON.stringify(periods) !== JSON.stringify(scheduleConfig.periods);

  function updateDay(idx, value) {
    setDays((d) => d.map((day, i) => (i === idx ? value : day)));
  }
  function removeDay(idx) {
    setDays((d) => d.filter((_, i) => i !== idx));
  }
  function addDay() {
    setDays((d) => [...d, `Day ${d.length + 1}`]);
  }

  function updatePeriod(idx, field, value) {
    setPeriods((p) => p.map((per, i) => (i === idx ? { ...per, [field]: value } : per)));
  }
  function removePeriod(idx) {
    setPeriods((p) => p.filter((_, i) => i !== idx));
  }
  function addPeriod() {
    setPeriods((p) => [...p, { id: p.length, startTime: "", endTime: "", isBreak: false }]);
  }

  function handleSave() {
    const normalizedPeriods = periods.map((p, i) => ({
      ...p,
      id: i,
      label: p.startTime && p.endTime ? `${p.startTime} - ${p.endTime}` : p.label || `Period ${i + 1}`,
    }));
    onSave({ days, periods: normalizedPeriods });
  }

  const slots = countWeeklySlots(days, periods);

  return (
    <div className="dashboard-panel">
      <div className="panel-header">
        <div>
          <h3>Weekly Schedule Structure</h3>
          <p>Define your school's days, period times, and breaks — the generator follows this exactly.</p>
        </div>
      </div>

      <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 15 }}>
        Currently: {days.length} day{days.length === 1 ? "" : "s"} ×{" "}
        {periods.filter((p) => !p.isBreak).length} teaching periods = <strong>{slots} lessons/week per class</strong>
      </p>

      <h4 style={{ fontSize: 13, marginBottom: 10 }}>Days</h4>
      <div className="schedule-days-list">
        {days.map((day, idx) => (
          <div key={idx} className="schedule-day-row">
            <input value={day} onChange={(e) => updateDay(idx, e.target.value)} />
            <button className="action-button" onClick={() => removeDay(idx)}>🗑</button>
          </div>
        ))}
      </div>
      <button className="view-button" onClick={addDay} style={{ marginBottom: 20 }}>+ Add Day</button>

      <h4 style={{ fontSize: 13, marginBottom: 10 }}>Periods</h4>
      <table className="students-table" style={{ marginBottom: 15 }}>
        <thead>
          <tr><th>Start</th><th>End</th><th>Break?</th><th>Break Label</th><th></th></tr>
        </thead>
        <tbody>
          {periods.map((p, idx) => (
            <tr key={idx}>
              <td><input type="time" value={p.startTime || ""} onChange={(e) => updatePeriod(idx, "startTime", e.target.value)} /></td>
              <td><input type="time" value={p.endTime || ""} onChange={(e) => updatePeriod(idx, "endTime", e.target.value)} /></td>
              <td>
                <input type="checkbox" checked={!!p.isBreak}
                  onChange={(e) => updatePeriod(idx, "isBreak", e.target.checked)} />
              </td>
              <td>
                {p.isBreak && (
                  <input value={p.breakLabel || ""} placeholder="e.g. Lunch"
                    onChange={(e) => updatePeriod(idx, "breakLabel", e.target.value)} />
                )}
              </td>
              <td><button className="action-button" onClick={() => removePeriod(idx)}>🗑</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="view-button" onClick={addPeriod} style={{ marginBottom: 20 }}>+ Add Period</button>

      <div className="modal-actions" style={{ borderTop: "none", paddingTop: 0, justifyContent: "flex-start" }}>
        <button className="save-button" disabled={!dirty} onClick={handleSave}>
          Save Schedule Settings
        </button>
      </div>
    </div>
  );
}

function SchoolTab({ schoolInfo, onSave }) {
  const [name, setName] = useState(schoolInfo.name);
  const [term, setTerm] = useState(schoolInfo.term);
  const dirty = name !== schoolInfo.name || term !== schoolInfo.term;

  return (
    <div className="dashboard-panel">
      <div className="panel-header">
        <div>
          <h3>School Details</h3>
          <p>Shown on the header of every printed timetable</p>
        </div>
      </div>
      <div className="form-grid">
        <div className="form-group full-width">
          <label>School Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alliance Girls High School" />
        </div>
        <div className="form-group full-width">
          <label>Term / Year</label>
          <input value={term} onChange={(e) => setTerm(e.target.value)}
            placeholder="e.g. Term 1, 2026" />
        </div>
      </div>
      <div className="modal-actions" style={{ borderTop: "none", paddingTop: 0, justifyContent: "flex-start" }}>
        <button className="save-button" disabled={!dirty} onClick={() => onSave({ name, term })}>
          Save School Details
        </button>
      </div>
    </div>
  );
}

export default function TimetableSetup() {
  const {
    teachers, subjects, rooms, classes, scheduleConfig, schoolInfo,
    addTeacher, updateTeacher, deleteTeacher,
    addSubject, deleteSubject,
    addRoom, deleteRoom,
    addClass, deleteClass,
    addClassSubject, removeClassSubject,
    setScheduleConfig,
    setSchoolInfo,
    loadSampleData,
  } = useTimetableData();

  const [activeTab, setActiveTab] = useState("teachers");
  const [modal, setModal] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [expandedClassId, setExpandedClassId] = useState(null);

  const totalSlots = countWeeklySlots(scheduleConfig.days, scheduleConfig.periods);

  function handleLoadSample() {
    loadSampleData({
      teachers: mockTeachers,
      subjects: mockSubjects,
      rooms: mockRooms,
      classes: mockClasses.map((c) => ({
        ...c,
        subjects: c.subjects.map((s) => ({ ...s, reqId: `${c.id}_${s.subjectId}` })),
      })),
      scheduleConfig,
      schoolInfo,
    });
  }

  return (
    <section className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Timetable Setup</h1>
          <p>Add the teachers, subjects, rooms, classes and schedule the generator needs.</p>
        </div>
        <button className="add-button" onClick={handleLoadSample}>Load Sample Data</button>
      </div>

      <div className="timetable-toggle" style={{ marginBottom: 20 }}>
        {TABS.map((tab) => (
          <button key={tab.id} className={activeTab === tab.id ? "timetable-toggle-active" : ""}
            onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "teachers" && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div><h3>Teachers</h3><p>{teachers.length} teacher{teachers.length === 1 ? "" : "s"}</p></div>
            <button className="view-button" onClick={() => { setEditingTeacher(null); setModal("teacher"); }}>
              + Add Teacher
            </button>
          </div>
          {teachers.length === 0 ? (
            <p style={{ color: "var(--color-text-muted)", fontSize: 13 }}>No teachers yet.</p>
          ) : (
            <table className="students-table">
              <thead><tr><th>Name</th><th>Max Periods/Day</th><th>Subjects Taught</th><th></th></tr></thead>
              <tbody>
                {teachers.map((t) => (
                  <tr key={t.id}>
                    <td>{t.name}</td>
                    <td>{t.maxPeriodsPerDay}</td>
                    <td>
                      {(t.subjectIds || []).length === 0
                        ? <span style={{ color: "var(--color-text-faint)" }}>None assigned</span>
                        : t.subjectIds.map((sid) => subjects.find((s) => s.id === sid)?.name).filter(Boolean).join(", ")}
                    </td>
                    <td>
                      <button className="action-button" onClick={() => { setEditingTeacher(t); setModal("teacher"); }}>✏️</button>
                      <button className="action-button" onClick={() => deleteTeacher(t.id)}>🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "subjects" && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div><h3>Subjects</h3><p>{subjects.length} subject{subjects.length === 1 ? "" : "s"}</p></div>
            <button className="view-button" onClick={() => setModal("subject")}>+ Add Subject</button>
          </div>
          {subjects.length === 0 ? (
            <p style={{ color: "var(--color-text-muted)", fontSize: 13 }}>No subjects yet.</p>
          ) : (
            <table className="students-table">
              <thead><tr><th>Name</th><th></th></tr></thead>
              <tbody>
                {subjects.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td><button className="action-button" onClick={() => deleteSubject(s.id)}>🗑</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "rooms" && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div><h3>Rooms</h3><p>{rooms.length} room{rooms.length === 1 ? "" : "s"}</p></div>
            <button className="view-button" onClick={() => setModal("room")}>+ Add Room</button>
          </div>
          {rooms.length === 0 ? (
            <p style={{ color: "var(--color-text-muted)", fontSize: 13 }}>
              No rooms yet — that's fine if no subjects need special rooms.
            </p>
          ) : (
            <table className="students-table">
              <thead><tr><th>Name</th><th>Type</th><th></th></tr></thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{r.type}</td>
                    <td><button className="action-button" onClick={() => deleteRoom(r.id)}>🗑</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "classes" && (
        <>
          <div className="dashboard-panel">
            <div className="panel-header">
              <div><h3>Classes / Streams</h3><p>{classes.length} class{classes.length === 1 ? "" : "es"}</p></div>
              <button className="view-button" onClick={() => setModal("class")}>+ Add Class</button>
            </div>
            {classes.length === 0 ? (
              <p style={{ color: "var(--color-text-muted)", fontSize: 13 }}>No classes yet.</p>
            ) : (
              <table className="students-table">
                <thead><tr><th>Name</th><th>Weekly Periods Assigned</th><th></th></tr></thead>
                <tbody>
                  {classes.map((c) => {
                    const assigned = c.subjects.reduce((sum, s) => sum + s.periodsPerWeek, 0);
                    const full = assigned === totalSlots;
                    return (
                      <tr key={c.id}>
                        <td>
                          <button className="student-name-button"
                            onClick={() => setExpandedClassId(expandedClassId === c.id ? null : c.id)}>
                            {c.name}
                          </button>
                        </td>
                        <td>
                          <span className={`period-badge ${full ? "period-badge-ok" : "period-badge-under"}`}>
                            {assigned} / {totalSlots}
                          </span>
                        </td>
                        <td><button className="action-button" onClick={() => deleteClass(c.id)}>🗑</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {expandedClassId && (
            <ClassSubjectsPanel
              cls={classes.find((c) => c.id === expandedClassId)}
              subjects={subjects}
              teachers={teachers}
              rooms={rooms}
              totalSlots={totalSlots}
              onAdd={addClassSubject}
              onRemove={removeClassSubject}
            />
          )}
        </>
      )}

      {activeTab === "schedule" && (
        <ScheduleTab scheduleConfig={scheduleConfig} onSave={setScheduleConfig} />
      )}

      {activeTab === "school" && (
        <SchoolTab schoolInfo={schoolInfo} onSave={setSchoolInfo} />
      )}

      {modal === "teacher" && (
        <TeacherModal
          subjects={subjects}
          existing={editingTeacher}
          onSave={(t) => editingTeacher ? updateTeacher(editingTeacher.id, t) : addTeacher(t)}
          onClose={() => { setModal(null); setEditingTeacher(null); }}
        />
      )}
      {modal === "subject" && <SubjectModal onSave={addSubject} onClose={() => setModal(null)} />}
      {modal === "room" && <RoomModal onSave={addRoom} onClose={() => setModal(null)} />}
      {modal === "class" && <ClassModal onSave={addClass} onClose={() => setModal(null)} />}
    </section>
  );
}