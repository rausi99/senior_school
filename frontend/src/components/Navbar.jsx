function Navbar({ sidebarOpen, setSidebarOpen }) {
  return (
    <header className="topbar">

      <button
        className="menu-button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      <div className="topbar-right">

        <button className="notification-button">
          🔔
          <span className="notification-dot"></span>
        </button>

        <div className="admin-profile">
          <div className="admin-avatar">
            A
          </div>

          <div className="admin-info">
            <strong>Administrator</strong>
            <span>Super Admin</span>
          </div>
        </div>

      </div>

    </header>
  );
}

export default Navbar;