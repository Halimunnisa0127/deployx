import { useState, useEffect, useMemo, useCallback } from 'react';
import { deploymentsService } from '../services/deploymentsService';
import { useAdminTable } from '../../shared/hooks/useAdminTable';

export function useDeployments() {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDeployments = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const data = await deploymentsService.getDeployments();
      setDeployments(data);
    } catch (error) {
      console.error("Failed to load deployments:", error);
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

  const { search, filters, tableData } = tableParams;

  // Emulate the activeFilter logic from Page
  const activeFilter = filters.state.status || 'all';
  const setActiveFilter = (val) => filters.update('status', val);

  // Re-apply the special active filter logic since useAdminTable's default filter 
  // might just do direct equality, but 'all' needs special handling.
  // Wait, useFilters in useAdminTable probably handles generic filtering. Let's provide a custom filtered list just to be safe, 
  // or use tableParams's filteredData. Actually, in DeploymentsPage it was:
  // if (activeFilter !== "all" && d.status !== activeFilter) return false;
  // If useAdminTable does exact match, 'status: all' might filter out everything. 
  // Let's implement filteredDeployments here properly to match DeploymentsPage.

  const filteredDeployments = useMemo(() => {
    const query = search.query.trim().toLowerCase();
    return deployments.filter((d) => {
      if (activeFilter !== "all" && d.status !== activeFilter) return false;
      if (query) {
        return (
          d.project.toLowerCase().includes(query) ||
          d.owner.toLowerCase().includes(query) ||
          d.id.toLowerCase().includes(query) ||
          d.latestCommit.toLowerCase().includes(query)
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
    }
  };

  const handleRedeploy = async (id) => {
    await deploymentsService.redeployDeployment(id);
    fetchDeployments(true);
  };

  const cancelDeployment = async (id) => {
    await deploymentsService.cancelDeployment(id);
    fetchDeployments(true);
  };

  const deleteDeployment = async (id) => {
    await deploymentsService.deleteDeployment(id);
    fetchDeployments(true);
  };

  return {
    loading,
    refreshing,
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
    // Add pagination or sort if needed
  };
}
