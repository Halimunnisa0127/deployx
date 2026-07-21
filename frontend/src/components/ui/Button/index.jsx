/**
 * Reusable Button component
 *
 * Props:
 *  - variant: 'primary' | 'secondary' | 'ghost' | 'danger'  (default: 'primary')
 *  - size:    'sm' | 'md' | 'lg'                            (default: 'md')
 *  - fullWidth: boolean                                      (default: false)
 *  - disabled: boolean
 *  - onClick, type, children, id, ...rest (any native button attr)
 */

const BASE = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  fontFamily: "'Inter', sans-serif",
  fontWeight: 600,
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  transition: 'opacity 0.15s, transform 0.1s',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
};

const VARIANTS = {
  primary: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff',
    boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
  },
  secondary: {
    background: 'transparent',
    color: '#94a3b8',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  ghost: {
    background: 'transparent',
    color: '#64748b',
    border: 'none',
  },
  danger: {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: '#fff',
    boxShadow: '0 4px 15px rgba(239,68,68,0.3)',
  },
};

const SIZES = {
  sm: { padding: '6px 12px', fontSize: '12px' },
  md: { padding: '9px 18px', fontSize: '14px' },
  lg: { padding: '12px 24px', fontSize: '16px' },
};

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  children,
  style: extraStyle,
  ...rest
}) {
  const computedStyle = {
    ...BASE,
    ...VARIANTS[variant] ?? VARIANTS.primary,
    ...SIZES[size] ?? SIZES.md,
    width: fullWidth ? '100%' : undefined,
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
    ...extraStyle,
  };

  return (
    <button style={computedStyle} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
