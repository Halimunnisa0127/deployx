import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import { Login, Register } from "../features/auth";
import Dashboard from "../features/dashboard/pages/Dashboard";
import { ProjectsList } from "../features/projects";
import PrivateRoute from "../routes/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
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