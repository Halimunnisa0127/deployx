import { forwardRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Card component
 *
 * Props:
 *  - children
 *  - style — optional overrides
 *  - onClick — makes the card interactive (cursor: pointer)
 *  - animated — boolean (adds fade-in animation)
 *  - ...rest — any native div attrs
 */

const Card = forwardRef(({ children, style: extraStyle, onClick, animated = false, className = '', ...rest }, ref) => {
  const Component = animated ? motion.div : 'div';
  const animationProps = animated ? {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  } : {};

  return (
    <Component
      ref={ref}
      onClick={onClick}
      className={`bg-black dark:bg-black backdrop-blur-xl border border-slate-200 dark:border-slate-900 rounded-[18px] shadow-sm dark:shadow-xl text-white dark:text-slate-100 transition-all duration-[250ms] ease-out ${onClick ? 'cursor-pointer hover:bg-slate-900' : 'cursor-default'} w-full max-w-[460px] ${className}`}
      style={{
        padding: '48px 40px',
        ...extraStyle,
      }}
      {...animationProps}
      {...rest}
    >
      {children}
    </Component>
  );
});

Card.displayName = 'Card';
export default Card;
