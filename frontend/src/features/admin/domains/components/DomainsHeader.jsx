import React from "react";
import { Globe, Search, Filter, Download } from "lucide-react";
import Button from "../../../../components/ui/Button";

export default function DomainsHeader({ onExport }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span className="hover:text-slate-900 dark:hover:text-slate-300 cursor-pointer transition-colors">
            Home
          </span>
          <span>&gt;</span>
          <span className="hover:text-slate-900 dark:hover:text-slate-300 cursor-pointer transition-colors">
            Admin
          </span>
          <span>&gt;</span>
          <span className="text-slate-900 dark:text-slate-200">Domains</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Globe className="w-5 h-5 text-indigo-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Domains Management
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
          Manage custom domains, SSL certificates, and DNS settings across all
          projects.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm">
          <Search className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm">
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
