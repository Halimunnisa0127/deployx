import { useState, useEffect, useMemo, useCallback } from 'react';
import { deploymentsApi } from '../api/deploymentsApi';
import { deploymentsService } from '../services/deploymentsService';

export function useDeployments() {
  const [deployments, setDeployments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchDeployments = async () => {
      try {
        setIsLoading(true);
        const data = await deploymentsApi.getDeployments();
        if (mounted) setDeployments(data);
      } catch (err) {
        console.error("Failed to fetch deployments", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchDeployments();
    return () => { mounted = false; };
  }, []);

  const statusCounts = useMemo(() => {
    return deploymentsService.getDeploymentCounts(deployments);
  }, [deployments]);

  const filteredDeployments = useMemo(() => {
    return deploymentsService.filterDeployments(deployments, { activeTab, searchQuery });
  }, [deployments, activeTab, searchQuery]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setActiveTab('all');
  }, []);

  const handleRedeploy = useCallback((deployment) => {
    setNotification({
      type: 'success',
      message: `Triggered redeployment for ${deployment.projectName} (${deployment.id})`,
    });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  return {
    deployments: filteredDeployments,
    totalDeployments: deployments.length,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    isLoading,
    notification,
    setNotification,
    statusCounts,
    handleResetFilters,
    handleRedeploy
  };
}
