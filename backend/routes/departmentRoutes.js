const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all departments
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM departments ORDER BY name ASC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching departments:", error);

    res.status(500).json({
      message: "Failed to fetch departments",
    });
  }
});

// GET one department
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM departments WHERE id = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching department:", error);

    res.status(500).json({
      message: "Failed to fetch department",
    });
  }
});

// CREATE department
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Department name is required",
      });
    }

    const result = await pool.query(
      `INSERT INTO departments (name, description)
       VALUES ($1, $2)
       RETURNING *`,
      [name, description || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating department:", error);

    res.status(500).json({
      message: "Failed to create department",
    });
  }
});

// UPDATE department
router.put("/:id", async (req, res) => {
  try {
    const { name, description } = req.body;

    const result = await pool.query(
      `UPDATE departments
       SET name = $1,
           description = $2
       WHERE id = $3
       RETURNING *`,
      [name, description || null, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating department:", error);

    res.status(500).json({
      message: "Failed to update department",
    });
  }
});

// DELETE department
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM departments WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    res.json({
      message: "Department deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting department:", error);

    res.status(500).json({
      message: "Failed to delete department",
    });
  }
});

module.exports = router;