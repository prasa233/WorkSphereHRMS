
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Clock3,
  CalendarDays,
  Wallet,
  Bell,
  LogOut,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/employees", label: "Employees", icon: Users, roles: ["HR", "ADMIN"] },
    { to: "/attendance", label: "Attendance", icon: Clock3 },
    { to: "/leaves", label: "Leave Management", icon: CalendarDays },
    { to: "/payroll", label: "Payroll", icon: Wallet },
    { to: "/notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-mark small">W</span>
          <span>WorkSphere</span>
        </div>

        <p className="nav-label">WORKSPACE</p>

        <nav className="side-nav">
          {links
            .filter(
              (link) =>
                !link.roles || link.roles.includes(user?.role)
            )
            .map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={19} />
                <span>{label}</span>
              </NavLink>
            ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="user-details">
            <strong>{user?.username}</strong>
            <span>{user?.role}</span>
          </div>
          <button className="logout-button" onClick={logout}>
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <span>WorkSphere HRMS</span>
          <span className="topbar-user">{user?.email}</span>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
