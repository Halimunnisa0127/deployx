/**
 * Reusable Badge component
 *
 * Props:
 *  - variant: 'success' | 'warning' | 'danger' | 'neutral' | 'info'  (default: 'neutral')
 *  - dot:     boolean — show a coloured dot before text               (default: true)
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
    dot: '#6366f1',
    badge: 'rgba(99,102,241,0.15)',
    text: '#818cf8',
  },
};

export default function Badge({ variant = 'neutral', dot = true, children, style: extraStyle }) {
  const s = VARIANTS[variant] ?? VARIANTS.neutral;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 10px',
        borderRadius: '999px',
        background: s.badge,
        color: s.text,
        fontSize: '12px',
        fontWeight: 500,
        fontFamily: "'Inter', sans-serif",
        whiteSpace: 'nowrap',
        flexShrink: 0,
        ...extraStyle,
      }}
    >
      {dot && (
        <span
          style={{
            width: '7px',
            height: '7px',
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
