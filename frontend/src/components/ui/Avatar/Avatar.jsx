import React, { useState } from 'react';
import { cn } from '../../../lib/utils';

export default function Avatar({
  src,
  alt,
  initials,
  size = 'md',
  className,
  ...props
}) {
  const [error, setError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-muted font-medium text-foreground shrink-0',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !error ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          onError={() => setError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials || (alt ? alt.substring(0, 2).toUpperCase() : '?')}</span>
      )}
    </div>
  );
}
