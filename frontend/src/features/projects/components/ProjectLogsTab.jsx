import { useState, useEffect, useCallback } from 'react';
import { Terminal, Search, Copy, Check, RefreshCw, AlertCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { deploymentsApi } from '../../deployments/api/deploymentsApi';

export default function ProjectLogsTab({ project }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all'); // 'all' | 'info' | 'warn' | 'error'
  const [copied, setCopied] = useState(false);
  const [activeDeploymentId, setActiveDeploymentId] = useState(null);

  const fetchLogs = useCallback(async (isManualRefresh = false) => {
    const projectId = project?._id || project?.id;
    if (!projectId) return;

    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // 1. Identify deployment to fetch logs for
      let deploymentId = activeDeploymentId;
      if (!deploymentId) {
        const depRes = await deploymentsApi.getProjectDeployments(projectId);
        const projectDeployments = depRes?.data?.deployments || depRes?.data || [];
        if (projectDeployments.length > 0) {
          deploymentId = projectDeployments[0]._id || projectDeployments[0].id;
          setActiveDeploymentId(deploymentId);
        }
      }

      if (deploymentId) {
        const logsRes = await deploymentsApi.getDeploymentLogs(deploymentId, 1, 200);
        const rawLogs = logsRes?.data?.logs || [];
        const formatted = rawLogs.map((l) => ({
          id: l._id || l.id || `${l.sequence}-${l.createdAt}`,
          timestamp: l.createdAt ? new Date(l.createdAt).toLocaleTimeString() : '00:00:00',
          level: l.level === 'warning' ? 'warn' : l.level || 'info',
          type: l.type || 'build',
          message: l.message,
        }));
        setLogs(formatted);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.warn('Could not load live logs for project deployment:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [project, activeDeploymentId]);

  useEffect(() => {
    let ignore = false;
    const projectId = project?._id || project?.id;
    if (!projectId) {
      return;
    }

    const load = async () => {
      try {
        let deploymentId = activeDeploymentId;
        if (!deploymentId) {
          const depRes = await deploymentsApi.getProjectDeployments(projectId);
          const projectDeployments = depRes?.data?.deployments || depRes?.data || [];
          if (projectDeployments.length > 0) {
            deploymentId = projectDeployments[0]._id || projectDeployments[0].id;
            if (!ignore) setActiveDeploymentId(deploymentId);
          }
        }

        if (deploymentId) {
          const logsRes = await deploymentsApi.getDeploymentLogs(deploymentId, 1, 200);
          const rawLogs = logsRes?.data?.logs || [];
          const formatted = rawLogs.map((l) => ({
            id: l._id || l.id || `${l.sequence}-${l.createdAt}`,
            timestamp: l.createdAt ? new Date(l.createdAt).toLocaleTimeString() : '00:00:00',
            level: l.level === 'warning' ? 'warn' : l.level || 'info',
            type: l.type || 'build',
            message: l.message,
          }));
          if (!ignore) setLogs(formatted);
        } else {
          if (!ignore) setLogs([]);
        }
      } catch (err) {
        console.warn('Could not load live logs for project deployment:', err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [project, activeDeploymentId]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.type?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const handleCopyLogs = () => {
    const logText = filteredLogs
      .map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] [${l.type}] ${l.message}`)
      .join('\n');
    navigator.clipboard.writeText(logText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 animate-fade-in font-sans selection:bg-blue-500 selection:text-white">
      {/* Header Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search project logs..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/80 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 dark:bg-slate-950/80 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 transition-colors"
          />
        </div>

        {/* Filters & Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 bg-white/80 p-1 rounded-xl border border-slate-200 dark:bg-slate-950/80 dark:border-slate-800 text-xs">
            {['all', 'info', 'warn', 'error'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setFilterLevel(level)}
                className={`px-2.5 py-1 rounded-lg capitalize text-xs font-semibold transition-all ${
                  filterLevel === level
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => fetchLogs(true)}
            disabled={refreshing || loading}
            iconLeft={<RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />}
            className="text-xs"
          >
            Refresh
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleCopyLogs}
            disabled={filteredLogs.length === 0}
            iconLeft={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </div>

      {/* Real-time Logs Terminal Panel */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl font-mono text-xs">
        {/* Log Viewer Header */}
        <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span className="text-slate-200 font-semibold text-xs">Runtime & Build Logs</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              Live Stream
            </span>
          </div>
          <span className="text-sm text-slate-500">{filteredLogs.length} events logged</span>
        </div>

        {/* Log Lines Content */}
        <div className="p-4 space-y-2 max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
          {loading ? (
            <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
              <span>Fetching live logs...</span>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
              <AlertCircle className="w-6 h-6 text-slate-600 mb-1" />
              <p className="italic">No deployment logs available for this project yet.</p>
              <p className="text-xs text-slate-600">Trigger a new deployment to view build and runtime output in real-time.</p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              let badgeStyle = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
              if (log.level === 'warn') badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
              if (log.level === 'error') badgeStyle = 'bg-red-500/10 text-red-400 border-red-500/20';
              if (log.level === 'success') badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

              return (
                <div key={log.id} className="flex items-start gap-3 p-1.5 rounded hover:bg-slate-900/50 transition-colors">
                  <span className="text-slate-600 text-sm flex-shrink-0 pt-0.5">[{log.timestamp}]</span>
                  <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold border flex-shrink-0 ${badgeStyle}`}>
                    {log.level}
                  </span>
                  <span className="text-slate-500 text-xs font-semibold flex-shrink-0">[{log.type}]</span>
                  <span className="text-slate-200 break-all">{log.message}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
