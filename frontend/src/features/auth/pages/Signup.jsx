import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import GithubIcon from '../../../assets/icons/GithubIcon';
import GoogleIcon from '../../../assets/icons/GoogleIcon';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Divider from '../../../components/ui/Divider';
import SignupForm from '../components/SignupForm';
import { setCredentials } from '../slice/authSlice';

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOAuthSignup = () => {
    // Placeholder for OAuth logic
  };

  const handleEmailSignup = (data) => {
    // Dummy auth — replace with actual API call later
    dispatch(setCredentials({ user: { email: data.email, name: data.fullName }, token: 'dummy-token' }));
    navigate('/dashboard');
  };

  return (
    <Card animated size="sm">
      <div className="flex flex-col items-center text-center mb-9">
        <h2 className="m-0 mb-2 text-lg font-bold text-foreground font-sans">⚡Create your account</h2>
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

      <SignupForm onSubmit={handleEmailSignup} isLoading={false} />

      <div className="mt-7 flex flex-col items-center gap-4">
        <p className="m-0 text-sm text-muted-foreground font-sans">
          Already have an account? <Link to="/login" className="text-primary hover:text-primary/90 font-semibold transition-colors decoration-none">Sign In</Link>
        </p>
      </div>
    </Card>
  );
}

/* ── Styles removed in favor of Tailwind CSS ── */
