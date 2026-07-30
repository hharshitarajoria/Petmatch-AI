import { Outlet } from "react-router-dom";

/**
 * Layout for authentication pages (login, register).
 * Structural placeholder only — visual design will be added later.
 */
export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
