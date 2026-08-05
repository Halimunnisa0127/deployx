import React from 'react';
import { cn } from '../../../lib/utils';

const variantClasses = {
  default: 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100',
  success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  destructive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  outline: 'text-foreground border border-border',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
};

export default function Badge({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-colors',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
