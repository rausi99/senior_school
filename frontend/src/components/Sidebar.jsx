const NAV_SECTIONS = [
  {
    label: "MAIN",
    items: [
      { id: "dashboard", icon: "▣", text: "Dashboard" },
      { id: "students", icon: "👨‍🎓", text: "Students" },
      { id: "teachers", icon: "👨‍🏫", text: "Teachers" },
    ],
  },
{
  label: "ACADEMICS",
  items: [
    { id: "academics", icon: "📚", text: "Academics" },
    { id: "examinations", icon: "📝", text: "Examinations" },
    { id: "timetable", icon: "📅", text: "Timetable" },
    { id: "timetable-setup", icon: "🛠️", text: "Timetable Setup" },
  ],
},
  {
    label: "MANAGEMENT",
    items: [
      { id: "finance", icon: "💰", text: "Finance" },
      { id: "reports", icon: "📊", text: "Reports" },
      { id: "settings", icon: "⚙️", text: "Settings" },
    ],
  },
];

function NavItem({ item, isActive, sidebarOpen, onClick }) {
  return (
    <button
      className={`nav-item${isActive ? " active" : ""}`}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      title={!sidebarOpen ? item.text : undefined}
    >
      <span aria-hidden="true">{item.icon}</span>
      {sidebarOpen ? (
        <span>{item.text}</span>
      ) : (
        <span className="sr-only">{item.text}</span>
      )}
    </button>
  );
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  currentPage,
  setCurrentPage,
  onLogout,
}) {
  return (
    <aside
      className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">SS</div>

        {sidebarOpen && (
          <div className="logo-text">
            <h2>Senior School</h2>
            <span>Management System</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            {sidebarOpen && <p className="nav-section">{section.label}</p>}

            {section.items.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={currentPage === item.id}
                sidebarOpen={sidebarOpen}
                onClick={() => {
                  setCurrentPage(item.id);
                  if (window.innerWidth <= 768) setSidebarOpen(false);
                }}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="sidebar-bottom">
        <button className="nav-item logout" onClick={onLogout}>
          <span aria-hidden="true">↪</span>
          {sidebarOpen ? (
            <span>Logout</span>
          ) : (
            <span className="sr-only">Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
}