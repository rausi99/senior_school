import { createContext, useContext, useEffect, useState } from "react";
import { DAYS, DEFAULT_PERIODS } from "../utils/timetableEngine";

const STORAGE_KEY = "ssms_timetable_setup_data";

const TimetableDataContext = createContext(null);

function loadInitial() {
  const defaults = {
    teachers: [],
    subjects: [],
    rooms: [],
    classes: [],
    scheduleConfig: { days: DAYS, periods: DEFAULT_PERIODS },
    schoolInfo: { name: "Your School Name", term: "Term 1, 2026" },
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with defaults so old saved data (from before scheduleConfig /
      // schoolInfo existed) doesn't leave required fields undefined.
      return {
        ...defaults,
        ...parsed,
        scheduleConfig: parsed.scheduleConfig || defaults.scheduleConfig,
        schoolInfo: parsed.schoolInfo || defaults.schoolInfo,
      };
    }
  } catch {
    // corrupt storage — fall back to defaults
  }
  return defaults;
}

function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function TimetableDataProvider({ children }) {
  const [data, setData] = useState(loadInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const api = {
    ...data,

    addTeacher: (teacher) =>
      setData((d) => ({
        ...d,
        teachers: [...d.teachers, { ...teacher, id: makeId("t"), subjectIds: teacher.subjectIds || [] }],
      })),
    updateTeacher: (id, updates) =>
      setData((d) => ({
        ...d,
        teachers: d.teachers.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      })),
    deleteTeacher: (id) =>
      setData((d) => ({
        ...d,
        teachers: d.teachers.filter((t) => t.id !== id),
        classes: d.classes.map((c) => ({
          ...c,
          subjects: c.subjects.filter((s) => s.teacherId !== id),
        })),
      })),

    addSubject: (subject) =>
      setData((d) => ({ ...d, subjects: [...d.subjects, { ...subject, id: makeId("s") }] })),
    deleteSubject: (id) =>
      setData((d) => ({
        ...d,
        subjects: d.subjects.filter((s) => s.id !== id),
        teachers: d.teachers.map((t) => ({
          ...t,
          subjectIds: (t.subjectIds || []).filter((sid) => sid !== id),
        })),
        classes: d.classes.map((c) => ({
          ...c,
          subjects: c.subjects.filter((s) => s.subjectId !== id),
        })),
      })),

    addRoom: (room) =>
      setData((d) => ({ ...d, rooms: [...d.rooms, { ...room, id: makeId("r") }] })),
    deleteRoom: (id) =>
      setData((d) => ({ ...d, rooms: d.rooms.filter((r) => r.id !== id) })),

    addClass: (cls) =>
      setData((d) => ({
        ...d,
        classes: [...d.classes, { ...cls, id: makeId("c"), subjects: cls.subjects || [] }],
      })),
    deleteClass: (id) =>
      setData((d) => ({ ...d, classes: d.classes.filter((c) => c.id !== id) })),

    addClassSubject: (classId, req) =>
      setData((d) => ({
        ...d,
        classes: d.classes.map((c) =>
          c.id === classId
            ? { ...c, subjects: [...c.subjects, { ...req, reqId: makeId("req") }] }
            : c
        ),
      })),
    removeClassSubject: (classId, reqId) =>
      setData((d) => ({
        ...d,
        classes: d.classes.map((c) =>
          c.id === classId
            ? { ...c, subjects: c.subjects.filter((s) => s.reqId !== reqId) }
            : c
        ),
      })),

    setScheduleConfig: (scheduleConfig) => setData((d) => ({ ...d, scheduleConfig })),
    setSchoolInfo: (schoolInfo) => setData((d) => ({ ...d, schoolInfo })),

    loadSampleData: (sample) =>
      setData((d) => ({
        ...sample,
        scheduleConfig: sample.scheduleConfig || d.scheduleConfig,
        schoolInfo: sample.schoolInfo || d.schoolInfo,
      })),
  };

  return (
    <TimetableDataContext.Provider value={api}>{children}</TimetableDataContext.Provider>
  );
}

export function useTimetableData() {
  const ctx = useContext(TimetableDataContext);
  if (!ctx) throw new Error("useTimetableData must be used within TimetableDataProvider");
  return ctx;
}