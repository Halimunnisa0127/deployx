import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import ProjectCardSkeleton from '../components/ProjectCardSkeleton';
import ProjectsHeaderStats from '../components/ProjectsHeaderStats';
import ProjectsEmptyState from '../components/ProjectsEmptyState';
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
  const navigate = useNavigate();
  const items = useSelector((state) => state.projects.items);
  const statusState = useSelector((state) => state.projects.status);

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
    <div className="w-full font-inter">
      {/* Top Header Row */}
      <div className="flex items-start justify-between mb-7 flex-wrap gap-5">
        <div className="flex flex-col">
          <h1 className="m-0 text-[26px] font-bold tracking-tight text-foreground transition-colors">Projects</h1>
          <p className="mt-1.5 text-sm text-muted-foreground transition-colors">
            Manage, monitor, and deploy your web applications and services.
          </p>
          <div className="mt-3.5">
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
          to="/dashboard/projects/new"
          iconLeft={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          }
        >
          New Project
        </Button>
      </div>

      {/* Toolbar: Search, Filter Chips, Sort Dropdown */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        {/* Left: Search input */}
        <div className="flex-[1_1_280px] max-w-[380px]">
          <SearchBar
            id="projects-search-input"
            placeholder="Search projects by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            fullWidth
            size="sm"
          />
        </div>

        {/* Right: Filters and Sort */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 bg-slate-200/50 dark:bg-slate-900/40 p-1 rounded-[10px] border border-border transition-colors" role="tablist" aria-label="Project Status Filters">
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
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-sm font-medium transition-all outline-none ${isActive ? 'bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-500/40 shadow-sm' : 'bg-transparent text-muted-foreground border-transparent hover:text-slate-900 dark:hover:text-slate-300'}`}
                >
                  {tab.label}
                  <span
                    className={`text-xs font-semibold px-1.5 py-[1px] rounded-full transition-colors ${isActive ? 'bg-indigo-200 dark:bg-indigo-500/25 text-indigo-800 dark:text-indigo-300' : 'bg-slate-300/50 dark:bg-white/5 text-slate-700 dark:text-slate-500'}`}
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
              <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-card border border-border text-foreground text-sm font-medium cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-sm">
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
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <ProjectCardSkeleton key={idx} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <ProjectsEmptyState
          type="no-projects"
          onCreateClick={() => navigate('/dashboard/projects/new')}
        />
      ) : filteredAndSortedItems.length === 0 ? (
        <ProjectsEmptyState
          type="no-results"
          onResetFilters={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
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
    </div>
  );
}

