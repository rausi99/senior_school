const pool = require("../db");

// GET all teachers
const getTeachers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM teachers ORDER BY id ASC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error getting teachers:", error.message);

    res.status(500).json({
      message: "Failed to get teachers",
      error: error.message,
    });
  }
};

// GET one teacher
const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM teachers WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error getting teacher:", error.message);

    res.status(500).json({
      message: "Failed to get teacher",
      error: error.message,
    });
  }
};

// CREATE teacher
const createTeacher = async (req, res) => {
  try {
    const {
      full_name,
      employee_number,
      email,
      phone,
      gender,
      department,
      subjects,
      status,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO teachers
      (
        full_name,
        employee_number,
        email,
        phone,
        gender,
        department,
        subjects,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        full_name,
        employee_number,
        email,
        phone,
        gender,
        department,
        subjects,
        status || "Active",
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating teacher:", error.message);

    res.status(500).json({
      message: "Failed to create teacher",
      error: error.message,
    });
  }
};

// UPDATE teacher
const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      full_name,
      employee_number,
      email,
      phone,
      gender,
      department,
      subjects,
      status,
    } = req.body;

    const result = await pool.query(
      `UPDATE teachers
      SET
        full_name = $1,
        employee_number = $2,
        email = $3,
        phone = $4,
        gender = $5,
        department = $6,
        subjects = $7,
        status = $8
      WHERE id = $9
      RETURNING *`,
      [
        full_name,
        employee_number,
        email,
        phone,
        gender,
        department,
        subjects,
        status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating teacher:", error.message);

    res.status(500).json({
      message: "Failed to update teacher",
      error: error.message,
    });
  }
};

// DELETE teacher
const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM teachers WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    res.json({
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting teacher:", error.message);

    res.status(500).json({
      message: "Failed to delete teacher",
      error: error.message,
    });
  }
};

module.exports = {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};