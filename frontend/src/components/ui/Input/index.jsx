/**
 * Reusable Input component
 *
 * Props:
 *  - label:       string  — rendered as <label> above input
 *  - error:       string  — renders red helper text below input
 *  - id:          string  — links label htmlFor to input id
 *  - fullWidth:   boolean (default: true)
 *  - ...rest      — any native <input> attribute (type, value, onChange, placeholder, etc.)
 */

export default function Input({
  label,
  error,
  id,
  fullWidth = true,
  style: extraStyle,
  ...rest
}) {
  return (
    <div style={{ width: fullWidth ? '100%' : undefined }}>
      {label && (
        <label htmlFor={id} style={labelStyle}>
          {label}
        </label>
      )}
      <input
        id={id}
        style={{
          ...inputBase,
          borderColor: error ? '#ef4444' : 'rgba(255,255,255,0.1)',
          width: fullWidth ? '100%' : undefined,
          boxSizing: 'border-box',
          ...extraStyle,
        }}
        {...rest}
      />
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────────────── */

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  color: '#94a3b8',
  marginBottom: '8px',
  fontFamily: "'Inter', sans-serif",
};

const inputBase = {
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)',
  color: '#f1f5f9',
  fontSize: '14px',
  fontFamily: "'Inter', sans-serif",
  outline: 'none',
  transition: 'border-color 0.2s',
};

const errorStyle = {
  margin: '6px 0 0',
  fontSize: '12px',
  color: '#f87171',
  fontFamily: "'Inter', sans-serif",
};
