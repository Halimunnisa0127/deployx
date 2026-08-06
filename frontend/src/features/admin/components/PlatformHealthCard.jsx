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

export default function PlatformHealthCard({ health = [] }) {
  if (!health.length) return null;

  return (
    <Card className="h-full flex flex-col p-5 sm:p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-theme-heading flex items-center gap-2 tracking-tight">
          <Activity className="w-5 h-5 text-indigo-400" />
          Platform Health
        </h3>
        <Button
          variant="ghost"
          size="sm"
          iconLeft={<RefreshCw className="w-4 h-4 text-slate-400" />}
          className="text-theme-muted hover:text-theme-heading hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Refresh
        </Button>
      </div>

      <div className="space-y-4 flex-1">
        {health.map((item) => {
          const Icon = getIcon(item.id);
          return (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-border flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-theme-bg border border-theme-border flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-theme-heading font-semibold whitespace-nowrap">
                    {item.name}
                  </div>
                  <div className="text-xs text-theme-muted mt-0.5 flex gap-2">
                    <span>Latency: {item.latency}</span>
                    <span>&bull;</span>
                    <span>Uptime: {item.uptime}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge status={item.status} type="health" />
                <span className="text-theme-secondary font-medium truncate">
                  Checked {item.lastChecked}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

