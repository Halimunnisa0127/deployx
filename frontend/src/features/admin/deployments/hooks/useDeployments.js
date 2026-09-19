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
    let ignore = false;
    deploymentsService.getDeployments()
      .then((data) => {
        if (!ignore) {
          setDeployments(Array.isArray(data) ? data : (data?.deployments || []));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Failed to load deployments:", err);
          setError(err.response?.data?.message || err.message || "Failed to load deployments");
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const normalizeStatus = (status) => {
    if (!status) return 'unknown';
    const s = String(status).toLowerCase();
    if (s === 'ready' || s === 'success') return 'success';
    if (s === 'building' || s === 'deploying' || s === 'running') return 'running';
    if (s === 'queued' || s === 'pending') return 'queued';
    if (s === 'failed' || s === 'error') return 'failed';
    if (s === 'canceled' || s === 'cancelled') return 'cancelled';
    return s;
  };

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
      const norm = normalizeStatus(d.status);
      if (res[norm] !== undefined) res[norm]++;
    });
    return res;
  }, [deployments]);

  const tableParams = useAdminTable({
    data: deployments,
    searchKeys: ['id', '_id', 'project', 'projectName', 'owner', 'ownerEmail', 'latestCommit', 'commit', 'branch', 'environment'],
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
      const norm = normalizeStatus(d.status);
      if (activeFilter !== "all" && norm !== activeFilter && d.status !== activeFilter) {
        return false;
      }
      if (query) {
        const idStr = String(d.id || d._id || '').toLowerCase();
        const projectStr = String(d.project || d.projectName || '').toLowerCase();
        const ownerStr = String(d.owner || d.ownerEmail || '').toLowerCase();
        const commitStr = String(d.latestCommit || d.commit || d.commitMessage || '').toLowerCase();
        const branchStr = String(d.branch || '').toLowerCase();
        const envStr = String(d.environment || '').toLowerCase();

        return (
          projectStr.includes(query) ||
          ownerStr.includes(query) ||
          idStr.includes(query) ||
          commitStr.includes(query) ||
          branchStr.includes(query) ||
          envStr.includes(query)
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
