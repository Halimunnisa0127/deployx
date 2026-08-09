import { useState, useEffect, useMemo, useCallback } from 'react';
import { deploymentsApi } from '../api/deploymentsApi';
import { deploymentsService } from '../services/deploymentsService';
import { useDeploymentMutations } from './useDeploymentMutations';

export function useDeployments(projectId = null) {
  const [deployments, setDeployments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const { createDeployment } = useDeploymentMutations();

  const fetchDeployments = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = projectId 
        ? await deploymentsApi.getProjectDeployments(projectId)
        : await deploymentsApi.getDeployments();
      
      // The API returns { success: true, data: { deployments: [...] } }
      const rawDeployments = data.data?.deployments || [];
      const mappedDeployments = rawDeployments.map(d => ({
        ...d,
        id: d._id,
        projectName: d.project?.name || '',
      }));
      setDeployments(mappedDeployments);
    } catch (err) {
      console.error("Failed to fetch deployments", err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchDeployments();
  }, [fetchDeployments]);

  const statusCounts = useMemo(() => {
    return deploymentsService.getDeploymentCounts(deployments);
  }, [deployments]);

  const filteredDeployments = useMemo(() => {
    return deploymentsService.filterDeployments(deployments, { activeTab, searchQuery });
  }, [deployments, activeTab, searchQuery]);

  const handleRedeploy = useCallback(async (deployment) => {
    try {
      if (!deployment?.project) return;
      const projId = typeof deployment.project === 'object' ? deployment.project._id : deployment.project;
      
      const newDeployment = await createDeployment({
        projectId: projId,
        environment: deployment.environment,
        branch: deployment.branch,
        commitHash: deployment.commitHash,
      });
      
      setNotification({
        type: 'success',
        message: `Triggered redeploy. New deployment ID: ${newDeployment.deploymentNumber}`,
      });
      fetchDeployments(); // refresh list
      setTimeout(() => setNotification(null), 4000);
    } catch (err) {
      setNotification({
        type: 'error',
        message: 'Failed to trigger redeploy',
      });
      setTimeout(() => setNotification(null), 4000);
    }
  }, [createDeployment, fetchDeployments]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setActiveTab('all');
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
    handleRedeploy,
    refetch: fetchDeployments,
  };
}
