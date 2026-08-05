import React from "react";
import { Layers, Users, Activity } from "lucide-react";
import EmptyState from "../../../components/ui/EmptyState";

export function NoDeploymentsEmptyState() {
  return (
    <EmptyState
      icon={Layers}
      title="No Deployments Found"
      description="There are no recent deployments to display on the platform."
      primaryAction={{ label: "Trigger Deployment" }}
    />
  );
}

export function NoUsersEmptyState() {
  return (
    <EmptyState
      icon={Users}
      title="No Users Found"
      description="There are no recent users to display on the platform."
      primaryAction={{ label: "Invite User" }}
    />
  );
}

export function NoActivityEmptyState() {
  return (
    <EmptyState
      icon={Activity}
      title="No Activity"
      description="There has been no recent activity recorded on the platform."
      minHeight="h-full"
    />
  );
}


