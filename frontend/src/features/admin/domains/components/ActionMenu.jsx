import React from "react";
import {
  MoreVertical,
  Info,
  ShieldCheck,
  RefreshCcw,
  FolderGit2,
  Rocket,
  Trash2,
  Copy,
} from "lucide-react";
import Dropdown from "../../../../components/ui/Dropdown";

export default function ActionMenu({
  domain,
  onViewDetails,
  onVerify,
  onRefreshDNS,
  onOpenProject,
  onRemove,
}) {
  const isPending =
    domain.verificationStatus === "pending" ||
    domain.verificationStatus === "failed";

  const menuItems = [
    {
      id: "view",
      label: "View Details",
      icon: <Info className="w-4 h-4" />,
      onClick: (e) => {
        e.stopPropagation();
        onViewDetails(domain);
      },
    },
    {
      id: "verify",
      label: "Verify Domain",
      icon: <ShieldCheck className="w-4 h-4" />,
      disabled: !isPending,
      onClick: (e) => {
        e.stopPropagation();
        onVerify(domain);
      },
    },
    {
      id: "refresh",
      label: "Refresh DNS",
      icon: <RefreshCcw className="w-4 h-4" />,
      onClick: (e) => {
        e.stopPropagation();
        onRefreshDNS(domain);
      },
    },
    { divider: true },
    {
      id: "copy",
      label: "Copy Domain",
      icon: <Copy className="w-4 h-4" />,
      onClick: (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(domain.name);
      },
    },
    { divider: true },
    {
      id: "project",
      label: "Open Project",
      icon: <FolderGit2 className="w-4 h-4" />,
      onClick: (e) => {
        e.stopPropagation();
        onOpenProject(domain);
      },
    },
    {
      id: "deployments",
      label: "Open Deployments",
      icon: <Rocket className="w-4 h-4" />,
      onClick: (e) => {
        e.stopPropagation();
        onOpenProject(domain); // Uses same handler for now to simplify
      },
    },
    { divider: true },
    {
      id: "remove",
      label: "Remove Domain",
      icon: <Trash2 className="w-4 h-4" />,
      danger: true,
      onClick: (e) => {
        e.stopPropagation();
        onRemove(domain);
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
        width="w-56"
      />
    </div>
  );
}
