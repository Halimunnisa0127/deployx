import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to home page if user is not authenticated (since /login doesn't exist yet)
    return <Navigate to="/" replace />;
  }

  return children;
}
