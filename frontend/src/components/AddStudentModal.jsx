import { useState } from "react";

function AddStudentModal({ closeModal, onAddStudent }) {
const [formData, setFormData] = useState({
fullName: "",
admissionNumber: "",
dateOfBirth: "",
gender: "",
form: "",
stream: "",
parentName: "",
parentPhone: "",
email: "",
});

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const handleSubmit = (e) => {
  e.preventDefault();

  console.log("Sending student:", formData);

  onAddStudent(formData);
};
return ( <div className="modal-overlay">

  <div className="student-modal">

    {/* Modal Header */}
    <div className="modal-header">
      <div>
        <h2>Add New Student</h2>
        <p>Enter the student's information below.</p>
      </div>

      <button
        className="close-modal"
        onClick={closeModal}
      >
        ×
      </button>
    </div>

    {/* Student Form */}
    <form onSubmit={handleSubmit}>

      <div className="form-grid">

        <div className="form-group">
          <label>Full Name</label>

          <input
            type="text"
            name="fullName"
            placeholder="Enter full name"
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
            placeholder="e.g. ADM001"
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
            required
          />
        </div>

        <div className="form-group">
          <label>Gender</label>

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
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
            placeholder="e.g. North"
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
            placeholder="Enter parent name"
            value={formData.parentName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Parent Phone Number</label>

          <input
            type="tel"
            name="parentPhone"
            placeholder="e.g. 0712345678"
            value={formData.parentPhone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group full-width">
          <label>Email Address</label>

          <input
            type="email"
            name="email"
            placeholder="student@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

      </div>

      {/* Form Buttons */}
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
  Save Student
</button>

      </div>

    </form>

  </div>

</div>

);
}

export default AddStudentModal;