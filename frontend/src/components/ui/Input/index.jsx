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
 *  - iconLeft:    node    — renders icon on the left
 *  - ...rest      — any native <input> attribute
 */
const Input = forwardRef(({
  label,
  error,
  helperText,
  id,
  fullWidth = true,
  iconLeft,
  className = '',
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
    <div className={`${fullWidth ? 'w-full' : ''} mb-5`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-[13px] font-medium text-foreground mb-2 font-sans"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {iconLeft && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            {iconLeft}
          </div>
        )}
        
        <input
          id={id}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            w-full px-3.5 py-3 rounded-lg text-sm font-sans outline-none transition-all
            ${iconLeft ? 'pl-10' : ''}
            bg-card 
            text-foreground
            border
            ${
              error 
                ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/30 focus-visible:ring-offset-1 focus-visible:ring-offset-card' 
                : 'border-border hover:border-slate-400 dark:hover:border-white/20 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:ring-offset-1 focus-visible:ring-offset-card'
            }
            ${className}
          `}
          {...rest}
        />
      </div>

      {error ? (
        <p className="mt-2 text-xs text-red-500 font-sans">{error}</p>
      ) : helperText ? (
        <p className="mt-2 text-xs text-muted-foreground font-sans">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
