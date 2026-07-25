import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Reusable Tooltip component
 *
 * Props:
 *  - content:   ReactNode | string
 *  - position:  'top' | 'right' | 'bottom' | 'left' (default: 'right')
 *  - delay:     number (ms, default: 150)
 *  - disabled:  boolean (default: false)
 *  - children:  ReactElement
 */

const POSITION_STYLES = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2.5',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2.5',
};

const ANIMATION_VARIANTS = {
  top: { initial: { opacity: 0, y: 4, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 } },
  right: { initial: { opacity: 0, x: -4, scale: 0.95 }, animate: { opacity: 1, x: 0, scale: 1 } },
  bottom: { initial: { opacity: 0, y: -4, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 } },
  left: { initial: { opacity: 0, x: 4, scale: 0.95 }, animate: { opacity: 1, x: 0, scale: 1 } },
};

export default function Tooltip({
  content,
  position = 'right',
  delay = 100,
  disabled = false,
  children,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  if (!content || disabled) return children;

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const anim = ANIMATION_VARIANTS[position] || ANIMATION_VARIANTS.right;
  const posClass = POSITION_STYLES[position] || POSITION_STYLES.right;

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={anim.initial}
            animate={anim.animate}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute z-50 pointer-events-none whitespace-nowrap px-2.5 py-1 text-xs font-medium text-slate-100 bg-slate-900/95 border border-slate-700/80 rounded-md shadow-xl backdrop-blur-sm ${posClass}`}
            role="tooltip"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
