import React from 'react';
import Card from '../../../components/ui/Card';
import { Activity, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const SEVERITY_CONFIG = {
  High:   { icon: AlertCircle,   css: 'text-rose-600 bg-rose-500/10 border-rose-500/20' },
  Medium: { icon: AlertTriangle, css: 'text-amber-600 bg-amber-500/10 border-amber-500/20' },
  Low:    { icon: Info,          css: 'text-blue-600 bg-blue-500/10 border-blue-500/20' },
};

export default function UsageSpikes({ spikes = [] }) {
  if (!spikes || spikes.length === 0) return null;

  // Ensure we only show top 5
  const topSpikes = spikes.slice(0, 5);

  return (
    <Card className="border border-slate-200/80 dark:border-white/10 rounded-2xl
                     backdrop-blur-xl bg-white/80 dark:bg-slate-900/70
                     shadow-sm dark:shadow-xl overflow-hidden p-0">
      <div className="p-4 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Resource Usage Spikes
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Top abnormal consumption events
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Resource</th>
              <th className="px-4 py-2">Peak Usage</th>
              <th className="px-4 py-2">Reason</th>
              <th className="px-4 py-2">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {topSpikes.map((spike) => {
              const severityCfg = SEVERITY_CONFIG[spike.severity] || SEVERITY_CONFIG.Low;
              const SeverityIcon = severityCfg.icon;

              return (
                <tr key={spike.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-slate-600 dark:text-slate-400">
                    {spike.date}
                  </td>
                  <td className="px-4 py-2.5 font-bold text-slate-800 dark:text-slate-200">
                    {spike.resource}
                  </td>
                  <td className="px-4 py-2.5 font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                    {spike.peakUsage}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300 w-full whitespace-normal min-w-[150px]">
                    {spike.reason}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${severityCfg.css}`}>
                      <SeverityIcon className="w-3 h-3" />
                      {spike.severity}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
