import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PlaceholderPage from "@/pages/PlaceholderPage";
import LandingPage from "@/pages/LandingPage";
import { ROUTES } from "@/constants/routes";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: ROUTES.HOME, element: <LandingPage /> },
      { path: ROUTES.PETS, element: <PlaceholderPage title="Browse Pets" /> },
      { path: ROUTES.PET_DETAILS, element: <PlaceholderPage title="Pet Details" /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.LOGIN, element: <PlaceholderPage title="Login" /> },
      { path: ROUTES.REGISTER, element: <PlaceholderPage title="Register" /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: ROUTES.DASHBOARD, element: <PlaceholderPage title="Dashboard" /> },
          { path: ROUTES.SAVED_PETS, element: <PlaceholderPage title="Saved Pets" /> },
          { path: ROUTES.RECOMMENDATIONS, element: <PlaceholderPage title="Recommendations" /> },
          { path: ROUTES.ADOPTION_REQUESTS, element: <PlaceholderPage title="Adoption Requests" /> },
          { path: ROUTES.CONVERSATIONS, element: <PlaceholderPage title="Conversations" /> },
          { path: ROUTES.CONVERSATION_DETAILS, element: <PlaceholderPage title="Conversation" /> },
          { path: ROUTES.NOTIFICATIONS, element: <PlaceholderPage title="Notifications" /> },
          { path: ROUTES.REPORTS, element: <PlaceholderPage title="Reports" /> },
          { path: ROUTES.PROFILE, element: <PlaceholderPage title="Profile" /> },
        ],
      },
    ],
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <PlaceholderPage title="404 Not Found" />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
