import { useState, useEffect, useCallback } from "react";
import * as domainsService from "../services/domainsService";
import { useAdminTable } from "../../shared/hooks/useAdminTable";

export function useDomains() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchDomainsData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const data = await domainsService.getDomains();
      setDomains(data);
    } catch (err) {
      setError(err.message || "Failed to fetch domains");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDomainsData();
  }, [fetchDomainsData]);

  const handleVerifyDomain = async (id) => {
    await domainsService.verifyDomain(id);
    await fetchDomainsData(true);
  };

  const handleRefreshDomain = async (id) => {
    await domainsService.refreshDomain(id);
    await fetchDomainsData(true);
  };

  const handleRemoveDomain = async (id) => {
    await domainsService.removeDomain(id);
    await fetchDomainsData(true);
  };

  // Setup table features
  // Using itemsPerPage 1000 to allow DomainsTable to handle its own pagination
  const table = useAdminTable({
    data: domains,
    searchKeys: ["name", "project", "owner"],
    initialSort: { key: "name", direction: "asc" },
    itemsPerPage: 1000,
  });

  const activeFilter = table.filters.state.customFilterId || "all";

  const setActiveFilter = (val) => {
    table.filters.clear();
    if (val === "all") {
      table.filters.update("customFilterId", "all");
    } else if (val === "ssl-expiring") {
      table.filters.update("sslStatus", "expiring");
      table.filters.update("customFilterId", "ssl-expiring");
    } else {
      table.filters.update("verificationStatus", val);
      table.filters.update("customFilterId", val);
    }
  };

  const counts = domains.reduce(
    (acc, d) => {
      acc.all++;
      if (acc[d.verificationStatus] !== undefined) acc[d.verificationStatus]++;
      if (d.sslStatus === "expiring") acc["ssl-expiring"]++;
      return acc;
    },
    {
      all: 0,
      verified: 0,
      pending: 0,
      failed: 0,
      "ssl-expiring": 0,
    }
  );

  return {
    domains,
    loading,
    refreshing,
    error,
    activeFilter,
    setActiveFilter,
    counts,
    refresh: fetchDomainsData,
    actions: {
      verifyDomain: handleVerifyDomain,
      refreshDomain: handleRefreshDomain,
      removeDomain: handleRemoveDomain,
    },
    table,
  };
}
