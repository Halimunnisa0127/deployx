import { forwardRef } from 'react';

/**
 * Reusable Checkbox component
 *
 * Props:
 *  - label: ReactNode or string
 *  - error: string
 *  - id: string
 *  - ...rest: any native <input type="checkbox"> attribute
 */
const Checkbox = forwardRef(({ label, error, id, style: extraStyle, ...rest }, ref) => {
  return (
    <div style={{ marginBottom: '20px', ...extraStyle }}>
      <label htmlFor={id} style={containerStyle}>
        <input
          id={id}
          type="checkbox"
          ref={ref}
          style={checkboxStyle}
          {...rest}
        />
        {label && <span style={labelStyle}>{label}</span>}
      </label>
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
export default Checkbox;

/* ── Styles ─────────────────────────────────────────────────────── */

const containerStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  cursor: 'pointer',
};

const checkboxStyle = {
  width: '18px',
  height: '18px',
  marginTop: '2px', // Align with text
  cursor: 'pointer',
  accentColor: '#818cf8', // Modern indigo tint for modern browsers
};

const labelStyle = {
  fontSize: '13px',
  color: '#cbd5e1',
  fontFamily: "'Inter', sans-serif",
  lineHeight: 1.5,
};

const errorStyle = {
  margin: '6px 0 0 30px',
  fontSize: '12px',
  color: '#f87171',
  fontFamily: "'Inter', sans-serif",
};
