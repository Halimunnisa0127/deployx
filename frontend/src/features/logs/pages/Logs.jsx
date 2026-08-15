import { useEffect, useRef } from 'react';
import {
  Terminal,
  Search,
  Download,
  Copy,
  Check,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  XCircle,
  Activity,
  Trash2,
  Server,
  ArrowDown
} from 'lucide-react';
import { useLogs } from '../hooks/useLogs';

export default function Logs() {
  const {
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
    errorCount,
    warningCount,
    handleCopyLogs,
    handleDownloadLogs,
    handleClearLogs,
    handleResetLogs
  } = useLogs();

  const logsEndRef = useRef(null);

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredLogs, autoScroll]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 text-left font-sans">
      
      {/* 1. Header Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card p-6 rounded-2xl border border-border shadow-sm backdrop-blur-sm transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Terminal className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Live Deployment & System Logs
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  isStreaming
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isStreaming ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                {isStreaming ? 'Live Stream Active' : 'Stream Paused'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time build console output, server telemetry, and microservice runtime events.
            </p>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="px-3.5 py-2 rounded-xl bg-muted border border-border text-xs flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-500" />
            <div>
              <span className="text-muted-foreground block text-xs">TOTAL EVENTS</span>
              <strong className="text-foreground font-mono text-sm">{logs.length}</strong>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-muted border border-border text-xs flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-500" />
            <div>
              <span className="text-muted-foreground block text-xs">ERRORS</span>
              <strong className="text-rose-600 dark:text-rose-400 font-mono text-sm">{errorCount}</strong>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-muted border border-border text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <div>
              <span className="text-muted-foreground block text-xs">WARNINGS</span>
              <strong className="text-amber-600 dark:text-amber-400 font-mono text-sm">{warningCount}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Control Toolbar (Filters & Search & Action Buttons) */}
      <div className="bg-card p-4 rounded-2xl border border-border shadow-sm backdrop-blur-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search & Filters */}
          <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search logs by keyword, timestamp, or module..."
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-xs text-foreground placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Project Filter */}
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-3.5 py-2 bg-background border border-border rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
            >
              <option value="all">All Projects</option>
              <option value="deployx-frontend">deployx-frontend</option>
              <option value="api-gateway">api-gateway</option>
              <option value="auth-service">auth-service</option>
              <option value="payment-processor">payment-processor</option>
              <option value="analytics-worker">analytics-worker</option>
            </select>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3.5 py-2 bg-background border border-border rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
            >
              <option value="all">All Log Levels</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 justify-end">
            
            {/* Stream Toggle */}
            <button
              onClick={() => setIsStreaming((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isStreaming
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pause Stream
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Resume Stream
                </>
              )}
            </button>

            {/* Auto Scroll Toggle */}
            <button
              onClick={() => setAutoScroll((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                autoScroll
                  ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30'
                  : 'bg-muted text-muted-foreground border-border'
              }`}
              title="Toggle Auto-Scroll to bottom"
            >
              <ArrowDown className="w-3.5 h-3.5" /> Auto-Scroll
            </button>

            {/* Copy Logs */}
            <button
              onClick={handleCopyLogs}
              className="p-2 bg-muted border border-border rounded-xl text-muted-foreground hover:bg-muted transition-colors"
              title="Copy filtered logs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Download Logs */}
            <button
              onClick={handleDownloadLogs}
              className="p-2 bg-muted border border-border rounded-xl text-muted-foreground hover:bg-muted transition-colors"
              title="Download log file (.log)"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Clear Logs */}
            <button
              onClick={handleClearLogs}
              className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors"
              title="Clear terminal output"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Terminal Console Output */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden font-mono text-xs text-foreground">
        
        {/* Terminal Header Bar */}
        <div className="px-5 py-3 border-b border-border bg-muted flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 text-slate-400 font-sans text-xs font-semibold">
              deployx-terminal://live-console
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Encoding: UTF-8</span>
            <span>Showing {filteredLogs.length} of {logs.length} lines</span>
          </div>
        </div>

        {/* Console Log Content Area */}
        <div className="p-5 max-h-[560px] overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
          {logs.length === 0 ? (
            <div className="py-16 text-center space-y-4 font-sans">
              <Terminal className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-slate-400 text-sm">Terminal output cleared.</p>
              <button
                onClick={handleResetLogs}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 rounded-xl text-xs font-semibold transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Reset Sample Logs
              </button>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-sans">
              No logs matched your active filters ("{searchQuery}").
            </div>
          ) : (
            filteredLogs.map((log, index) => {
              const levelColor =
                log.level === 'error'
                  ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                  : log.level === 'warning'
                  ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                  : log.level === 'success'
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';

              return (
                <div
                  key={log.id}
                  className="flex items-start gap-3 py-1 hover:bg-muted px-2 rounded transition-colors group"
                >
                  {/* Line Number */}
                  <span className="text-slate-400 dark:text-slate-600 select-none w-8 text-right shrink-0">
                    {index + 1}
                  </span>

                  {/* Timestamp */}
                  <span className="text-slate-500 select-none shrink-0 font-mono">
                    [{log.timestamp}]
                  </span>

                  {/* Project Tag */}
                  <span className="px-1.5 py-0.5 rounded bg-muted border border-border text-xs text-muted-foreground select-none shrink-0">
                    {log.project}
                  </span>

                  {/* Log Level Badge */}
                  <span
                    className={`px-1.5 py-0.5 rounded border text-xs uppercase font-bold select-none shrink-0 ${levelColor}`}
                  >
                    {log.level}
                  </span>

                  {/* Log Message */}
                  <span className="text-foreground break-all leading-relaxed">
                    {log.message}
                  </span>
                </div>
              );
            })
          )}

          {/* Active Streaming Indicator */}
          {isStreaming && (
            <div className="flex items-center gap-2 pt-3 text-indigo-400 text-xs font-sans pl-10">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>Listening for live log events...</span>
            </div>
          )}

          <div ref={logsEndRef} />
        </div>

        {/* Terminal Footer Bar */}
        <div className="px-5 py-2.5 border-t border-border bg-muted flex items-center justify-between text-xs text-muted-foreground font-sans">
          <div className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            <span>DeployX Server Log Engine v2.4</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Buffer: 1000 lines</span>
            <span>Status: <strong className="text-emerald-400">Connected</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
