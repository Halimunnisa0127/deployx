import { useState, useEffect, useCallback, useRef } from 'react';
import { deploymentsApi } from '../api/deploymentsApi';

export function useDeploymentDetails(id) {
  const [deployment, setDeployment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isMountedRef = useRef(true);
  const isFetchingRef = useRef(false);

  const fetchDeployment = useCallback(async () => {
    if (!id) return;
    if (isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;
      setError(null);
      const response = await deploymentsApi.getDeploymentDetails(id);
      if (!response || !response.data || !response.data.deployment) {
        throw new Error('Invalid response structure: deployment is undefined');
      }
      const rawDeployment = response.data.deployment;
      if (isMountedRef.current) {
        setDeployment({
          ...rawDeployment,
          id: rawDeployment._id,
          projectName: rawDeployment.project?.name || '',
        });
      }
    } catch (err) {
      console.error("Failed to fetch deployment details", err);
      if (isMountedRef.current) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch deployment');
      }
    } finally {
      isFetchingRef.current = false;
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    isMountedRef.current = true;
    setIsLoading(true);
    fetchDeployment();

    return () => {
      isMountedRef.current = false;
    };
  }, [id, fetchDeployment]);

  useEffect(() => {
    if (!id) return;

    const currentStatus = deployment?.status;
    const isActive = ['queued', 'building'].includes(currentStatus);

    if (!isActive) return;

    const interval = setInterval(() => {
      if (isMountedRef.current && !isFetchingRef.current) {
        fetchDeployment();
      }
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [id, deployment?.status, fetchDeployment]);

  return {
    deployment,
    isLoading,
    error,
    refetch: fetchDeployment,
  };
}
