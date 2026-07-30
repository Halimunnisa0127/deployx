import React from "react";
import {
  UserPlus,
  FolderGit2,
  Rocket,
  Settings,
  ArrowRight,
} from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Create User",
      description: "Add a new member to the platform",
      icon: UserPlus,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "group-hover:border-emerald-500/50",
    },
    {
      title: "View Projects",
      description: "Manage all platform projects",
      icon: FolderGit2,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "group-hover:border-indigo-500/50",
    },
    {
      title: "View Deployments",
      description: "Check deployment status",
      icon: Rocket,
      color: "text-sky-400",
      bg: "bg-sky-500/10",
      border: "group-hover:border-sky-500/50",
    },
    {
      title: "Platform Settings",
      config: "Configure global options",
      icon: Settings,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "group-hover:border-amber-500/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, idx) => (
        <div
          key={idx}
          className={`group cursor-pointer p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:bg-slate-900/90 ${action.border}`}
        >
          <div className="flex justify-between items-start mb-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.bg}`}
            >
              <action.icon className={`w-5 h-5 ${action.color}`} />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
          </div>
          <h4 className="text-sm font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
            {action.title}
          </h4>
          <p className="text-xs text-slate-400">
            {action.description || action.config}
          </p>
        </div>
      ))}
    </div>
  );
}
