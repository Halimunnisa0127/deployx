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
    let ignore = false;
    logsService.getLogs()
      .then((data) => {
        if (!ignore) {
          setLogs(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err);
          console.error('Failed to load logs:', err);
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
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
