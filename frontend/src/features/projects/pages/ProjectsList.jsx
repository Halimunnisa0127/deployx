import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import ProjectCard from '../components/ProjectCard';
import ProjectCardSkeleton from '../components/ProjectCardSkeleton';
import ProjectsHeaderStats from '../components/ProjectsHeaderStats';
import ProjectsEmptyState from '../components/ProjectsEmptyState';
import CreateProjectModal from '../components/CreateProjectModal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Dropdown from '../../../components/ui/Dropdown';
import SearchBar from '../../../components/common/SearchBar';

const FILTER_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live' },
  { id: 'building', label: 'Building' },
  { id: 'failed', label: 'Failed' },
];

const SORT_OPTIONS = [
  { id: 'recent', label: 'Recently Deployed' },
  { id: 'name-asc', label: 'Name (A-Z)' },
  { id: 'name-desc', label: 'Name (Z-A)' },
  { id: 'status', label: 'Status' },
];

export default function ProjectsList() {
  const items = useSelector((state) => state.projects.items);
  const statusState = useSelector((state) => state.projects.status);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSort, setActiveSort] = useState('recent');

  // Stats calculation
  const stats = useMemo(() => {
    const total = items.length;
    const live = items.filter((i) => i.status === 'live').length;
    const building = items.filter((i) => i.status === 'building').length;
    const failed = items.filter((i) => i.status === 'failed').length;
    return { total, live, building, failed };
  }, [items]);

  // Count items per filter
  const filterCounts = useMemo(() => {
    return {
      all: items.length,
      live: stats.live,
      building: stats.building,
      failed: stats.failed,
    };
  }, [items, stats]);

  // Filter & Sort items
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((item) => item.name.toLowerCase().includes(q));
    }

    // Status filter
    if (activeFilter !== 'all') {
      result = result.filter((item) => item.status === activeFilter);
    }

    // Sorting
    result.sort((a, b) => {
      if (activeSort === 'recent') {
        const dateA = a.lastDeployed ? new Date(a.lastDeployed).getTime() : 0;
        const dateB = b.lastDeployed ? new Date(b.lastDeployed).getTime() : 0;
        return dateB - dateA;
      }
      if (activeSort === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (activeSort === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      if (activeSort === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

    return result;
  }, [items, searchQuery, activeFilter, activeSort]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveFilter('all');
    setActiveSort('recent');
  };

  const isLoading = statusState === 'loading';

  return (
    <div style={pageContainerStyle}>
      {/* Top Header Row */}
      <div style={headerRowStyle}>
        <div style={headerTitleGroupStyle}>
          <h1 style={headingStyle}>Projects</h1>
          <p style={subStyle}>
            Manage, monitor, and deploy your web applications and services.
          </p>
          <div style={{ marginTop: '14px' }}>
            <ProjectsHeaderStats
              total={stats.total}
              live={stats.live}
              building={stats.building}
              failed={stats.failed}
            />
          </div>
        </div>

        <Button
          id="create-project-btn"
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          iconLeft={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          }
        >
          Create Project
        </Button>
      </div>

      {/* Toolbar: Search, Filter Chips, Sort Dropdown */}
      <div style={toolbarStyle}>
        {/* Left: Search input */}
        <div style={searchWrapperStyle}>
          <SearchBar
            id="projects-search-input"
            placeholder="Search projects by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            fullWidth
            size="md"
          />
        </div>

        {/* Right: Filters and Sort */}
        <div style={filterSortGroupStyle}>
          {/* Filter Chips */}
          <div style={chipsContainerStyle} role="tablist" aria-label="Project Status Filters">
            {FILTER_OPTIONS.map((tab) => {
              const isActive = activeFilter === tab.id;
              const count = filterCounts[tab.id] ?? 0;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(tab.id)}
                  style={{
                    ...chipStyle,
                    background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    color: isActive ? '#818cf8' : '#94a3b8',
                    borderColor: isActive ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.08)',
                  }}
                >
                  {tab.label}
                  <span
                    style={{
                      ...chipBadgeStyle,
                      background: isActive ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                      color: isActive ? '#a5b4fc' : '#64748b',
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <Dropdown
            trigger={
              <div style={sortTriggerStyle}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5h10" />
                  <path d="M11 9h7" />
                  <path d="M11 13h4" />
                  <path d="M3 17l3 3 3-3" />
                  <path d="M6 18V4" />
                </svg>
                <span>{SORT_OPTIONS.find((s) => s.id === activeSort)?.label}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            }
            align="right"
            items={SORT_OPTIONS.map((opt) => ({
              id: opt.id,
              label: opt.label,
              onClick: () => setActiveSort(opt.id),
            }))}
          />
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div style={gridStyle}>
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <ProjectCardSkeleton key={idx} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <ProjectsEmptyState
          type="no-projects"
          onCreateClick={() => setIsModalOpen(true)}
        />
      ) : filteredAndSortedItems.length === 0 ? (
        <ProjectsEmptyState
          type="no-results"
          onResetFilters={handleResetFilters}
        />
      ) : (
        <div style={gridStyle}>
          {filteredAndSortedItems.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              status={project.status}
              lastDeployed={project.lastDeployed}
              framework={project.framework}
              branch={project.branch}
              url={project.url}
            />
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────────────── */

const pageContainerStyle = {
  width: '100%',
  fontFamily: "'Inter', sans-serif",
};

const headerRowStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: '28px',
  flexWrap: 'wrap',
  gap: '20px',
};

const headerTitleGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const headingStyle = {
  margin: 0,
  fontSize: '26px',
  fontWeight: 700,
  color: '#f8fafc',
  letterSpacing: '-0.02em',
};

const subStyle = {
  margin: '6px 0 0',
  fontSize: '14px',
  color: '#94a3b8',
};

const toolbarStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  marginBottom: '24px',
  flexWrap: 'wrap',
};

const searchWrapperStyle = {
  flex: '1 1 280px',
  maxWidth: '380px',
};

const searchIconStyle = {
  position: 'absolute',
  left: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
  zIndex: 1,
};

const clearSearchButtonStyle = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  color: '#64748b',
  cursor: 'pointer',
  fontSize: '12px',
  padding: '4px',
  lineHeight: 1,
};

const filterSortGroupStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
};

const chipsContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  background: 'rgba(15, 23, 42, 0.4)',
  padding: '4px',
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.06)',
};

const chipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  borderRadius: '7px',
  border: '1px solid transparent',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  outline: 'none',
  fontFamily: "'Inter', sans-serif",
};

const chipBadgeStyle = {
  fontSize: '11px',
  fontWeight: 600,
  padding: '1px 6px',
  borderRadius: '999px',
};

const sortTriggerStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 14px',
  borderRadius: '8px',
  background: 'rgba(15, 23, 42, 0.6)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: '#cbd5e1',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: "'Inter', sans-serif",
  transition: 'all 0.15s ease',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '20px',
};
