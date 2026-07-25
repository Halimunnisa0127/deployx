export default function ProjectsHeaderStats({ total = 0, live = 0, building = 0, failed = 0 }) {
  const stats = [
    { label: 'Total', count: total, color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', border: 'rgba(148, 163, 184, 0.15)' },
    { label: 'Live', count: live, color: '#4ade80', bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.2)' },
    { label: 'Building', count: building, color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)' },
    { label: 'Failed', count: failed, color: '#f87171', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)' },
  ];

  return (
    <div style={statsContainerStyle}>
      {stats.map((item) => (
        <div
          key={item.label}
          style={{
            ...statCardStyle,
            borderColor: item.border,
            background: item.bg,
          }}
        >
          <span style={{ ...statDotStyle, background: item.color }} />
          <span style={statLabelStyle}>{item.label}</span>
          <span style={{ ...statCountStyle, color: item.color }}>{item.count}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────────────── */

const statsContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  flexWrap: 'wrap',
};

const statCardStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 12px',
  borderRadius: '8px',
  border: '1px solid',
  fontSize: '13px',
  fontWeight: 500,
  fontFamily: "'Inter', sans-serif",
  transition: 'transform 0.15s ease, background 0.15s ease',
};

const statDotStyle = {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  flexShrink: 0,
};

const statLabelStyle = {
  color: '#94a3b8',
};

const statCountStyle = {
  fontWeight: 600,
};
