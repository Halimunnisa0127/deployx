import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../features/auth/slice/authSlice";
import { ThemeToggle } from "../../ui/ThemeToggle";
import useAuth from "../../../hooks/useAuth";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleLogout = () => {
    dispatch(logoutUser());
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
