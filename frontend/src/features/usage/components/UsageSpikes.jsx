import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import { Activity, AlertTriangle, AlertCircle, Info, ChevronRight } from 'lucide-react';

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
    <Card 
      style={{ maxWidth: '100%' }}
      className="border border-slate-200/80 dark:border-white/10 rounded-2xl
                     backdrop-blur-xl bg-white/80 dark:bg-slate-900/70
                     shadow-sm dark:shadow-xl overflow-hidden p-0 flex flex-col h-full"
    >
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-none">
              Usage Spikes
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Abnormal consumption events
            </p>
          </div>
        </div>
        
        <Link 
          to="/dashboard/logs" 
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
        >
          View All <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </Link>
      </div>

      {/* Compact List */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {topSpikes.map((spike, idx) => {
          const severityCfg = SEVERITY_CONFIG[spike.severity] || SEVERITY_CONFIG.Low;
          const SeverityIcon = severityCfg.icon;

          return (
            <div 
              key={spike.id} 
              className={`flex items-start sm:items-center justify-between gap-4 p-4 sm:p-5 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50 ${
                idx !== topSpikes.length - 1 ? 'border-b border-slate-100 dark:border-white/5' : ''
              }`}
            >
              {/* Left: Icon & Details */}
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div className={`p-2 rounded-lg border shrink-0 mt-0.5 sm:mt-0 ${severityCfg.css}`}>
                  <SeverityIcon className="w-4 h-4" />
                </div>
                
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 truncate">
                      {spike.resource}
                    </span>
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500 shrink-0">
                      {spike.date}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 sm:line-clamp-none max-w-[180px] sm:max-w-[280px] truncate" title={spike.reason}>
                    {spike.reason}
                  </p>
                </div>
              </div>

              {/* Right: Peak & Severity */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 shrink-0 mt-2 sm:mt-0">
                <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                  {spike.peakUsage}
                </span>
                <span className={`inline-flex justify-center min-w-[50px] px-2 py-0.5 rounded text-xs sm:text-xs font-bold border ${severityCfg.css}`}>
                  {spike.severity}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
