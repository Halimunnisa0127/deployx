import LoginForm from '../components/LoginForm';

/**
 * Login page — owns the full-screen centering layout.
 * LoginForm owns the card, fields, and Redux-driven form state.
 */
export default function Login() {
  return (
    <div style={pageStyle}>
      <LoginForm />
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────────────── */

const pageStyle = {
  minHeight: '100vh',
  background: '#0a0f1e',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
};
