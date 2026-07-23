import RegisterForm from '../components/RegisterForm';
import deployxLogo from '../../../assets/logos/deployx-logo.jpg';

/**
 * Register page
 */
export default function Register() {
  return (
    <div style={pageStyle}>
      <img src={deployxLogo} alt="DeployX Logo" style={logoStyle} />
      <RegisterForm />
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────────────── */

const pageStyle = {
  minHeight: '100vh',
  background: '#0a0f1e',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
};

const logoStyle = {
  width: '300px',
  marginBottom: '32px',
  objectFit: 'contain',
};
