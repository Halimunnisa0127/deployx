import {
  RefreshCw,
  Activity,
  Server,
  Database,
  HardDrive,
  Box,
  Layers,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";

const getIcon = (id) => {
  switch (id) {
    case "api":
      return Server;
    case "db":
      return Database;
    case "queue":
      return Layers;
    case "docker":
      return Box;
    case "storage":
      return HardDrive;
    default:
      return Activity;
  }
};

const DEFAULT_HEALTH_ITEMS = [
  { id: "api", name: "DeployX API Service", status: "healthy", latency: "24ms", uptime: "99.98%", lastChecked: "Just now" },
  { id: "db", name: "Database (MongoDB)", status: "healthy", latency: "Ready", uptime: "100%", lastChecked: "Just now" },
  { id: "docker", name: "Docker Container Engine", status: "healthy", latency: "Ready", uptime: "99.95%", lastChecked: "Just now" },
  { id: "queue", name: "Build Queue Workers", status: "healthy", latency: "Idle", uptime: "100%", lastChecked: "Just now" },
];

export default function PlatformHealthCard({ health = [], onRefresh }) {
  const items = health && health.length > 0 ? health : DEFAULT_HEALTH_ITEMS;

  return (
    <Card className="flex flex-col p-5 sm:p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-theme-heading flex items-center gap-2 tracking-tight">
          <Activity className="w-4 h-4 text-indigo-500" />
          Platform Health
        </h3>
        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            iconLeft={<RefreshCw className="w-3.5 h-3.5 text-slate-400" />}
            className="text-theme-muted hover:text-theme-heading hover:bg-muted text-xs"
          >
            Refresh
          </Button>
        )}
      </div>

      <div className="space-y-3 flex-1">
        {items.map((item) => {
          const Icon = getIcon(item.id);
          return (
            <div
              key={item.id}
              className="p-3.5 rounded-xl border border-border flex items-center justify-between group hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground group-hover:text-indigo-500 transition-colors shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-theme-heading font-semibold truncate">
                    {item.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                    <span>Latency: {item.latency}</span>
                    <span>&bull;</span>
                    <span>Uptime: {item.uptime}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0 ml-3">
                <Badge status={item.status} type="health" />
                <span className="text-[11px] text-muted-foreground">
                  {item.lastChecked}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

