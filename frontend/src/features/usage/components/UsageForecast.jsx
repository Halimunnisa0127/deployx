import { Wifi, HardDrive, Clock, Cpu, TrendingUp, ShieldCheck, AlertTriangle, AlertCircle, CalendarDays } from 'lucide-react';
import Card from '../../../components/ui/Card';

/* ─── resource config ────────────────────────────────────────── */
const RESOURCE_CONFIG = {
  bandwidth: {
    icon:      Wifi,
    label:     'Bandwidth',
    iconBg:    'bg-blue-500/10 border-blue-500/20 text-blue-500 dark:text-blue-400',
    accentText:'text-blue-600 dark:text-blue-400',
  },
  storage: {
    icon:      HardDrive,
    label:     'Storage',
    iconBg:    'bg-purple-500/10 border-purple-500/20 text-purple-500 dark:text-purple-400',
    accentText:'text-purple-600 dark:text-purple-400',
  },
  build_minutes: {
    icon:      Clock,
    label:     'Build Minutes',
    iconBg:    'bg-orange-500/10 border-orange-500/20 text-orange-500 dark:text-orange-400',
    accentText:'text-orange-600 dark:text-orange-400',
  },
  function_executions: {
    icon:      Cpu,
    label:     'Functions',
    iconBg:    'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 dark:text-emerald-400',
    accentText:'text-emerald-600 dark:text-emerald-400',
  },
};

/* ─── status derived from forecast percent ───────────────────── */
function deriveStatus(forecastPercent) {
  if (forecastPercent >= 90) return 'Critical';
  if (forecastPercent >= 70) return 'Warning';
  return 'Safe';
}

const STATUS_CONFIG = {
  Safe:     { icon: ShieldCheck,   css: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  Warning:  { icon: AlertTriangle, css: 'bg-amber-500/10  text-amber-600  dark:text-amber-400  border-amber-500/20' },
  Critical: { icon: AlertCircle,   css: 'bg-rose-500/10   text-rose-600   dark:text-rose-400   border-rose-500/20' },
};

/* ─── single forecast card ───────────────────────────────────── */
function ForecastCard({ resource }) {
  const cfg           = RESOURCE_CONFIG[resource.id] || RESOURCE_CONFIG.bandwidth;
  const Icon          = cfg.icon;
  const forecastPct   = resource.forecastPercent;
  const statusKey     = deriveStatus(forecastPct);
  const status        = STATUS_CONFIG[statusKey];
  const StatusIcon    = status.icon;

  const forecastDelta = (resource.forecastUsed - resource.currentUsed).toFixed(1);

  return (
    <Card
      style={{ maxWidth: '100%', padding: '16px 18px' }}
      className={`border border-slate-200/80 dark:border-white/10 rounded-2xl
                  backdrop-blur-xl bg-white/80 dark:bg-slate-900/70
                  shadow-sm dark:shadow-xl flex flex-col gap-3
                  hover:-translate-y-1 hover:shadow-md
                  transition-all duration-300 group`}
    >
      {/* ── Row 1: Icon + label + status badge ────────────────── */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg border shrink-0 ${cfg.iconBg} transition-transform duration-300 group-hover:scale-105`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {cfg.label}
          </span>
        </div>

        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${status.css}`}>
          <StatusIcon className="w-3 h-3" />
          {statusKey}
        </div>
      </div>

      {/* ── Row 2: Forecast end-of-month ──────────────────────── */}
      <div>
        <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none flex items-baseline gap-1.5">
          {resource.forecastUsed}
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            {resource.unit}
          </span>
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
          Projected by end of month
        </div>
      </div>

      {/* ── Row 3: Forecast stats row ─────────────────────────── */}
      <div className="pt-2 mt-1 border-t border-slate-100 dark:border-white/5">
        {/* Delta */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase font-semibold tracking-wide text-slate-400 dark:text-slate-500">
            Predicted Growth
          </span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3 text-slate-400 shrink-0" />
            +{forecastDelta} {resource.unit}
          </span>
        </div>
      </div>
    </Card>
  );
}

/* ─── section wrapper ────────────────────────────────────────── */
export default function UsageForecast({ forecasts = [] }) {
  if (!forecasts.length) return null;

  // Get today's date for display
  const now     = new Date();
  const eomDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const eomStr  = eomDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const daysLeft = eomDate.getDate() - now.getDate();

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-500/10 dark:bg-violet-500/20
                          border border-violet-500/30 text-violet-600 dark:text-violet-400">
            <CalendarDays className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-none">
              Forecast Usage
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Projected end-of-month consumption based on current daily rate
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono font-bold
                        px-3 py-1.5 rounded-full
                        bg-violet-500/10 text-violet-600 dark:text-violet-400
                        border border-violet-500/20">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>EOM {eomStr} · {daysLeft}d left</span>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {forecasts.map((resource) => (
          <ForecastCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
}
