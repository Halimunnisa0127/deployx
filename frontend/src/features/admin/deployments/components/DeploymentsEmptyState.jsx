import React from "react";
import { Rocket, Search, AlertCircle, PlayCircle } from "lucide-react";
import Button from "../../../../components/ui/Button";

export function NoDeploymentsEmptyState() {
  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-10 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
        <Rocket className="w-8 h-8 text-indigo-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">
        No Deployments Found
      </h3>
      <p className="text-slate-400 max-w-sm mb-6">
        There are currently no deployments on the platform.
      </p>
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
      <p className="text-slate-400 max-w-sm mb-6">
        No deployments matched your search or filter criteria. Try adjusting
        them.
      </p>
      <Button variant="secondary" onClick={onClear}>
        Clear Filters
      </Button>
    </div>
  );
}

export function NoRunningDeploymentsEmptyState({ onClear }) {
  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-10 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
        <PlayCircle className="w-8 h-8 text-blue-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">
        No Running Deployments
      </h3>
      <p className="text-slate-400 max-w-sm mb-6">
        There are currently no active deployments running.
      </p>
      <Button variant="secondary" onClick={onClear}>
        Clear Filters
      </Button>
    </div>
  );
}

export function NoFailedDeploymentsEmptyState({ onClear }) {
  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-10 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-rose-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">
        No Failed Deployments
      </h3>
      <p className="text-slate-400 max-w-sm mb-6">
        Great job! There are no failed deployments right now.
      </p>
      <Button variant="secondary" onClick={onClear}>
        Clear Filters
      </Button>
    </div>
  );
}
