import React from 'react';
import { cn } from '../../../lib/utils';

export default function Divider({
  orientation = 'horizontal',
  variant = 'solid',
  spacing = 'none',
  className,
  ...props
}) {
  const orientationClasses = {
    horizontal: 'w-full border-t',
    vertical: 'h-full border-l inline-block align-middle',
  };

  const variantClasses = {
    solid: 'border-slate-200 dark:border-slate-800',
    dashed: 'border-slate-200 dark:border-slate-800 border-dashed',
  };

  const spacingClasses = {
    none: '',
    sm: orientation === 'horizontal' ? 'my-2' : 'mx-2',
    md: orientation === 'horizontal' ? 'my-4' : 'mx-4',
    lg: orientation === 'horizontal' ? 'my-8' : 'mx-8',
  };

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        orientationClasses[orientation],
        variantClasses[variant],
        spacingClasses[spacing],
        className
      )}
      {...props}
    />
  );
}
