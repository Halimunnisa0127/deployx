import { useState } from "react";
import DomainsHeader from "../components/DomainsHeader";
import AnalyticsCards from "../components/AnalyticsCards";
import DomainsFilters from "../components/DomainsFilters";
import DomainsTable from "../components/DomainsTable";
import DomainDetailsDrawer from "../components/DomainDetailsDrawer";
import ConfirmationDialog from "../../../../components/ui/ConfirmationDialog";
import {
  DomainsTableSkeleton,
  DomainsStatisticsSkeleton as AnalyticsSkeleton,
} from "../components/DomainsSkeleton";
import {
  NoDomainsEmptyState,
  NoSearchResultsEmptyState,
  NoPendingDomainsEmptyState,
  NoFailedDomainsEmptyState,
} from "../components/DomainsEmptyState";
import SearchBar from "../../../../components/common/SearchBar";
import { useDomains } from "../hooks/useDomains";

export default function DomainsPage() {
  const {
    domains,
    loading,
    refreshing,
    activeFilter,
    setActiveFilter,
    counts,
    refresh,
    actions,
    table,
  } = useDomains();

  const [selectedDomain, setSelectedDomain] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [domainToRemove, setDomainToRemove] = useState(null);

  const handleRowClick = (domain) => {
    setSelectedDomain(domain);
    setIsDrawerOpen(true);
  };

  const handleVerify = async (domain) => {
    await actions.verifyDomain(domain.id);
  };

  const handleRefreshDNS = async (domain) => {
    await actions.refreshDomain(domain.id);
    alert("DNS records refreshed successfully.");
  };

  const handleOpenProject = (domain) => {
    console.log("Open project for", domain.project);
  };

  const confirmRemove = (domain) => {
    setDomainToRemove(domain);
    setIsModalOpen(true);
  };

  const executeRemove = async () => {
    if (!domainToRemove) return;
    await actions.removeDomain(domainToRemove.id);
    if (selectedDomain?.id === domainToRemove.id) setIsDrawerOpen(false);
    setIsModalOpen(false);
    setDomainToRemove(null);
  };

  const actionHandlers = {
    onViewDetails: handleRowClick,
    onVerify: handleVerify,
    onRefreshDNS: handleRefreshDNS,
    onOpenProject: handleOpenProject,
    onRemove: confirmRemove,
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-10 text-left animate-in fade-in duration-300">
      <DomainsHeader
        onRefresh={() => refresh(true)}
        isRefreshing={refreshing}
      />

      {/* Top Statistics */}
      {loading && !refreshing ? (
        <AnalyticsSkeleton />
      ) : (
        <AnalyticsCards domains={domains} />
      )}

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <DomainsFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />

        <SearchBar
          value={table.search.query}
          onChange={(e) => table.search.setQuery(e.target.value)}
          onClear={() => table.search.setQuery("")}
          placeholder="Search by domain, project, or owner..."
          shortcut="⌘K"
          size="md"
          className="w-full sm:w-80 shrink-0"
        />
      </div>

      {/* Table / Empty States */}
      {loading && !refreshing ? (
        <DomainsTableSkeleton />
      ) : domains.length === 0 ? (
        <NoDomainsEmptyState />
      ) : table.tableData.length === 0 ? (
        activeFilter === "pending" ? (
          <NoPendingDomainsEmptyState onClear={() => setActiveFilter("all")} />
        ) : activeFilter === "failed" ? (
          <NoFailedDomainsEmptyState onClear={() => setActiveFilter("all")} />
        ) : (
          <NoSearchResultsEmptyState
            onClear={() => {
              table.search.setQuery("");
              setActiveFilter("all");
            }}
          />
        )
      ) : (
        <DomainsTable
          domains={table.tableData}
          onRowClick={handleRowClick}
          actionHandlers={actionHandlers}
        />
      )}

      {/* Deep Dive Drawer */}
      <DomainDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        domain={selectedDomain}
        {...actionHandlers}
      />

      {/* Destructive Action Modal */}
      <ConfirmationDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={executeRemove}
        title="Remove Domain"
        message={`Are you sure you want to remove ${domainToRemove?.name}? This action cannot be undone and will immediately take the domain offline.`}
        confirmText="Remove Domain"
        isDanger={true}
      />
    </div>
  );
}
