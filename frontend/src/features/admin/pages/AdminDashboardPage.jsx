import React, { useState, useEffect } from "react";
import DashboardHeader from "../components/DashboardHeader";
import StatisticsCards from "../components/StatisticsCards";
import RecentDeploymentsTable from "../components/RecentDeploymentsTable";
import RecentUsersTable from "../components/RecentUsersTable";
import PlatformHealthCard from "../components/PlatformHealthCard";
import ActivityTimeline from "../components/ActivityTimeline";
import QuickActions from "../components/QuickActions";
import DeploymentTrendChart from "../components/DeploymentTrendChart";
import UserGrowthChart from "../components/UserGrowthChart";
import {
  StatisticsSkeleton,
  ChartSkeleton,
  TableSkeleton,
  PlatformHealthSkeleton,
  ActivitySkeleton,
  QuickActionSkeleton,
} from "../components/AdminSkeleton";
import {
  NoDeploymentsEmptyState,
  NoUsersEmptyState,
  NoActivityEmptyState,
} from "../components/AdminEmptyState";
import {
  getDashboardStats,
  getRecentDeployments,
  getRecentUsers,
  getPlatformHealth,
  getActivity,
  getDeploymentTrend,
  getUserGrowth,
} from "../services/admin.service";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: null,
    deployments: [],
    users: [],
    health: [],
    activity: [],
    trend: [],
    growth: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          statsData,
          deploymentsData,
          usersData,
          healthData,
          activityData,
          trendData,
          growthData,
        ] = await Promise.all([
          getDashboardStats(),
          getRecentDeployments(),
          getRecentUsers(),
          getPlatformHealth(),
          getActivity(),
          getDeploymentTrend(),
          getUserGrowth(),
        ]);

        setData({
          stats: statsData,
          deployments: deploymentsData,
          users: usersData,
          health: healthData,
          activity: activityData,
          trend: trendData,
          growth: growthData,
        });
      } catch (error) {
        console.error("Failed to load admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6 md:space-y-8 pb-10 text-left animate-in fade-in duration-300">
      <DashboardHeader stats={data.stats} />

      {/* Top Statistics */}
      {loading ? (
        <StatisticsSkeleton />
      ) : (
        <StatisticsCards stats={data.stats} />
      )}

      {/* Quick Actions */}
      {loading ? <QuickActionSkeleton /> : <QuickActions />}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <DeploymentTrendChart data={data.trend} />
            <UserGrowthChart data={data.growth} />
          </>
        )}
      </div>

      {/* Health and Activity Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Platform Health */}
        {loading ? (
          <PlatformHealthSkeleton />
        ) : (
          <PlatformHealthCard health={data.health} />
        )}

        {/* Recent Activity */}
        {loading ? (
          <ActivitySkeleton />
        ) : data.activity.length > 0 ? (
          <ActivityTimeline activity={data.activity} />
        ) : (
          <NoActivityEmptyState />
        )}
      </div>

      {/* Data Tables Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Deployments */}
        {loading ? (
          <TableSkeleton rows={5} />
        ) : data.deployments.length > 0 ? (
          <RecentDeploymentsTable deployments={data.deployments} />
        ) : (
          <NoDeploymentsEmptyState />
        )}

        {/* Recent Users */}
        {loading ? (
          <TableSkeleton rows={5} />
        ) : data.users.length > 0 ? (
          <RecentUsersTable users={data.users} />
        ) : (
          <NoUsersEmptyState />
        )}

      </div>
    </div>
  );
}
