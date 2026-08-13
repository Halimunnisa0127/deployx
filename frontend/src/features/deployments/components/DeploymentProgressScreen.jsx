import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Terminal,
  Check,
  Loader2,
  XCircle,
  ExternalLink,
  Copy,
  CheckCircle2,
  GitBranch,
  Folder,
  AlertCircle,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useDeploymentDetails } from '../hooks/useDeploymentDetails';
import { useDeploymentLogs } from '../hooks/useDeploymentLogs';

const DEPLOYMENT_STEPS = [
  { id: 1, name: 'Queued', statusKey: 'queued' },
  { id: 2, name: 'Building', statusKey: 'building' },
  { id: 3, name: 'Ready', statusKey: 'ready' },
];

export default function DeploymentProgressScreen({
  projectName = '',
  repository = '',
  branch = '',
  url = '',
  deploymentId,
  creationError,
  onCancel,
}) {
  const navigate = useNavigate();
  const [copiedLogs, setCopiedLogs] = useState(false);
  const logsEndRef = useRef(null);

  // Authoritative status and logs polling
  const { deployment, isLoading: isLoadingDetails, error: detailsError } = useDeploymentDetails(deploymentId);
  
  const displayProjectName = deployment?.projectName || deployment?.project?.name || projectName || 'Loading project...';
  const displayRepository = deployment?.source?.repositoryFullName || repository || 'Loading repository...';
  const displayBranch = deployment?.source?.branch || branch || 'Loading branch...';

  const currentStatus = creationError ? 'failed' : (deployment?.status || 'queued');
  const { logs, isLoading: isLoadingLogs, error: logsError } = useDeploymentLogs(deploymentId, currentStatus);

  // Auto-scroll logs terminal
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Handle Copy Logs
  const handleCopyLogs = () => {
    const textToCopy = logs.map((l) => `[${l.time || ''}] [${l.type.toUpperCase()}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopiedLogs(true);
    setTimeout(() => setCopiedLogs(false), 2000);
  };

  // Progress percentage mapping
  let progressPercent = 0;
  if (currentStatus === 'queued') progressPercent = 33;
  else if (currentStatus === 'building') progressPercent = 66;
  else if (['ready', 'failed', 'cancelled'].includes(currentStatus)) progressPercent = 100;

  // Status mappings
  const statusLabels = {
    queued: 'Queued',
    building: 'Building & Deploying',
    ready: 'Deployment Ready',
    failed: 'Deployment Failed',
    cancelled: 'Deployment Cancelled',
  };

  const currentStatusLabel = statusLabels[currentStatus] || 'Initializing...';

  // Navigate back/projects
  const handleGoToDashboard = () => {
    navigate('/dashboard/projects');
  };

  // Render initialization state when thunk hasn't resolved to a deployment ID yet
  if (!deploymentId && !creationError) {
    return (
      <div className="w-full max-w-4xl mx-auto py-20 text-center space-y-4 font-sans bg-card border border-border rounded-2xl shadow-xl">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Initializing project deployment...</h3>
        <p className="text-xs text-muted-foreground">Setting up database records and preparing build pipeline.</p>
      </div>
    );
  }

  // Render creation error state
  if (creationError) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 text-center space-y-6 font-sans bg-card border border-red-500/20 rounded-2xl shadow-xl">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-red-500">Failed to trigger deployment</h3>
          <p className="text-sm text-muted-foreground">{creationError}</p>
        </div>
        <Button variant="secondary" size="md" onClick={handleGoToDashboard}>
          Back to Projects
        </Button>
      </div>
    );
  }

  const realUrl = deployment?.url || url;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in font-sans selection:bg-blue-500 selection:text-white">
      {/* Header Info Banner */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {displayProjectName}
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${
                currentStatus === 'ready'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : ['failed', 'cancelled'].includes(currentStatus)
                  ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
              }`}
            >
              {currentStatus === 'ready' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Deployed
                </>
              ) : ['failed', 'cancelled'].includes(currentStatus) ? (
                <>
                  <XCircle className="w-3.5 h-3.5" />
                  {currentStatus === 'failed' ? 'Failed' : 'Cancelled'}
                </>
              ) : (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {currentStatus === 'queued' ? 'Queued' : 'Building & Deploying...'}
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1 font-mono text-muted-foreground">
              <Folder className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              {displayRepository}
            </span>
            <span className="flex items-center gap-1 font-mono text-muted-foreground">
              <GitBranch className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              {displayBranch}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {['queued', 'building'].includes(currentStatus) && (
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={onCancel}
            >
              Cancel Deployment
            </Button>
          )}

          {['ready', 'failed', 'cancelled'].includes(currentStatus) && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGoToDashboard}
            >
              Projects
            </Button>
          )}

          {currentStatus === 'ready' && realUrl && (
            <Button
              variant="primary"
              size="sm"
              href={realUrl}
              target="_blank"
              rel="noreferrer"
              iconRight={<ExternalLink className="w-4 h-4" />}
              className="shadow-lg shadow-blue-500/20"
            >
              Visit App
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar & Steps Tracker */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-xl backdrop-blur-xl space-y-5 text-left">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Deployment Progress
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {currentStatusLabel}
            </h3>
          </div>

          <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            {progressPercent}%
          </span>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-border p-0.5 relative">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              currentStatus === 'ready'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : ['failed', 'cancelled'].includes(currentStatus)
                ? 'bg-gradient-to-r from-red-500 to-rose-600'
                : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 animate-pulse'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 3 Steps Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
          {DEPLOYMENT_STEPS.map((step) => {
            const stepOrder = { queued: 1, building: 2, ready: 3, failed: 3, cancelled: 3 };
            const currentOrder = stepOrder[currentStatus] || 1;
            
            const isFinished = step.id < currentOrder || currentStatus === 'ready';
            const isCurrent = step.id === currentOrder && ['queued', 'building'].includes(currentStatus);
            const isFailed = ['failed', 'cancelled'].includes(currentStatus) && step.id === currentOrder;

            return (
              <div
                key={step.id}
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                  isFinished
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300'
                    : isCurrent
                    ? 'bg-blue-500/15 border-blue-500 text-blue-600 dark:text-blue-300 font-semibold ring-1 ring-blue-500/30'
                    : isFailed
                    ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
                    : 'bg-slate-50 dark:bg-slate-950/40 border-border text-muted-foreground opacity-60'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    isFinished
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-blue-500 text-white shadow-sm'
                      : isFailed
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-muted-foreground'
                  }`}
                >
                  {isFinished ? (
                    <Check className="w-3 h-3 stroke-[3]" />
                  ) : isCurrent ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : isFailed ? (
                    <XCircle className="w-3 h-3" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className="truncate text-sm font-medium">{step.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Logs Terminal Panel */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
        {/* Terminal Header */}
        <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-800 text-xs font-mono text-slate-300">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span>deployx-builder.log</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-slate-500">
              {logs.length} lines
            </span>
            <button
              type="button"
              onClick={handleCopyLogs}
              className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
              title="Copy Logs"
            >
              {copiedLogs ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Terminal Window Content */}
        <div className="p-4 font-mono text-xs text-slate-300 space-y-1.5 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 selection:bg-blue-500 selection:text-white">
          {isLoadingLogs && logs.length === 0 ? (
            <div className="text-slate-600 italic py-4 text-center">
              Loading deployment logs...
            </div>
          ) : logs.length === 0 ? (
            <div className="text-slate-600 italic py-4 text-center">
              Waiting for build runner to start...
            </div>
          ) : (
            logs.map((log, index) => {
              let tagColor = 'text-blue-400 bg-blue-500/10 border-blue-500/20';
              if (log.type === 'git') tagColor = 'text-purple-400 bg-purple-500/10 border-purple-500/20';
              if (log.type === 'deps') tagColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
              if (log.type === 'build') tagColor = 'text-sky-400 bg-sky-500/10 border-sky-500/20';
              if (log.type === 'ssl') tagColor = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
              if (log.type === 'success') tagColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
              if (log.type === 'error') tagColor = 'text-red-400 bg-red-500/10 border-red-500/20';

              return (
                <div key={index} className="flex items-start gap-2.5 leading-relaxed hover:bg-slate-900/40 p-0.5 rounded text-left">
                  <span className="text-slate-600 text-xs select-none flex-shrink-0 pt-0.5">
                    [{log.time || log.timestamp || ''}]
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-xs uppercase font-bold border flex-shrink-0 ${tagColor}`}
                  >
                    {log.type}
                  </span>
                  <span className="text-slate-200 break-all">{log.text}</span>
                </div>
              );
            })
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
}
