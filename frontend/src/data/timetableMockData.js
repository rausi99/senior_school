// Replace with real data once you build the setup forms for
// classes/teachers/subjects/rooms. Field shapes here are exactly
// what generateTimetable() expects.

export const mockSubjects = [
  { id: "math", name: "Mathematics" },
  { id: "eng", name: "English" },
  { id: "kis", name: "Kiswahili" },
  { id: "bio", name: "Biology" },
  { id: "chem", name: "Chemistry" },
  { id: "phy", name: "Physics" },
  { id: "geo", name: "Geography" },
  { id: "hist", name: "History" },
  { id: "cre", name: "C.R.E" },
  { id: "bus", name: "Business Studies" },
  { id: "comp", name: "Computer Studies" },
  { id: "pe", name: "Physical Education" },
];

export const mockTeachers = [
  { id: "t1", name: "Mr. Otieno", maxPeriodsPerDay: 6, subjectIds: ["math"] },
  { id: "t2", name: "Mrs. Wanjiru", maxPeriodsPerDay: 6, subjectIds: ["eng", "kis"] },
  { id: "t3", name: "Mr. Kiptoo", maxPeriodsPerDay: 6, subjectIds: ["bio", "phy"] },
  { id: "t4", name: "Ms. Achieng", maxPeriodsPerDay: 6, subjectIds: ["chem"] },
  { id: "t5", name: "Mr. Mwangi", maxPeriodsPerDay: 6, subjectIds: ["geo", "pe"] },
  { id: "t6", name: "Mrs. Njeri", maxPeriodsPerDay: 5, subjectIds: ["cre", "hist"] },
  { id: "t7", name: "Mr. Barasa", maxPeriodsPerDay: 6, subjectIds: ["comp", "bus"] },
];

export const mockRooms = [
  { id: "lab1", name: "Chemistry Lab", type: "lab" },
  { id: "lab2", name: "Physics/Biology Lab", type: "lab" },
  { id: "compLab", name: "Computer Lab", type: "computer" },
];

export const mockClasses = [
  {
    id: "f1e",
    name: "Form 1 East",
    subjects: [
      { subjectId: "math", teacherId: "t1", periodsPerWeek: 5, isDouble: false },
      { subjectId: "eng", teacherId: "t2", periodsPerWeek: 5, isDouble: false },
      { subjectId: "kis", teacherId: "t2", periodsPerWeek: 4, isDouble: false },
      { subjectId: "bio", teacherId: "t3", periodsPerWeek: 4, isDouble: true, roomType: "lab" },
      { subjectId: "chem", teacherId: "t4", periodsPerWeek: 4, isDouble: true, roomType: "lab" },
      { subjectId: "geo", teacherId: "t5", periodsPerWeek: 3, isDouble: false },
      { subjectId: "cre", teacherId: "t6", periodsPerWeek: 3, isDouble: false },
      { subjectId: "comp", teacherId: "t7", periodsPerWeek: 2, isDouble: false, roomType: "computer" },
      { subjectId: "pe", teacherId: "t5", periodsPerWeek: 2, isDouble: false },
    ],
  },
  {
    id: "f2e",
    name: "Form 2 East",
    subjects: [
      { subjectId: "math", teacherId: "t1", periodsPerWeek: 5, isDouble: false },
      { subjectId: "eng", teacherId: "t2", periodsPerWeek: 5, isDouble: false },
      { subjectId: "kis", teacherId: "t2", periodsPerWeek: 4, isDouble: false },
      { subjectId: "phy", teacherId: "t3", periodsPerWeek: 4, isDouble: true, roomType: "lab" },
      { subjectId: "chem", teacherId: "t4", periodsPerWeek: 4, isDouble: true, roomType: "lab" },
      { subjectId: "hist", teacherId: "t6", periodsPerWeek: 3, isDouble: false },
      { subjectId: "bus", teacherId: "t7", periodsPerWeek: 3, isDouble: false },
      { subjectId: "comp", teacherId: "t7", periodsPerWeek: 2, isDouble: false, roomType: "computer" },
      { subjectId: "pe", teacherId: "t5", periodsPerWeek: 2, isDouble: false },
    ],
  },
];