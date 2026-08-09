import { useState, useEffect, useCallback } from 'react';
import { deploymentsApi } from '../api/deploymentsApi';

export function useDeploymentDetails(id) {
  const [deployment, setDeployment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDeployment = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setError(null);
      const rawDeployment = response.data.deployment;
      setDeployment({
        ...rawDeployment,
        id: rawDeployment._id,
        projectName: rawDeployment.project?.name || '',
      });
    } catch (err) {
      console.error("Failed to fetch deployment details", err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch deployment');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDeployment();
  }, [fetchDeployment]);

  return {
    deployment,
    isLoading,
    error,
    refetch: fetchDeployment,
  };
}
