import { useEffect, useState } from "react";
import TeacherProfileModal from "../components/TeacherProfileModal";

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [viewingTeacher, setViewingTeacher] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    employee_number: "",
    email: "",
    phone: "",
    gender: "",
    department: "",
    subjects: "",
    status: "Active",
  });

  const fetchTeachers = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/teachers"
      );

      if (!response.ok) {
        throw new Error("Failed to load teachers");
      }

      const data = await response.json();

      setTeachers(data);
      setError("");
    } catch (error) {
      console.error(error);
      setError(
        "Unable to load teachers. Please make sure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      full_name: "",
      employee_number: "",
      email: "",
      phone: "",
      gender: "",
      department: "",
      subjects: "",
      status: "Active",
    });

    setEditingTeacher(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);

    setFormData({
      full_name: teacher.full_name || "",
      employee_number: teacher.employee_number || "",
      email: teacher.email || "",
      phone: teacher.phone || "",
      gender: teacher.gender || "",
      department: teacher.department || "",
      subjects: teacher.subjects || "",
      status: teacher.status || "Active",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingTeacher
        ? `http://localhost:5000/api/teachers/${editingTeacher.id}`
        : "http://localhost:5000/api/teachers";

      const method = editingTeacher ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save teacher");
      }

      resetForm();
      setShowForm(false);

      fetchTeachers();
    } catch (error) {
      console.error(error);
      alert("Failed to save teacher information.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/teachers/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete teacher");
      }

      fetchTeachers();
    } catch (error) {
      console.error(error);
      alert("Failed to delete teacher.");
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const search = searchTerm.toLowerCase();

    return (
      teacher.full_name?.toLowerCase().includes(search) ||
      teacher.employee_number?.toLowerCase().includes(search) ||
      teacher.department?.toLowerCase().includes(search) ||
      teacher.subjects?.toLowerCase().includes(search)
    );
  });

  const activeTeachers = teachers.filter(
    (teacher) => teacher.status === "Active"
  ).length;

  const departments = new Set(
    teachers
      .map((teacher) => teacher.department)
      .filter(Boolean)
  ).size;

  return (
    <section className="dashboard-content">

      {/* PAGE HEADER */}

      <div className="page-header professional-header">
        <div>
          <p className="page-eyebrow">SCHOOL ADMINISTRATION</p>

          <h1>Teachers Management</h1>

          <p>
            Manage teacher records, departments and professional information.
          </p>
        </div>

        <button
          className="add-button"
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              resetForm();
            } else {
              handleAddNew();
            }
          }}
        >
          {showForm ? "Close Form" : "+ Add Teacher"}
        </button>
      </div>

      {/* STATISTICS */}

      <div className="teacher-stats">

        <div className="teacher-stat-card">
          <span className="stat-icon">👨‍🏫</span>

          <div>
            <p>Total Teachers</p>
            <h2>{teachers.length}</h2>
          </div>
        </div>

        <div className="teacher-stat-card">
          <span className="stat-icon">✓</span>

          <div>
            <p>Active Teachers</p>
            <h2>{activeTeachers}</h2>
          </div>
        </div>

        <div className="teacher-stat-card">
          <span className="stat-icon">🏛</span>

          <div>
            <p>Departments</p>
            <h2>{departments}</h2>
          </div>
        </div>

      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* FORM */}

      {showForm && (
        <div className="dashboard-panel teacher-form-panel">

          <div className="form-header">
            <div>
              <p className="page-eyebrow">
                {editingTeacher ? "UPDATE RECORD" : "NEW TEACHER"}
              </p>

              <h2>
                {editingTeacher
                  ? "Edit Teacher Information"
                  : "Add New Teacher"}
              </h2>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="professional-teacher-form"
          >

            <div className="form-section-title">
              Personal Information
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label>Full Name *</label>

                <input
                  type="text"
                  name="full_name"
                  placeholder="Enter teacher's full name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Employee Number *</label>

                <input
                  type="text"
                  name="employee_number"
                  placeholder="Example: TCH001"
                  value={formData.employee_number}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  placeholder="teacher@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>

                <input
                  type="text"
                  name="phone"
                  placeholder="0712345678"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Gender</label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

            </div>

            <div className="form-section-title">
              Professional Information
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label>Department</label>

                <input
                  type="text"
                  name="department"
                  placeholder="Example: Mathematics"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Subjects</label>

                <input
                  type="text"
                  name="subjects"
                  placeholder="Example: Mathematics, Physics"
                  value={formData.subjects}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Employment Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

            </div>

            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="add-button"
              >
                {editingTeacher
                  ? "Update Teacher"
                  : "Save Teacher"}
              </button>

            </div>

          </form>
        </div>
      )}

      {/* TEACHERS LIST */}

      <div className="dashboard-panel teachers-list-panel">

        <div className="table-header">

          <div>
            <h2>Teacher Directory</h2>

            <p>
              {filteredTeachers.length} teacher
              {filteredTeachers.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <input
            className="teacher-search"
            type="text"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>

        {loading ? (
          <div className="table-empty">
            Loading teachers...
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="table-empty">
            No teachers found.
          </div>
        ) : (
          <div className="table-wrapper">

            <table className="professional-table">

              <thead>
                <tr>
                  <th>Teacher</th>
                  <th>Employee No.</th>
                  <th>Department</th>
                  <th>Subjects</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th className="actions-column">Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredTeachers.map((teacher) => (

                  <tr key={teacher.id}>

                    <td>
                      <div className="teacher-name-cell">

                        <div className="teacher-mini-avatar">
                          {teacher.full_name?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <strong>{teacher.full_name}</strong>

                          <span>
                            {teacher.email || "No email provided"}
                          </span>
                        </div>

                      </div>
                    </td>

                    <td>
                      <span className="employee-number">
                        {teacher.employee_number}
                      </span>
                    </td>

                    <td>
                      {teacher.department || "—"}
                    </td>

                    <td>
                      {teacher.subjects || "—"}
                    </td>

                    <td>
                      {teacher.phone || "—"}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          teacher.status === "Active"
                            ? "status-active"
                            : "status-inactive"
                        }`}
                      >
                        {teacher.status}
                      </span>
                    </td>

                    <td>

                      <div className="teacher-actions">

                        <button
                          className="view-button"
                          onClick={() =>
                            setViewingTeacher(teacher)
                          }
                        >
                          View
                        </button>

                        <button
                          className="edit-button"
                          onClick={() =>
                            handleEdit(teacher)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDelete(teacher.id)
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

      </div>

      <TeacherProfileModal
        teacher={viewingTeacher}
        onClose={() => setViewingTeacher(null)}
        onEdit={handleEdit}
      />

    </section>
  );
}

export default Teachers;