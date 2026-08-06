import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

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

const Card = forwardRef(({ children, style: extraStyle, onClick, animated = false, size = 'default', className = '', ...rest }, ref) => {
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
      className={twMerge(
        'bg-card backdrop-blur-xl border border-border rounded-[18px] shadow-sm text-card-foreground transition-all duration-[250ms] ease-out w-full',
        onClick ? 'cursor-pointer hover:bg-muted' : 'cursor-default',
        size === 'sm' ? 'max-w-[460px] p-10 md:p-12' : 'p-6',
        className
      )}
      style={extraStyle}
      {...animationProps}
      {...rest}
    >
      {children}
    </Component>
  );
});

Card.displayName = 'Card';
export default Card;
