import React from "react";
import {
  UserPlus,
  FolderPlus,
  Rocket,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import Card from "../../../components/ui/Card";

const getIcon = (type) => {
  switch (type) {
    case "user_created":
      return { icon: UserPlus, color: "text-sky-500 dark:text-sky-400", bg: "bg-sky-500/10" };
    case "project_created":
      return {
        icon: FolderPlus,
        color: "text-indigo-500 dark:text-indigo-400",
        bg: "bg-indigo-500/10",
      };
    case "deployment_started":
      return { icon: Rocket, color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-500/10" };
    case "deployment_failed":
      return {
        icon: AlertTriangle,
        color: "text-rose-500 dark:text-rose-400",
        bg: "bg-rose-500/10",
      };
    case "domain_verified":
      return {
        icon: CheckCircle,
        color: "text-emerald-500 dark:text-emerald-400",
        bg: "bg-emerald-500/10",
      };
    default:
      return {
        icon: CheckCircle,
        color: "text-slate-500 dark:text-slate-400",
        bg: "bg-slate-500/10",
      };
  }
};

const formatTimeAgo = (timestamp) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return `${minutes}m ago`;
};

export default function ActivityTimeline({ activity = [] }) {
  if (!activity.length) return null;

  return (
    <Card className="h-full p-5 sm:p-6 shadow-lg overflow-hidden">
      <h3 className="text-lg font-bold text-theme-heading mb-6 tracking-tight flex items-center gap-2">
        <Clock className="w-5 h-5 text-indigo-400" />
        Recent Activity
      </h3>

      <div className="relative border-l border-theme-border ml-3 space-y-6">
        {activity.map((item, idx) => {
          const { icon: Icon, color, bg } = getIcon(item.type);
          return (
            <div key={item.id} className="relative pl-6 group">
              {/* Timeline Dot */}
              <div className="absolute -left-3 top-1 flex items-center justify-center w-6 h-6 rounded-full bg-theme-card border border-theme-border group-hover:border-indigo-500/50 transition-colors">
                <div
                  className={`w-2 h-2 rounded-full ${color.replaceAll("text-", "bg-")}`}
                />
              </div>

              <div className="bg-theme-bg/50 hover:bg-theme-card/80 p-3.5 rounded-xl border border-transparent hover:border-theme-border transition-all cursor-default">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1 rounded ${bg} flex items-center justify-center`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${color}`} />
                    </div>
                    <span className="text-sm font-medium text-theme-heading group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-xs text-theme-muted whitespace-nowrap">
                    {formatTimeAgo(item.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-theme-muted mt-0.5">
                  {item.description}
                </p>
                <div className="text-[10px] text-theme-secondary font-medium mt-1">
                  By {item.user}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

