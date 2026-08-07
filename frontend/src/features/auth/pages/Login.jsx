import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GithubIcon from '../../../assets/icons/GithubIcon';
import GoogleIcon from '../../../assets/icons/GoogleIcon';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Divider from '../../../components/ui/Divider';
import LoginForm from '../components/LoginForm';
import { loginUser } from '../slice/authSlice';
import { useEffect, useState } from 'react';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [loginError, setLoginError] = useState(null);

  const handleOAuthLogin = () => {
    // Placeholder for OAuth logic
  };

  const handleEmailLogin = async (data) => {
    setLoginError(null);
    const resultAction = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(resultAction)) {
      navigate('/dashboard');
    } else {
      setLoginError(resultAction.payload || 'Login failed');
    }
  };

  return (
    <Card animated size="sm">
      <div className="flex flex-col items-center text-center mb-9">
        <h2 className="m-0 mb-2 text-lg font-bold text-foreground font-sans">⚡Deploy Your Projects with Confidence</h2>
        <p className="m-0 text-sm text-muted-foreground font-sans tracking-wide">GitHub • Docker • CI/CD • Instant Deployments</p>
      </div>

      <div className="flex flex-col gap-3 mb-2">
        <Button
          type="button"
          variant="oauth"
          fullWidth
          iconLeft={<GithubIcon size={18} />}
          onClick={() => { }}
        >
          Continue with GitHub
        </Button>
        <Button
          type="button"
          variant="oauth"
          fullWidth
          iconLeft={<GoogleIcon size={18} />}
          onClick={() => { }}
        >
          Continue with Google
        </Button>
      </div>

      <Divider>OR</Divider>

      {loginError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md w-full text-center">
          {loginError}
        </div>
      )}

      <LoginForm onSubmit={handleEmailLogin} isLoading={status === 'loading'} />

      <div className="mt-7 flex flex-col items-center gap-4">
        <div className="w-full flex justify-center">
          <Link to="/forgot-password" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors font-sans decoration-none">Forgot Password?</Link>
        </div>
        <p className="m-0 text-sm text-muted-foreground font-sans">
          Don't have an account? <Link to="/signup" className="text-primary hover:text-primary/90 font-semibold transition-colors decoration-none">Sign Up</Link>
        </p>
      </div>
    </Card>
  );
}

/* ── Styles removed in favor of Tailwind CSS ── */
