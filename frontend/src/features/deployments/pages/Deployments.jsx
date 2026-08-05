import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../../components/common/SearchBar';
import StatusFilterTabs from '../components/StatusFilterTabs';
import DeploymentCard from '../components/DeploymentCard';
import DeploymentSkeleton from '../components/DeploymentSkeleton';
import DeploymentsEmptyState from '../components/DeploymentsEmptyState';
import { Layers, Activity, RefreshCw } from 'lucide-react';
import { useDeployments } from '../hooks/useDeployments';

export default function Deployments() {
  const navigate = useNavigate();
  const {
    deployments: filteredDeployments,
    totalDeployments,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    isLoading,
    notification,
    setNotification,
    statusCounts,
    handleResetFilters,
    handleRedeploy
  } = useDeployments();

  const handleCardClick = (deployment) => {
    navigate(`/dashboard/deployments/${deployment.id}`);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Deployments
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            Monitor every deployment across your projects in real-time.
          </p>
        </div>

        {/* Top Active Summary Badge */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-card border border-border text-xs font-medium text-foreground flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            <span>Total Deployments: <strong className="text-foreground font-semibold">{totalDeployments}</strong></span>
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
