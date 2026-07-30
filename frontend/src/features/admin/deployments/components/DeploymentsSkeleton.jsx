import React from "react";
import { Card } from "../../../../components/common/Card";
import Skeleton from "../../../../components/ui/Skeleton";

export function DeploymentsTableSkeleton({ rows = 6 }) {
  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden shadow-lg animate-in fade-in duration-300">
      <div className="p-5 border-b border-slate-800/80">
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="p-5 space-y-4">
        {[...Array(rows)].map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center py-3 border-b border-slate-800/30 last:border-0"
          >
            <div className="flex items-center gap-3 w-1/4">
              <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-5 w-24 rounded" />
            <Skeleton className="h-5 w-20 rounded" />
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-6 rounded shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card
          key={i}
          className="p-5 sm:p-6 bg-slate-900/60 border-slate-800/80"
        >
          <div className="flex justify-between items-start mb-4">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="w-8 h-8 rounded-lg" />
          </div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-3 w-28 mb-4" />
          <Skeleton className="h-1 w-full rounded-full" />
        </Card>
      ))}
    </div>
  );
}

export function DrawerSkeleton() {
  return (
    <div className="p-6 space-y-8 animate-pulse">
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-xl" />
        <div>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}
