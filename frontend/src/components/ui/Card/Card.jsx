import React from 'react';
import { cn } from '../../../lib/utils';
import { Skeleton } from '../Skeleton';

const variantClasses = {
  default: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800',
  panel: 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50',
  settings: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800',
};

const paddingClasses = {
  none: 'p-0',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
};

const sizeClasses = {
  sm: 'w-full max-w-md',
  md: 'w-full max-w-3xl',
  lg: 'w-full max-w-5xl',
  full: 'w-full',
};

const roundedClasses = {
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
};

const shadowClasses = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow',
  lg: 'shadow-lg',
};

export default function Card({
  variant = 'default',
  size = 'full',
  padding = 'md',
  rounded = 'lg',
  shadow = 'sm',
  hoverable = false,
  clickable = false,
  loading = false,
  borderless = false,
  elevated = false,
  animated,
  className,
  children,
  ...props
}) {
  if (loading) {
    return <Skeleton className={cn(sizeClasses[size], "h-32")} rounded={rounded} />;
  }

  return (
    <div
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        roundedClasses[rounded],
        shadowClasses[elevated ? 'lg' : shadow],
        hoverable && 'transition-shadow hover:shadow-md dark:hover:shadow-slate-800/50',
        clickable && 'cursor-pointer active:scale-[0.99] transition-transform',
        borderless && 'border-transparent',
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
