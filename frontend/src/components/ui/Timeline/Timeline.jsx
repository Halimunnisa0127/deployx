import React from 'react';

export function Timeline({ children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );
}

export function TimelineItem({
  children,
  isLast = false,
  time,
  icon,
  iconContainerClassName = "w-12 h-12 rounded-full border flex items-center justify-center bg-slate-500/10 border-slate-500/20 text-slate-400",
  lineClassName = "left-6 top-10 bottom-[-1.5rem]"
}) {
  return (
    <div className="flex gap-4 relative">
      {!isLast && (
        <div className={`absolute w-px bg-slate-200 dark:bg-slate-800/80 ${lineClassName}`}></div>
      )}

      {time && (
        <div className="flex-none pt-1">
          <div className="text-xs text-slate-500 font-mono w-24 text-right pr-2">
            {time}
          </div>
        </div>
      )}

      <div className={`shrink-0 z-10 ${iconContainerClassName}`}>
        {icon}
      </div>

      <div className="flex-1 pb-8">
        {children}
      </div>
    </div>
  );
}
