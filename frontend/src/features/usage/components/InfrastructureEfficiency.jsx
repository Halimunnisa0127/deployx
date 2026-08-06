import Card from '../../../components/ui/Card';
import { Zap } from 'lucide-react';

export default function InfrastructureEfficiency({ score = 88, tipsCount = 2 }) {
  let grade = 'A';
  let health = 'Excellent';
  let colorClass = 'text-emerald-500';
  let strokeClass = 'stroke-emerald-500';
  let bgClass = 'bg-emerald-500/10 border-emerald-500/20';

  if (score < 90) {
    grade = 'B';
    health = 'Good';
    colorClass = 'text-indigo-500 dark:text-indigo-400';
    strokeClass = 'stroke-indigo-500';
    bgClass = 'bg-indigo-500/10 border-indigo-500/20';
  }
  if (score < 75) {
    grade = 'C';
    health = 'Needs Review';
    colorClass = 'text-amber-500 dark:text-amber-400';
    strokeClass = 'stroke-amber-500';
    bgClass = 'bg-amber-500/10 border-amber-500/20';
  }
  if (score < 60) {
    grade = 'D';
    health = 'Poor';
    colorClass = 'text-rose-500 dark:text-rose-400';
    strokeClass = 'stroke-rose-500';
    bgClass = 'bg-rose-500/10 border-rose-500/20';
  }

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="h-full border border-border/80 rounded-2xl
                     backdrop-blur-xl bg-card/80
                     shadow-sm dark:shadow-xl p-5 sm:p-6 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg border ${bgClass} ${colorClass}`}>
          <Zap className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-foreground">
            Infrastructure Efficiency
          </h3>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">
            Overall resource utilization and health score
          </p>
        </div>
      </div>

      {/* Main Score (Centered) */}
      <div className="flex-1 flex items-center justify-center py-2">
        <div className="relative flex items-center justify-center w-36 h-36">
          <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 96 96">
            <circle
              className="stroke-muted"
              strokeWidth="8"
              fill="transparent"
              r={radius}
              cx="48"
              cy="48"
            />
            <circle
              className={`${strokeClass} transition-all duration-1000 ease-out`}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              r={radius}
              cx="48"
              cy="48"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-foreground leading-none tracking-tighter">
              {score}
            </span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
              Score
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Stats */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/50">
        <div className="text-center flex flex-col gap-1">
          <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            Grade
          </div>
          <div className={`text-xl leading-none font-black ${colorClass}`}>
            {grade}
          </div>
        </div>
        <div className="text-center border-l border-border/50 flex flex-col gap-1">
          <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            Health
          </div>
          <div className="text-sm font-bold text-foreground">
            {health}
          </div>
        </div>
        <div className="text-center border-l border-border/50 flex flex-col gap-1">
          <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            Pending
          </div>
          <div className="text-sm font-bold text-foreground">
            {tipsCount} <span className="font-semibold text-muted-foreground text-xs">tips</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
