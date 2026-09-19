import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  FolderGit2,
  Rocket,
  Settings,
  ArrowRight,
} from "lucide-react";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Create User",
      description: "Add a new member to the platform",
      icon: UserPlus,
      href: "/admin/users",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "hover:border-emerald-500/40",
    },
    {
      title: "View Projects",
      description: "Manage all platform projects",
      icon: FolderGit2,
      href: "/admin/projects",
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "hover:border-indigo-500/40",
    },
    {
      title: "View Deployments",
      description: "Check deployment status",
      icon: Rocket,
      href: "/admin/deployments",
      color: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-500/10",
      border: "hover:border-sky-500/40",
    },
    {
      title: "Platform Settings",
      description: "Configure global options",
      icon: Settings,
      href: "/admin/settings",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
      border: "hover:border-amber-500/40",
    },
  ];

  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-theme-heading tracking-tight">
          Quick Actions
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => navigate(action.href)}
            className={`group text-left p-3.5 rounded-xl bg-background hover:bg-muted/60 border border-border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${action.border}`}
          >
            <div className="flex justify-between items-start mb-2.5">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.bg}`}
              >
                <action.icon className={`w-4 h-4 ${action.color}`} />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
            </div>
            <h4 className="text-xs font-bold text-theme-heading group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
              {action.title}
            </h4>
            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
              {action.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

