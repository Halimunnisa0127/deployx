import React from "react";
import { Clock, Rocket, User } from "lucide-react";
import Badge from "../../../../components/ui/Badge";
import EnvironmentBadge from "./EnvironmentBadge";
import FrameworkBadge from "./FrameworkBadge";
import ActionMenu from "./ActionMenu";

export default function DeploymentRow({
  deployment,
  onRowClick,
  ...actionProps
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onRowClick(deployment);
    }
  };

  return (
    <tr
      tabIndex={0}
      onClick={() => onRowClick(deployment)}
      onKeyDown={handleKeyDown}
      className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer outline-none focus-visible:bg-slate-100 dark:focus-visible:bg-slate-800/50"
    >
      <td className="px-5 py-4 min-w-[200px]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0">
            <Rocket className="w-5 h-5 text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors" />
          </div>
          <div>
            <div className="font-bold text-theme-heading group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors truncate">
              {deployment.project}
            </div>
            <div className="text-xs text-theme-muted font-mono mt-0.5">
              {deployment.id} • {deployment.latestCommit}
            </div>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5 text-sm text-theme-secondary">
          <User className="w-3.5 h-3.5 text-theme-muted" />
          {deployment.owner}
        </div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <FrameworkBadge framework={deployment.framework} />
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <EnvironmentBadge environment={deployment.environment} />
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <Badge status={deployment.status} />
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-xs text-theme-muted font-mono">
        {deployment.duration}
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-theme-muted text-xs">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-theme-muted" />
          {new Date(deployment.createdAt).toLocaleString()}
        </span>
      </td>
      <td className="px-5 py-4 text-right">
        <ActionMenu
          deployment={deployment}
          onViewDetails={onRowClick}
          {...actionProps}
        />
      </td>
    </tr>
  );
}
