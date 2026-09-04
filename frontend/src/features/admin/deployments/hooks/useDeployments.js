import { useState, useEffect, useMemo, useCallback } from 'react';
import { deploymentsService } from '../services/deploymentsService';
import { useAdminTable } from '../../shared/hooks/useAdminTable';

export function useDeployments() {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchDeployments = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const data = await deploymentsService.getDeployments();
      setDeployments(Array.isArray(data) ? data : (data?.deployments || []));
    } catch (err) {
      console.error("Failed to load deployments:", err);
      setError(err.response?.data?.message || err.message || "Failed to load deployments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDeployments();
  }, [fetchDeployments]);

  const counts = useMemo(() => {
    const res = {
      all: deployments.length,
      running: 0,
      queued: 0,
      success: 0,
      failed: 0,
      cancelled: 0,
    };
    deployments.forEach((d) => {
      if (res[d.status] !== undefined) res[d.status]++;
    });
    return res;
  }, [deployments]);

  const tableParams = useAdminTable({
    data: deployments,
    searchKeys: ['id', 'project', 'owner', 'latestCommit'],
    initialFilters: { status: 'all' },
    initialSort: { key: 'createdAt', direction: 'desc' },
    itemsPerPage: 10,
    idKey: 'id',
  });

  const { search, filters } = tableParams;

  const activeFilter = filters.state.status || 'all';
  const setActiveFilter = (val) => filters.update('status', val);

  const filteredDeployments = useMemo(() => {
    const query = search.query.trim().toLowerCase();
    return deployments.filter((d) => {
      if (activeFilter !== "all" && d.status !== activeFilter) return false;
      if (query) {
        return (
          (d.project && d.project.toLowerCase().includes(query)) ||
          (d.owner && d.owner.toLowerCase().includes(query)) ||
          (d.id && String(d.id).toLowerCase().includes(query)) ||
          (d.latestCommit && d.latestCommit.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [deployments, activeFilter, search.query]);

  const handleExport = async () => {
    try {
      await deploymentsService.exportDeployments('csv');
      alert("Deployments exported successfully!");
    } catch (error) {
      console.error("Failed to export deployments", error);
      alert(error.response?.data?.message || "Failed to export deployments");
    }
  };

  const handleRedeploy = async (id) => {
    try {
      await deploymentsService.redeployDeployment(id);
      await fetchDeployments(true);
    } catch (err) {
      console.error("Failed to trigger redeploy:", err);
      alert(err.response?.data?.message || err.message || "Failed to trigger redeploy");
    }
  };

  const cancelDeployment = async (id) => {
    try {
      await deploymentsService.cancelDeployment(id);
      await fetchDeployments(true);
    } catch (err) {
      console.error("Failed to cancel deployment:", err);
      alert(err.response?.data?.message || err.message || "Failed to cancel deployment");
    }
  };

  const deleteDeployment = async (id) => {
    try {
      await deploymentsService.deleteDeployment(id);
      await fetchDeployments(true);
    } catch (err) {
      console.error("Failed to delete deployment:", err);
      alert(err.response?.data?.message || err.message || "Failed to delete deployment");
    }
  };

  return {
    loading,
    refreshing,
    error,
    deployments,
    filteredDeployments,
    counts,
    activeFilter,
    setActiveFilter,
    searchQuery: search.query,
    setSearchQuery: search.setQuery,
    fetchData: fetchDeployments,
    handleExport,
    handleRedeploy,
    cancelDeployment,
    deleteDeployment,
  };
}
