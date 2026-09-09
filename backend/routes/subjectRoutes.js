const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all subjects with department information
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        subjects.id,
        subjects.name,
        subjects.code,
        subjects.department_id,
        departments.name AS department_name,
        subjects.created_at
      FROM subjects
      LEFT JOIN departments
        ON subjects.department_id = departments.id
      ORDER BY subjects.name ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching subjects:", error);

    res.status(500).json({
      message: "Failed to fetch subjects",
    });
  }
});

// GET one subject
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM subjects WHERE id = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching subject:", error);

    res.status(500).json({
      message: "Failed to fetch subject",
    });
  }
});

// CREATE subject
router.post("/", async (req, res) => {
  try {
    const { name, code, department_id } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Subject name is required",
      });
    }

    const result = await pool.query(
      `INSERT INTO subjects (name, code, department_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        name,
        code || null,
        department_id || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating subject:", error);

    res.status(500).json({
      message: "Failed to create subject",
    });
  }
});

// UPDATE subject
router.put("/:id", async (req, res) => {
  try {
    const { name, code, department_id } = req.body;

    const result = await pool.query(
      `UPDATE subjects
       SET name = $1,
           code = $2,
           department_id = $3
       WHERE id = $4
       RETURNING *`,
      [
        name,
        code || null,
        department_id || null,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating subject:", error);

    res.status(500).json({
      message: "Failed to update subject",
    });
  }
});

// DELETE subject
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM subjects WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.json({
      message: "Subject deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting subject:", error);

    res.status(500).json({
      message: "Failed to delete subject",
    });
  }
});

module.exports = router;