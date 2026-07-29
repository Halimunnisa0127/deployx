import { Check } from 'lucide-react';
import { STEPS } from '../constants/wizardConstants';

export default function WizardStepper({ currentStep }) {
  return (
    <div className="border-b border-slate-800/60 bg-slate-900/40 px-4 sm:px-8 py-3 overflow-x-auto scrollbar-none z-20">
      <div className="max-w-5xl mx-auto flex items-center justify-between min-w-[640px] gap-2">
        {STEPS.map((stepItem) => {
          const isCompleted = stepItem.id < currentStep;
          const isActive = stepItem.id === currentStep;

          return (
            <div
              key={stepItem.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-500/15 border border-blue-500/30 text-blue-400 font-medium'
                  : isCompleted
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 opacity-60'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : isActive
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-500'
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
