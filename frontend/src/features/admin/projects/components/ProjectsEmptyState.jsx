import React from "react";
import { FolderGit2, Search, CheckCircle, Archive } from "lucide-react";
import Button from "../../../../components/ui/Button";

export function NoProjectsEmptyState() {
  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-10 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
        <FolderGit2 className="w-8 h-8 text-indigo-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No Projects Found</h3>
      <p className="text-slate-400 max-w-sm mb-6">
        There are currently no projects in the platform.
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
        No projects matched your search or filter criteria. Try adjusting them.
      </p>
      <Button variant="secondary" onClick={onClear}>
        Clear Filters
      </Button>
    </div>
  );
}

export function NoActiveProjectsEmptyState({ onClear }) {
  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-10 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
        <CheckCircle className="w-8 h-8 text-emerald-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No Active Projects</h3>
      <p className="text-slate-400 max-w-sm mb-6">
        There are currently no active projects on the platform.
      </p>
      <Button variant="secondary" onClick={onClear}>
        Clear Filters
      </Button>
    </div>
  );
}

export function NoArchivedProjectsEmptyState({ onClear }) {
  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-10 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center mb-4">
        <Archive className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">
        No Archived Projects
      </h3>
      <p className="text-slate-400 max-w-sm mb-6">
        There are currently no archived projects on the platform.
      </p>
      <Button variant="secondary" onClick={onClear}>
        Clear Filters
      </Button>
    </div>
  );
}
