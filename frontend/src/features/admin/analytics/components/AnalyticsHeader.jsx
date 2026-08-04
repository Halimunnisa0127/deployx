import React from "react";
import { BarChart3, Download, RefreshCw } from "lucide-react";
import Button from "../../../../components/ui/Button";
import DateRangePicker from "./DateRangePicker";

export default function AnalyticsHeader({
  onRefresh,
  onExport,
  isRefreshing,
  dateRange,
  setDateRange,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border pb-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-theme-muted mb-4">
          <span className="hover:text-theme-body cursor-pointer transition-colors">
            Home
          </span>
          <span>&gt;</span>
          <span className="hover:text-theme-body cursor-pointer transition-colors">
            Admin
          </span>
          <span>&gt;</span>
          <span className="text-theme-secondary">Analytics</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-theme-heading tracking-tight">
            Platform Analytics
          </h1>
        </div>
        <p className="text-sm text-theme-muted mt-1.5 leading-relaxed max-w-2xl">
          Monitor platform usage, growth, infrastructure metrics, deployment
          performance and business insights.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-2 md:mt-0">
        <DateRangePicker value={dateRange} onChange={setDateRange} />

        <Button
          variant="secondary"
          iconLeft={<Download className="w-4 h-4" />}
          onClick={onExport}
        >
          Export Report
        </Button>
        <Button
          variant="primary"
          iconLeft={
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          }
          onClick={onRefresh}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
}

