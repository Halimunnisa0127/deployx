import { useMemo } from "react";
import {
  Rocket,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
} from "lucide-react";
import OverviewCard from "../../components/OverviewCard";

export default function AnalyticsCards({ deployments = [] }) {
  const stats = useMemo(() => {
    const total = deployments.length;
    const running = deployments.filter((d) => d.status === "running").length;
    const success = deployments.filter((d) => d.status === "success").length;
    const failed = deployments.filter((d) => d.status === "failed").length;
    const queued = deployments.filter((d) => d.status === "queued").length;
    const cancelled = deployments.filter(
      (d) => d.status === "cancelled",
    ).length;

    return { total, running, success, failed, queued, cancelled };
  }, [deployments]);

  const cards = [
    {
      title: "Total Deployments",
      value: stats.total,
      change: 24.5,
      icon: Rocket,
    },
    {
      title: "Running Deployments",
      value: stats.running,
      change: 5.2,
      icon: PlayCircle,
    },
    {
      title: "Successful Deployments",
      value: stats.success,
      change: 18.7,
      icon: CheckCircle2,
    },
    {
      title: "Failed Deployments",
      value: stats.failed,
      change: -12.4,
      icon: AlertCircle,
    },
    {
      title: "Queued Deployments",
      value: stats.queued,
      change: 1.5,
      icon: Clock,
    },
    {
      title: "Cancelled Deployments",
      value: stats.cancelled,
      change: -3.2,
      icon: XCircle,
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
