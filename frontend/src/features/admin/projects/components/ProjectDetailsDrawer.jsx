import React from "react";
import Drawer from "../../../../components/ui/Drawer";
import {
  User,
  Calendar,
  Shield,
  FolderGit2,
  Rocket,
  Globe,
  GitBranch,
  Archive,
  Eye,
} from "lucide-react";
import Badge from "../../../../components/ui/Badge";
import FrameworkBadge from "./FrameworkBadge";
import Button from "../../../../components/ui/Button";

export default function ProjectDetailsDrawer({
  isOpen,
  onClose,
  project,
  onView,
  onOpenDeployments,
  onOpenDomains,
  onArchive,
}) {
  if (!project) return null;
  const isArchived = project.status === "archived";

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Project Details"
      width="w-full md:w-[450px]"
    >
      <div className="p-6 space-y-8">
        {/* Project Info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0">
            <FolderGit2 className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{project.name}</h2>
            <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-1">
              <Globe className="w-3.5 h-3.5" />
              {project.connectedDomain}
            </p>
          </div>
        </div>

        {/* Status & Framework Badges */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border flex flex-col gap-2">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5" /> Framework
            </span>
            <div>
              <FrameworkBadge framework={project.framework} />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border flex flex-col gap-2">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Status
            </span>
            <div>
              <Badge status={project.status} type="project" />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <User className="w-4 h-4" /> Owner
            </span>
            <span className="text-sm font-medium text-foreground">
              {project.owner}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Created
            </span>
            <span className="text-sm font-medium text-foreground">
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Updated
            </span>
            <span className="text-sm font-medium text-foreground">
              {new Date(project.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <GitBranch className="w-4 h-4" /> Environment
            </span>
            <span className="text-sm font-medium text-foreground capitalize">
              {project.environment}
            </span>
          </div>
        </div>

        {/* Repository */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
            <GitBranch className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> Repository
          </h3>
          <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-border p-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground truncate">
                {project.repository}
              </p>
            </div>
            <a
              href={`https://${project.repository}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 text-xs font-medium"
            >
              View
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-border grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            iconLeft={<Eye className="w-4 h-4" />}
            onClick={() => onView(project)}
            className="w-full"
          >
            View Project
          </Button>
          <Button
            variant="secondary"
            iconLeft={<Rocket className="w-4 h-4" />}
            onClick={() => onOpenDeployments(project)}
            className="w-full"
          >
            Deployments
          </Button>
          <Button
            variant="secondary"
            iconLeft={<Globe className="w-4 h-4" />}
            onClick={() => onOpenDomains(project)}
            className="w-full"
          >
            Domains
          </Button>
          <Button
            variant="secondary"
            iconLeft={<Archive className="w-4 h-4" />}
            onClick={() => onArchive(project)}
            disabled={isArchived}
            className={`w-full ${!isArchived ? "text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20" : ""}`}
          >
            Archive Project
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
