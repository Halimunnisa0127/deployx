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
    dispatch(setCredentials({ user: { email: data.email }, token: 'dummy-token' }));
    navigate('/dashboard');
  };

  return (
    <Card animated>
      <div style={headerStyle}>
        <h2 style={headingStyle}>⚡Deploy Your Projects with Confidence</h2>
        <p style={subtitleStyle}>GitHub • Docker • CI/CD • Instant Deployments</p>
      </div>

      <div style={oauthContainer}>
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

      <div style={footerStyle}>
        <div style={linkContainer}>
          <Link to="/forgot-password" className="auth-link" style={linkStyle}>Forgot Password?</Link>
        </div>
        <p style={switchText}>
          Don't have an account? <Link to="/signup" className="auth-link-highlight" style={linkHighlight}>Sign Up</Link>
        </p>
      </div>
    </Card>
  );
}

/* ── Styles ──────────────────────────────────────────────────────── */

const headerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  marginBottom: '36px',
};

const headingStyle = {
  margin: '0 0 8px 0',
  fontSize: '18px',
  fontWeight: 600,
  color: '#cbd5e1',
  fontFamily: "'Inter', sans-serif",
};

const subtitleStyle = {
  margin: 0,
  fontSize: '13px',
  color: '#64748b',
  fontFamily: "'Inter', sans-serif",
  letterSpacing: '0.2px',
};

const oauthContainer = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '8px',
};

const footerStyle = {
  marginTop: '28px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
};

const linkContainer = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
};

const linkStyle = {
  fontSize: '13px',
  color: '#94a3b8',
  textDecoration: 'none',
  fontFamily: "'Inter', sans-serif",
  fontWeight: 500,
  transition: 'color 0.2s',
};

const switchText = {
  margin: 0,
  fontSize: '14px',
  color: '#94a3b8',
  fontFamily: "'Inter', sans-serif",
};

const linkHighlight = {
  color: '#e2e8f0',
  textDecoration: 'none',
  fontWeight: 600,
  transition: 'color 0.2s',
};

const logoStyle = {
  width: '300px',
  marginBottom: '32px',
  objectFit: 'contain',
};
