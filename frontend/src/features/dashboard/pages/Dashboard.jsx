import React, { lazy, Suspense } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';
import DashboardHero from '../components/DashboardHero';
import StatCards from '../components/StatCards';
import RecentDeploymentsCard from '../components/RecentDeploymentsCard';
import ProjectOverviewCard from '../components/ProjectOverviewCard';
import QuickActionsCard from '../components/QuickActionsCard';
import SystemStatusPanel from '../components/SystemStatusPanel';
import RecentActivityTimeline from '../components/RecentActivityTimeline';
import InfrastructureUsageCard from '../components/InfrastructureUsageCard';
import DashboardSkeleton from '../components/DashboardSkeleton';
import Skeleton from '../../../components/ui/Skeleton';
import Button from '../../../components/ui/Button';

// Lazy-load DeploymentTrendsCard to optimize bundle size and render performance
const DeploymentTrendsCard = lazy(() => import('../components/DeploymentTrendsCard'));

function Dashboard() {
  const {
    projects,
    statMetrics,
    recentDeployments,
    projectOverview,
    systemServices,
    deploymentTrends,
    recentActivities,
    usageSummary,
    loading,
    error,
    refetch,
  } = useDashboardData();

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-8">
      {/* Error alert with retry if initial data fetch failed */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={refetch}
            iconLeft={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Retry
          </Button>
        </div>
      )}

      {/* 1. Dashboard Hero Section */}
      <DashboardHero
        latestDeployment={recentDeployments[0] || null}
        projectsCount={projects.length}
      />

      {/* 2. Statistics Section */}
      <StatCards metrics={statMetrics} />

      {/* 3. Main Dashboard Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (Recent Deployments, Project Overview, Usage Summary & Deployment Trends) */}
        <div className="lg:col-span-2 space-y-6">
          <RecentDeploymentsCard deployments={recentDeployments} />

          <ProjectOverviewCard overview={projectOverview} />

          {/* Stacked Usage Summary and Deployment Trends */}
          <InfrastructureUsageCard usage={usageSummary} />

          <Suspense fallback={<Skeleton height="280px" borderRadius="16px" />}>
            <DeploymentTrendsCard data={deploymentTrends} />
          </Suspense>
        </div>

        {/* Right Column (Quick Actions, Infrastructure Health & Activity Timeline) */}
        <div className="lg:col-span-1 space-y-6">
          <QuickActionsCard />
          <SystemStatusPanel services={systemServices} />
          <RecentActivityTimeline activities={recentActivities} />
        </div>
      </div>
    </div>
  );
}

export default React.memo(Dashboard);


