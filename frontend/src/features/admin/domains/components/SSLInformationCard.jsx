import React from "react";
import { ShieldCheck, ShieldAlert, Shield, AlertTriangle } from "lucide-react";

export default function SSLInformationCard({ sslInfo }) {
  if (!sslInfo) return null;

  const isActive = sslInfo.status === "Active";
  const isExpiring = sslInfo.status === "Expiring Soon";
  const isExpired = sslInfo.status === "Expired";
  const isPending = sslInfo.status === "Pending Issuance";

  const StatusIcon = isExpired
    ? ShieldAlert
    : isExpiring
      ? AlertTriangle
      : isActive
        ? ShieldCheck
        : Shield;
  const iconColor = isExpired
    ? "text-rose-600 dark:text-rose-400"
    : isExpiring
      ? "text-amber-600 dark:text-amber-400"
      : isActive
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-slate-500 dark:text-slate-400";

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> SSL Certificate
      </h3>
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 flex items-center justify-center shrink-0`}
          >
            <StatusIcon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div>
            <div className={`font-semibold ${iconColor}`}>{sslInfo.status}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Provided by {sslInfo.provider}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-500 mb-1">Issued Date</div>
            <div className="text-sm text-slate-700 dark:text-slate-200">
              {sslInfo.issued
                ? new Date(sslInfo.issued).toLocaleDateString()
                : "-"}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Expiry Date</div>
            <div className="text-sm text-slate-700 dark:text-slate-200">
              {sslInfo.expiry
                ? new Date(sslInfo.expiry).toLocaleDateString()
                : "-"}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Days Remaining</div>
            <div className="text-sm font-mono text-slate-700 dark:text-slate-200">
              {sslInfo.daysRemaining !== null ? sslInfo.daysRemaining : "-"}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Auto-Renewal</div>
            <div className="text-sm text-slate-700 dark:text-slate-200">
              {sslInfo.autoRenew ? "Enabled" : "Disabled"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
