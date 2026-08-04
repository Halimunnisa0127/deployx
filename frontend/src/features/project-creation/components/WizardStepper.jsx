import { Check } from 'lucide-react';
import { STEPS } from '../constants/wizardConstants';

export default function WizardStepper({ currentStep }) {
  return (
    <div className="border-b border-slate-200 bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/40 px-4 sm:px-8 py-3 overflow-x-auto scrollbar-none z-20">
      <div className="max-w-5xl mx-auto flex items-center justify-between min-w-[640px] gap-2">
        {STEPS.map((stepItem) => {
          const isCompleted = stepItem.id < currentStep;
          const isActive = stepItem.id === currentStep;

          return (
            <div
              key={stepItem.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-50 border border-blue-200 text-blue-600 font-medium dark:bg-blue-500/15 dark:border-blue-500/30 dark:text-blue-400'
                  : isCompleted
                  ? 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  : 'text-slate-400 dark:text-slate-600 opacity-60'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30'
                    : isActive
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepItem.id}
              </div>
              <span className="text-xs font-medium whitespace-nowrap">{stepItem.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
