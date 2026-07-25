import DashboardHero from '../components/DashboardHero';
import StatCards from '../components/StatCards';
import RecentDeploymentsCard from '../components/RecentDeploymentsCard';
import ProjectOverviewCard from '../components/ProjectOverviewCard';
import QuickActionsCard from '../components/QuickActionsCard';
import SystemStatusPanel from '../components/SystemStatusPanel';
import RecentActivityTimeline from '../components/RecentActivityTimeline';

export default function Dashboard() {
  return (
    <div className="space-y-6 md:space-y-8 pb-8">
      {/* 1. Dashboard Hero Section */}
      <DashboardHero />

      {/* 2. Statistics Section */}
      <StatCards />

      {/* 3. Main Dashboard Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (Primary Deployment Overview & Recent Deployments) */}
        <div className="lg:col-span-2 space-y-6">
          <RecentDeploymentsCard />
          <ProjectOverviewCard />
        </div>

        {/* Right Column (Quick Actions, Infrastructure Health & Activity Timeline) */}
        <div className="lg:col-span-1 space-y-6">
          <QuickActionsCard />
          <SystemStatusPanel />
          <RecentActivityTimeline />
        </div>
      </div>
    </div>
  );
}
