import React, { useState, useEffect, useRef } from 'react';
import BuildLogToolbar from './BuildLogToolbar';
import BuildLogLine from './BuildLogLine';
import BuildLogsEmptyState from './BuildLogsEmptyState';
import BuildLogsSkeleton from './BuildLogsSkeleton';

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
  { id: 10, type: 'success', time: '00:00:28', text: '✓ 38 modules transformed.' },
  { id: 11, type: 'success', time: '00:00:30', text: 'dist/index.html                     0.45 kB │ gzip:  0.28 kB' },
  { id: 12, type: 'success', time: '00:00:31', text: 'dist/assets/index-D7a9b2c.js       142.10 kB │ gzip: 44.80 kB' },
  { id: 13, type: 'info', time: '00:00:32', text: 'Uploading build artifacts to DeployX edge network' },
  { id: 14, type: 'success', time: '00:00:34', text: '✓ Deployment successful! Production URL live.' },
];

export default function BuildLogsTerminal({
  logs = DEFAULT_DUMMY_LOGS,
  deploymentId,
  environment = 'Production',
  status = 'success',
  isStreaming = false,
  isLoading = false,
  title = 'Build & Deployment Logs',
  maxHeight = '420px',
  className = '',
}) {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);

  const scrollRef = useRef(null);

  // Auto-scroll to bottom whenever logs update if autoScroll is enabled
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Filter logs by search term
  const filteredLogs = (logs || []).filter((line) =>
    line.text.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const handleCopyLogs = () => {
    const text = (logs || []).map((l) => `[${l.time || ''}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-2xl border border-slate-800/80 bg-[#050608] shadow-2xl overflow-hidden text-left font-mono ${className}`}>
      {/* Terminal Toolbar */}
      <BuildLogToolbar
        title={title}
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onSearchClear={() => setSearchQuery('')}
        onCopyLogs={handleCopyLogs}
        copied={copied}
        autoScroll={autoScroll}
        onToggleAutoScroll={() => setAutoScroll((prev) => !prev)}
        isStreaming={isStreaming}
        status={status}
      />

      {/* Terminal Output Area */}
      <div 
        ref={scrollRef}
        style={{ maxHeight }}
        className="p-5 overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 text-xs leading-relaxed space-y-1 text-slate-300"
      >
        {isLoading ? (
          <BuildLogsSkeleton count={6} />
        ) : !logs || logs.length === 0 ? (
          <BuildLogsEmptyState reason="no_logs" />
        ) : filteredLogs.length === 0 ? (
          <BuildLogsEmptyState reason="no_matches" searchQuery={searchQuery} />
        ) : (
          filteredLogs.map((log) => (
            <BuildLogLine key={log.id || log.text} log={log} />
          ))
        )}
      </div>

      {/* Terminal Status Footer */}
      <div className="px-5 py-2.5 border-t border-slate-800/80 bg-[#08090d] flex items-center justify-between text-[11px] text-slate-500 font-sans">
        <div className="flex items-center gap-3">
          <span>Env: <strong className="text-slate-300">{environment}</strong></span>
          {deploymentId && <span>&bull; ID: <strong className="text-slate-400 font-mono">{deploymentId}</strong></span>}
        </div>
        
        <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Ready
        </span>
      </div>
    </div>
  );
}
