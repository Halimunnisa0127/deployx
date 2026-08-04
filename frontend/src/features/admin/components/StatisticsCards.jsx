import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  FolderGit2,
  Rocket,
  Globe,
  Server,
  Activity,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Wrench
} from "lucide-react";
import OverviewCard from "./OverviewCard";

export default function StatisticsCards({ stats }) {
  const navigate = useNavigate();

  if (!stats) return null;
  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers?.value,
      change: stats.totalUsers?.change,
      icon: Users,
      route: "/admin/users"
    },
    {
      title: "Active Users",
      value: stats.activeUsers?.value,
      change: stats.activeUsers?.change,
      icon: Activity,
      route: "/admin/users"
    },
    {
      title: "Total Projects",
      value: stats.totalProjects?.value,
      change: stats.totalProjects?.change,
      icon: FolderGit2,
      route: "/admin/projects"
    },
    {
      title: "Active Deployments",
      value: stats.activeDeployments?.value,
      change: stats.activeDeployments?.change,
      icon: CheckCircle,
      route: "/admin/deployments"
    },
    {
      title: "Pending Deployments",
      value: stats.pendingDeployments?.value,
      change: stats.pendingDeployments?.change,
      icon: Clock,
      route: "/admin/deployments"
    },
    {
      title: "Failed Deployments",
      value: stats.failedDeployments?.value,
      change: stats.failedDeployments?.change,
      icon: XCircle,
      route: "/admin/deployments"
    },
    {
      title: "Recent Builds",
      value: stats.recentBuilds?.value,
      change: stats.recentBuilds?.change,
      icon: Wrench,
      route: "/admin/deployments"
    },
    {
      title: "Recent Errors",
      value: stats.recentErrors?.value,
      change: stats.recentErrors?.change,
      icon: AlertCircle,
      route: "/admin/logs"
    },
    {
      title: "Active Domains",
      value: stats.activeDomains?.value,
      change: stats.activeDomains?.change,
      icon: Globe,
      route: "/admin/domains"
    },
    {
      title: "Platform Uptime",
      value: stats.platformUptime?.value,
      change: stats.platformUptime?.change,
      icon: Server,
      route: "/admin/system-health"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {cards.map((card, idx) => (
        <OverviewCard
          key={idx}
          title={card.title}
          value={card.value}
          change={card.change}
          icon={card.icon}
          onClick={() => {
            if (card.route) navigate(card.route);
          }}
        />
      ))}
    </div>
  );
}

