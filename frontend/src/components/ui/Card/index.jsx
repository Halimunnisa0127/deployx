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

const Card = forwardRef(({ children, style: extraStyle, onClick, animated = false, ...rest }, ref) => {
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
      style={{
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '48px 40px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.02) inset',
        transition: 'border-color 0.2s, transform 0.15s',
        cursor: onClick ? 'pointer' : 'default',
        width: '100%',
        maxWidth: '460px',
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
