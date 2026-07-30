import React, { useMemo } from "react";
import {
  Globe,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldAlert,
  Eye,
} from "lucide-react";
import OverviewCard from "../../components/OverviewCard";

export default function AnalyticsCards({ domains = [] }) {
  const stats = useMemo(() => {
    const total = domains.length;
    const verified = domains.filter(
      (d) => d.verificationStatus === "verified",
    ).length;
    const pending = domains.filter(
      (d) => d.verificationStatus === "pending",
    ).length;
    const failed = domains.filter(
      (d) => d.verificationStatus === "failed",
    ).length;
    const sslExpiring = domains.filter(
      (d) => d.sslStatus === "expiring",
    ).length;
    const preview = domains.filter((d) => d.environment === "preview").length;

    return { total, verified, pending, failed, sslExpiring, preview };
  }, [domains]);

  const cards = [
    { title: "Total Domains", value: stats.total, change: 12.5, icon: Globe },
    {
      title: "Verified Domains",
      value: stats.verified,
      change: 8.2,
      icon: CheckCircle2,
    },
    {
      title: "Pending Verification",
      value: stats.pending,
      change: 1.5,
      icon: Clock,
    },
    {
      title: "Failed Verification",
      value: stats.failed,
      change: -2.4,
      icon: XCircle,
    },
    {
      title: "SSL Expiring Soon",
      value: stats.sslExpiring,
      change: 5.0,
      icon: ShieldAlert,
    },
    { title: "Preview Domains", value: stats.preview, change: 15.2, icon: Eye },
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
