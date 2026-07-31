import React from "react";
import { Settings } from "lucide-react";
import Button from "../../../../components/ui/Button";

export function SettingsEmptyState({ onRetry }) {
  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-12 flex flex-col items-center justify-center text-center mt-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
        <Settings className="w-8 h-8 text-indigo-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">
        Failed to load settings
      </h3>
      <p className="text-slate-400 max-w-sm mb-6">
        We couldn't retrieve the platform configuration at this time.
      </p>
      <Button variant="primary" onClick={onRetry}>
        Retry Connection
      </Button>
    </div>
  );
}
