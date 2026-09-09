import { useEffect, useState, useMemo } from "react";

/**
 * Dashboard
 *
 * Admin landing page for the school management system.
 * Data-driven, accessible, and ready to wire into a real API —
 * swap `fetchDashboardData` for your actual endpoint and everything
 * downstream (stats, chart, activity feed) updates automatically.
 */

// ---------------------------------------------------------------------------
// Data layer — replace this with a real fetch() / API client call.
// Keeping the shape explicit here documents exactly what the backend
// needs to return.
// ---------------------------------------------------------------------------
async function fetchDashboardData() {
  // Example real implementation:
  // const res = await fetch("/api/dashboard");
  // if (!res.ok) throw new Error("Failed to load dashboard data");
  // return res.json();

  await new Promise((resolve) => setTimeout(resolve, 400)); // simulate latency

  return {
    adminName: "Administrator",
    stats: {
      totalStudents: 1245,
      totalStaff: 86,
      todayAttendancePct: 94.2,
      feeCollectionKsh: 2450000,
    },
    studentsByForm: [
      { form: "Form 1", count: 325 },
      { form: "Form 2", count: 425 },
      { form: "Form 3", count: 375 },
      { form: "Form 4", count: 475 },
    ],
    activities: [
      {
        id: "act-1",
        type: "registration",
        title: "New student registered",
        detail: "Brian Kiptoo was added",
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      },
      {
        id: "act-2",
        type: "exam",
        title: "Exam results uploaded",
        detail: "Form 3 Mathematics",
        timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      },
      {
        id: "act-3",
        type: "payment",
        title: "Fee payment received",
        detail: "KSh 25,000 received",
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------
const kshFormatter = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

const compactKshFormatter = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  notation: "compact",
  maximumFractionDigits: 2,
});

function formatRelativeTime(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  const diffDay = Math.round(diffHr / 24);
  return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
}

const ACTIVITY_ICON = {
  registration: { icon: "👨‍🎓", label: "New registration" },
  exam: { icon: "📝", label: "Exam update" },
  payment: { icon: "💰", label: "Payment" },
};

// ---------------------------------------------------------------------------
// Presentational subcomponents
// ---------------------------------------------------------------------------

function StatCard({ icon, label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" role="img" aria-label="">
        {icon}
      </div>
      <div>
        <span>{label}</span>
        <h2>{value}</h2>
      </div>
    </div>
  );
}

function StudentsByFormChart({ data }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div
      className="chart"
      role="img"
      aria-label={`Students by form: ${data
        .map((d) => `${d.form} ${d.count}`)
        .join(", ")}`}
    >
      {data.map((d) => (
        <div className="chart-bar" key={d.form}>
          <div
            className="bar"
            style={{ height: `${(d.count / maxCount) * 100}%` }}
            title={`${d.form}: ${d.count} students`}
          ></div>
          <span>{d.form}</span>
        </div>
      ))}
    </div>
  );
}

function ActivityItem({ activity }) {
  const meta = ACTIVITY_ICON[activity.type] ?? { icon: "•", label: "Update" };
  return (
    <div className="activity">
      <div className="activity-icon" role="img" aria-label={meta.label}>
        {meta.icon}
      </div>
      <div>
        <strong>{activity.title}</strong>
        <p>{activity.detail}</p>
        <small>
          <time dateTime={activity.timestamp}>
            {formatRelativeTime(activity.timestamp)}
          </time>
        </small>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <section className="dashboard-content" aria-busy="true" aria-live="polite">
      <p>Loading dashboard…</p>
    </section>
  );
}

function DashboardError({ message, onRetry }) {
  return (
    <section className="dashboard-content" role="alert">
      <div className="page-header">
        <div>
          <h1>Couldn't load the dashboard</h1>
          <p>{message}</p>
        </div>
        <button className="add-button" onClick={onRetry}>
          Try again
        </button>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Dashboard({ onAddStudent, onViewStudentDetails }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      try {
        const result = await fetchDashboardData();
        if (!cancelled) {
          setData(result);
          setStatus("ready");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
          setStatus("error");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const formattedFees = useMemo(() => {
    if (!data) return null;
    // Full value for accessibility/tooltip, compact value for display
    return {
      compact: compactKshFormatter.format(data.stats.feeCollectionKsh),
      full: kshFormatter.format(data.stats.feeCollectionKsh),
    };
  }, [data]);

  if (status === "loading") return <DashboardSkeleton />;
  if (status === "error")
    return (
      <DashboardError
        message={error}
        onRetry={() => {
          setStatus("loading");
          fetchDashboardData()
            .then((result) => {
              setData(result);
              setStatus("ready");
            })
            .catch((err) => {
              setError(err instanceof Error ? err.message : "Something went wrong");
              setStatus("error");
            });
        }}
      />
    );

  const { adminName, stats, studentsByForm, activities } = data;

  return (
    <section className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Good morning, {adminName}</h1>
          <p>Here's what's happening in Alliance Senior School</p>
        </div>

        <button className="add-button" onClick={onAddStudent}>
          + Add Student
        </button>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <StatCard
          icon="👨‍🎓"
          label="Total Learners"
          value={stats.totalStudents.toLocaleString("en-KE")}
        />
        <StatCard icon="👨‍🏫" label="Total Staff" value={stats.totalStaff} />
        <StatCard
          icon="📊"
          label="Today's Attendance"
          value={`${stats.todayAttendancePct.toFixed(1)}%`}
        />
        <StatCard
          icon="💰"
          label="Fee Collection"
          value={
            <span title={formattedFees.full}>{formattedFees.compact}</span>
          }
        />
      </div>

      {/* Dashboard Panels */}
      <div className="dashboard-grid">
        {/* Student Overview */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Learners Overview</h3>
              <p>Learners by Grade</p>
            </div>

            <button className="view-button" onClick={onViewStudentDetails}>
              View Details
            </button>
          </div>

          <StudentsByFormChart data={studentsByForm} />
        </div>

        {/* Recent Activities */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Recent Activities</h3>
              <p>Latest school activities</p>
            </div>
          </div>

          {activities.length === 0 ? (
            <p>No recent activity yet.</p>
          ) : (
            <div className="activities">
              {activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}