const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all classes with class teacher information
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        classes.id,
        classes.name,
        classes.level,
        classes.class_teacher_id,
        teachers.full_name AS class_teacher_name,
        classes.created_at
      FROM classes
      LEFT JOIN teachers
        ON classes.class_teacher_id = teachers.id
      ORDER BY classes.id ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching classes:", error);

    res.status(500).json({
      message: "Failed to fetch classes",
    });
  }
});

// GET one class
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM classes WHERE id = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching class:", error);

    res.status(500).json({
      message: "Failed to fetch class",
    });
  }
});

// CREATE class
router.post("/", async (req, res) => {
  try {
    const { name, level, class_teacher_id } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Class name is required",
      });
    }

    const result = await pool.query(
      `INSERT INTO classes (name, level, class_teacher_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        name,
        level || null,
        class_teacher_id || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating class:", error);

    res.status(500).json({
      message: "Failed to create class",
    });
  }
});

// UPDATE class
router.put("/:id", async (req, res) => {
  try {
    const { name, level, class_teacher_id } = req.body;

    const result = await pool.query(
      `UPDATE classes
       SET name = $1,
           level = $2,
           class_teacher_id = $3
       WHERE id = $4
       RETURNING *`,
      [
        name,
        level || null,
        class_teacher_id || null,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating class:", error);

    res.status(500).json({
      message: "Failed to update class",
    });
  }
});

// DELETE class
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM classes WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    res.json({
      message: "Class deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting class:", error);

    res.status(500).json({
      message: "Failed to delete class",
    });
  }
});

module.exports = router;