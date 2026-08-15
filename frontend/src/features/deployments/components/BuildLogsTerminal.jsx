import { useState, useEffect, useRef, memo } from 'react';
import BuildLogToolbar from './BuildLogToolbar';
import BuildLogLine from './BuildLogLine';
import BuildLogsEmptyState from './BuildLogsEmptyState';
import BuildLogsSkeleton from './BuildLogsSkeleton';
import { AlertTriangle, XCircle, Clock, RotateCcw } from 'lucide-react';

const STATUS_STYLES = {
  queued: {
    label: 'Queued',
    classes: 'bg-slate-500/10 border-slate-500/20 text-slate-600 dark:text-slate-400',
    dotClasses: 'bg-slate-500 dark:bg-slate-400'
  },
  building: {
    label: 'Building',
    classes: 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
    dotClasses: 'bg-blue-500 dark:bg-blue-400 animate-pulse'
  },
  in_progress: {
    label: 'Building',
    classes: 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
    dotClasses: 'bg-blue-500 dark:bg-blue-400 animate-pulse'
  },
  ready: {
    label: 'Ready',
    classes: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    dotClasses: 'bg-emerald-500 dark:bg-emerald-400'
  },
  success: {
    label: 'Ready',
    classes: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    dotClasses: 'bg-emerald-500 dark:bg-emerald-400'
  },
  failed: {
    label: 'Failed',
    classes: 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400',
    dotClasses: 'bg-rose-500 dark:bg-rose-400'
  },
  cancelled: {
    label: 'Cancelled',
    classes: 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400',
    dotClasses: 'bg-red-500 dark:bg-red-400'
  }
};

