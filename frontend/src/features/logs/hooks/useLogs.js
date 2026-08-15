import { useState, useEffect, useCallback, useMemo } from 'react';
import { logsApi } from '../api/logsApi';
import { logsService } from '../services/logsService';

export function useLogs() {
  const [logs, setLogs] = useState([]);
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);
  const [copied, setCopied] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load
  useEffect(() => {
    let mounted = true;
    const fetchInitial = async () => {
      try {
        setIsLoading(true);
        const data = await logsApi.getInitialLogs();
        if (mounted) setLogs(data);
      } catch (err) {
        console.error("Failed to fetch initial logs", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchInitial();
    return () => { mounted = false; };
  }, []);

  // Streaming logic
  useEffect(() => {
    if (!isStreaming) return;

    let mounted = true;
    const interval = setInterval(async () => {
      try {
        const randomLog = await logsApi.getStreamEvent();
        if (mounted) {
          const now = new Date();
          const timeString = now.toTimeString().split(' ')[0];
          setLogs((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              project: randomLog.project,
              level: randomLog.level,
              timestamp: timeString,
              message: randomLog.message,
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to stream event", err);
      }
    }, 3500);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [isStreaming]);

  // Derived state via service
  const filteredLogs = useMemo(
    () => logsService.filterLogs(logs, { selectedProject, selectedLevel, searchQuery }),
    [logs, selectedProject, selectedLevel, searchQuery]
  );

  const { errorCount, warningCount, successCount } = useMemo(
    () => logsService.getLogCounts(logs),
    [logs]
  );

  // Handlers
  const handleCopyLogs = useCallback(() => {
    const text = logsService.formatLogsForExport(filteredLogs);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [filteredLogs]);

  const handleDownloadLogs = useCallback(() => {
    const text = logsService.formatLogsForExport(filteredLogs);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `deployx-logs-${Date.now()}.log`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredLogs]);

  const handleClearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const handleResetLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await logsApi.getInitialLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    logs,
    filteredLogs,
    selectedProject,
    setSelectedProject,
    selectedLevel,
    setSelectedLevel,
    searchQuery,
    setSearchQuery,
    isStreaming,
    setIsStreaming,
    copied,
    autoScroll,
    setAutoScroll,
    isLoading,
    errorCount,
    warningCount,
    successCount,
    handleCopyLogs,
    handleDownloadLogs,
    handleClearLogs,
    handleResetLogs
  };
}
