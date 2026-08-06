import {
  Server,
  Database,
  Box,
  Layers,
  HardDrive,
  MoreVertical,
  Play,
  Pause,
  RefreshCw,
  Cpu,
  Clock,
  Mail,
  Shield
} from "lucide-react";
import GithubIcon from "../../../../components/ui/GithubIcon";
import Badge from "../../../../components/ui/Badge";
import Dropdown from "../../../../components/ui/Dropdown";

const getIconForType = (type) => {
  switch (type) {
    case "api":
      return Server;
    case "database":
      return Database;
    case "docker":
      return Box;
    case "queue":
      return Layers;
    case "storage":
      return HardDrive;
    case "github":
      return GithubIcon;
    case "worker":
      return Cpu;
    case "scheduler":
      return Clock;
    case "email":
      return Mail;
    case "ssl":
      return Shield;
    default:
      return Server;
  }
};

export function InfrastructureCard({
  service,
  onClick,
  onRestart,
  onToggleMaintenance,
}) {
  const Icon = getIconForType(service.type);
  const menuItems = [
    {
      id: "restart",
      label: "Restart Service",
      icon: <RefreshCw className="w-4 h-4" />,
      onClick: (e) => {
        e.stopPropagation();
        onRestart(service);
      },
    },
    { divider: true },
    service.status === "maintenance"
      ? {
          id: "disable-maint",
          label: "Disable Maintenance",
          icon: <Play className="w-4 h-4" />,
          onClick: (e) => {
            e.stopPropagation();
            onToggleMaintenance(service, false);
          },
        }
      : {
          id: "enable-maint",
          label: "Enable Maintenance",
          icon: <Pause className="w-4 h-4" />,
          onClick: (e) => {
            e.stopPropagation();
            onToggleMaintenance(service, true);
          },
        },
  ];

  return (
    <div
      onClick={() => onClick(service)}
      className="bg-card rounded-2xl border border-border p-5 shadow-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:border-indigo-500/30 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Icon className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-foreground font-semibold">{service.name}</h3>
            <div className="mt-1">
              <Badge status={service.status} />
            </div>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown
            trigger={
              <button className="p-1.5 text-muted-foreground hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            }
            items={menuItems}
            align="right"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div>
          <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">
            Uptime
          </div>
          <div className="text-sm font-mono text-emerald-400">
            {service.uptime}%
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">
            CPU / RAM
          </div>
          <div className="text-sm font-mono text-foreground">
            {service.metrics.cpu}% / {service.metrics.memory}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InfrastructureCards({
  services = [],
  onServiceClick,
  onRestart,
  onToggleMaintenance,
}) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-foreground mb-4">
        Infrastructure Services
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {services.map((service) => (
          <InfrastructureCard
            key={service.id}
            service={service}
            onClick={onServiceClick}
            onRestart={onRestart}
            onToggleMaintenance={onToggleMaintenance}
          />
        ))}
      </div>
    </div>
  );
}
