import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { Login } from "../features/auth";
import Dashboard from "../features/dashboard/pages/Dashboard";
import { ProjectsList } from "../features/projects";
import PrivateRoute from "../routes/PrivateRoute";

const router = createBrowserRouter([
  {
    // Root redirects to login; once logged in, PrivateRoute sends to /dashboard
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/projects",
    element: (
      <PrivateRoute>
        <MainLayout>
          <ProjectsList />
        </MainLayout>
      </PrivateRoute>
    ),
  },
]);

export default router;