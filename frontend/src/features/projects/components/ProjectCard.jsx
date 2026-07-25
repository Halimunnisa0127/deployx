import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

/** Maps project status string to Badge variant */
const STATUS_VARIANT = {
  live: 'success',
  building: 'warning',
  failed: 'danger',
  'not deployed': 'neutral',
};

function formatDate(iso) {
  if (!iso) return 'Never';
  const date = new Date(iso);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ProjectCard({
  id,
  name,
  status = 'not deployed',
  lastDeployed,
  framework = 'React',
  branch = 'main',
  url,
}) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const badgeVariant = STATUS_VARIANT[status] ?? 'neutral';

  const defaultUrl = url || `${name.toLowerCase().replace(/[^a-z0-9-]/g, '')}.deployx.app`;

  const handleCardClick = () => {
    if (id) {
      navigate(`/dashboard/projects/${id}`);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        padding: '20px 22px',
        maxWidth: '100%',
        background: isHovered ? 'rgba(15, 23, 42, 0.75)' : 'rgba(15, 23, 42, 0.5)',
        borderColor: isHovered ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.08)',
        boxShadow: isHovered
          ? '0 12px 28px -6px rgba(0, 0, 0, 0.6), 0 0 20px 0 rgba(99, 102, 241, 0.12)'
          : '0 4px 12px 0 rgba(0, 0, 0, 0.3)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
      }}
    >
      {/* Top row: name + status badge */}
      <div style={topRowStyle}>
        <div style={titleGroupStyle}>
          {/* Framework icon badge */}
          <div style={iconContainerStyle}>
            <span style={frameworkIconStyle}>{framework[0]}</span>
          </div>
          <span style={nameStyle} title={name}>
            {name}
          </span>
        </div>

        <Badge variant={badgeVariant}>
          {status}
        </Badge>
      </div>

      {/* URL / Subtitle */}
      <div style={urlRowStyle}>
        <a
          href={`https://${defaultUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={urlStyle}
          title={`https://${defaultUrl}`}
        >
          {defaultUrl}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>

      {/* Footer info: branch + last deployed */}
      <div style={footerStyle}>
        <div style={branchBadgeStyle}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="6" y1="3" x2="6" y2="15" />
            <circle cx="18" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <path d="M18 9a9 9 0 0 1-9 9" />
          </svg>
          <span style={branchTextStyle}>{branch}</span>
        </div>

        <span style={dateStyle}>
          {formatDate(lastDeployed)}
        </span>
      </div>
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

const titleGroupStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  minWidth: 0,
};

const iconContainerStyle = {
  width: '28px',
  height: '28px',
  borderRadius: '8px',
  background: 'rgba(99, 102, 241, 0.15)',
  border: '1px solid rgba(99, 102, 241, 0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const frameworkIconStyle = {
  fontSize: '12px',
  fontWeight: 700,
  color: '#818cf8',
  fontFamily: "'Inter', sans-serif",
};

const nameStyle = {
  fontFamily: "'Inter', sans-serif",
  fontWeight: 600,
  fontSize: '15px',
  color: '#f8fafc',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const urlRowStyle = {
  display: 'flex',
  alignItems: 'center',
};

const urlStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '13px',
  color: '#64748b',
  textDecoration: 'none',
  fontFamily: "'Inter', sans-serif",
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  transition: 'color 0.15s ease',
};

const footerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: '8px',
  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
};

const branchBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
};

const branchTextStyle = {
  fontSize: '12px',
  color: '#94a3b8',
  fontFamily: "'Inter', monospace",
};

const dateStyle = {
  fontSize: '12px',
  color: '#64748b',
  fontFamily: "'Inter', sans-serif",
};
