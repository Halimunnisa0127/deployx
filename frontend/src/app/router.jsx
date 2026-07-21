import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import { Login } from "../features/auth";
import Dashboard from "../features/dashboard/pages/Dashboard";
import PrivateRoute from "../routes/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout>
        <Home />
      </MainLayout>
    ),
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
]);

export default router;