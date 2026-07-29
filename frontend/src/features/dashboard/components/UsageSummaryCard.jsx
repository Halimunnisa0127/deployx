import { Gauge, Wifi, HardDrive, Clock, Cpu } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { MOCK_USAGE_SUMMARY } from '../data/mockDashboardData';

const METRIC_ICON_MAP = {
  bandwidth: <Wifi className="w-4 h-4 text-indigo-400" />,
  storage: <HardDrive className="w-4 h-4 text-purple-400" />,
  build_minutes: <Clock className="w-4 h-4 text-amber-400" />,
  function_executions: <Cpu className="w-4 h-4 text-emerald-400" />,
};

const PROGRESS_COLOR_MAP = {
  bandwidth: 'bg-indigo-500',
  storage: 'bg-purple-500',
  build_minutes: 'bg-amber-500',
  function_executions: 'bg-emerald-500',
};

export default function UsageSummaryCard({ usage = MOCK_USAGE_SUMMARY }) {
  return (
    <Card style={{ maxWidth: '100%', padding: '24px' }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100 tracking-tight">
            Usage Summary
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-400 font-mono">
          Monthly Quota
        </span>
      </div>

      {/* Grid / List of Resource Progress Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {usage.map((item) => {
          const colorClass = PROGRESS_COLOR_MAP[item.id] || 'bg-indigo-500';
          const icon = METRIC_ICON_MAP[item.id] || <Gauge className="w-4 h-4 text-slate-400" />;

          return (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 space-y-2.5 transition-colors group"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700/60 flex-shrink-0">
                    {icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                    {item.name}
                  </span>
                </div>

                <span className="text-xs font-mono font-semibold text-slate-300 flex-shrink-0">
                  {item.used} / {item.total} {item.unit}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colorClass} rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${Math.min(item.percent, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{item.percent}% used</span>
                  <span>{100 - item.percent}% remaining</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
