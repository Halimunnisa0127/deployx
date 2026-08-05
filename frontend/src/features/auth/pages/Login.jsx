import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import GithubIcon from '../../../assets/icons/GithubIcon';
import GoogleIcon from '../../../assets/icons/GoogleIcon';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Divider from '../../../components/ui/Divider';
import LoginForm from '../components/LoginForm';
import { setCredentials } from '../slice/authSlice';
import deployxLogo from '../../../assets/logos/deployx-logo.jpg';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOAuthLogin = () => {
    // Placeholder for OAuth logic
  };

  const handleEmailLogin = (data) => {
    // Dummy auth — replace with actual API call later
    if (data.email === 'admin@deployx.dev' && data.password === 'hunter2') {
      localStorage.setItem("role", "admin");
      dispatch(setCredentials({ user: { email: data.email, role: 'admin' }, token: 'dummy-admin-token' }));
      navigate('/admin');
    } else {
      localStorage.setItem("role", "user");
      dispatch(setCredentials({ user: { email: data.email, role: 'user' }, token: 'dummy-token' }));
      navigate('/dashboard');
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

      <LoginForm onSubmit={handleEmailLogin} isLoading={false} />

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
