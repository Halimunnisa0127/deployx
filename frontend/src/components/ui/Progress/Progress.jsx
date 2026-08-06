import React from 'react';

/**
 * Reusable Progress Component
 */
export default function Progress({
  percent = 0,
  color = 'bg-indigo-500',
  height = 'h-2.5',
  className = '',
}) {
  const safePercent = Math.min(Math.max(percent, 0), 100);

  return (
    <div 
      className={`${height} w-full bg-muted rounded-full overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={safePercent}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        className={`h-full ${color} rounded-full transition-all duration-[250ms] ease-out`}
        style={{ width: `${safePercent}%` }}
      />
    </div>
  );
}
