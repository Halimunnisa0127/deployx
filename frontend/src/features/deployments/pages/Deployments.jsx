import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../../components/common/SearchBar';
import StatusFilterTabs from '../components/StatusFilterTabs';
import DeploymentCard from '../components/DeploymentCard';
import DeploymentSkeleton from '../components/DeploymentSkeleton';
import DeploymentsEmptyState from '../components/DeploymentsEmptyState';
import { mockDeployments } from '../data/mockDeployments';
import { Layers, Activity, RefreshCw } from 'lucide-react';

export default function Deployments() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Compute status counts for filter tabs
  const statusCounts = useMemo(() => {
    const counts = {
      all: mockDeployments.length,
      success: 0,
      building: 0,
      failed: 0,
      queued: 0,
    };

    mockDeployments.forEach((dep) => {
      if (counts[dep.status] !== undefined) {
        counts[dep.status] += 1;
      }
    });

    return counts;
  }, []);

  // Filter deployments by search query (projectName, branch, commitHash, commitMessage, environment) & status tab
  const filteredDeployments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return mockDeployments.filter((dep) => {
      // Status filter
      if (activeTab !== 'all' && dep.status !== activeTab) {
        return false;
      }

      // Search filter
      if (query) {
        const matchProject = dep.projectName.toLowerCase().includes(query);
        const matchBranch = dep.branch.toLowerCase().includes(query);
        const matchCommitHash = dep.commitHash.toLowerCase().includes(query);
        const matchCommitMessage = dep.commitMessage.toLowerCase().includes(query);
        const matchEnvironment = dep.environment.toLowerCase().includes(query);
        const matchFramework = dep.framework?.toLowerCase().includes(query);

        return matchProject || matchBranch || matchCommitHash || matchCommitMessage || matchEnvironment || matchFramework;
      }

      return true;
    });
  }, [searchQuery, activeTab]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveTab('all');
  };

  const handleCardClick = (deployment) => {
    navigate(`/dashboard/deployments/${deployment.id}`);
  };

  const [notification, setNotification] = useState(null);

  const handleRedeploy = (deployment) => {
    setNotification({
      type: 'success',
      message: `Triggered redeployment for ${deployment.projectName} (${deployment.id})`,
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const hasActiveFilter = searchQuery.trim().length > 0 || activeTab !== 'all';

  return (
    <div className="space-y-6 md:space-y-8 pb-10 text-left animate-in fade-in duration-300">
      {/* Toast notification feedback */}
      {notification && (
        <div className="p-4 rounded-xl border flex items-center justify-between text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 bg-emerald-950/80 border-emerald-500/40 text-emerald-300">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="hover:underline text-xs">Dismiss</button>
        </div>
      )}

      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Deployments
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
            Monitor every deployment across your projects in real-time.
          </p>
        </div>

        {/* Top Active Summary Badge */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span>Total Deployments: <strong className="text-white font-semibold">{mockDeployments.length}</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Controls Bar: Search & Status Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status Filter Tabs */}
          <StatusFilterTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={statusCounts}
          />

          {/* SearchBar Component */}
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            placeholder="Search deployments..."
            shortcut="⌘K"
            size="md"
            className="w-full sm:w-72 shrink-0"
          />
        </div>
      </div>

      {/* 3. Main Deployments List / Loading / Empty State */}
      {isLoading ? (
        <DeploymentSkeleton count={4} />
      ) : filteredDeployments.length > 0 ? (
        <div className="space-y-4">
          {filteredDeployments.map((deployment) => (
            <DeploymentCard
              key={deployment.id}
              deployment={deployment}
              onClick={handleCardClick}
              onRedeploy={handleRedeploy}
            />
          ))}
        </div>
      ) : (
        <DeploymentsEmptyState
          hasFilter={hasActiveFilter}
          onResetFilter={handleResetFilters}
        />
      )}

    </div>
  );
}
