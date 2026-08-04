import React from "react";
import { Rocket, Search, Filter, Download } from "lucide-react";
import Button from "../../../../components/ui/Button";

export default function DeploymentsHeader({ onExport }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/60 pb-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
          <span className="hover:text-slate-900 dark:hover:text-slate-300 cursor-pointer transition-colors">
            Home
          </span>
          <span>&gt;</span>
          <span className="hover:text-slate-900 dark:hover:text-slate-300 cursor-pointer transition-colors">
            Admin
          </span>
          <span>&gt;</span>
          <span className="text-slate-900 dark:text-slate-200">Deployments</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Rocket className="w-5 h-5 text-indigo-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Deployments
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
          Monitor and manage application deployments across all projects and
          environments.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm">
          <Search className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm">
          <Filter className="w-4 h-4" />
        </button>
        <Button
          variant="primary"
          iconLeft={<Download className="w-4 h-4" />}
          onClick={onExport}
        >
          Export
        </Button>
      </div>
    </div>
  );
}
