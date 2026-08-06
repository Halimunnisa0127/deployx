import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Reusable Dropdown component
 *
 * Props:
 *  - trigger:     ReactNode (element that triggers opening)
 *  - items:       Array of menu items:
 *                 { id, label, icon, badge, onClick, danger, disabled, divider, header }
 *  - align:       'left' | 'right' (default: 'left')
 *  - position:    'bottom' | 'top' (default: 'bottom')
 *  - width:       string (e.g. 'w-56', default: 'w-60')
 *  - children:    ReactNode (custom dropdown contents if not using items array)
 *  - className:   string
 */

export default function Dropdown({
  trigger,
  items = [],
  align = 'left',
  position = 'bottom',
  width = 'w-60',
  children,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const alignClass = align === 'right' ? 'right-0' : 'left-0';
  const positionClass = position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2';

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger container */}
      <div
        onClick={toggleDropdown}
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown();
          }
        }}
        className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
      >
        {trigger}
      </div>

      {/* Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: position === 'top' ? 6 : -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position === 'top' ? 6 : -6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute z-50 ${alignClass} ${positionClass} ${width} p-1.5 bg-white/95 dark:bg-[#0f172a]/95 border border-border text-slate-900 dark:text-slate-100 rounded-xl shadow-2xl backdrop-blur-xl outline-none`}
            role="menu"
          >
            {children ? (
              typeof children === 'function' ? children({ close: () => setIsOpen(false) }) : children
            ) : (
              <div className="py-1 space-y-0.5">
                {items.map((item, idx) => {
                  if (item.divider) {
                    return <div key={`div-${idx}`} className="my-1.5 h-px bg-slate-200 dark:bg-slate-800" />;
                  }

                  if (item.header) {
                    return (
                      <div
                        key={`hdr-${idx}`}
                        className="px-3 py-1.5 text-sm font-semibold tracking-wider text-muted-foreground uppercase"
                      >
                        {item.label}
                      </div>
                    );
                  }

                  const isDanger = item.danger;
                  const isDisabled = item.disabled;

                  return (
                    <button
                      key={item.id || idx}
                      disabled={isDisabled}
                      onClick={(e) => {
                        if (isDisabled) return;
                        if (item.onClick) item.onClick(e);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left select-none ${
                        isDisabled
                          ? 'opacity-40 cursor-not-allowed text-muted-foreground'
                          : isDanger
                          ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-300'
                          : 'text-foreground hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      role="menuitem"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.icon && <span className="text-muted-foreground flex-shrink-0">{item.icon}</span>}
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && <span className="flex-shrink-0 ml-2">{item.badge}</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
