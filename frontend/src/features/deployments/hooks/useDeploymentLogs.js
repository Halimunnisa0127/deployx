import { useState, useEffect, useCallback, useRef } from 'react';
import { deploymentsApi } from '../api/deploymentsApi';

export function useDeploymentLogs(deploymentId, status) {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isPollingRef = useRef(false);

  const fetchLogs = useCallback(async (showLoading = false) => {
    if (!deploymentId) return;
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      setError(null);
      
      const response = await deploymentsApi.getDeploymentLogs(deploymentId, 1, 10000);
      const rawLogs = response.data?.logs || [];
      
      const mappedLogs = rawLogs.map(log => {
        let timeStr = '';
        if (log.timestamp) {
          try {
            timeStr = new Date(log.timestamp).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            });
          } catch (e) {
            // Ignore format error
          }
        }
        return {
          id: log.sequence || log._id,
          type: log.level || 'info',
          time: timeStr,
          text: log.message || '',
        };
      });
      
      setLogs(mappedLogs);
    } catch (err) {
      console.error("Failed to fetch logs", err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch logs');
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, [deploymentId]);

  // Initial load
  useEffect(() => {
    fetchLogs(true);
  }, [fetchLogs]);

  // Polling loop for active builds (queued / building)
  useEffect(() => {
    if (!deploymentId) return;
    
    const isBuilding = ['queued', 'building', 'in_progress'].includes(status);
    if (!isBuilding) {
      isPollingRef.current = false;
      return;
    }

    isPollingRef.current = true;
    
    const interval = setInterval(() => {
      if (isPollingRef.current) {
        fetchLogs(false);
      }
    }, 3000);

    return () => {
      isPollingRef.current = false;
      clearInterval(interval);
    };
  }, [deploymentId, status, fetchLogs]);

  return {
    logs,
    isLoading,
    error,
    refetch: () => fetchLogs(true),
  };
}
