import React from "react";
import { BarChart3 } from "lucide-react";
import Button from "../../../../components/ui/Button";

import Card from "../../../../components/ui/Card";

export function NoAnalyticsEmptyState({ onRefresh }) {
  return (
<<<<<<< HEAD
    <div className="bg-black dark:bg-black rounded-2xl border border-slate-200 dark:border-slate-900 p-10 flex flex-col items-center justify-center text-center col-span-full min-h-[400px]">
=======
    <Card className="flex flex-col items-center justify-center text-center col-span-full min-h-[400px]" style={{ padding: '2.5rem' }}>
>>>>>>> e9bb4d3fc0ed5658293b72b9fb68775ffae8e7f0
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
        <BarChart3 className="w-8 h-8 text-indigo-400" />
      </div>
      <h3 className="text-xl font-bold text-theme-heading mb-2">No Data Available</h3>
      <p className="text-theme-muted max-w-sm mb-6">
        There is no analytics data available for the selected date range.
      </p>
      <Button variant="primary" onClick={onRefresh}>
        Refresh Data
      </Button>
    </Card>
  );
}

