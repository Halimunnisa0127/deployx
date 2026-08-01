import React from "react";
import {
  HeartPulse,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Settings,
} from "lucide-react";
import { Card } from "../../../../components/common/Card";

export default function HealthOverviewCard({ data }) {
  if (!data) return null;

  return (
    <Card className="p-6 bg-slate-900/60 border-slate-800/80 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Main Score */}
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />

              <path
                className={
                  data.healthScore >= 95
                    ? "text-emerald-500"
                    : data.healthScore >= 80
                      ? "text-amber-500"
                      : "text-rose-500"
                }
                strokeWidth="3"
                strokeDasharray={`${data.healthScore}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold text-white">
                {data.healthScore}
              </span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Platform Health{" "}
              <HeartPulse
                className={`w-5 h-5 ${data.healthScore >= 95 ? "text-emerald-500" : "text-amber-500"}`}
              />
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Overall System Uptime:{" "}
              <span className="text-emerald-400 font-mono">{data.uptime}%</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Last Checked: {new Date(data.lastChecked).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 md:gap-8 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-sm">Active</span>
            </div>
            <span className="text-xl font-bold text-white">
              {data.activeServices}
            </span>
          </div>
          <div className="w-px bg-slate-800/80"></div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-sm">Warning</span>
            </div>
            <span className="text-xl font-bold text-white">
              {data.warningServices}
            </span>
          </div>
          <div className="w-px bg-slate-800/80"></div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span className="text-sm">Offline</span>
            </div>
            <span className="text-xl font-bold text-white">
              {data.offlineServices}
            </span>
          </div>
          <div className="w-px bg-slate-800/80"></div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Settings className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Maint.</span>
            </div>
            <span className="text-xl font-bold text-white">
              {data.maintenanceServices}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
