import React from "react";
import { ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";
import Card from "../../../components/ui/Card";

export default function OverviewCard({
  title,
  value,
  change,
  icon: Icon,
  onClick,
}) {
  const isPositive = change > 0;
  const isNeutral = change === 0;
  return (
    <Card
      onClick={onClick}
      className="group p-5 sm:p-6 hover:border-indigo-500/50 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(79,70,229,0.18)]"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center shrink-0 shadow-inner group-hover:border-indigo-500/40 group-hover:bg-indigo-500/10 transition-colors">
          <Icon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
        </div>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-theme-muted group-hover:text-indigo-500 dark:group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-theme-secondary mb-1">{title}</h3>
        <div className="flex items-end gap-3">
          <span className="text-2xl font-bold text-theme-heading tracking-tight">
            {typeof value === "number" && value > 1000
              ? value.toLocaleString()
              : value}
            {title === "Platform Uptime" && "%"}
          </span>
          {!isNeutral && (
            <div
              className={`flex items-center text-xs font-medium mb-1 px-1.5 py-0.5 rounded ${isPositive ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : "text-rose-400 bg-rose-500/10 border border-rose-500/20"}`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-0.5" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <p className="text-xs text-theme-muted mt-2">vs last 7 days</p>
      </div>

      {/* Mini Progress Indicator */}
      <div className="mt-4 h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${title === "Platform Uptime" || isPositive ? "bg-indigo-500" : "bg-rose-500"}`}
          style={{ width: `${Math.min(Math.abs(change) * 5 + 30, 100)}%` }}
        />
      </div>
    </Card>
  );
}

