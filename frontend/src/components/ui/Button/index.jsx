import { forwardRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

/**
 * Reusable Button component
 *
 * Props:
 *  - variant:  'primary' | 'secondary' | 'ghost' | 'danger' | 'oauth' (default: 'primary')
 *  - size:     'sm' | 'md' | 'lg'                                     (default: 'md')
 *  - fullWidth: boolean                                              (default: false)
 *  - iconOnly:  boolean                                              (default: false)
 *  - disabled:  boolean
 *  - isLoading: boolean
 *  - iconLeft:  ReactNode
 *  - to:        string (React Router navigation link)
 *  - href:      string (External link)
 *  - as:        ElementType (Custom component, e.g. Link / NavLink)
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
  sm: { padding: '6px 14px', fontSize: '13px', height: '32px', gap: '6px' },
  md: { padding: '10px 20px', fontSize: '14px', height: '40px', gap: '8px' },
  lg: { padding: '14px 28px', fontSize: '16px', height: '48px', gap: '10px' },
};

const ICON_SIZES = {
  sm: { width: '32px', height: '32px', padding: 0 },
  md: { width: '40px', height: '40px', padding: 0 },
  lg: { width: '48px', height: '48px', padding: 0 },
};

const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  iconOnly = false,
  disabled = false,
  isLoading = false,
  iconLeft,
  to,
  href,
  as: ComponentProp,
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
    } else if (variant === 'secondary') {
      dynamicStyle = { background: 'rgba(255,255,255,0.1)', color: '#ffffff' };
    }
  }

  if (isActive && !disabled && !isLoading) {
    dynamicStyle = { ...dynamicStyle, transform: 'scale(0.97)' };
  }

  const sizeStyle = iconOnly ? (ICON_SIZES[size] ?? ICON_SIZES.md) : (SIZES[size] ?? SIZES.md);

  const computedStyle = {
    ...BASE,
    ...baseVariantStyle,
    ...sizeStyle,
    gap: sizeStyle.gap || BASE.gap,
    width: fullWidth ? '100%' : iconOnly ? sizeStyle.width : undefined,
    opacity: disabled || isLoading ? 0.6 : 1,
    pointerEvents: disabled || isLoading ? 'none' : 'auto',
    ...dynamicStyle,
    ...extraStyle,
  };

  let Tag = ComponentProp || 'button';
  if (!ComponentProp) {
    if (to) Tag = Link;
    else if (href) Tag = 'a';
  }

  const tagProps = {};
  if (Tag === Link || Tag === NavLink) {
    tagProps.to = to;
  } else if (Tag === 'a') {
    tagProps.href = href;
  } else if (Tag === 'button') {
    tagProps.disabled = disabled || isLoading;
  }

  return (
    <Tag
      ref={ref}
      style={computedStyle}
      onMouseEnter={(e) => { setIsHovered(true); if (onMouseEnter) onMouseEnter(e); }}
      onMouseLeave={(e) => { setIsHovered(false); setIsActive(false); if (onMouseLeave) onMouseLeave(e); }}
      onMouseDown={(e) => { setIsActive(true); if (onMouseDown) onMouseDown(e); }}
      onMouseUp={(e) => { setIsActive(false); if (onMouseUp) onMouseUp(e); }}
      {...tagProps}
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
    </Tag>
  );
});

Button.displayName = 'Button';
export default Button;
