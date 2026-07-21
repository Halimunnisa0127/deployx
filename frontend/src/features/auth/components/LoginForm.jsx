import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../slice/authSlice';
import Card from '../../../components/ui/Card';
import Form from '../../../components/ui/Form';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── Local form state (no longer in Redux) ──────────────────────
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError(''); // Clear error on typing
  };

  const handleSubmit = () => {
    // Basic validation — real API validation comes later
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    // Dummy auth — replaced by real API thunk later
    dispatch(setCredentials({ user: { email }, token: 'dummy-token' }));
    navigate('/dashboard');
  };

  return (
    <Card
      style={{
        width: '100%',
        maxWidth: '400px',
        padding: '40px 36px',
        borderRadius: '16px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        background: '#0f172a',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Brand */}
      <div style={brandStyle}>
        <span style={logoStyle}>⚡</span>
        <h1 style={titleStyle}>DeployX</h1>
      </div>
      <p style={subtitleStyle}>Sign in to your account</p>

      {/* Form — uses reusable Form, Input, Button */}
      <Form onSubmit={handleSubmit}>
        <Input
          id="login-email"
          label="Email"
          type="email"
          value={email}
          onChange={handleChange(setEmail)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <Input
          id="login-password"
          label="Password"
          type="password"
          value={password}
          onChange={handleChange(setPassword)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />

        {/* Form-level error (shown once below both fields) */}
        {error && <p style={errorStyle}>{error}</p>}

        <Button type="submit" variant="primary" fullWidth>
          Sign in
        </Button>
      </Form>
    </Card>
  );
}

/* ── Styles ──────────────────────────────────────────────────────── */

const brandStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '8px',
};

const logoStyle = {
  fontSize: '28px',
  lineHeight: 1,
};

const titleStyle = {
  margin: 0,
  fontSize: '24px',
  fontWeight: 700,
  color: '#f1f5f9',
  fontFamily: "'Inter', sans-serif",
};

const subtitleStyle = {
  margin: '0 0 32px',
  fontSize: '14px',
  color: '#64748b',
  fontFamily: "'Inter', sans-serif",
};

const errorStyle = {
  margin: 0,
  fontSize: '13px',
  color: '#f87171',
  fontFamily: "'Inter', sans-serif",
};
