import React from "react";
import { Globe, Search, ShieldCheck, AlertCircle } from "lucide-react";
import EmptyState from "../../../../components/ui/EmptyState";

export function NoDomainsEmptyState({ onAddDomain }) {
  return (
    <EmptyState
      icon={Globe}
      title="No Domains Found"
      description="You don't have any custom domains yet. Start by connecting a new domain."
      primaryAction={{
        label: "Connect Domain",
        onClick: onAddDomain,
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
      description="No domains matched your search or filter criteria. Try adjusting them."
      secondaryAction={{
        label: "Clear Filters",
        onClick: onClear,
      }}
      minHeight=""
      className="p-10"
    />
  );
}

export function NoActiveDomainsEmptyState({ onClear }) {
  return (
    <EmptyState
      icon={ShieldCheck}
      title="No Active Domains"
      description="There are currently no active domains on the platform."
      secondaryAction={{
        label: "Clear Filters",
        onClick: onClear,
      }}
      minHeight=""
      className="p-10"
    />
  );
}

export function NoPendingDomainsEmptyState({ onClear }) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="No Pending Domains"
      description="There are no domains pending verification or configuration."
      secondaryAction={{
        label: "Clear Filters",
        onClick: onClear,
      }}
      minHeight=""
      className="p-10"
    />
  );
}
