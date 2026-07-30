/**
 * Reusable Skeleton loader component
 *
 * Props:
 *  - variant: 'text' | 'circular' | 'rectangular' (default: 'text')
 *  - width: string | number
 *  - height: string | number
 *  - borderRadius: string | number
 *  - style: object (additional custom styles)
 *  - className: string
 */
export default function Skeleton({
  variant = 'text',
  width,
  height,
  borderRadius,
  style: extraStyle,
  className = '',
  ...rest
}) {
  let defaultHeight = '1rem';
  let defaultRadius = '6px';

  if (variant === 'circular') {
    defaultRadius = '9999px';
    defaultHeight = width || '40px';
  } else if (variant === 'rectangular') {
    defaultHeight = '120px';
    defaultRadius = '12px';
  }

  const computedStyle = {
    display: 'inline-block',
    width: width || (variant === 'circular' ? defaultHeight : '100%'),
    height: height || defaultHeight,
    borderRadius: borderRadius || defaultRadius,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    backgroundImage: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0) 100%)',
    backgroundSize: '200% 100%',
    animation: 'skeleton-shimmer 1.8s infinite ease-in-out',
    ...extraStyle,
  };

  return (
    <>
      <style>{`
        @keyframes skeleton-shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
      <div
        style={computedStyle}
        className={`select-none ${className}`}
        aria-hidden="true"
        {...rest}
      />
    </>
  );
}

export { default as SkeletonCard } from './SkeletonCard';
export { default as SkeletonChart } from './SkeletonChart';
export { default as SkeletonTable } from './SkeletonTable';
