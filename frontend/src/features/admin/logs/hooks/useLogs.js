import { useState, useEffect } from 'react';
import { logsService } from '../services/logsService';
import { useAdminTable } from '../../shared/hooks/useAdminTable';

export function useLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const data = await logsService.getLogs();
      setLogs(data);
    } catch (err) {
      setError(err);
      console.error('Failed to load logs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const table = useAdminTable({
    data: logs,
    searchKeys: ['message', 'source'],
    initialFilters: { level: '' },
    initialSort: { key: 'timestamp', direction: 'desc' },
    itemsPerPage: 10,
  });

  return {
    loading,
    refreshing,
    error,
    fetchData,
    table,
  };
}
