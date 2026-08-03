import React from "react";
import {
  MoreVertical,
  Info,
  FolderGit2,
  Globe,
  RefreshCcw,
  XCircle,
  Trash2,
  Copy,
} from "lucide-react";
import Dropdown from "../../../../components/ui/Dropdown";

export default function ActionMenu({
  deployment,
  onViewDetails,
  onOpenProject,
  onRedeploy,
  onCancel,
  onDelete,
}) {
  const isRunning =
    deployment.status === "running" || deployment.status === "queued";

  const menuItems = [
    {
      id: "view",
      label: "View Details",
      icon: <Info className="w-4 h-4" />,
      onClick: (e) => {
        e.stopPropagation();
        onViewDetails(deployment);
      },
    },
    {
      id: "project",
      label: "Open Project",
      icon: <FolderGit2 className="w-4 h-4" />,
      onClick: (e) => {
        e.stopPropagation();
        onOpenProject(deployment);
      },
    },
    {
      id: "domain",
      label: "Open Domain",
      icon: <Globe className="w-4 h-4" />,
      onClick: (e) => {
        e.stopPropagation();
        window.open(`https://${deployment.domain}`, "_blank");
      },
    },
    { divider: true },
    {
      id: "copy-id",
      label: "Copy Deployment ID",
      icon: <Copy className="w-4 h-4" />,
      onClick: (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(deployment.id);
      },
    },
    { divider: true },
    {
      id: "redeploy",
      label: "Redeploy",
      icon: <RefreshCcw className="w-4 h-4" />,
      onClick: (e) => {
        e.stopPropagation();
        onRedeploy(deployment);
      },
    },
    {
      id: "cancel",
      label: "Cancel Deployment",
      icon: <XCircle className="w-4 h-4" />,
      disabled: !isRunning,
      onClick: (e) => {
        e.stopPropagation();
        onCancel(deployment);
      },
    },
    { divider: true },
    {
      id: "delete",
      label: "Delete Deployment",
      icon: <Trash2 className="w-4 h-4" />,
      danger: true,
      onClick: (e) => {
        e.stopPropagation();
        onDelete(deployment);
      },
    },
  ];

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dropdown
        trigger={
          <button className="p-1.5 rounded-lg text-theme-muted hover:text-theme-heading hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        }
        items={menuItems}
        align="right"
        width="w-56"
      />
    </div>
  );
}
