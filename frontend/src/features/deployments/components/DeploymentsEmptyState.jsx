import React from 'react';
import { Layers, RotateCcw, Search } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function DeploymentsEmptyState({ onResetFilter, hasFilter }) {
  return (
    <div className="py-16 px-4 text-center rounded-2xl bg-slate-900/40 border border-slate-800/60 max-w-lg mx-auto my-8 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto shadow-inner">
        {hasFilter ? <Search className="w-8 h-8 text-indigo-400" /> : <Layers className="w-8 h-8 text-indigo-400" />}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-lg font-bold text-white">
          {hasFilter ? 'No deployments found' : 'No deployments recorded yet'}
        </h3>
        <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
          {hasFilter
            ? 'No deployment records match your active search or status filter parameters.'
            : 'Deployments will automatically appear here when pushes to connected Git branches occur.'}
        </p>
      </div>

      {hasFilter && onResetFilter && (
        <div className="pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onResetFilter}
            iconLeft={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Clear Filters & Search
          </Button>
        </div>
      )}
    </div>
  );
}
