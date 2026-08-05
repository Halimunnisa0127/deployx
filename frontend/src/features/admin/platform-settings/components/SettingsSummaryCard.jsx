import React from "react";
import { Globe, Wrench, Shield, CheckCircle2, Clock } from "lucide-react";

export default function SettingsSummaryCard({ data }) {
  if (!data) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 mb-8 lg:mb-12 shadow-sm dark:shadow-lg">
      <h2 className="text-lg font-bold text-foreground mb-6">
        Configuration Summary
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-border">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
              Platform Region
            </div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-200">
              {data.general?.defaultRegion}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-border">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${data.maintenance?.enabled ? "bg-rose-500/10" : "bg-emerald-500/10"}`}
          >
            {data.maintenance?.enabled ? (
              <Wrench className="w-5 h-5 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
              Status
            </div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-200">
              {data.maintenance?.enabled ? "Maintenance Mode" : "Operational"}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-border">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
              Security
            </div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-200">
              {data.security?.require2fa ? "Strict (2FA Enforced)" : "Standard"}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-border">
          <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
              Last Updated
            </div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-200">Just now</div>
          </div>
        </div>
      </div>
    </div>
  );
}
