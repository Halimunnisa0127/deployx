import React from "react";
import { Users, Search, ShieldOff, CheckCircle } from "lucide-react";
import EmptyState from "../../../../components/ui/EmptyState";

export function NoUsersEmptyState({ onAddUser }) {
  return (
    <EmptyState
      icon={Users}
      title="No Users Found"
      description="You don't have any users in your platform yet. Start by inviting a new user."
      primaryAction={{
        label: "Invite User",
        onClick: onAddUser,
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
      description="No users matched your search or filter criteria. Try adjusting them."
      secondaryAction={{
        label: "Clear Filters",
        onClick: onClear,
      }}
      minHeight=""
      className="p-10"
    />
  );
}

export function NoActiveUsersEmptyState({ onClear }) {
  return (
    <EmptyState
      icon={CheckCircle}
      title="No Active Users"
      description="There are currently no active users on the platform."
      secondaryAction={{
        label: "Clear Filters",
        onClick: onClear,
      }}
      minHeight=""
      className="p-10"
    />
  );
}

export function NoSuspendedUsersEmptyState({ onClear }) {
  return (
    <EmptyState
      icon={ShieldOff}
      title="No Suspended Users"
      description="There are currently no suspended users on the platform."
      secondaryAction={{
        label: "Clear Filters",
        onClick: onClear,
      }}
      minHeight=""
      className="p-10"
    />
  );
}
