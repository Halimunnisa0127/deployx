import React from 'react';
import { Terminal, SearchX } from 'lucide-react';

export default function BuildLogsEmptyState({ reason = 'no_logs', searchQuery }) {
  if (reason === 'no_matches') {
    return (
      <div className="py-12 px-4 text-center font-sans space-y-2">
        <SearchX className="w-8 h-8 text-slate-500 mx-auto" />
        <div className="text-sm font-semibold text-slate-300">No matching log entries</div>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          No lines matched your log search term "{searchQuery}". Try clearing the search query.
        </p>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 text-center font-sans space-y-3">
      <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mx-auto">
        <Terminal className="w-6 h-6" />
      </div>
      <div className="text-sm font-bold text-slate-200">No logs available for this deployment</div>
      <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
        Logs will begin streaming automatically once the build process starts.
      </p>
    </div>
  );
}
