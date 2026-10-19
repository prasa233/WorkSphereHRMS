
import { useEffect, useState } from "react";
import {
  Users,
  Clock3,
  CalendarDays,
  Wallet,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";

const initialStats = [
  { label: "Total Employees", value: "—", icon: Users },
  { label: "Present Today", value: "—", icon: Clock3 },
  { label: "Pending Leaves", value: "—", icon: CalendarDays },
  { label: "Monthly Payroll", value: "—", icon: Wallet },
];

const chartData = [
  { day: "Mon", attendance: 0 },
  { day: "Tue", attendance: 0 },
  { day: "Wed", attendance: 0 },
  { day: "Thu", attendance: 0 },
  { day: "Fri", attendance: 0 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(initialStats);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!["ADMIN", "HR"].includes(user?.role)) return;

    async function loadStats() {
      try {
        const response = await api.get("/dashboard/stats");
        const data = response.data;

        setStats([
          {
            label: "Total Employees",
            value: data.total_employees ?? 0,
            icon: Users,
          },
          {
            label: "Present Today",
            value: data.present_today ?? 0,
            icon: Clock3,
          },
          {
            label: "Pending Leaves",
            value: data.pending_leaves ?? 0,
            icon: CalendarDays,
          },
          {
            label: "Monthly Payroll",
            value: `₹${Number(data.monthly_payroll ?? 0).toLocaleString("en-IN")}`,
            icon: Wallet,
          },
        ]);
      } catch {
        setNotice(
          "Dashboard statistics are unavailable. Check the FastAPI dashboard endpoint."
        );
      }
    }

    loadStats();
  }, [user?.role]);

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Welcome, {user?.username || "User"}</h1>
          <p className="muted">
            Here's your WorkSphere workspace.
          </p>
        </div>
        <span className="role-pill">{user?.role}</span>
      </div>

      {notice && <div className="notice">{notice}</div>}

      {["ADMIN", "HR"].includes(user?.role) ? (
        <>
          <div className="stats-grid">
            {stats.map(({ label, value, icon: Icon }) => (
              <article className="stat-card" key={label}>
                <div className="stat-icon"><Icon size={21} /></div>
                <p>{label}</p>
                <h2>{value}</h2>
              </article>
            ))}
          </div>

          <article className="panel chart-panel">
            <h2>Attendance overview</h2>
            <p className="muted">
              Connect your attendance reporting API to populate this chart.
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="attendance"
                  fill="#4f46e5"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </article>
        </>
      ) : (
        <div className="panel">
          <h2>Your employee workspace</h2>
          <p>
            Use the navigation menu to view attendance, apply for leave,
            and check your payroll details.
          </p>
        </div>
      )}
    </section>
  );
}
