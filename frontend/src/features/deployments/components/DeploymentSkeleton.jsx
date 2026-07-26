import React from 'react';
import Skeleton from '../../../components/ui/Skeleton';

export default function DeploymentSkeleton({ count = 4 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index}
          className="p-5 sm:p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton variant="circular" width="40px" height="40px" />
              <div className="space-y-2">
                <Skeleton width="180px" height="18px" />
                <Skeleton width="120px" height="12px" />
              </div>
            </div>
            <Skeleton width="80px" height="24px" borderRadius="999px" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton width="90px" height="20px" />
              <Skeleton width="70px" height="20px" />
            </div>
            <Skeleton width="100%" height="16px" />
          </div>

          <div className="pt-2 border-t border-slate-800/40 flex items-center justify-between">
            <Skeleton width="140px" height="14px" />
            <Skeleton width="160px" height="14px" />
          </div>
        </div>
      ))}
    </div>
  );
}
