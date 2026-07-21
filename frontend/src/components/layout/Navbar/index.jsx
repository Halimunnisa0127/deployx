import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../features/auth/slice/authSlice";
import useAuth from "../../../hooks/useAuth";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav>
      <span>DeployX</span>
      {isAuthenticated && (
        <button onClick={handleLogout}>Logout</button>
      )}
    </nav>
  );
}
