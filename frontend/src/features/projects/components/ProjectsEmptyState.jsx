import Button from '../../../components/ui/Button';

export default function ProjectsEmptyState({ type = 'no-projects', onCreateClick, onResetFilters }) {
  const isNoResults = type === 'no-results';

  return (
    <div style={containerStyle}>
      <div style={iconBadgeStyle}>
        {isNoResults ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            <line x1="12" y1="11" x2="12" y2="17" />
            <line x1="9" y1="14" x2="15" y2="14" />
          </svg>
        )}
      </div>

      <h3 style={titleStyle}>
        {isNoResults ? 'No matching projects found' : 'No projects created yet'}
      </h3>

      <p style={descriptionStyle}>
        {isNoResults
          ? 'Try refining your search terms or status filters to find what you looking for.'
          : 'Get started by creating your first project and deploying it to the DeployX cloud.'}
      </p>

      <div style={actionContainerStyle}>
        {isNoResults ? (
          <Button variant="secondary" size="sm" onClick={onResetFilters}>
            Clear Search & Filters
          </Button>
        ) : (
          <Button variant="primary" size="md" onClick={onCreateClick}>
            + Create Your First Project
          </Button>
        )}
      </div>
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────────────── */

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '64px 24px',
  textAlign: 'center',
  border: '1px dashed rgba(255, 255, 255, 0.12)',
  borderRadius: '16px',
  background: 'rgba(15, 23, 42, 0.3)',
  backdropFilter: 'blur(8px)',
  margin: '24px 0',
};

const iconBadgeStyle = {
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  background: 'rgba(99, 102, 241, 0.12)',
  border: '1px solid rgba(99, 102, 241, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px',
};

const titleStyle = {
  fontSize: '18px',
  fontWeight: 600,
  color: '#f8fafc',
  margin: '0 0 8px 0',
  fontFamily: "'Inter', sans-serif",
};

const descriptionStyle = {
  fontSize: '14px',
  color: '#64748b',
  maxWidth: '400px',
  margin: '0 0 24px 0',
  lineHeight: '1.5',
  fontFamily: "'Inter', sans-serif",
};

const actionContainerStyle = {
  display: 'flex',
  gap: '12px',
};
