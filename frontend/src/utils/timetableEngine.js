// Converts periods into display columns: teaching periods get sequential
// numbers ("Period 1", "Period 2"...), breaks keep their label. No clock
// times — the school can reference actual times separately if needed.
export function buildPeriodColumns(periods) {
  let count = 0;
  return periods.map((period) => {
    if (period.isBreak) {
      return { period, label: period.breakLabel || "Break" };
    }
    count += 1;
    return { period, label: `Period ${count}` };
  });
}
// timetableEngine.js
//
// Generates a clash-free weekly timetable using a randomized greedy
// algorithm with restarts: each attempt places lessons in a shuffled
// order, scoring candidate slots to spread subjects across the week
// and balance daily load. If an attempt can't place every lesson, it
// keeps the best attempt found and reports what couldn't be placed,
// rather than failing outright — a partial result you can act on beats
// a hard failure.

export function countWeeklySlots(days, periods) {
  return days.length * periods.filter((p) => !p.isBreak).length;
}
export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Edit this to match your school's actual day structure.
// isBreak periods are never scheduled and never count as "adjacent"
// for double-lesson placement.
export const DEFAULT_PERIODS = [
  { id: 0, label: "8:00 - 8:40" },
  { id: 1, label: "8:40 - 9:20" },
  { id: 2, label: "9:20 - 10:00" },
  { id: 3, label: "10:00 - 10:20", isBreak: true, breakLabel: "Short Break" },
  { id: 4, label: "10:20 - 11:00" },
  { id: 5, label: "11:00 - 11:40" },
  { id: 6, label: "11:40 - 12:20" },
  { id: 7, label: "12:20 - 13:20", isBreak: true, breakLabel: "Lunch" },
  { id: 8, label: "13:20 - 14:00" },
  { id: 9, label: "14:00 - 14:40" },
  { id: 10, label: "14:40 - 15:20" },
];

function isFree(grid, dayIdx, periodId) {
  return !grid[dayIdx][periodId];
}

function areAdjacent(periods, p1, p2) {
  const idx1 = periods.findIndex((p) => p.id === p1);
  const idx2 = periods.findIndex((p) => p.id === p2);
  return idx2 === idx1 + 1;
}

function roomAvailable(roomType, rooms, roomGrids, dayIdx, periodId) {
  if (!roomType) return true;
  return rooms.some(
    (r) => r.type === roomType && isFree(roomGrids[r.id], dayIdx, periodId)
  );
}

