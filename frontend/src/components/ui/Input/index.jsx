import { forwardRef, useState } from 'react';

/**
 * Reusable Input component
 *
 * Props:
 *  - label:       string  — rendered as <label> above input
 *  - error:       string  — renders red helper text below input
 *  - id:          string  — links label htmlFor to input id
 *  - fullWidth:   boolean (default: true)
 *  - helperText:  string  — renders subtle helper text below input (if no error)
 *  - ...rest      — any native <input> attribute
 */
const Input = forwardRef(({
  label,
  error,
  helperText,
  id,
  fullWidth = true,
  style: extraStyle,
  onFocus,
  onBlur,
  ...rest
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <div style={{ width: fullWidth ? '100%' : undefined, marginBottom: '20px' }}>
      {label && (
        <label htmlFor={id} style={labelStyle}>
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{
          ...inputBase,
          borderColor: error ? '#ef4444' : isFocused ? '#818cf8' : 'rgba(255,255,255,0.12)',
          boxShadow: isFocused && !error ? '0 0 0 3px rgba(129, 140, 248, 0.15)' : error && isFocused ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : 'none',
          width: fullWidth ? '100%' : undefined,
          boxSizing: 'border-box',
          ...extraStyle,
        }}
        {...rest}
      />
      {error ? (
        <p style={errorStyle}>{error}</p>
      ) : helperText ? (
        <p style={helperStyle}>{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

/* ── Styles ─────────────────────────────────────────────────────── */

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  color: '#cbd5e1',
  marginBottom: '8px',
  fontFamily: "'Inter', sans-serif",
};

const inputBase = {
  padding: '12px 14px',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(15, 23, 42, 0.5)',
  color: '#f8fafc',
  fontSize: '14px',
  fontFamily: "'Inter', sans-serif",
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
};

const errorStyle = {
  margin: '8px 0 0',
  fontSize: '12px',
  color: '#f87171',
  fontFamily: "'Inter', sans-serif",
};

const helperStyle = {
  margin: '8px 0 0',
  fontSize: '12px',
  color: '#64748b',
  fontFamily: "'Inter', sans-serif",
};
