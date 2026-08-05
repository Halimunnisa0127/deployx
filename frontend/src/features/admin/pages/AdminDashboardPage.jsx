import React from "react";
import DashboardHeader from "../components/DashboardHeader";
import StatisticsCards from "../components/StatisticsCards";
import RecentDeploymentsTable from "../components/RecentDeploymentsTable";
import RecentUsersTable from "../components/RecentUsersTable";
import PlatformHealthCard from "../components/PlatformHealthCard";
import QuickActions from "../components/QuickActions";
import DeploymentTrendChart from "../components/charts/DeploymentTrendChart";
import UserGrowthChart from "../components/charts/UserGrowthChart";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function AdminDashboardPage() {
  const {
    stats,
    deployments,
    users,
    health,
    trend,
    growth,
    loading,
    refreshing,
    error,
    dateRange,
    setDateRange,
    refreshData,
  } = useAdminDashboard();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-theme-heading mb-2">Failed to load dashboard</h3>
        <p className="text-theme-secondary mb-6 max-w-md">{error}</p>
        <button
          onClick={refreshData}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-10 text-left animate-in fade-in duration-300">
      <DashboardHeader 
        stats={stats} 
        dateRange={dateRange}
        setDateRange={setDateRange}
        refreshData={refreshData}
        refreshing={refreshing || loading}
      />

      {loading && !stats ? (
        <div className="animate-pulse space-y-6">
          <div className="h-[120px] bg-muted rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[400px] bg-muted rounded-2xl" />
            <div className="h-[400px] bg-muted rounded-2xl" />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <StatisticsCards stats={stats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DeploymentTrendChart data={trend} />
            <UserGrowthChart data={growth} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <RecentDeploymentsTable deployments={deployments} />
              <RecentUsersTable users={users} />
            </div>
            <div className="space-y-6">
              <PlatformHealthCard health={health} />
              <QuickActions />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
