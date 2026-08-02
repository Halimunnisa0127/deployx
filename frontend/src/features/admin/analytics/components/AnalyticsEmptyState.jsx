import React from "react";
import { BarChart3 } from "lucide-react";
import Button from "../../../../components/ui/Button";

export function NoAnalyticsEmptyState({ onRefresh }) {
  return (
    <div className="bg-black dark:bg-black rounded-2xl border border-slate-200 dark:border-slate-900 p-10 flex flex-col items-center justify-center text-center col-span-full min-h-[400px]">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
        <BarChart3 className="w-8 h-8 text-indigo-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No Data Available</h3>
      <p className="text-slate-400 max-w-sm mb-6">
        There is no analytics data available for the selected date range.
      </p>
      <Button variant="primary" onClick={onRefresh}>
        Refresh Data
      </Button>
    </div>
  );
}

