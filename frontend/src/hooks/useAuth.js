import { useSelector } from 'react-redux';

export default function useAuth() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  return { isAuthenticated, user, token };
}
