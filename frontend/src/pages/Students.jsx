import { useEffect, useState } from "react";

// ==========================================
// 1. ADD STUDENT MODAL COMPONENT
// ==========================================
function AddStudentModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    fullName: "",
    admissionNumber: "",
    dateOfBirth: "",
    gender: "Male",
    form: "Form 1",
    stream: "",
    parentName: "",
    parentPhone: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Student</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Full Name *
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </label>
            <label>
              Admission Number *
              <input type="text" name="admissionNumber" value={formData.admissionNumber} onChange={handleChange} required />
            </label>
            <label>
              Date of Birth
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
            </label>
            <label>
              Gender
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label>
              Form *
              <select name="form" value={formData.form} onChange={handleChange} required>
                <option value="Form 1">Form 1</option>
                <option value="Form 2">Form 2</option>
                <option value="Form 3">Form 3</option>
                <option value="Form 4">Form 4</option>
              </select>
            </label>
            <label>
              Stream
              <input type="text" name="stream" value={formData.stream} onChange={handleChange} placeholder="e.g. West" />
            </label>
            <label>
              Parent/Guardian Name
              <input type="text" name="parentName" value={formData.parentName} onChange={handleChange} />
            </label>
            <label>
              Parent Phone Contact
              <input type="tel" name="parentPhone" value={formData.parentPhone} onChange={handleChange} />
            </label>
            <label>
              Email Address
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-btn">Save Student</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 2. EDIT STUDENT MODAL COMPONENT
// ==========================================
function EditStudentModal({ student, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    fullName: student.full_name || "",
    admissionNumber: student.admission_number || "",
    dateOfBirth: student.date_of_birth || "",
    gender: student.gender || "Male",
    form: student.form || "Form 1",
    stream: student.stream || "",
    parentName: student.parent_name || "",
    parentPhone: student.parent_phone || "",
    email: student.email || "",
    status: student.status || "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Student Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Full Name *
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </label>
            <label>
              Admission Number *
              <input type="text" name="admissionNumber" value={formData.admissionNumber} onChange={handleChange} required />
            </label>
            <label>
              Date of Birth
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
            </label>
            <label>
              Gender
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label>
              Form *
              <select name="form" value={formData.form} onChange={handleChange} required>
                <option value="Form 1">Form 1</option>
                <option value="Form 2">Form 2</option>
                <option value="Form 3">Form 3</option>
                <option value="Form 4">Form 4</option>
              </select>
            </label>
            <label>
              Stream
              <input type="text" name="stream" value={formData.stream} onChange={handleChange} />
            </label>
            <label>
              Status
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
            <label>
              Parent/Guardian Name
              <input type="text" name="parentName" value={formData.parentName} onChange={handleChange} />
            </label>
            <label>
              Parent Phone
              <input type="tel" name="parentPhone" value={formData.parentPhone} onChange={handleChange} />
            </label>
            <label>
              Email Address
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-btn">Update Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 3. STUDENT PROFILE PROFILE/VIEW MODAL
// ==========================================
function StudentProfileModal({ student, onClose, onEdit }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content profile-modal">
        <h2>Student Record Sheet</h2>
        <div className="profile-detail-grid">
          <p><strong>Full Name:</strong> {student.full_name}</p>
          <p><strong>Admission Number:</strong> {student.admission_number}</p>
          <p><strong>Form & Stream:</strong> {student.form} {student.stream || ""}</p>
          <p><strong>Status:</strong> <span className={`status-badge ${student.status?.toLowerCase()}`}>{student.status}</span></p>
          <p><strong>Gender:</strong> {student.gender || "N/A"}</p>
          <p><strong>Date of Birth:</strong> {student.date_of_birth || "N/A"}</p>
          <p><strong>Parent/Guardian:</strong> {student.parent_name || "N/A"}</p>
          <p><strong>Parent Phone:</strong> {student.parent_phone || "N/A"}</p>
          <p><strong>Email Address:</strong> {student.email || "N/A"}</p>
        </div>
        <div className="modal-actions">
          <button type="button" className="cancel-btn" onClick={onClose}>Close</button>
          <button type="button" className="edit-btn" onClick={() => onEdit(student)}>Modify Profile</button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. MAIN STUDENTS SYSTEM COMPONENT
// ==========================================
export default function Students() {
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedForm, setSelectedForm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/students");

      if (!response.ok) {
        throw new Error("Failed to load students");
      }

      const data = await response.json();
      setStudents(data);
      setError("");
    } catch (error) {
      console.error("Error loading students:", error);
      setError("Unable to load students. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      student.full_name?.toLowerCase().includes(search) ||
      student.admission_number?.toLowerCase().includes(search);

    const matchesForm = selectedForm === "" || student.form === selectedForm;
    const matchesStatus = selectedStatus === "" || student.status === selectedStatus;

    return matchesSearch && matchesForm && matchesStatus;
  });
  const totalPages = Math.max(
  1,
  Math.ceil(filteredStudents.length / studentsPerPage)
);

const startIndex = (currentPage - 1) * studentsPerPage;
const endIndex = startIndex + studentsPerPage;

const currentStudents = filteredStudents.slice(
  startIndex,
  endIndex
);

const activeStudents = students.filter(
  (student) => student.status === "Active"
).length;

const inactiveStudents = students.filter(
  (student) => student.status === "Inactive"
).length;

const totalForms = new Set(
  students
    .map((student) => student.form)
    .filter(Boolean)
).size;


/* =========================
   SEARCH AND FILTERS
========================= */

const handleSearchChange = (e) => {
  setSearchTerm(e.target.value);
  setCurrentPage(1);
};

const handleFormChange = (e) => {
  setSelectedForm(e.target.value);
  setCurrentPage(1);
};

const handleStatusChange = (e) => {
  setSelectedStatus(e.target.value);
  setCurrentPage(1);
};

const handleResetFilters = () => {
  setSearchTerm("");
  setSelectedForm("");
  setSelectedStatus("");
  setCurrentPage(1);
};


/* =========================
   ADD STUDENT
========================= */

const handleAddStudent = async (newStudent) => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/students",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          full_name: newStudent.fullName,
          admission_number: newStudent.admissionNumber,
          date_of_birth: newStudent.dateOfBirth,
          gender: newStudent.gender,
          form: newStudent.form,
          stream: newStudent.stream,
          parent_name: newStudent.parentName,
          parent_phone: newStudent.parentPhone,
          email: newStudent.email,
          status: "Active",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add student");
    }

    setShowModal(false);

    await fetchStudents();

  } catch (error) {
    console.error(
      "Error adding student:",
      error
    );
  }
};


