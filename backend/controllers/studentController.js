const pool = require("../db");

const getStudents = async (req, res) => {
try {
const result = await pool.query(
"SELECT * FROM students ORDER BY id DESC"
);

res.json(result.rows);

} catch (error) {
console.error("Error fetching students:", error.message);

res.status(500).json({
  message: "Failed to fetch students",
});

}
};

const getStudentById = async (req, res) => {
try {
const { id } = req.params;

const result = await pool.query(
  "SELECT * FROM students WHERE id = $1",
  [id]
);

if (result.rows.length === 0) {
  return res.status(404).json({
    message: "Student not found",
  });
}

res.json(result.rows[0]);

} catch (error) {
console.error("Error fetching student:", error.message);

res.status(500).json({
  message: "Failed to fetch student",
});

}
};

const createStudent = async (req, res) => {
try {
const {
full_name,
admission_number,
date_of_birth,
gender,
form,
stream,
parent_name,
parent_phone,
email,
status,
} = req.body;

const result = await pool.query(
  `INSERT INTO students
  (full_name, admission_number, date_of_birth, gender, form, stream, parent_name, parent_phone, email, status)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING *`,
  [
    full_name,
    admission_number,
    date_of_birth,
    gender,
    form,
    stream,
    parent_name,
    parent_phone,
    email,
    status || "Active",
  ]
);

res.status(201).json(result.rows[0]);

} catch (error) {
console.error("Error creating student:", error.message);

res.status(500).json({
  message: "Failed to create student",
});

}
};

const updateStudent = async (req, res) => {
try {
const { id } = req.params;

const {
  full_name,
  admission_number,
  date_of_birth,
  gender,
  form,
  stream,
  parent_name,
  parent_phone,
  email,
  status,
} = req.body;

const result = await pool.query(
  `UPDATE students
   SET full_name = $1,
       admission_number = $2,
       date_of_birth = $3,
       gender = $4,
       form = $5,
       stream = $6,
       parent_name = $7,
       parent_phone = $8,
       email = $9,
       status = $10
   WHERE id = $11
   RETURNING *`,
  [
    full_name,
    admission_number,
    date_of_birth,
    gender,
    form,
    stream,
    parent_name,
    parent_phone,
    email,
    status,
    id,
  ]
);

if (result.rows.length === 0) {
  return res.status(404).json({
    message: "Student not found",
  });
}

res.json(result.rows[0]);

} catch (error) {
console.error("Error updating student:", error.message);

res.status(500).json({
  message: "Failed to update student",
});

}
};

const deleteStudent = async (req, res) => {
try {
const { id } = req.params;

const result = await pool.query(
  "DELETE FROM students WHERE id = $1 RETURNING *",
  [id]
);

if (result.rows.length === 0) {
  return res.status(404).json({
    message: "Student not found",
  });
}

res.json({
  message: "Student deleted successfully",
  student: result.rows[0],
});

} catch (error) {
console.error("Error deleting student:", error.message);

res.status(500).json({
  message: "Failed to delete student",
});

}
};

module.exports = {
getStudents,
getStudentById,
createStudent,
updateStudent,
deleteStudent,
};