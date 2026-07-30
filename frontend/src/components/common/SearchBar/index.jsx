import { forwardRef } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Reusable SearchBar component for DeployX
 *
 * Props:
 *  - value:        string
 *  - onChange:     (e) => void or (value: string) => void
 *  - onClear:      () => void
 *  - placeholder: string (default: 'Search...')
 *  - shortcut:    string (e.g. '⌘K')
 *  - size:        'sm' | 'md' | 'lg' (default: 'sm')
 *  - fullWidth:   boolean (default: false)
 *  - readOnly:    boolean (default: false)
 *  - onClick:     (e) => void
 *  - className:   string
 *  - style:       object
 */
const SIZES = {
  sm: {
    container: 'h-9 text-xs',
    padding: 'pl-9 pr-8',
    iconSize: 'w-3.5 h-3.5',
    iconLeftPos: 'left-2.5',
    iconRightPos: 'right-2.5',
  },
  md: {
    container: 'h-10 text-sm',
    padding: 'pl-10 pr-9',
    iconSize: 'w-4 h-4',
    iconLeftPos: 'left-3',
    iconRightPos: 'right-3',
  },
  lg: {
    container: 'h-12 text-base',
    padding: 'pl-12 pr-10',
    iconSize: 'w-5 h-5',
    iconLeftPos: 'left-3.5',
    iconRightPos: 'right-3.5',
  },
};

const SearchBar = forwardRef(({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search...',
  shortcut,
  size = 'sm',
  fullWidth = false,
  readOnly = false,
  onClick,
  className = '',
  style: extraStyle,
  ...rest
}, ref) => {
  const sizeConfig = SIZES[size] || SIZES.sm;

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onClear) {
      onClear();
    }
  };

  return (
    <div
      className={`relative flex items-center select-none ${fullWidth ? 'w-full' : 'w-64'} ${className}`}
      style={extraStyle}
    >
      {/* Left Search Icon */}
      <Search className={`${sizeConfig.iconSize} text-slate-400 absolute ${sizeConfig.iconLeftPos} pointer-events-none z-10 flex-shrink-0`} />

      {/* Main Input */}
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={handleChange}
        onClick={onClick}
        readOnly={readOnly}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`w-full ${sizeConfig.container} ${sizeConfig.padding} rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all ${
          readOnly ? 'cursor-pointer' : 'cursor-text'
        }`}
        {...rest}
      />

      {/* Right Action: Clear Button or Keyboard Shortcut */}
      {value && onClear ? (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className={`absolute ${sizeConfig.iconRightPos} p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors z-10 focus:outline-none`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      ) : shortcut ? (
        <kbd className={`absolute ${sizeConfig.iconRightPos} px-1.5 py-0.5 text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/60 rounded pointer-events-none`}>
          {shortcut}
        </kbd>
      ) : null}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
export default SearchBar;
