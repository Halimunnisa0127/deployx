import { forwardRef, useState } from 'react';

/**
 * Reusable Button component
 *
 * Props:
 *  - variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'oauth' (default: 'primary')
 *  - size:    'sm' | 'md' | 'lg'                                     (default: 'md')
 *  - fullWidth: boolean                                              (default: false)
 *  - disabled: boolean
 *  - isLoading: boolean
 *  - iconLeft: ReactNode
 *  - onClick, type, children, id, ...rest (any native button attr)
 */

const BASE = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  fontFamily: "'Inter', sans-serif",
  fontWeight: 600,
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  position: 'relative',
  overflow: 'hidden',
};

const VARIANTS = {
  primary: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff',
    boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
  },
  secondary: {
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#e2e8f0',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  ghost: {
    background: 'transparent',
    color: '#94a3b8',
    border: 'none',
  },
  danger: {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: '#fff',
    boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)',
  },
  oauth: {
    background: '#1e293b',
    color: '#f8fafc',
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  }
};

const SIZES = {
  sm: { padding: '8px 16px', fontSize: '13px', height: '32px' },
  md: { padding: '12px 24px', fontSize: '14px', height: '44px' },
  lg: { padding: '16px 32px', fontSize: '16px', height: '52px' },
};

const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  isLoading = false,
  iconLeft,
  children,
  style: extraStyle,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  ...rest
}, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const baseVariantStyle = VARIANTS[variant] ?? VARIANTS.primary;

  // Add hover state modifiers
  let dynamicStyle = {};
  if (isHovered && !disabled && !isLoading) {
    if (variant === 'primary' || variant === 'danger') {
      dynamicStyle = { filter: 'brightness(1.1)', transform: 'translateY(-1px)' };
    } else if (variant === 'oauth') {
      dynamicStyle = { background: '#334155', transform: 'translateY(-1px)' };
    } else if (variant === 'ghost') {
      dynamicStyle = { background: 'rgba(255,255,255,0.05)', color: '#f1f5f9' };
    }
  }

  if (isActive && !disabled && !isLoading) {
    dynamicStyle = { ...dynamicStyle, transform: 'scale(0.97)' };
  }

  const computedStyle = {
    ...BASE,
    ...baseVariantStyle,
    ...(SIZES[size] ?? SIZES.md),
    width: fullWidth ? '100%' : undefined,
    opacity: disabled || isLoading ? 0.6 : 1,
    pointerEvents: disabled || isLoading ? 'none' : 'auto',
    ...dynamicStyle,
    ...extraStyle,
  };

  return (
    <button
      ref={ref}
      style={computedStyle}
      disabled={disabled || isLoading}
      onMouseEnter={(e) => { setIsHovered(true); if (onMouseEnter) onMouseEnter(e); }}
      onMouseLeave={(e) => { setIsHovered(false); setIsActive(false); if (onMouseLeave) onMouseLeave(e); }}
      onMouseDown={(e) => { setIsActive(true); if (onMouseDown) onMouseDown(e); }}
      onMouseUp={(e) => { setIsActive(false); if (onMouseUp) onMouseUp(e); }}
      {...rest}
    >
      {isLoading ? (
        <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="32" strokeLinecap="round" opacity="0.3" />
          <path d="M12 2A10 10 0 002 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      ) : iconLeft ? (
        iconLeft
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
