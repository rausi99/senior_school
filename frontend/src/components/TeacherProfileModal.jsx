function TeacherProfileModal({ teacher, onClose, onEdit }) {
  if (!teacher) return null;

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div
        className="teacher-profile-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="teacher-profile-header">
          <div className="teacher-avatar">
            {teacher.full_name?.charAt(0).toUpperCase()}
          </div>

          <div className="teacher-profile-title">
            <h2>{teacher.full_name}</h2>
            <p>{teacher.employee_number}</p>
          </div>

          <button
            className="profile-close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="teacher-profile-status">
          <span
            className={`status-badge ${
              teacher.status?.toLowerCase() === "active"
                ? "status-active"
                : "status-inactive"
            }`}
          >
            {teacher.status}
          </span>
        </div>

        <div className="teacher-profile-content">
          <div className="profile-section">
            <h3>Personal Information</h3>

            <div className="profile-details">
              <div className="profile-item">
                <span>Full Name</span>
                <strong>{teacher.full_name || "Not provided"}</strong>
              </div>

              <div className="profile-item">
                <span>Gender</span>
                <strong>{teacher.gender || "Not provided"}</strong>
              </div>

              <div className="profile-item">
                <span>Email Address</span>
                <strong>{teacher.email || "Not provided"}</strong>
              </div>

              <div className="profile-item">
                <span>Phone Number</span>
                <strong>{teacher.phone || "Not provided"}</strong>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Professional Information</h3>

            <div className="profile-details">
              <div className="profile-item">
                <span>Employee Number</span>
                <strong>
                  {teacher.employee_number || "Not provided"}
                </strong>
              </div>

              <div className="profile-item">
                <span>Department</span>
                <strong>
                  {teacher.department || "Not assigned"}
                </strong>
              </div>

              <div className="profile-item">
                <span>Subjects</span>
                <strong>
                  {teacher.subjects || "Not assigned"}
                </strong>
              </div>

              <div className="profile-item">
                <span>Employment Status</span>
                <strong>
                  {teacher.status || "Not provided"}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="teacher-profile-footer">
          <button
            className="profile-cancel-button"
            onClick={onClose}
          >
            Close
          </button>

          <button
            className="profile-edit-button"
            onClick={() => {
              onClose();
              onEdit(teacher);
            }}
          >
            Edit Teacher
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeacherProfileModal;