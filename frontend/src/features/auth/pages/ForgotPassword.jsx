import { Link } from 'react-router-dom';
import { useState } from 'react';
import Card from '../../../components/ui/Card';
import ForgotPasswordForm from '../components/ForgotPasswordForm';

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (data) => {
    // Mock sending email
    console.log('Sending reset link to:', data.email);
    setIsSubmitted(true);
  };

  return (
    <Card animated>
      <div style={headerStyle}>
        <h2 style={headingStyle}>Reset Password</h2>
        <p style={subtitleStyle}>
          {isSubmitted 
            ? "Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder."
            : "Enter your email address and we'll send you a link to reset your password."}
        </p>
      </div>

      {!isSubmitted && (
        <ForgotPasswordForm onSubmit={handleSubmit} isLoading={false} />
      )}

      <div style={footerStyle}>
        <p style={switchText}>
          <Link to="/login" className="auth-link-highlight" style={linkHighlight}>← Back to Login</Link>
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
  fontSize: '14px',
  color: '#94a3b8',
  fontFamily: "'Inter', sans-serif",
  lineHeight: 1.5,
  letterSpacing: '0.2px',
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
