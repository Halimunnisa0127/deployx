import { Wifi, HardDrive, Clock, Cpu, ShieldCheck, AlertTriangle, AlertCircle, Target, ArrowRight } from 'lucide-react';
import Card from '../../../components/ui/Card';

/* ─── resource config ────────────────────────────────────────── */
const RESOURCE_CONFIG = {
  bandwidth: {
    icon:      Wifi,
    label:     'Bandwidth',
    iconBg:    'bg-blue-500/10 border-blue-500/20 text-blue-500 dark:text-blue-400',
  },
  storage: {
    icon:      HardDrive,
    label:     'Storage',
    iconBg:    'bg-purple-500/10 border-purple-500/20 text-purple-500 dark:text-purple-400',
  },
  build_minutes: {
    icon:      Clock,
    label:     'Build Minutes',
    iconBg:    'bg-orange-500/10 border-orange-500/20 text-orange-500 dark:text-orange-400',
  },
  function_executions: {
    icon:      Cpu,
    label:     'Functions',
    iconBg:    'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 dark:text-emerald-400',
  },
};

/* ─── single goal card ───────────────────────────────────────── */
function GoalCard({ resource }) {
  const cfg = RESOURCE_CONFIG[resource.id] || RESOURCE_CONFIG.bandwidth;
  const Icon = cfg.icon;

  // Derive goal as 70% of the absolute limit for the sake of the tracker
  const goalLimit = Math.floor(resource.limit * 0.7);
  const currentVal = Math.floor(resource.currentUsed);
  const forecastVal = Math.floor(resource.forecastUsed);

  const isCritical = forecastVal > resource.limit;
  const isWarning = forecastVal > goalLimit && !isCritical;

  let statusKey = 'On Track';
  let StatusIcon = ShieldCheck;
  let statusCss = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';

  if (isCritical) {
    statusKey = 'Exceeded';
    StatusIcon = AlertCircle;
    statusCss = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
  } else if (isWarning) {
    statusKey = 'At Risk';
    StatusIcon = AlertTriangle;
    statusCss = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
  }

  return (
    <Card
      style={{ maxWidth: '100%', padding: '16px' }}
      className={`border border-border rounded-2xl
                  backdrop-blur-xl bg-card
                  shadow-sm dark:shadow-xl flex flex-col gap-3
                  hover:-translate-y-1 hover:shadow-lg
                  transition-all duration-300 group`}
    >
      {/* ── Header: Icon + label + status badge ────────────────── */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg border shrink-0 ${cfg.iconBg} transition-transform duration-300 group-hover:scale-110`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-base font-extrabold tracking-wide text-foreground uppercase">
            {cfg.label}
          </span>
        </div>

        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border shrink-0 ${statusCss}`}>
          <StatusIcon className="w-3 h-3" />
          {statusKey}
        </div>
      </div>

      {/* ── Goal Tracker ───────────────────────────────────────── */}
      <div className="p-2.5 bg-muted rounded-xl border border-border mt-1">
        <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-0.5 flex items-center gap-1">
          <Target className="w-3 h-3" />
          Goal
        </div>
        <div className="text-sm font-bold text-foreground">
          Stay below {goalLimit} {resource.unit}
        </div>
      </div>

      {/* ── Current & Forecast grid ────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border">
        <div>
          <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-0.5">
            Current
          </div>
          <div className="text-xl font-black text-foreground tracking-tight flex items-baseline gap-1">
            {currentVal} <span className="text-sm font-semibold text-muted-foreground">{resource.unit}</span>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 text-muted-foreground hidden sm:block">
            <ArrowRight className="w-3 h-3" />
          </div>
          <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-0.5 sm:pl-2">
            Forecast
          </div>
          <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight flex items-baseline gap-1 sm:pl-2">
            {forecastVal} <span className="text-sm font-semibold text-indigo-400/70 dark:text-indigo-500/70">{resource.unit}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ─── section wrapper ────────────────────────────────────────── */
export default function UsageGoals({ goals = [] }) {
  if (!goals.length) return null;

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20
                          border border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
            <Target className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-foreground leading-none">
              Goal Tracking
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Monitor current usage and EOM forecast against personalized targets
            </p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {goals.map((resource) => (
          <GoalCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
}
