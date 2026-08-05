import {
  Lightbulb, Rocket, Terminal, Zap, Archive,
  ArrowUpRight, Clock, TrendingUp, Gauge, Sliders,
  DollarSign,
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

/* ─── icon map ──────────────────────────────────────────────── */
const TIP_ICONS = { Rocket, Terminal, Zap, Archive };

/* ─── priority badge styles ──────────────────────────────────── */
const PRIORITY_STYLES = {
  'High Priority':   'bg-rose-500/10   text-rose-600   dark:text-rose-400   border-rose-500/25',
  'Medium Priority': 'bg-amber-500/10  text-amber-600  dark:text-amber-400  border-amber-500/25',
  'Low Priority':    'bg-blue-500/10   text-blue-600   dark:text-blue-400   border-blue-500/25',
};

/* ─── difficulty styles ──────────────────────────────────────── */
const DIFFICULTY_STYLES = {
  Easy:   { pill: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-500' },
  Medium: { pill: 'bg-amber-500/10   text-amber-600   dark:text-amber-400   border-amber-500/20',   dot: 'bg-amber-500'   },
  Hard:   { pill: 'bg-rose-500/10    text-rose-600    dark:text-rose-400    border-rose-500/20',    dot: 'bg-rose-500'    },
};

/* ─── impact styles ─────────────────────────────────────────── */
const IMPACT_STYLES = {
  'High Impact':   'text-indigo-600 dark:text-indigo-400',
  'Medium Impact': 'text-amber-600  dark:text-amber-400',
  'Low Impact':    'text-muted-foreground',
};

export default function OptimizationTips({ tips = [] }) {
  // Only display actionable recommendations
  const actionableTips = tips.filter(tip => tip.actionLabel && tip.actionLabel.trim() !== '');

  if (actionableTips.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20
                          border border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-foreground leading-none">
              Quota Optimization
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Actionable savings recommendations sorted by impact
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex text-xs font-mono font-bold px-3 py-1.5
                         rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400
                         border border-emerald-500/20">
          Actionable Savings
        </span>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {actionableTips.map((tip) => {
          const Icon            = TIP_ICONS[tip.icon] || Lightbulb;
          const priority        = tip.priority        || 'Medium Priority';
          const difficulty      = tip.difficulty      || 'Easy';
          const impact          = tip.impact          || 'High Impact';
          const timeRequired    = tip.timeRequired    || '2 mins';
          const estimatedSavings    = tip.estimatedSavings    || '–';
          const monthlyCostSavings  = tip.monthlyCostSavings  || null;

          const priorityStyle   = PRIORITY_STYLES[priority]  || PRIORITY_STYLES['Medium Priority'];
          const diffStyle       = DIFFICULTY_STYLES[difficulty] || DIFFICULTY_STYLES.Easy;
          const impactStyle     = IMPACT_STYLES[impact]       || IMPACT_STYLES['Medium Impact'];

          return (
            <Card
              key={tip.id}
              style={{ maxWidth: '100%', padding: '12px' }}
              className="border border-border/80 rounded-2xl
                         backdrop-blur-xl bg-card/80
                         shadow-sm dark:shadow-xl flex flex-col gap-2.5
                         hover:-translate-y-1 hover:shadow-lg
                         hover:border-indigo-400/40 dark:hover:border-indigo-400/30
                         transition-all duration-300 group"
            >
              {/* ── Top: Icon + Priority ─────────────────────── */}
              <div className="flex items-center justify-between gap-2">
                <div className="p-1.5 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20
                                border border-indigo-500/30 text-indigo-600 dark:text-indigo-400
                                transition-transform duration-300
                                group-hover:scale-110 shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                                  text-xs font-extrabold border shrink-0 ${priorityStyle}`}>
                  <Sliders className="w-3 h-3" />
                  {priority}
                </span>
              </div>

              {/* ── Title + Description ──────────────────────── */}
              <div>
                <h3 className="text-sm font-extrabold text-foreground
                               group-hover:text-indigo-600 dark:group-hover:text-indigo-400
                               transition-colors leading-snug line-clamp-1">
                  {tip.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                  {tip.description}
                </p>
              </div>

              {/* ── Savings block ────────────────────────────── */}
              <div className="rounded-xl bg-muted
                              border border-border/80
                              px-3 py-2.5 flex items-center justify-between gap-2 mt-auto">
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider
                                   text-muted-foreground mb-0.5">
                    Est. Savings
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400
                                     tracking-tight leading-none">
                      {estimatedSavings}
                    </span>
                    {monthlyCostSavings && (
                      <span className="text-xs font-bold text-emerald-600/80 dark:text-emerald-400/80">
                        ({monthlyCostSavings})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Metadata row: Difficulty | Time | Impact ─── */}
              <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-border/50">
                {/* Difficulty */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase font-semibold tracking-wider text-muted-foreground">
                    Difficulty
                  </span>
                  <span className={`inline-flex items-center gap-1.5 self-start px-2 py-0.5 rounded text-sm font-bold border ${diffStyle.pill}`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${diffStyle.dot}`} />
                    {difficulty}
                  </span>
                </div>

                {/* Time */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase font-semibold tracking-wider text-muted-foreground">
                    Time
                  </span>
                  <span className="text-xs font-bold font-mono text-foreground pt-0.5">
                    {timeRequired}
                  </span>
                </div>

                {/* Impact */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase font-semibold tracking-wider text-muted-foreground">
                    Impact
                  </span>
                  <span className={`text-xs font-extrabold leading-tight pt-0.5 ${impactStyle}`}>
                    {impact.replace(' Impact', '')}
                  </span>
                </div>
              </div>

              {/* ── Action button ────────────────────────────── */}
              <div className="pt-1">
                <Button variant="secondary" size="sm" fullWidth iconLeft={<ArrowUpRight className="w-3 h-3" />}>
                  {tip.actionLabel}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
