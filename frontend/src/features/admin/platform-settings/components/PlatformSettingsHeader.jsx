import React from "react";
import { Settings, Download, Upload } from "lucide-react";
import Button from "../../../../components/ui/Button";

export default function PlatformSettingsHeader({ onExport, onImport }) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800/60 pb-6">
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
          <span className="text-slate-900 dark:text-slate-200">Platform Settings</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Settings className="w-5 h-5 text-indigo-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Platform Settings
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-2xl">
          Configure global platform settings, branding, integrations,
          notifications and security from one centralized dashboard.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-2 md:mt-0">
        <Button
          variant="secondary"
          iconLeft={<Upload className="w-4 h-4" />}
          onClick={onImport}
        >
          Import
        </Button>
        <Button
          variant="secondary"
          iconLeft={<Download className="w-4 h-4" />}
          onClick={onExport}
        >
          Export
        </Button>
      </div>
    </div>
  );
}
