import { forwardRef } from 'react';
import { Link, NavLink } from 'react-router-dom';

/**
 * Reusable Button component with light and dark mode theme support
 */

const VARIANTS = {
  primary: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:via-indigo-500 hover:to-sky-500 text-white shadow-md shadow-blue-500/25 border border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/35',
  secondary: 'bg-card backdrop-blur-xl border border-border text-foreground hover:bg-muted shadow-sm hover:shadow-md hover:border-border',
  ghost: 'bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground',
  danger: 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-md shadow-rose-500/25 border border-rose-500/30 hover:shadow-lg hover:shadow-rose-500/35',
  oauth: 'bg-card backdrop-blur-md border border-border text-foreground shadow-sm hover:bg-muted',
};

const SIZES = {
  sm: 'px-3.5 py-1.5 text-xs h-8 gap-1.5 rounded-lg',
  md: 'px-4 py-2 text-sm h-10 gap-2 rounded-xl',
  lg: 'px-6 py-3 text-base h-12 gap-2.5 rounded-xl',
};

const ICON_SIZES = {
  sm: 'w-8 h-8 p-0 flex items-center justify-center rounded-lg',
  md: 'w-10 h-10 p-0 flex items-center justify-center rounded-xl',
  lg: 'w-12 h-12 p-0 flex items-center justify-center rounded-xl',
};

const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  iconOnly = false,
  disabled = false,
  isLoading = false,
  loading = false,
  iconLeft,
  to,
  href,
  as: ComponentProp,
  children,
  className = '',
  style: extraStyle,
  ...rest
}, ref) => {
  const isBtnLoading = isLoading || loading;
  const variantClass = VARIANTS[variant] ?? VARIANTS.primary;
  const sizeClass = iconOnly ? (ICON_SIZES[size] ?? ICON_SIZES.md) : (SIZES[size] ?? SIZES.md);

  const baseClass = `inline-flex items-center justify-center font-sans font-semibold transition-all duration-[250ms] ease-out select-none whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 relative overflow-hidden ${
    fullWidth ? 'w-full' : ''
  } ${
    disabled || isBtnLoading
      ? 'opacity-50 cursor-not-allowed pointer-events-none shadow-none'
      : 'cursor-pointer hover:-translate-y-[1px] hover:shadow-md active:scale-[0.98]'
  } ${variantClass} ${sizeClass} ${className}`;

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
    tagProps.disabled = disabled || isBtnLoading;
  }

  return (
    <Tag
      ref={ref}
      className={baseClass}
      style={extraStyle}
      {...tagProps}
      {...rest}
    >
      {isBtnLoading ? (
        <svg className="animate-spin shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="32" strokeLinecap="round" opacity="0.3" />
          <path d="M12 2A10 10 0 002 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      ) : iconLeft ? (
        <span className="shrink-0">{iconLeft}</span>
      ) : null}
      {children}
    </Tag>
  );
});

Button.displayName = 'Button';
export default Button;
