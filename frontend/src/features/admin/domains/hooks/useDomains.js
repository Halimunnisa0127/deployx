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
      setDomains(Array.isArray(data) ? data : (data?.domains || []));
    } catch (err) {
      console.error("Failed to fetch domains:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch domains");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    domainsService.getDomains()
      .then((data) => {
        if (!ignore) {
          setDomains(Array.isArray(data) ? data : (data?.domains || []));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Failed to fetch domains:", err);
          setError(err.response?.data?.message || err.message || "Failed to fetch domains");
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const handleVerifyDomain = async (id) => {
    try {
      const res = await domainsService.verifyDomain(id);
      await fetchDomainsData(true);
      return res;
    } catch (err) {
      console.error("Failed to verify domain:", err);
      alert(err.response?.data?.message || err.message || "Domain verification failed");
    }
  };

  const handleRefreshDomain = async (id) => {
    try {
      const res = await domainsService.refreshDomain(id);
      await fetchDomainsData(true);
      return res;
    } catch (err) {
      console.error("Failed to refresh domain:", err);
      alert(err.response?.data?.message || err.message || "Failed to refresh domain records");
    }
  };

  const handleRemoveDomain = async (id) => {
    try {
      await domainsService.removeDomain(id);
      await fetchDomainsData(true);
    } catch (err) {
      console.error("Failed to remove domain:", err);
      alert(err.response?.data?.message || err.message || "Failed to remove domain");
    }
  };

  // Setup table features
  const table = useAdminTable({
    data: domains,
    searchKeys: ["name", "hostname", "project", "owner"],
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

  const counts = (domains || []).reduce(
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