function BuildLogsTerminal({
  logs: initialLogs = [],
  deploymentId,
  environment = 'Production',
  status = 'success',
  isStreaming = false,
  isLoading = false,
  duration = '34s',
  title = 'Build & Deployment Logs',
  maxHeight = '420px',
  className = '',
}) {
  const [displayedLogs, setDisplayedLogs] = useState(initialLogs);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isWordWrap, setIsWordWrap] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const scrollRef = useRef(null);
  const isBuilding = status === 'building' || status === 'in_progress' || isStreaming;
  const currentStatusStyle = STATUS_STYLES[status] || STATUS_STYLES.ready;

  // Sync initial logs
  useEffect(() => {
    setDisplayedLogs(initialLogs);
  }, [initialLogs]);

  // Compute stats: Errors & Warnings counts
  const errorCount = (displayedLogs || []).filter((l) => l.type === 'error').length;
  const warningCount = (displayedLogs || []).filter((l) => l.type === 'warning').length;

  // Filter logs by search query
  const filteredLogs = (displayedLogs || []).filter((line) =>
    line.text.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  // 1. Copy Logs Handler
  const handleCopyLogs = () => {
    const text = (displayedLogs || []).map((l) => `[${l.time || ''}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 2. Download Logs Handler
  const handleDownloadLogs = () => {
    const text = (displayedLogs || []).map((l) => `[${l.time || ''}] [${l.type || 'info'}] ${l.text}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `build-logs-${deploymentId || 'dep-001'}.log`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Clear Logs Handler
  const handleClearLogs = () => {
    setDisplayedLogs([]);
  };

  // Reset cleared logs
  const handleResetLogs = () => {
    setDisplayedLogs(initialLogs);
  };

  return (
    <div className="space-y-3 text-left font-sans" id="build-logs-section">
      {/* SECTION 5 Summary Badges Above Terminal (Ready, Errors, Warnings, Duration) */}
      <div className="flex items-center justify-between gap-3 px-1 select-none flex-wrap">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 font-semibold border ${currentStatusStyle.classes}`}>
            <span className={`w-2 h-2 rounded-full ${currentStatusStyle.dotClasses}`} />
            {currentStatusStyle.label}
          </span>

          <span
            className={`px-2.5 py-1 rounded-md border text-xs font-semibold flex items-center gap-1.5 ${
              errorCount > 0
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                : 'bg-muted text-muted-foreground border-border'
            }`}
          >
            <XCircle className={`w-3.5 h-3.5 ${errorCount > 0 ? 'text-rose-500' : 'text-muted-foreground'}`} />
            {errorCount} {errorCount === 1 ? 'Error' : 'Errors'}
          </span>

          <span
            className={`px-2.5 py-1 rounded-md border text-xs font-semibold flex items-center gap-1.5 ${
              warningCount > 0
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                : 'bg-muted text-muted-foreground border-border'
            }`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${warningCount > 0 ? 'text-amber-500' : 'text-muted-foreground'}`} />
            {warningCount} {warningCount === 1 ? 'Warning' : 'Warnings'}
          </span>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-muted text-foreground border border-border text-xs font-mono font-medium">
          <Clock className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
          Duration: <strong className="text-foreground">{duration}</strong>
        </span>
      </div>

      {/* Terminal Container */}
      <div
        className={`rounded-2xl border border-border bg-card shadow-sm dark:shadow-2xl overflow-hidden font-mono transition-all duration-200 ${
          isFullscreen
            ? 'fixed inset-4 z-50 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)] max-h-none border-indigo-500/50'
            : `relative ${className}`
        }`}
      >
        {/* Terminal Toolbar (Search, Download, Copy, Word Wrap, Clear, Fullscreen) */}
        <BuildLogToolbar
          title={title}
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onSearchClear={() => setSearchQuery('')}
          onCopyLogs={handleCopyLogs}
          copied={copied}
          onDownloadLogs={handleDownloadLogs}
          isWordWrap={isWordWrap}
          onToggleWordWrap={() => setIsWordWrap((prev) => !prev)}
          onClearLogs={handleClearLogs}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
          isStreaming={isStreaming}
          status={status}
        />

        {/* Terminal Output Body */}
        <div 
          ref={scrollRef}
          style={{ maxHeight: isFullscreen ? 'calc(100vh - 120px)' : maxHeight }}
          className="p-5 overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 text-xs leading-relaxed space-y-1 text-foreground flex-1"
        >
          {isLoading ? (
            <BuildLogsSkeleton count={6} />
          ) : !displayedLogs || displayedLogs.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <BuildLogsEmptyState reason="no_logs" />
              <button
                type="button"
                onClick={handleResetLogs}
                className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restore Logs View
              </button>
            </div>
          ) : filteredLogs.length === 0 ? (
            <BuildLogsEmptyState reason="no_matches" searchQuery={searchQuery} />
          ) : (
            <>
              {filteredLogs.map((log) => (
                <div key={log.id || log.text} className="animate-in fade-in duration-150">
                  <BuildLogLine log={log} isWordWrap={isWordWrap} />
                </div>
              ))}
              
              {/* Active Deployment Blinking Terminal Cursor */}
              {isBuilding && (
                <div className="flex items-center gap-2 pt-2 text-indigo-400">
                  <span>Streaming build output...</span>
                  <span className="inline-block w-2 h-4 bg-indigo-400 animate-pulse align-middle" />
                </div>
              )}
            </>
          )}
        </div>

        {/* Terminal Footer */}
        <div className="px-5 py-3 border-t border-border bg-muted flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground font-sans select-none">
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1.5 font-semibold text-xs border border-transparent rounded px-1.5 py-0.5 ${currentStatusStyle.classes}`}>
              <span className={`w-2 h-2 rounded-full ${currentStatusStyle.dotClasses}`} />
              {currentStatusStyle.label}
            </span>
            <span className="text-muted-foreground">•</span>
            <span>Env: <strong className="text-foreground">{environment}</strong></span>
            {deploymentId && <span>• ID: <strong className="text-muted-foreground font-mono">{deploymentId}</strong></span>}
          </div>
          
          <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
            <span>Terminal: <strong className="text-foreground">bash / zsh</strong></span>
            <span>Encoding: <strong className="text-foreground">UTF-8</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(BuildLogsTerminal);
