import { Outlet, NavLink } from "react-router-dom";

export default function Layout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2 className="logo">Kimonix CZ</h2>

        <nav>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `dashboard-link ${isActive ? "active" : ""}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/ab-testing"
            className={({ isActive }) =>
              `ab-testing-link ${isActive ? "active" : ""}`
            }
          >
            A/B testování
          </NavLink>

          <NavLink
            to="/sorting"
            className={({ isActive }) =>
              `sorting-link ${isActive ? "active" : ""}`
            }
          >
            Řazení
          </NavLink>
        </nav>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
