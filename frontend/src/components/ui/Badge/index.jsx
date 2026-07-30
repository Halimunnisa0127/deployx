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
    dot: '#22c55e',
    badge: 'rgba(34,197,94,0.15)',
    text: '#4ade80',
  },
  warning: {
    dot: '#f59e0b',
    badge: 'rgba(245,158,11,0.15)',
    text: '#fbbf24',
  },
  danger: {
    dot: '#ef4444',
    badge: 'rgba(239,68,68,0.15)',
    text: '#f87171',
  },
  neutral: {
    dot: '#6b7280',
    badge: 'rgba(107,114,128,0.15)',
    text: '#9ca3af',
  },
  info: {
    dot: '#3b82f6',
    badge: 'rgba(59,130,246,0.15)',
    text: '#60a5fa',
  },
  primary: {
    dot: '#3b82f6', // Blue
    badge: 'rgba(59,130,246,0.15)',
    text: '#60a5fa',
  },
  purple: {
    dot: '#2563eb', // Blue fallback
    badge: 'rgba(37,99,235,0.15)',
    text: '#93c5fd',
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
      className={`${animClass} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '2px 8px',
        borderRadius: '999px',
        background: s.badge,
        color: s.text,
        fontSize: '10px',
        fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        whiteSpace: 'nowrap',
        flexShrink: 0,
        ...extraStyle,
      }}
    >
      {dot && (
        <span
          className={isBuilding ? 'animate-ping' : undefined}
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: s.dot,
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
}
