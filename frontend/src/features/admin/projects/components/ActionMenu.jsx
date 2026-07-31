import React from "react";
import {
  MoreVertical,
  FolderGit2,
  Rocket,
  Globe,
  Archive,
  Trash2,
} from "lucide-react";
import Dropdown from "../../../../components/ui/Dropdown";

export default function ActionMenu({
  project,
  onView,
  onOpenDeployments,
  onOpenDomains,
  onArchive,
  onDelete,
}) {
  const menuItems = [
    {
      id: "view",
      label: "View Project",
      icon: <FolderGit2 className="w-4 h-4" />,
      onClick: (e) => {
        e.stopPropagation();
        onView(project);
      },
    },
    {
      id: "deployments",
      label: "Open Deployments",
      icon: <Rocket className="w-4 h-4" />,
      onClick: (e) => {
        e.stopPropagation();
        onOpenDeployments(project);
      },
    },
    {
      id: "domains",
      label: "Open Domains",
      icon: <Globe className="w-4 h-4" />,
      onClick: (e) => {
        e.stopPropagation();
        onOpenDomains(project);
      },
    },
    { divider: true },
    {
      id: "archive",
      label: "Archive Project",
      icon: <Archive className="w-4 h-4" />,
      disabled: project.status === "archived",
      onClick: (e) => {
        e.stopPropagation();
        onArchive(project);
      },
    },
    { divider: true },
    {
      id: "delete",
      label: "Delete Project",
      icon: <Trash2 className="w-4 h-4" />,
      danger: true,
      onClick: (e) => {
        e.stopPropagation();
        onDelete(project);
      },
    },
  ];

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dropdown
        trigger={
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        }
        items={menuItems}
        align="right"
        width="w-48"
      />
    </div>
  );
}
