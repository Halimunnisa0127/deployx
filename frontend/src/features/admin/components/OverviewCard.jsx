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
      className="group hover:border-indigo-500/50 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(79,70,229,0.18)]"
      style={{ padding: '16px' }}
    >
      <div className="flex justify-between items-center mb-1.5">
        <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center shrink-0 shadow-inner group-hover:border-indigo-500/40 group-hover:bg-indigo-500/10 transition-colors">
          <Icon className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
        </div>
        <div className="w-5 h-5 rounded flex items-center justify-center text-theme-muted group-hover:text-indigo-500 dark:group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>

      <div>
        <h3 className="text-[11px] font-medium text-theme-secondary mb-0.5">{title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-theme-heading tracking-tight leading-none">
            {typeof value === "number" && value > 1000
              ? value.toLocaleString()
              : value}
            {title === "Platform Uptime" && "%"}
          </span>
          {!isNeutral && (
            <div
              className={`flex items-center text-[9px] font-medium px-1 py-0.5 rounded ${isPositive ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : "text-rose-400 bg-rose-500/10 border border-rose-500/20"}`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-2.5 h-2.5 mr-0.5" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>
      </div>

      {/* Mini Progress Indicator */}
      <div className="mt-2 h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${title === "Platform Uptime" || isPositive ? "bg-indigo-500" : "bg-rose-500"}`}
          style={{ width: `${Math.min(Math.abs(change) * 5 + 30, 100)}%` }}
        />
      </div>
    </Card>
  );
}
