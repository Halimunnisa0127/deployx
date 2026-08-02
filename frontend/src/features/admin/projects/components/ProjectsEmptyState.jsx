import React from "react";
import { FolderGit2, Search, Archive, CheckCircle } from "lucide-react";
import EmptyState from "../../../../components/ui/EmptyState";

export function NoProjectsEmptyState({ onCreateProject }) {
  return (
    <EmptyState
      icon={FolderGit2}
      title="No Projects Found"
      description="You don't have any projects in your platform yet. Start by creating a new project."
      primaryAction={{
        label: "Create Project",
        onClick: onCreateProject,
      }}
      minHeight=""
      className="p-10"
    />
  );
}

export function NoSearchResultsEmptyState({ onClear }) {
  return (
    <EmptyState
      icon={Search}
      title="No Results Found"
      description="No projects matched your search or filter criteria. Try adjusting them."
      secondaryAction={{
        label: "Clear Filters",
        onClick: onClear,
      }}
      minHeight=""
      className="p-10"
    />
  );
}

export function NoActiveProjectsEmptyState({ onClear }) {
  return (
    <EmptyState
      icon={CheckCircle}
      title="No Active Projects"
      description="There are currently no active projects on the platform."
      secondaryAction={{
        label: "Clear Filters",
        onClick: onClear,
      }}
      minHeight=""
      className="p-10"
    />
  );
}

export function NoArchivedProjectsEmptyState({ onClear }) {
  return (
    <EmptyState
      icon={Archive}
      title="No Archived Projects"
      description="There are currently no archived projects on the platform."
      secondaryAction={{
        label: "Clear Filters",
        onClick: onClear,
      }}
      minHeight=""
      className="p-10"
    />
  );
}
