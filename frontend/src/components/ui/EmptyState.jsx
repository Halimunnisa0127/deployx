import React from "react";
import Button from "./Button";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className = "",
  minHeight = "h-[400px]",
}) {
  return (
    <div
      className={`bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800/80 p-8 flex flex-col items-center justify-center text-center shadow-lg ${minHeight} ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-slate-500 dark:text-slate-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">{description}</p>

      <div className="flex flex-col sm:flex-row gap-3">
        {secondaryAction && (
          <Button variant="secondary" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
        {primaryAction && (
          <Button
            variant="primary"
            onClick={primaryAction.onClick}
            iconLeft={primaryAction.icon}
          >
            {primaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}