/* =========================
   UPDATE STUDENT
========================= */

const handleUpdateStudent = async (updatedStudent) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/students/${editingStudent.id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          full_name: updatedStudent.fullName,
          admission_number: updatedStudent.admissionNumber,
          date_of_birth: updatedStudent.dateOfBirth,
          gender: updatedStudent.gender,
          form: updatedStudent.form,
          stream: updatedStudent.stream,
          parent_name: updatedStudent.parentName,
          parent_phone: updatedStudent.parentPhone,
          email: updatedStudent.email,
          status:
            updatedStudent.status ||
            editingStudent.status,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to update student"
      );
    }

    setEditingStudent(null);
    setViewingStudent(null);

    await fetchStudents();

  } catch (error) {
    console.error(
      "Error updating student:",
      error
    );
  }
};


/* =========================
   DELETE STUDENT
========================= */

const handleDeleteStudent = async (studentId) => {

  if (
    !window.confirm(
      "Are you sure you want to delete this student record?"
    )
  ) {
    return;
  }

  try {

    const response = await fetch(
      `http://localhost:5000/api/students/${studentId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to delete student"
      );
    }

    await fetchStudents();

  } catch (error) {

    console.error(
      "Error deleting student:",
      error
    );

  }
};


/* =========================
   VIEW AND EDIT
========================= */

const handleViewStudent = (student) => {
  setViewingStudent(student);
};

const handleEditFromProfile = (student) => {
  setViewingStudent(null);
  setEditingStudent(student);
};


/* =========================
   PAGE INTERFACE
========================= */

return (
  <section className="dashboard-content">

    {/* ERROR MESSAGE */}

    {error && (
      <div className="error-message">
        {error}
      </div>
    )}


    {/* PAGE HEADER */}

    <div className="page-header professional-header">

      <div>

        <p className="page-eyebrow">
          STUDENT ADMINISTRATION
        </p>

        <h1>
          Students Management
        </h1>

        <p>
          Manage student records, enrollment and
          academic information.
        </p>

      </div>

      <button
        type="button"
        className="add-button"
        onClick={() => setShowModal(true)}
      >
        + Add Student
      </button>

    </div>


    {/* STUDENT STATISTICS */}

    <div className="student-stats">

      <div className="student-stat-card">

        <div className="student-stat-icon">
          ST
        </div>

        <div>
          <p>Total Students</p>
          <h2>{students.length}</h2>
        </div>

      </div>


      <div className="student-stat-card">

        <div className="student-stat-icon">
          AC
        </div>

        <div>
          <p>Active Students</p>
          <h2>{activeStudents}</h2>
        </div>

      </div>


      <div className="student-stat-card">

        <div className="student-stat-icon">
          IN
        </div>

        <div>
          <p>Inactive Students</p>
          <h2>{inactiveStudents}</h2>
        </div>

      </div>


      <div className="student-stat-card">

        <div className="student-stat-icon">
          FM
        </div>

        <div>
          <p>Total Forms</p>
          <h2>{totalForms}</h2>
        </div>

      </div>

    </div>


    {/* STUDENT DIRECTORY */}

    <div className="dashboard-panel students-directory-panel">

      <div className="students-directory-header">

        <div>

          <h2>
            Student Directory
          </h2>

          <p>
            {filteredStudents.length} student
            {filteredStudents.length !== 1
              ? "s"
              : ""}{" "}
            found
          </p>

        </div>


        {/* SEARCH */}

        <div className="students-directory-search">

          <input
            type="text"
            placeholder="Search by name or admission number..."
            value={searchTerm}
            onChange={handleSearchChange}
          />

        </div>

      </div>


      {/* FILTERS */}

      <div className="student-professional-filters">

        <select
          value={selectedForm}
          onChange={handleFormChange}
        >

          <option value="">
            All Forms
          </option>

          <option value="Form 1">
            Form 1
          </option>

          <option value="Form 2">
            Form 2
          </option>

          <option value="Form 3">
            Form 3
          </option>

          <option value="Form 4">
            Form 4
          </option>

        </select>


        <select
          value={selectedStatus}
          onChange={handleStatusChange}
        >

          <option value="">
            All Status
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Inactive">
            Inactive
          </option>

        </select>


        {(searchTerm ||
          selectedForm ||
          selectedStatus) && (

          <button
            type="button"
            className="student-reset-button"
            onClick={handleResetFilters}
          >
            Reset Filters
          </button>

        )}

      </div>


      {/* TABLE */}

      {loading ? (

        <div className="table-empty">
          Loading student profiles...
        </div>

      ) : currentStudents.length === 0 ? (

        <div className="table-empty">
          No students matched your criteria.
        </div>

      ) : (

        <div className="table-wrapper">

          <table className="professional-table">

            <thead>

              <tr>

                <th>Adm No.</th>
                <th>Full Name</th>
                <th>Form & Stream</th>
                <th>Parent Contact</th>
                <th>Status</th>
                <th>Actions</th>

              </tr>

            </thead>


            <tbody>

              {currentStudents.map((student) => (

                <tr key={student.id}>

                  <td>
                    {student.admission_number}
                  </td>


                  <td>

                    <button
                      type="button"
                      className="student-directory-name-button"
                      onClick={() =>
                        handleViewStudent(student)
                      }
                    >
                      {student.full_name}
                    </button>

                  </td>


                  <td>
                    {student.form}{" "}

                    {student.stream
                      ? `- ${student.stream}`
                      : ""}
                  </td>


                  <td>
                    {student.parent_phone || "—"}
                  </td>


                  <td>

                    <span
                      className={`status-badge ${
                        student.status === "Active"
                          ? "status-active"
                          : "status-inactive"
                      }`}
                    >
                      {student.status}
                    </span>

                  </td>


                  <td>

                    <div className="student-table-actions">

                      <button
                        type="button"
                        className="view-button"
                        onClick={() =>
                          handleViewStudent(student)
                        }
                      >
                        View
                      </button>


                      <button
                        type="button"
                        className="edit-button"
                        onClick={() =>
                          setEditingStudent(student)
                        }
                      >
                        Edit
                      </button>


                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          handleDeleteStudent(student.id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}


      {/* PAGINATION */}

      <div className="student-pagination-footer">

        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage((page) =>
              Math.max(1, page - 1)
            )
          }
        >
          Previous
        </button>


        <span>
          Page {currentPage} of {totalPages}
        </span>


        <button
          type="button"
          disabled={
            currentPage === totalPages
          }
          onClick={() =>
            setCurrentPage((page) =>
              Math.min(
                totalPages,
                page + 1
              )
            )
          }
        >
          Next
        </button>

      </div>

    </div>


    {/* ADD STUDENT MODAL */}

    {showModal && (

      <AddStudentModal
        closeModal={() =>
          setShowModal(false)
        }
        onAddStudent={handleAddStudent}
      />

    )}


    {/* EDIT STUDENT MODAL */}

    {editingStudent && (

      <EditStudentModal
        student={editingStudent}
        closeModal={() =>
          setEditingStudent(null)
        }
        onUpdateStudent={
          handleUpdateStudent
        }
      />

    )}


    {/* STUDENT PROFILE MODAL */}

    {viewingStudent && (

      <StudentProfileModal
        student={viewingStudent}
        closeModal={() =>
          setViewingStudent(null)
        }
        onEditStudent={
          handleEditFromProfile
        }
      />

    )}

  </section>
);
}
