import AnalyticsHeader from "../components/AnalyticsHeader";
import KPICards from "../components/KPICards";
import DeploymentTrendChart from "../components/charts/DeploymentTrendChart";
import UserGrowthChart from "../components/charts/UserGrowthChart";
import ProjectGrowthChart from "../components/charts/ProjectGrowthChart";
import FrameworkDistributionChart from "../components/charts/FrameworkDistributionChart";
import RegionDistributionChart from "../components/charts/RegionDistributionChart";
import DeploymentSuccessChart from "../components/charts/DeploymentSuccessChart";
import TopProjectsCard from "../components/TopProjectsCard";
import TopUsersCard from "../components/TopUsersCard";
import TopRegionsCard from "../components/TopRegionsCard";
import ReportsCard from "../components/ReportsCard";
import {
  KPISkeleton,
  ChartSkeleton,
  ListSkeleton,
} from "../components/AnalyticsSkeleton";
import { NoAnalyticsEmptyState } from "../components/AnalyticsEmptyState";
import { useAnalytics } from "../hooks/useAnalytics";

export default function AnalyticsDashboardPage() {
  const {
    dateRange,
    setDateRange,
    loading,
    refreshing,
    hasData,
    kpiData,
    deploymentTrend,
    userGrowth,
    projectGrowth,
    frameworks,
    regions,
    topProjects,
    topUsers,
    fetchData,
    handleExport,
  } = useAnalytics();

  return (
    <div className="space-y-6 md:space-y-8 pb-10 text-left animate-in fade-in duration-300">
      <AnalyticsHeader
        onRefresh={() => fetchData(true)}
        onExport={handleExport}
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
            {loading && !refreshing ? (
              <KPISkeleton />
            ) : (
              <KPICards data={kpiData} />
            )}
          </section>

          {/* Main Charts */}
          <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading && !refreshing ? (
              <>
                <ChartSkeleton />
                <ChartSkeleton />
                <ChartSkeleton />
              </>
            ) : (
              <>
                <DeploymentTrendChart data={deploymentTrend} />
                <UserGrowthChart data={userGrowth} />
                <ProjectGrowthChart data={projectGrowth} />
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
              onExportCSV={() => handleExport("csv")}
              onExportPDF={() => handleExport("pdf")}
              onPrint={() => window.print()}
              onShare={() => alert("Link copied to clipboard")}
            />
          </section>
        </>
      )}
    </div>
  );
}
