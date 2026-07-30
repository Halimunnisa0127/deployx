import React from 'react';
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
    <Card className="border border-slate-200/80 dark:border-white/10 rounded-2xl
                     backdrop-blur-xl bg-white/80 dark:bg-slate-900/70
                     shadow-sm dark:shadow-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      
      {/* Left Details */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg border ${bgClass} ${colorClass}`}>
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Infrastructure Efficiency
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Overall resource utilization and health score
            </p>
          </div>
        </div>

        <div className="flex gap-8 mt-1">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Grade
            </div>
            <div className={`text-2xl leading-none font-black ${colorClass}`}>
              {grade}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Resource Health
            </div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {health}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Opportunities
            </div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {tipsCount} <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Circular Progress */}
      <div className="relative flex items-center justify-center shrink-0 w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
          <circle
            className="stroke-slate-100 dark:stroke-slate-800/80"
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
          <span className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">
            {score}
          </span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
            Score
          </span>
        </div>
      </div>
    </Card>
  );
}
