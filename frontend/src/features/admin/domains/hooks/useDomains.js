import { useState, useEffect, useCallback, useMemo } from "react";
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

  const [activeFilter, setActiveFilter] = useState("all");

  const filteredDomains = useMemo(() => {
    return (domains || []).filter((d) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "ssl-expiring") {
        return d.sslStatus === "expiring" || d.ssl?.status === "expiring";
      }
      const vStatus = (d.verificationStatus || d.status || "").toLowerCase();
      return vStatus === activeFilter.toLowerCase();
    });
  }, [domains, activeFilter]);

  const counts = useMemo(() => {
    return (domains || []).reduce(
      (acc, d) => {
        acc.all++;
        const vStatus = (d.verificationStatus || d.status || "").toLowerCase();
        if (acc[vStatus] !== undefined) acc[vStatus]++;
        if (d.sslStatus === "expiring" || d.ssl?.status === "expiring") {
          acc["ssl-expiring"]++;
        }
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
  }, [domains]);

  // Setup table features
  const table = useAdminTable({
    data: filteredDomains,
    searchKeys: [
      "name",
      "hostname",
      "project",
      "project.name",
      "project.slug",
      "owner",
      "owner.fullName",
      "ownerEmail",
      "owner.email",
    ],
    initialSort: { key: "name", direction: "asc" },
    itemsPerPage: 1000,
  });

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