function pickRoom(roomType, rooms, roomGrids, dayIdx, periodIds) {
  const room = rooms.find(
    (r) =>
      r.type === roomType &&
      periodIds.every((p) => isFree(roomGrids[r.id], dayIdx, p))
  );
  return room ? room.id : null;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function emptyGrid(days) {
  const grid = {};
  days.forEach((_, dayIdx) => (grid[dayIdx] = {}));
  return grid;
}

// Splits each class's subject requirement into schedulable "units":
// double-lesson sessions (2 consecutive periods) and single periods.
function buildUnits(classes) {
  const units = [];
  for (const cls of classes) {
    for (const req of cls.subjects) {
      const total = req.periodsPerWeek;
      let doublesCount = 0;
      let singlesCount = total;
      if (req.isDouble && total >= 2) {
        doublesCount = Math.floor(total / 2);
        singlesCount = total % 2;
      }
      for (let i = 0; i < doublesCount; i++) {
        units.push({
          type: "double",
          classId: cls.id,
          subjectId: req.subjectId,
          teacherId: req.teacherId,
          roomType: req.roomType || null,
        });
      }
      for (let i = 0; i < singlesCount; i++) {
        units.push({
          type: "single",
          classId: cls.id,
          subjectId: req.subjectId,
          teacherId: req.teacherId,
          roomType: req.roomType || null,
        });
      }
    }
  }
  return units;
}

export function generateTimetable({
  classes,
  teachers,
  subjects,
  rooms = [],
  days = DAYS,
  periods = DEFAULT_PERIODS,
  maxAttempts = 40,
}) {
  const teacherById = Object.fromEntries(teachers.map((t) => [t.id, t]));
  const schedulableSlots = periods.filter((p) => !p.isBreak).map((p) => p.id);

  let best = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const classGrids = {};
    const teacherGrids = {};
    const roomGrids = {};
    classes.forEach((c) => (classGrids[c.id] = emptyGrid(days)));
    teachers.forEach((t) => (teacherGrids[t.id] = emptyGrid(days)));
    rooms.forEach((r) => (roomGrids[r.id] = emptyGrid(days)));

    const classDaySubjectCount = {};
    const classDayLoad = {};
    const teacherDayLoad = {};

    classes.forEach((c) => {
      classDaySubjectCount[c.id] = {};
      classDayLoad[c.id] = {};
      days.forEach((_, d) => {
        classDaySubjectCount[c.id][d] = {};
        classDayLoad[c.id][d] = 0;
      });
    });
    teachers.forEach((t) => {
      teacherDayLoad[t.id] = {};
      days.forEach((_, d) => (teacherDayLoad[t.id][d] = 0));
    });

    let unitsOrder = shuffle(buildUnits(classes));
    // Doubles are harder to place (need two consecutive free slots), so
    // place them first while there's still room to maneuver.
    unitsOrder.sort((a, b) =>
      a.type === b.type ? 0 : a.type === "double" ? -1 : 1
    );

    const unplaced = [];

    for (const unit of unitsOrder) {
      const teacher = teacherById[unit.teacherId];
      const maxPerDay = teacher?.maxPeriodsPerDay ?? Infinity;
      const candidates = [];

      for (let dayIdx = 0; dayIdx < days.length; dayIdx++) {
        if (unit.type === "single") {
          for (const p of schedulableSlots) {
            if (
              isFree(classGrids[unit.classId], dayIdx, p) &&
              isFree(teacherGrids[unit.teacherId], dayIdx, p) &&
              teacherDayLoad[unit.teacherId][dayIdx] + 1 <= maxPerDay &&
              roomAvailable(unit.roomType, rooms, roomGrids, dayIdx, p)
            ) {
              candidates.push({ dayIdx, periods: [p] });
            }
          }
        } else {
          for (let i = 0; i < schedulableSlots.length - 1; i++) {
            const p = schedulableSlots[i];
            const pNext = schedulableSlots[i + 1];
            if (!areAdjacent(periods, p, pNext)) continue;
            if (
              isFree(classGrids[unit.classId], dayIdx, p) &&
              isFree(classGrids[unit.classId], dayIdx, pNext) &&
              isFree(teacherGrids[unit.teacherId], dayIdx, p) &&
              isFree(teacherGrids[unit.teacherId], dayIdx, pNext) &&
              teacherDayLoad[unit.teacherId][dayIdx] + 2 <= maxPerDay &&
              roomAvailable(unit.roomType, rooms, roomGrids, dayIdx, p) &&
              roomAvailable(unit.roomType, rooms, roomGrids, dayIdx, pNext)
            ) {
              candidates.push({ dayIdx, periods: [p, pNext] });
            }
          }
        }
      }

      if (candidates.length === 0) {
        unplaced.push(unit);
        continue;
      }

      // Prefer slots that don't repeat this subject on the same day,
      // and that keep the class/teacher's day load balanced.
      function score(c) {
        const repeat = classDaySubjectCount[unit.classId][c.dayIdx][unit.subjectId]
          ? 50
          : 0;
        return (
          repeat +
          classDayLoad[unit.classId][c.dayIdx] +
          teacherDayLoad[unit.teacherId][c.dayIdx]
        );
      }
      const ranked = shuffle(candidates).sort((a, b) => score(a) - score(b));
      const chosen = ranked[0];

      const roomId = unit.roomType
        ? pickRoom(unit.roomType, rooms, roomGrids, chosen.dayIdx, chosen.periods)
        : null;

      chosen.periods.forEach((p) => {
        classGrids[unit.classId][chosen.dayIdx][p] = {
          subjectId: unit.subjectId,
          teacherId: unit.teacherId,
          roomId,
          isDouble: unit.type === "double",
        };
        teacherGrids[unit.teacherId][chosen.dayIdx][p] = {
          classId: unit.classId,
          subjectId: unit.subjectId,
          roomId,
        };
        if (roomId) {
          roomGrids[roomId][chosen.dayIdx][p] = {
            classId: unit.classId,
            subjectId: unit.subjectId,
          };
        }
      });

      classDaySubjectCount[unit.classId][chosen.dayIdx][unit.subjectId] =
        (classDaySubjectCount[unit.classId][chosen.dayIdx][unit.subjectId] || 0) + 1;
      classDayLoad[unit.classId][chosen.dayIdx] += chosen.periods.length;
      teacherDayLoad[unit.teacherId][chosen.dayIdx] += chosen.periods.length;
    }

    const result = { classGrids, teacherGrids, unplaced, success: unplaced.length === 0 };
    if (!best || unplaced.length < best.unplaced.length) best = result;
    if (result.success) return result;
  }

  return best;
}