import React from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Download, 
  WrapText, 
  Trash2, 
  Maximize2, 
  Minimize2 
} from 'lucide-react';
import SearchBar from '../../../components/common/SearchBar';

export default function BuildLogToolbar({
  title = 'Build & Deployment Logs',
  searchQuery,
  onSearchChange,
  onSearchClear,
  onCopyLogs,
  copied,
  onDownloadLogs,
  isWordWrap,
  onToggleWordWrap,
  onClearLogs,
  isFullscreen,
  onToggleFullscreen,
  isStreaming,
  status = 'success',
}) {
  const isBuilding = status === 'building' || isStreaming;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#0b0d12] gap-3 select-none">
      {/* Left Side: Mac Traffic Lights & Terminal Title */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <Terminal className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{title}</span>
        </div>

        {/* Dynamic Status Pill */}
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

      {/* Right Side: Toolbar Action Controls (Search, Download, Copy, Word Wrap, Clear, Fullscreen) */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* 1. Search */}
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          onClear={onSearchClear}
          placeholder="Search logs..."
          size="sm"
          className="w-36 sm:w-44 shrink-0"
        />

        {/* 2. Download */}
        <button
          type="button"
          onClick={onDownloadLogs}
          className="p-1.5 px-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1.5 border border-slate-700/60"
          title="Download build logs (.log)"
        >
          <Download className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden lg:inline">Download</span>
        </button>

        {/* 3. Copy */}
        <button
          type="button"
          onClick={onCopyLogs}
          className="p-1.5 px-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1.5 border border-slate-700/60"
          title="Copy logs to clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="hidden lg:inline">{copied ? 'Copied' : 'Copy'}</span>
        </button>

        {/* 4. Word Wrap Toggle */}
        <button
          type="button"
          onClick={onToggleWordWrap}
          className={`p-1.5 px-2.5 rounded-lg text-xs flex items-center gap-1.5 border transition-colors ${
            isWordWrap
              ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 font-medium'
              : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200'
          }`}
          title={isWordWrap ? 'Disable Word Wrap' : 'Enable Word Wrap'}
        >
          <WrapText className={`w-3.5 h-3.5 ${isWordWrap ? 'text-indigo-400' : ''}`} />
          <span className="hidden lg:inline">Wrap</span>
        </button>

        {/* 5. Clear */}
        <button
          type="button"
          onClick={onClearLogs}
          className="p-1.5 px-2.5 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 border border-slate-700/60 transition-colors text-xs flex items-center gap-1.5"
          title="Clear terminal view"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden lg:inline">Clear</span>
        </button>

        {/* 6. Fullscreen Toggle */}
        <button
          type="button"
          onClick={onToggleFullscreen}
          className={`p-1.5 px-2.5 rounded-lg text-xs flex items-center gap-1.5 border transition-colors ${
            isFullscreen
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:text-white'
          }`}
          title={isFullscreen ? 'Exit Fullscreen Mode' : 'Enter Fullscreen Mode'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5 text-slate-300" />
          )}
          <span className="hidden lg:inline">{isFullscreen ? 'Exit' : 'Full'}</span>
        </button>
      </div>
    </div>
  );
}
