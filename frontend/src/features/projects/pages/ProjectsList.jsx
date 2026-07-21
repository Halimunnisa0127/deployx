import { useState } from 'react';
import { useSelector } from 'react-redux';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';
import Button from '../../../components/ui/Button';

export default function ProjectsList() {
  const items = useSelector((state) => state.projects.items);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={pageStyle}>
      {/* Header row */}
      <div style={headerRowStyle}>
        <div>
          <h1 style={headingStyle}>Projects</h1>
          <p style={subStyle}>
            {items.length} project{items.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          id="create-project-btn"
          variant="primary"
          onClick={() => setIsModalOpen(true)}
        >
          + Create Project
        </Button>
      </div>

      {/* Card grid or empty state */}
      {items.length === 0 ? (
        <div style={emptyStyle}>
          <p style={emptyTextStyle}>No projects yet. Create your first one!</p>
        </div>
      ) : (
        <div style={gridStyle}>
          {items.map((project) => (
            <ProjectCard
              key={project.id}
              name={project.name}
              status={project.status}
              lastDeployed={project.lastDeployed}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────────────── */

const pageStyle = {
  minHeight: '100vh',
  background: '#0a0f1e',
  padding: '40px 32px',
  fontFamily: "'Inter', sans-serif",
};

const headerRowStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: '32px',
  flexWrap: 'wrap',
  gap: '16px',
};

const headingStyle = {
  margin: 0,
  fontSize: '28px',
  fontWeight: 700,
  color: '#f1f5f9',
};

const subStyle = {
  margin: '4px 0 0',
  fontSize: '14px',
  color: '#64748b',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '16px',
};

const emptyStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '200px',
  border: '1px dashed rgba(255,255,255,0.1)',
  borderRadius: '12px',
};

const emptyTextStyle = {
  color: '#475569',
  fontSize: '15px',
};
