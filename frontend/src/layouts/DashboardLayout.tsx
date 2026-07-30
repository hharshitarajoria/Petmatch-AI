import { Outlet } from "react-router-dom";

/**
 * Layout for authenticated app pages (dashboard, pets, adoption requests,
 * conversations, notifications, reports, profile).
 * Structural placeholder only — sidebar/navbar UI will be designed later.
 */
export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <aside data-placeholder="dashboard-sidebar" />

      <div className="flex flex-1 flex-col">
        <header data-placeholder="dashboard-header" />

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
