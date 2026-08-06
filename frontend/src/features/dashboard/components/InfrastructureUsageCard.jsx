import { Gauge, Wifi, HardDrive, Clock, ArrowRight, Zap } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { Progress } from '../../../components/ui';
import { Link } from 'react-router-dom';
import { MOCK_USAGE_SUMMARY } from '../data/mockDashboardData';

const METRICS = [
  { id: 'bandwidth', label: 'Bandwidth', icon: Wifi, color: 'indigo' },
  { id: 'storage', label: 'Storage', icon: HardDrive, color: 'purple' },
  { id: 'build_minutes', label: 'Build Minutes', icon: Clock, color: 'amber' },
  { id: 'function_executions', label: 'Function Executions', icon: Zap, color: 'sky' },
];

const COLOR_MAP = {
  indigo: {
    bar: 'bg-indigo-500',
    iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
    iconText: 'text-indigo-500 dark:text-indigo-400',
    badge: 'text-indigo-600 dark:text-indigo-400',
  },
  purple: {
    bar: 'bg-purple-500',
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/15',
    iconText: 'text-purple-500 dark:text-purple-400',
    badge: 'text-purple-600 dark:text-purple-400',
  },
  amber: {
    bar: 'bg-amber-500',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/15',
    iconText: 'text-amber-500 dark:text-amber-400',
    badge: 'text-amber-600 dark:text-amber-400',
  },
  sky: {
    bar: 'bg-sky-500',
    iconBg: 'bg-sky-500/10 dark:bg-sky-500/15',
    iconText: 'text-sky-500 dark:text-sky-400',
    badge: 'text-sky-600 dark:text-sky-400',
  },
};

/**
 * Compact Infrastructure Usage overview card for the Dashboard.
 * Displays Bandwidth, Storage, and Build Minutes with progress bars.
 * Links to the dedicated Usage page for full analytics.
 */
export default function InfrastructureUsageCard({ usage = MOCK_USAGE_SUMMARY }) {
  const usageMap = Object.fromEntries(usage.map((u) => [u.id, u]));

  return (
    <Link to="/dashboard/usage" className="block group focus:outline-none focus:ring-2 focus:ring-indigo-500/80 rounded-[18px] transition-all">
      <Card
        className="max-w-full py-5 px-6"
        className="group-hover:-translate-y-[3px] group-hover:border-indigo-500/40 dark:group-hover:border-indigo-500/30"
      >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/5 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200/60 dark:from-slate-800/80 dark:to-slate-800/40 text-muted-foreground ring-1 ring-slate-200/50 dark:ring-white/5">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground tracking-tight">
              Infrastructure Usage
            </h2>
            <p className="text-sm text-muted-foreground">
              Monthly resource consumption
            </p>
          </div>
        </div>
      </div>

      {/* Compact Metrics List */}
      <div className="space-y-3">
        {METRICS.map(({ id, label, icon: Icon, color }) => {
          const data = usageMap[id];
          if (!data) return null;

          const colors = COLOR_MAP[color];
          const percent = Math.min(data.percent, 100);
          const isHigh = percent >= 80;

          return (
            <div
              key={id}
              className="flex items-center gap-3 group"
            >
              {/* Icon */}
              <div className={`p-1.5 rounded-lg ${colors.iconBg} flex-shrink-0 transition-transform duration-200 group-hover:scale-110`}>
                <Icon className={`w-4 h-4 ${colors.iconText}`} />
              </div>

              {/* Label + Progress */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-foreground truncate">
                    {label}
                  </span>
                  <span className={`text-xs font-bold font-mono tabular-nums ${
                    isHigh
                      ? 'text-red-500 dark:text-red-400'
                      : colors.badge
                  }`}>
                    {data.percent}%
                  </span>
                </div>

                {/* Progress Bar */}
                <Progress 
                  percent={percent} 
                  color={isHigh ? 'bg-red-500' : colors.bar} 
                  height="h-1.5" 
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Link */}
      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/5">
        <div
          className="flex items-center justify-between text-xs font-semibold text-muted-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200"
        >
          <span>View Full Usage</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Card>
    </Link>
  );
}
