import { Outlet } from "react-router-dom";

/**
 * Layout for public-facing pages (home, browse pets, etc).
 * Structural placeholder only — header/footer UI will be designed later.
 */
export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header data-placeholder="main-header" />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer data-placeholder="main-footer" />
    </div>
  );
}
