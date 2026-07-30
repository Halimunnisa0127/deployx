import React, { useState, useEffect } from 'react';
import AnalyticsHeader from '../components/AnalyticsHeader';
import KPICards from '../components/KPICards';
import DeploymentTrendChart from '../components/DeploymentTrendChart';
import UserGrowthChart from '../components/UserGrowthChart';
import ProjectGrowthChart from '../components/ProjectGrowthChart';
import FrameworkDistributionChart from '../components/FrameworkDistributionChart';
import RegionDistributionChart from '../components/RegionDistributionChart';
import DeploymentSuccessChart from '../components/DeploymentSuccessChart';
import TopProjectsCard from '../components/TopProjectsCard';
import TopUsersCard from '../components/TopUsersCard';
import TopRegionsCard from '../components/TopRegionsCard';
import ReportsCard from '../components/ReportsCard';
import { KPISkeleton, ChartSkeleton, ListSkeleton } from '../components/AnalyticsSkeleton';
import { NoAnalyticsEmptyState } from '../components/AnalyticsEmptyState';

import {
  getDashboardAnalytics,
  getDeploymentTrend,
  getUserGrowth,
  getProjectGrowth,
  getFrameworkDistribution,
  getRegionDistribution,
  getTopProjects,
  getTopUsers,
  exportReport
} from '../services/analytics.service';

export default function AnalyticsDashboardPage() {
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasData, setHasData] = useState(true);

  // Data states
  const [kpiData, setKpiData] = useState(null);
  const [deploymentTrend, setDeploymentTrend] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [projectGrowth, setProjectGrowth] = useState([]);
  const [frameworks, setFrameworks] = useState([]);
  const [regions, setRegions] = useState([]);
  const [topProjects, setTopProjects] = useState([]);
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const [
        kpiRes, trendRes, usersRes, projRes, frameRes, regRes, topProjRes, topUsersRes
      ] = await Promise.all([
        getDashboardAnalytics(dateRange),
        getDeploymentTrend(dateRange),
        getUserGrowth(dateRange),
        getProjectGrowth(dateRange),
        getFrameworkDistribution(),
        getRegionDistribution(),
        getTopProjects(),
        getTopUsers()
      ]);

      setKpiData(kpiRes);
      setDeploymentTrend(trendRes);
      setUserGrowth(usersRes);
      setProjectGrowth(projRes);
      setFrameworks(frameRes);
      setRegions(regRes);
      setTopProjects(topProjRes);
      setTopUsers(topUsersRes);
      setHasData(true);

    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      setHasData(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleExport = async (format = 'pdf') => {
    try {
      await exportReport(format);
      alert(`Exporting ${format.toUpperCase()} report...`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-10 text-left animate-in fade-in duration-300">
      <AnalyticsHeader 
        onRefresh={() => fetchData(true)}
        onExport={() => handleExport('pdf')}
        isRefreshing={refreshing}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      {!hasData ? (
        <NoAnalyticsEmptyState onRefresh={() => fetchData(true)} />
      ) : (
        <>
          {/* KPI Section */}
          <section>
            {loading && !refreshing ? <KPISkeleton /> : <KPICards data={kpiData} />}
          </section>

          {/* Main Charts */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loading && !refreshing ? (
              <>
                <ChartSkeleton />
                <ChartSkeleton />
              </>
            ) : (
              <>
                <DeploymentTrendChart data={deploymentTrend} />
                <UserGrowthChart data={userGrowth} />
              </>
            )}
          </section>

          {/* Secondary Charts */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {loading && !refreshing ? (
              <>
                <ChartSkeleton />
                <ChartSkeleton />
                <ChartSkeleton />
              </>
            ) : (
              <>
                <FrameworkDistributionChart data={frameworks} />
                <DeploymentSuccessChart data={deploymentTrend} />
                <RegionDistributionChart data={regions} />
              </>
            )}
          </section>

          {/* Top Lists & Actions */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {loading && !refreshing ? (
              <>
                <ListSkeleton />
                <ListSkeleton />
                <ListSkeleton />
              </>
            ) : (
              <>
                <TopProjectsCard projects={topProjects} />
                <TopUsersCard users={topUsers} />
                <TopRegionsCard regions={regions} />
              </>
            )}
          </section>
          
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ReportsCard 
              onExportCSV={() => handleExport('csv')}
              onExportPDF={() => handleExport('pdf')}
              onPrint={() => window.print()}
              onShare={() => alert('Link copied to clipboard')}
            />
          </section>
        </>
      )}
    </div>
  );
}
