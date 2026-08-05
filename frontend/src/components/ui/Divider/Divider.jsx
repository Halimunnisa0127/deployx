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
    solid: 'border-border',
    dashed: 'border-border border-dashed',
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
