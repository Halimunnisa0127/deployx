import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../slice/authSlice';
import Card from '../../../components/ui/Card';
import Form from '../../../components/ui/Form';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    dispatch(setCredentials({ user: { email, name }, token: 'dummy-token' }));
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
      <div style={brandStyle}>
        <span style={logoStyle}>⚡</span>
        <h1 style={titleStyle}>DeployX</h1>
      </div>
      <p style={subtitleStyle}>Create a new account</p>

      <Form onSubmit={handleSubmit}>
        <Input
          id="register-name"
          label="Full Name"
          type="text"
          value={name}
          onChange={handleChange(setName)}
          placeholder="John Doe"
          autoComplete="name"
          required
        />
        <Input
          id="register-email"
          label="Email"
          type="email"
          value={email}
          onChange={handleChange(setEmail)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <Input
          id="register-password"
          label="Password"
          type="password"
          value={password}
          onChange={handleChange(setPassword)}
          placeholder="••••••••"
          autoComplete="new-password"
          required
        />

        {error && <p style={errorStyle}>{error}</p>}

        <Button type="submit" variant="primary" fullWidth>
          Register
        </Button>
      </Form>
      
      <div style={linkContainerStyle}>
        <span style={linkTextStyle}>Already have an account? </span>
        <Link to="/login" style={linkStyle}>Sign in</Link>
      </div>
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

const linkContainerStyle = {
  marginTop: '24px',
  textAlign: 'center',
  fontSize: '14px',
  fontFamily: "'Inter', sans-serif",
};

const linkTextStyle = {
  color: '#94a3b8',
};

const linkStyle = {
  color: '#818cf8',
  textDecoration: 'none',
  fontWeight: 500,
};
