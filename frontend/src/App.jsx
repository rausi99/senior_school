import { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Timetable from "./pages/Timetable";
import TimetableSetup from "./pages/TimetableSetup";
import { TimetableDataProvider } from "./context/TimetableDataContext";

const IMPLEMENTED_PAGES = new Set([
  "dashboard",
  "students",
  "teachers",
  "timetable",
  "timetable-setup",
]);

const PAGE_TITLES = {
  dashboard: "Dashboard",
  students: "Students",
  teachers: "Teachers",
  staff: "Staff",
  academics: "Academics",
  examinations: "Examinations",
  timetable: "Timetable",
  "timetable-setup": "Timetable Setup",
  finance: "Finance",
  reports: "Reports",
  settings: "Settings",
};

function ComingSoon({ page }) {
  return (
    <section className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>{PAGE_TITLES[page] ?? "Page"}</h1>
          <p>This page isn't built yet.</p>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  function handleLogout() {
    setIsAuthenticated(false);
  }

  function renderPage() {
    if (!IMPLEMENTED_PAGES.has(currentPage)) {
      return <ComingSoon page={currentPage} />;
    }

    switch (currentPage) {
      case "dashboard":
        return (
          <Dashboard
            onAddStudent={() => setCurrentPage("students")}
            onViewStudentDetails={() => setCurrentPage("students")}
          />
        );

      case "students":
        return <Students />;

      case "teachers":
        return <Teachers />;

      case "timetable":
        return (
          <Timetable
            onGoToSetup={() => setCurrentPage("timetable-setup")}
          />
        );

      case "timetable-setup":
        return <TimetableSetup />;

      default:
        return <ComingSoon page={currentPage} />;
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <p>You've been logged out.</p>
      </div>
    );
  }

  return (
    <TimetableDataProvider>
      <Layout
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogout={handleLogout}
      >
        {renderPage()}
      </Layout>
    </TimetableDataProvider>
  );
}