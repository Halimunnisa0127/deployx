import React from 'react';
import { cn } from '../../../lib/utils';

export default function Skeleton({
  className,
  rounded = 'md',
  animation = 'pulse',
  width,
  height,
  borderRadius,
  variant,
  style,
  ...props
}) {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    none: '',
  };

  return (
    <div
      className={cn(
        'bg-slate-200 dark:bg-slate-800',
        variant === 'circular' ? 'rounded-full' : (roundedClasses[rounded] || roundedClasses.md),
        animationClasses[animation],
        className
      )}
      style={{ width, height, borderRadius, ...style }}
      {...props}
    />
  );
}
