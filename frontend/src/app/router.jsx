import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import AuthLayout from "../layouts/AuthLayout";
import { Login, Signup, ForgotPassword } from "../features/auth";
import Dashboard from "../features/dashboard/pages/Dashboard";
import { ProjectsList, ProjectDetails } from "../features/projects";
import { DeploymentsPage, DeploymentDetailsPage } from "../features/deployments";
import PrivateRoute from "../routes/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/projects",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <ProjectsList />
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/projects/:id",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <ProjectDetails />
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/deployments",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <DeploymentsPage />
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/deployments/:id",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <DeploymentDetailsPage />
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
]);

export default router;