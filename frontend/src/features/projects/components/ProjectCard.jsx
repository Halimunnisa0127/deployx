import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

/** Maps a project status string to a Badge variant */
const STATUS_VARIANT = {
  live: 'success',
  building: 'warning',
  failed: 'danger',
  'not deployed': 'neutral',
};

function formatDate(iso) {
  if (!iso) return 'Never';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ProjectCard({ name, status, lastDeployed }) {
  const badgeVariant = STATUS_VARIANT[status] ?? 'neutral';

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Top row: name + status badge */}
      <div style={topRowStyle}>
        <span style={nameStyle}>{name}</span>
        <Badge variant={badgeVariant}>{status}</Badge>
      </div>

      {/* Meta */}
      <p style={metaStyle}>Last deployed: {formatDate(lastDeployed)}</p>
    </Card>
  );
}

/* ── Styles ─────────────────────────────────────────────────────── */

const topRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
};

const nameStyle = {
  fontFamily: "'Inter', sans-serif",
  fontWeight: 600,
  fontSize: '15px',
  color: '#f1f5f9',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const metaStyle = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '13px',
  color: '#64748b',
  margin: 0,
};
