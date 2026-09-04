import {
  Rocket,
  ShieldCheck,
  Users,
  FolderGit2,
  Activity,
} from "lucide-react";
import OverviewCard from "../../components/OverviewCard";

export default function KPICards({ data }) {
  if (!data) return null;

  const totalDeploymentsVal = data.totalDeployments?.value ?? data.totalDeployments ?? 0;
  const successRateVal = data.successRate?.value ?? data.successRate ?? 100;
  const activeUsersVal = data.activeUsers?.value ?? data.activeUsers ?? (data.totalUsers?.value ?? 0);
  const activeProjectsVal = data.activeProjects?.value ?? data.activeProjects ?? (data.totalProjects?.value ?? 0);
  const failureRateVal = data.failureRate?.value ?? data.failureRate ?? 0;
  const durationVal = data.deploymentDuration?.value ?? data.deploymentDuration ?? '0s';
  const bandwidthVal = data.bandwidthUsage?.value ?? 'Not tracked';

  const cards = [
    {
      title: "Total Deployments",
      value: Number(totalDeploymentsVal).toLocaleString(),
      change: data.totalDeployments?.trend || 0,
      icon: Rocket,
    },
    {
      title: "Success Rate",
      value: `${successRateVal}%`,
      change: data.successRate?.trend || 0,
      icon: ShieldCheck,
    },
    {
      title: "Active Users",
      value: Number(activeUsersVal).toLocaleString(),
      change: data.activeUsers?.trend || 0,
      icon: Users,
    },
    {
      title: "Active Projects",
      value: Number(activeProjectsVal).toLocaleString(),
      change: data.activeProjects?.trend || 0,
      icon: FolderGit2,
    },
    {
      title: "Failure Rate",
      value: `${failureRateVal}%`,
      change: data.failureRate?.trend || 0,
      icon: Activity,
    },
    {
      title: "Deployment Time",
      value: String(durationVal),
      change: data.deploymentDuration?.trend || 0,
      icon: Rocket,
    },
    {
      title: "Bandwidth Usage",
      value: String(bandwidthVal),
      change: 0,
      icon: Activity,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
      {cards.map((card, idx) => (
        <OverviewCard
          key={idx}
          title={card.title}
          value={card.value}
          change={card.change}
          icon={card.icon}
          onClick={() => alert(`Drill down into ${card.title}`)}
        />
      ))}
    </div>
  );
}

