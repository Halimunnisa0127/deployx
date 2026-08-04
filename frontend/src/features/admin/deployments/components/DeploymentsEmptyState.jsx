import React from "react";
import { Rocket, Search, AlertCircle, PlayCircle } from "lucide-react";
import EmptyState from "../../../../components/ui/EmptyState";

export function NoDeploymentsEmptyState({ onDeploy }) {
  return (
    <EmptyState
      icon={Rocket}
      title="No Deployments Found"
      description="You don't have any deployments yet. Start by triggering a new deployment for your project."
      primaryAction={{
        label: "Deploy Now",
        onClick: onDeploy,
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
      description="No deployments matched your search or filter criteria. Try adjusting them."
      secondaryAction={{
        label: "Clear Filters",
        onClick: onClear,
      }}
      minHeight=""
      className="p-10"
    />
  );
}

export function NoFailedDeploymentsEmptyState({ onClear }) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="No Failed Deployments"
      description="Great! There are no failed deployments in the selected timeframe."
      secondaryAction={{
        label: "Clear Filters",
        onClick: onClear,
      }}
      minHeight=""
      className="p-10"
    />
  );
}

export function NoActiveDeploymentsEmptyState({ onClear }) {
  return (
    <EmptyState
      icon={PlayCircle}
      title="No Active Deployments"
      description="There are currently no deployments in progress."
      secondaryAction={{
        label: "Clear Filters",
        onClick: onClear,
      }}
      minHeight=""
      className="p-10"
    />
  );
}
