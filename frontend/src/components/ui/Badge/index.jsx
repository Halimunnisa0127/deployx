import React from 'react';

/**
 * Reusable Badge component with STAGE 8 micro animations
 *
 * Props:
 *  - variant: 'success' | 'warning' | 'danger' | 'neutral' | 'info'  (default: 'neutral')
 *  - dot:     boolean — show a coloured dot before text               (default: true)
 *  - pulse:   boolean — pulse animation indicator
 *  - children — badge label text
 */

const VARIANTS = {
  success: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  },
  warning: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  },
  danger: {
    dot: 'bg-rose-500',
    badge: 'bg-rose-500/15 text-rose-700 dark:text-rose-400',
  },
  neutral: {
    dot: 'bg-muted-foreground',
    badge: 'bg-muted text-muted-foreground border border-border',
  },
  info: {
    dot: 'bg-sky-500',
    badge: 'bg-sky-500/15 text-sky-700 dark:text-sky-400',
  },
  primary: {
    dot: 'bg-indigo-500',
    badge: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400',
  },
  purple: {
    dot: 'bg-purple-500',
    badge: 'bg-purple-500/15 text-purple-700 dark:text-purple-400',
  },
};

export default function Badge({ 
  variant = 'neutral', 
  dot = true, 
  pulse = false,
  children, 
  className = '',
  style: extraStyle 
}) {
  const s = VARIANTS[variant] ?? VARIANTS.neutral;
  const labelStr = (typeof children === 'string' ? children : '').toLowerCase();

  const isBuilding = pulse || labelStr.includes('building') || labelStr.includes('in_progress');
  const isQueued = labelStr.includes('queued');

  let animClass = '';
  if (isBuilding) {
    animClass = 'animate-pulse';
  } else if (isQueued) {
    animClass = 'animate-pulse opacity-80';
  }

  return (
    <span
      className={`inline-flex items-center gap-[5px] px-[8px] py-[2px] rounded-full text-[10px] font-semibold whitespace-nowrap shrink-0 font-sans ${s.badge} ${animClass} ${className}`}
      style={extraStyle}
    >
      {dot && (
        <span
          className={`w-[5px] h-[5px] rounded-full shrink-0 ${s.dot} ${isBuilding ? 'animate-ping' : ''}`}
        />
      )}
      {children}
    </span>
  );
}
