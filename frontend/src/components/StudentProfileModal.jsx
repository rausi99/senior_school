function StudentProfileModal({ student, closeModal, onEditStudent }) {
  return (
    <div className="modal-overlay">
      <div className="student-profile-modal">

        {/* HEADER */}
        <div className="profile-header">
          <div className="profile-header-left">

            <div className="profile-avatar">
              {student.name.charAt(0)}
            </div>

            <div>
              <h2>{student.name}</h2>

              <p>
                Admission No: {student.admission}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="close-modal"
            onClick={closeModal}
          >
            ×
          </button>
        </div>

        {/* STATUS */}
        <div className="profile-status">
          <span className="status active-status">
            {student.status}
          </span>
        </div>

        {/* PERSONAL INFORMATION */}
        <div className="profile-section">
          <h3>Personal Information</h3>

          <div className="profile-grid">

            <div className="profile-item">
              <span>Full Name</span>
              <strong>{student.name}</strong>
            </div>

            <div className="profile-item">
              <span>Admission Number</span>
              <strong>{student.admission}</strong>
            </div>

            <div className="profile-item">
              <span>Date of Birth</span>
              <strong>
                {student.dateOfBirth || "Not provided"}
              </strong>
            </div>

            <div className="profile-item">
              <span>Gender</span>
              <strong>
                {student.gender || "Not provided"}
              </strong>
            </div>

          </div>
        </div>

        {/* ACADEMIC INFORMATION */}
        <div className="profile-section">
          <h3>Academic Information</h3>

          <div className="profile-grid">

            <div className="profile-item">
              <span>Form</span>
              <strong>{student.form}</strong>
            </div>

            <div className="profile-item">
              <span>Stream</span>
              <strong>{student.stream}</strong>
            </div>

            <div className="profile-item">
              <span>Student Status</span>
              <strong>{student.status}</strong>
            </div>

          </div>
        </div>

        {/* PARENT INFORMATION */}
        <div className="profile-section">
          <h3>Parent / Guardian Information</h3>

          <div className="profile-grid">

            <div className="profile-item">
              <span>Parent / Guardian</span>
              <strong>
                {student.parentName || "Not provided"}
              </strong>
            </div>

            <div className="profile-item">
              <span>Phone Number</span>
              <strong>
                {student.parentPhone || "Not provided"}
              </strong>
            </div>

            <div className="profile-item">
              <span>Email Address</span>
              <strong>
                {student.email || "Not provided"}
              </strong>
            </div>

          </div>
        </div>

        {/* ACTIONS */}
        <div className="profile-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={closeModal}
          >
            Close
          </button>

          <button
            type="button"
            className="save-button"
            onClick={() => onEditStudent(student)}
          >
            Edit Student
          </button>

        </div>

      </div>
    </div>
  );
}

export default StudentProfileModal;