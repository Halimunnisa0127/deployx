import React from "react";
import { motion } from "framer-motion";
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
    <Card className="p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Main Score */}
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />

              <motion.path
                className={
                  data.healthScore >= 95
                    ? "text-emerald-500"
                    : data.healthScore >= 80
                      ? "text-amber-500"
                      : "text-rose-500"
                }
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${data.healthScore}, 100` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <motion.span 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-2xl font-bold text-foreground"
              >
                {data.healthScore}
              </motion.span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              Platform Health{" "}
              <HeartPulse
                className={`w-5 h-5 ${data.healthScore >= 95 ? "text-emerald-500" : "text-amber-500"}`}
              />
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Overall System Uptime:{" "}
              <span className="text-emerald-500 font-mono">{data.uptime}%</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Last Checked: {new Date(data.lastChecked).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 md:gap-8 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-border">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-sm">Healthy</span>
            </div>
            <span className="text-xl font-bold text-foreground">
              {data.activeServices}
            </span>
          </div>
          <div className="w-px bg-slate-200 dark:bg-slate-800/80"></div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-sm">Warning</span>
            </div>
            <span className="text-xl font-bold text-foreground">
              {data.warningServices}
            </span>
          </div>
          <div className="w-px bg-slate-200 dark:bg-slate-800/80"></div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-sm">Critical</span>
            </div>
            <span className="text-xl font-bold text-foreground">
              {data.criticalServices || 0}
            </span>
          </div>
          <div className="w-px bg-slate-200 dark:bg-slate-800/80"></div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <XCircle className="w-4 h-4 text-rose-500" />
              <span className="text-sm">Offline</span>
            </div>
            <span className="text-xl font-bold text-foreground">
              {data.offlineServices}
            </span>
          </div>
          <div className="w-px bg-slate-200 dark:bg-slate-800/80"></div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <Settings className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Maint.</span>
            </div>
            <span className="text-xl font-bold text-foreground">
              {data.maintenanceServices}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
