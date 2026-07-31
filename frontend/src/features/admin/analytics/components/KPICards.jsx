import React from "react";
import {
  Rocket,
  ShieldCheck,
  Users,
  FolderGit2,
  HardDrive,
  Activity,
} from "lucide-react";
import OverviewCard from "../../components/OverviewCard";

export default function KPICards({ data }) {
  if (!data) return null;

  const cards = [
    {
      title: "Total Deployments",
      value: data.totalDeployments.value.toLocaleString(),
      change: data.totalDeployments.trend,
      icon: Rocket,
    },
    {
      title: "Success Rate",
      value: `${data.successRate.value}%`,
      change: data.successRate.trend,
      icon: ShieldCheck,
    },
    {
      title: "Active Users",
      value: data.activeUsers.value.toLocaleString(),
      change: data.activeUsers.trend,
      icon: Users,
    },
    {
      title: "Active Projects",
      value: data.activeProjects.value.toLocaleString(),
      change: data.activeProjects.trend,
      icon: FolderGit2,
    },
    {
      title: "Storage Usage",
      value: data.storageUsage.value,
      change: data.storageUsage.trend,
      icon: HardDrive,
    },
    {
      title: "Bandwidth Usage",
      value: data.bandwidthUsage.value,
      change: data.bandwidthUsage.trend,
      icon: Activity,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, idx) => (
        <OverviewCard
          key={idx}
          title={card.title}
          value={card.value}
          change={card.change}
          icon={card.icon}
          onClick={() => {}}
        />
      ))}
    </div>
  );
}
