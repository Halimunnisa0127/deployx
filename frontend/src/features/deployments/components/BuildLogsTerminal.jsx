import React, { useState, useEffect, useRef, memo } from 'react';
import BuildLogToolbar from './BuildLogToolbar';
import BuildLogLine from './BuildLogLine';
import BuildLogsEmptyState from './BuildLogsEmptyState';
import BuildLogsSkeleton from './BuildLogsSkeleton';
import { CheckCircle2, AlertTriangle, XCircle, Clock, RotateCcw } from 'lucide-react';

const DEFAULT_DUMMY_LOGS = [
  { id: 1, type: 'info', time: '00:00:01', text: 'Initializing DeployX Build Environment (v20.11.0 node)' },
  { id: 2, type: 'info', time: '00:00:02', text: 'Cloning repository: github.com/my-team/deployx-app' },
  { id: 3, type: 'info', time: '00:00:04', text: 'Checking out branch main @ commit #a4b9c1d' },
  { id: 4, type: 'info', time: '00:00:06', text: 'Restoring build cache from previous successful build...' },
  { id: 5, type: 'info', time: '00:00:08', text: 'Cache hit: node_modules (saved 18s)' },
  { id: 6, type: 'info', time: '00:00:10', text: 'Injecting environment variables (DATABASE_URL, API_KEY)' },
  { id: 7, type: 'info', time: '00:00:12', text: 'Running build command: npm run build' },
  { id: 8, type: 'info', time: '00:00:15', text: 'Vite v5.2.0 building for production...' },
  { id: 9, type: 'info', time: '00:00:22', text: 'transforming (142) modules...' },
  { id: 10, type: 'warning', time: '00:00:26', text: 'WARN: Chunk size after minification is 520 kB (recommend <500 kB)' },
  { id: 11, type: 'success', time: '00:00:28', text: '✓ 38 modules transformed.' },
  { id: 12, type: 'success', time: '00:00:30', text: 'dist/index.html                     0.45 kB │ gzip:  0.28 kB' },
  { id: 13, type: 'success', time: '00:00:31', text: 'dist/assets/index-D7a9b2c.js       142.10 kB │ gzip: 44.80 kB' },
  { id: 14, type: 'info', time: '00:00:32', text: 'Uploading build artifacts to DeployX edge network' },
  { id: 15, type: 'success', time: '00:00:34', text: '✓ Deployment successful! Production URL live.' },
];

function BuildLogsTerminal({
  logs: initialLogs = DEFAULT_DUMMY_LOGS,
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
          <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md flex items-center gap-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            Ready
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
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-semibold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              Ready
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
