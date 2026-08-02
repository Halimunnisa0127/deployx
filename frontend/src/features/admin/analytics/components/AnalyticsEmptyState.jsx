import React from "react";
import { BarChart3 } from "lucide-react";
import Button from "../../../../components/ui/Button";

import Card from "../../../../components/ui/Card";

export function NoAnalyticsEmptyState({ onRefresh }) {
  return (
    <Card className="flex flex-col items-center justify-center text-center col-span-full min-h-[400px]" style={{ padding: '2.5rem' }}>
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
