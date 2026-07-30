import React from 'react';
import { Link } from 'react-router-dom';
import {
  BellRing,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const SEVERITY_CONFIG = {
  critical: {
    label: 'Critical',
    icon: AlertCircle,
    iconColor: 'text-rose-500',
    bgColor: 'bg-rose-500/10 dark:bg-rose-500/20',
    borderColor: 'border-rose-500/30',
    badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  },
  warning: {
    label: 'Warning',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-500/10 dark:bg-amber-500/20',
    borderColor: 'border-amber-500/30',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  healthy: {
    label: 'Healthy',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    borderColor: 'border-emerald-500/30',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  information: {
    label: 'Information',
    icon: Info,
    iconColor: 'text-blue-500 dark:text-blue-400',
    bgColor: 'bg-blue-500/10 dark:bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
};

const SEVERITY_WEIGHT = {
  critical: 3,
  warning: 2,
  healthy: 1,
  information: 1,
  normal: 1
};

const compactTimestamp = (ts) => {
  if (!ts) return '';
  return ts
    .replace(' mins ago', 'm ago')
    .replace(' min ago', 'm ago')
    .replace(' hours ago', 'h ago')
    .replace(' hour ago', 'h ago');
};

export default function UsageAlerts({ alerts = [] }) {
  // Normalize and sort by priority, then take top 3
  const sortedAlerts = [...alerts].sort((a, b) => {
    const wA = SEVERITY_WEIGHT[a.severity] || 0;
    const wB = SEVERITY_WEIGHT[b.severity] || 0;
    return wB - wA; // Higher weight first
  }).slice(0, 3);

  return (
    <Card 
      style={{ maxWidth: '100%', padding: 0 }}
      className="h-full flex flex-col border border-slate-200/80 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-slate-900/70 shadow-sm dark:shadow-xl overflow-hidden"
    >
      
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 shadow-sm shrink-0">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-none">
              Recent Usage Alerts ({sortedAlerts.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              High-priority operational notices
            </p>
          </div>
        </div>
        
        <Link 
          to="/dashboard/notifications" 
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
        >
          Open Notification Center <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
        </Link>
      </div>

      {/* Alerts List */}
      <div className="flex flex-col flex-1">
        {sortedAlerts.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No active usage alerts. Your infrastructure is operating normally.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {sortedAlerts.map((item) => {
              const severityKey = item.severity === 'normal' ? 'information' : item.severity;
              const style = SEVERITY_CONFIG[severityKey] || SEVERITY_CONFIG.information;
              const SeverityIcon = style.icon;

              return (
                <div key={item.id} className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 p-3 sm:p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  
                  {/* Left: Icon & Details */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className={`p-2 rounded-lg border shrink-0 mt-0.5 ${style.bgColor} ${style.borderColor}`}>
                      <SeverityIcon className={`w-4 h-4 ${style.iconColor}`} />
                    </div>
                    
                    <div className="min-w-0 flex flex-col gap-1.5 flex-1">
                      {/* Title & Badge */}
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-extrabold border ${style.badgeClass} shrink-0 uppercase tracking-wider`}>
                          {style.label}
                        </span>
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 truncate">
                          {item.title}
                        </h3>
                      </div>
                      
                      {/* Description */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1" title={item.description}>
                        {item.description}
                      </p>

                      {/* Bottom-left: Timestamp & Resource */}
                      <div className="flex flex-wrap items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1.5 text-sm font-mono text-slate-400 dark:text-slate-500 shrink-0">
                          <Clock className="w-3 h-3" />
                          {compactTimestamp(item.timestamp)}
                        </span>
                        {item.affectedResource && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shrink-0">
                            <Layers className="w-3 h-3" />
                            {item.affectedResource}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Action Button */}
                  {item.actionLabel && (
                    <div className="shrink-0 ml-11 xl:ml-0 self-start xl:self-center mt-1 xl:mt-0">
                      <Button variant="secondary" size="sm" className="text-[11px] px-2.5 py-1 min-h-0 h-auto font-semibold">
                        {item.actionLabel}
                      </Button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}

