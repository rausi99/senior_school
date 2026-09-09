const express = require("express");

const {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacherController");

const router = express.Router();

router.get("/", getTeachers);

router.get("/:id", getTeacherById);

router.post("/", createTeacher);

router.put("/:id", updateTeacher);

router.delete("/:id", deleteTeacher);

module.exports = router;