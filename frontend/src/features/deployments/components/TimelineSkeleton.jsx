import React from 'react';
import Skeleton from '../../../components/ui/Skeleton';

export default function TimelineSkeleton({ count = 5 }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-6 text-left animate-pulse">
      <div className="border-b border-slate-800/60 pb-3 flex justify-between items-center">
        <Skeleton width="210px" height="20px" />
        <Skeleton width="120px" height="20px" borderRadius="6px" />
      </div>

      <div className="relative pl-7 space-y-5 before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800/90">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="relative flex items-start gap-4">
            {/* Timeline Circle Node */}
            <div className="absolute -left-7 top-1 w-6 h-6 rounded-full border-2 border-slate-700 bg-slate-950 flex items-center justify-center">
              <Skeleton variant="circular" width="12px" height="12px" />
            </div>

            {/* Timeline Step Card */}
            <div className="flex-1 p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton width="130px" height="16px" />
                  <Skeleton width="70px" height="18px" borderRadius="999px" />
                </div>
                <Skeleton width="260px" height="12px" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton width="50px" height="18px" borderRadius="4px" />
                <Skeleton width="60px" height="14px" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
