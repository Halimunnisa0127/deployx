import React from 'react';
import { Terminal, Copy, Check, ArrowDown } from 'lucide-react';
import SearchBar from '../../../components/common/SearchBar';

export default function BuildLogToolbar({
  title = 'Build & Deployment Logs',
  searchQuery,
  onSearchChange,
  onSearchClear,
  onCopyLogs,
  copied,
  autoScroll,
  onToggleAutoScroll,
  isStreaming,
  status = 'success',
}) {
  const isBuilding = status === 'building' || isStreaming;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#0b0d12] gap-3">
      {/* Left Side: Mac Traffic Lights & Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span>{title}</span>
        </div>

        {/* Dynamic Status Indicator */}
        {isBuilding ? (
          <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            Live Logs
          </span>
        ) : (
          <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Logs Complete
          </span>
        )}
      </div>

      {/* Right Side: Controls */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Search Input */}
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          onClear={onSearchClear}
          placeholder="Search logs..."
          size="sm"
          className="w-40 sm:w-48"
        />

        {/* Auto-Scroll Toggle Button */}
        <button
          type="button"
          onClick={onToggleAutoScroll}
          className={`p-1.5 px-2.5 rounded-lg text-xs flex items-center gap-1.5 border transition-colors ${
            autoScroll
              ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 font-medium'
              : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200'
          }`}
          title={autoScroll ? 'Disable auto-scroll' : 'Enable auto-scroll'}
        >
          <ArrowDown className={`w-3.5 h-3.5 ${autoScroll ? 'text-indigo-400' : ''}`} />
          <span className="hidden sm:inline">Auto-scroll</span>
        </button>

        {/* Copy Logs Button */}
        <button
          type="button"
          onClick={onCopyLogs}
          className="p-1.5 px-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1.5 border border-slate-700/60"
          title="Copy logs to clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
}
