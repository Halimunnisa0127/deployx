import React, { useState, useEffect, useMemo } from "react";
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
import {
  getDomains,
  verifyDomain,
  refreshDomain,
  removeDomain,
} from "../services/domains.service";

export default function DomainsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [domains, setDomains] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [domainToRemove, setDomainToRemove] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const data = await getDomains();
      setDomains(data);
    } catch (error) {
      console.error("Failed to load domains:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const counts = useMemo(() => {
    const res = {
      all: domains.length,
      verified: 0,
      pending: 0,
      failed: 0,
      "ssl-expiring": 0,
    };
    domains.forEach((d) => {
      if (res[d.verificationStatus] !== undefined) res[d.verificationStatus]++;
      if (d.sslStatus === "expiring") res["ssl-expiring"]++;
    });
    return res;
  }, [domains]);

  const filteredDomains = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return domains.filter((d) => {
      if (activeFilter === "ssl-expiring" && d.sslStatus !== "expiring")
        return false;
      if (
        activeFilter !== "all" &&
        activeFilter !== "ssl-expiring" &&
        d.verificationStatus !== activeFilter
      )
        return false;
      if (query) {
        return (
          d.name.toLowerCase().includes(query) ||
          d.project.toLowerCase().includes(query) ||
          d.owner.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [domains, activeFilter, searchQuery]);

  const handleRowClick = (domain) => {
    setSelectedDomain(domain);
    setIsDrawerOpen(true);
  };

  const handleVerify = async (domain) => {
    await verifyDomain(domain.id);
    fetchData(true);
  };

  const handleRefreshDNS = async (domain) => {
    await refreshDomain(domain.id);
    alert("DNS records refreshed successfully.");
    fetchData(true);
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
    await removeDomain(domainToRemove.id);
    if (selectedDomain?.id === domainToRemove.id) setIsDrawerOpen(false);
    setIsModalOpen(false);
    setDomainToRemove(null);
    fetchData(true);
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
        onRefresh={() => fetchData(true)}
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
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
      ) : filteredDomains.length === 0 ? (
        activeFilter === "pending" ? (
          <NoPendingDomainsEmptyState onClear={() => setActiveFilter("all")} />
        ) : activeFilter === "failed" ? (
          <NoFailedDomainsEmptyState onClear={() => setActiveFilter("all")} />
        ) : (
          <NoSearchResultsEmptyState
            onClear={() => {
              setSearchQuery("");
              setActiveFilter("all");
            }}
          />
        )
      ) : (
        <DomainsTable
          domains={filteredDomains}
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
