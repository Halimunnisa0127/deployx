import React from 'react';
import { Globe, Search, AlertCircle, Clock } from 'lucide-react';
import Button from '../../../../components/ui/Button';

export function NoDomainsEmptyState() {
  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-10 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
        <Globe className="w-8 h-8 text-indigo-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No Domains Found</h3>
      <p className="text-slate-400 max-w-sm mb-6">There are currently no domains connected to the platform.</p>
    </div>
  );
}

export function NoSearchResultsEmptyState({ onClear }) {
  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-10 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No Results Found</h3>
      <p className="text-slate-400 max-w-sm mb-6">No domains matched your search or filter criteria. Try adjusting them.</p>
      <Button variant="secondary" onClick={onClear}>Clear Filters</Button>
    </div>
  );
}

export function NoPendingDomainsEmptyState({ onClear }) {
  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-10 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
        <Clock className="w-8 h-8 text-amber-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No Pending Domains</h3>
      <p className="text-slate-400 max-w-sm mb-6">There are currently no domains waiting for verification.</p>
      <Button variant="secondary" onClick={onClear}>Clear Filters</Button>
    </div>
  );
}

export function NoFailedDomainsEmptyState({ onClear }) {
  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-10 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-rose-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No Failed Domains</h3>
      <p className="text-slate-400 max-w-sm mb-6">Great job! There are no failed domain verifications right now.</p>
      <Button variant="secondary" onClick={onClear}>Clear Filters</Button>
    </div>
  );
}
