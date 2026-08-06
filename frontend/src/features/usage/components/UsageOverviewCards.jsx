import { Wifi, HardDrive, Clock, Cpu, TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { Progress } from '../../../components/ui';

const METRIC_ICONS = {
  bandwidth: Wifi,
  storage: HardDrive,
  build_minutes: Clock,
  function_executions: Cpu,
};

const METRIC_COLORS = {
  bandwidth: {
    badgeBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400',
    iconColor: 'text-indigo-500 dark:text-indigo-400',
    barColor: 'bg-indigo-500',
  },
  storage: {
    badgeBg: 'bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400',
    iconColor: 'text-purple-500 dark:text-purple-400',
    barColor: 'bg-purple-500',
  },
  build_minutes: {
    badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
    iconColor: 'text-amber-500 dark:text-amber-400',
    barColor: 'bg-amber-500',
  },
  function_executions: {
    badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    barColor: 'bg-emerald-500',
  },
};

export default function UsageOverviewCards({ summary = {} }) {
  const cards = Object.values(summary);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-extrabold text-foreground tracking-tight">
          Usage Overview
        </h2>
        <span className="text-xs font-mono text-muted-foreground">
          Updated live
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((item) => {
          const Icon = METRIC_ICONS[item.id] || Wifi;
          const colors = METRIC_COLORS[item.id] || METRIC_COLORS.bandwidth;
          const TrendIcon = item.isUp ? TrendingUp : TrendingDown;

          return (
            <Card
              key={item.id}
              style={{ maxWidth: '100%', padding: '24px 28px' }}
              className="relative border-border rounded-[18px] backdrop-blur-xl bg-card/80 shadow-sm transition-all duration-300 group"
            >
              <div className="space-y-6">
                {/* Header: Title & Icon Pill */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {item.title}
                  </span>
                  <div className={`p-2.5 rounded-xl border ${colors.badgeBg} transition-colors`}>
                    <Icon className={`w-5 h-5 ${colors.iconColor}`} />
                  </div>
                </div>

                {/* Main Metric: Current Usage / Limit */}
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {item.used} <span className="text-xs sm:text-sm font-semibold text-muted-foreground">{item.unit}</span>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono mt-1">
                    Limit: <span className="font-semibold text-foreground">{item.limit} {item.unit}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <Progress 
                  percent={item.percent} 
                  color={colors.barColor} 
                  height="h-2.5" 
                />

                {/* Footer: Trend */}
                <div className="flex items-center pt-2 border-t border-border text-xs">
                  <div className={`flex items-center gap-1 font-bold ${item.isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    <TrendIcon className="w-4 h-4" />
                    <span>{item.trend}</span>
                  </div>
                </div>
              </div>

              {/* Hover Tooltip: Secondary Stats */}
              <div
                className="absolute left-0 right-0 -bottom-px z-20
                           transition-all duration-200 ease-out
                           opacity-0 translate-y-[calc(100%-6px)] pointer-events-none
                           group-hover:opacity-100 group-hover:translate-y-full group-hover:pointer-events-auto"
              >
                <div className="mx-0.5 mt-1 rounded-xl
                                bg-card
                                border border-border
                                backdrop-blur-md shadow-xl px-4 py-3">
                  <div className="flex justify-between items-center text-xs font-mono font-semibold">
                    <span className="text-foreground">{item.percent}% used</span>
                    <span className="text-muted-foreground">{item.remaining} {item.unit} remaining</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2 pt-2 border-t border-border text-center">
                    vs last period
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
