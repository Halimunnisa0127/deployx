import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <Outlet />
      </div>
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────────────── */

const pageStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(to bottom, #0a0f1e, #030712)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 16px',
};

const containerStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
};
