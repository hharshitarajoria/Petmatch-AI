import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { ROUTES } from "@/constants/routes";

/**
 * Guards routes that require an authenticated user.
 * Renders the matched child route via <Outlet /> when a token is present,
 * otherwise redirects to the login page.
 */
export default function ProtectedRoute() {
  const token = useAppSelector((state) => state.auth.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
}

