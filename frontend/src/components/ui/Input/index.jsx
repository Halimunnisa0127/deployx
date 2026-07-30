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
          className="block text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-2 font-sans"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {iconLeft && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
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
            bg-white dark:bg-slate-900/50 
            text-slate-900 dark:text-slate-50
            border
            ${
              error 
                ? 'border-red-500 focus:ring-[3px] focus:ring-red-500/15' 
                : isFocused 
                  ? 'border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/20' 
                  : 'border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20'
            }
            ${className}
          `}
          {...rest}
        />
      </div>

      {error ? (
        <p className="mt-2 text-xs text-red-500 font-sans">{error}</p>
      ) : helperText ? (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-sans">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
