/**
 * Reusable Modal component
 *
 * Props:
 *  - isOpen:   boolean — controls visibility
 *  - onClose:  function — called when backdrop or ✕ is clicked
 *  - title:    string  — displayed in modal header
 *  - children  — modal body content
 *  - maxWidth: string  — CSS max-width of the panel (default: '440px')
 */

export default function Modal({ isOpen, onClose, title, children, maxWidth = '440px' }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div style={overlayStyle} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label={title}>
      <div style={{ ...panelStyle, maxWidth }}>
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>{title}</h2>
          <button style={closeBtnStyle} onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Body */}
        <div>{children}</div>
      </div>
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────────────── */

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.6)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const panelStyle = {
  background: '#0f172a',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '16px',
  padding: '32px',
  width: '100%',
  boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
  fontFamily: "'Inter', sans-serif",
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '24px',
};

const titleStyle = {
  margin: 0,
  fontSize: '18px',
  fontWeight: 700,
  color: '#f1f5f9',
};

const closeBtnStyle = {
  background: 'transparent',
  border: 'none',
  color: '#64748b',
  fontSize: '18px',
  cursor: 'pointer',
  lineHeight: 1,
  padding: '4px',
};
