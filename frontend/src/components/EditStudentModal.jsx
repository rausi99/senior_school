import { useState } from "react";

function EditStudentModal({ student, closeModal, onUpdateStudent }) {
  const [formData, setFormData] = useState({
    fullName: student.name,
    admissionNumber: student.admission,
    dateOfBirth: student.dateOfBirth || "",
    gender: student.gender || "",
    form: student.form,
    stream: student.stream,
    parentName: student.parentName || "",
    parentPhone: student.parentPhone || "",
    email: student.email || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onUpdateStudent(formData);
  };

  return (
    <div className="modal-overlay">

      <div className="student-modal">

        <div className="modal-header">

          <div>
            <h2>Edit Student</h2>
            <p>Update the student's information below.</p>
          </div>

          <button
            type="button"
            className="close-modal"
            onClick={closeModal}
          >
            ×
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Admission Number</label>

              <input
                type="text"
                name="admissionNumber"
                value={formData.admissionNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>

              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
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
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div className="form-group">
              <label>Form</label>

              <select
                name="form"
                value={formData.form}
                onChange={handleChange}
                required
              >
                <option value="">Select Form</option>
                <option>Form 1</option>
                <option>Form 2</option>
                <option>Form 3</option>
                <option>Form 4</option>
              </select>
            </div>

            <div className="form-group">
              <label>Stream</label>

              <input
                type="text"
                name="stream"
                value={formData.stream}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Parent / Guardian Name</label>

              <input
                type="text"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Parent Phone Number</label>

              <input
                type="tel"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="modal-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={closeModal}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-button"
            >
              Update Student
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditStudentModal;