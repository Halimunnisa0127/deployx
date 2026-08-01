import React from "react";
import { Activity, Download, RefreshCw, TerminalSquare } from "lucide-react";
import Button from "../../../../components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function SystemHealthHeader({
  onRefresh,
  onExport,
  isRefreshing,
  autoRefresh,
  setAutoRefresh,
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-800/60 pb-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
          <span
            className="hover:text-slate-300 cursor-pointer transition-colors"
            onClick={() => navigate("/dashboard/admin")}
          >
            Home
          </span>
          <span>&gt;</span>
          <span
            className="hover:text-slate-300 cursor-pointer transition-colors"
            onClick={() => navigate("/dashboard/admin")}
          >
            Admin
          </span>
          <span>&gt;</span>
          <span className="text-slate-200">System Health</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Activity className="w-5 h-5 text-indigo-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            System Health
          </h1>
        </div>
        <p className="text-sm text-slate-400 mt-1.5 leading-relaxed max-w-2xl">
          Monitor infrastructure health, resource usage and service availability
          across the DeployX platform.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-2 md:mt-0">
        <select
          value={autoRefresh}
          onChange={(e) => setAutoRefresh(e.target.value)}
          className="h-9 px-3 bg-slate-900/80 border border-slate-800 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors outline-none cursor-pointer"
        >
          <option value="off">Auto Refresh: Off</option>
          <option value="15">Auto Refresh: 15s</option>
          <option value="30">Auto Refresh: 30s</option>
          <option value="60">Auto Refresh: 1m</option>
          <option value="300">Auto Refresh: 5m</option>
        </select>

        <Button
          variant="secondary"
          iconLeft={<TerminalSquare className="w-4 h-4" />}
          onClick={() => navigate("/dashboard/admin/logs")}
        >
          View Logs
        </Button>
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
