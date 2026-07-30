import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute({ children }) {
  // Mock check for admin role
  const role = localStorage.getItem("role");

  if (role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children || <Outlet />}</>;
}
