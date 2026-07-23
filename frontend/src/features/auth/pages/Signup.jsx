import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import GithubIcon from '../../../components/ui/GithubIcon';
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
    <Card animated>
      <div style={headerStyle}>
        <div style={brandStyle}>
          <span style={logoStyle}>⚡</span>
          <h1 style={titleStyle}>DeployX</h1>
        </div>
        <h2 style={headingStyle}>Create your account</h2>
        <p style={subtitleStyle}>GitHub • Docker • CI/CD • Instant Deployments</p>
      </div>

      <div style={oauthContainer}>
        <Button 
          type="button"
          variant="oauth" 
          fullWidth 
          iconLeft={<GithubIcon size={18} />} 
          onClick={handleOAuthSignup}
        >
          Continue with GitHub
        </Button>
      </div>

      <Divider>OR</Divider>

      <SignupForm onSubmit={handleEmailSignup} isLoading={false} />

      <div style={footerStyle}>
        <p style={switchText}>
          Already have an account? <Link to="/login" className="auth-link-highlight" style={linkHighlight}>Sign In</Link>
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

const brandStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  marginBottom: '16px',
};

const logoStyle = {
  fontSize: '28px',
  lineHeight: 1,
};

const titleStyle = {
  margin: 0,
  fontSize: '26px',
  fontWeight: 700,
  color: '#f8fafc',
  fontFamily: "'Inter', sans-serif",
  letterSpacing: '-0.5px',
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
  marginBottom: '4px',
};

const footerStyle = {
  marginTop: '28px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
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
