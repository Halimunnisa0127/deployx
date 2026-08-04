import React from "react";
import { Card } from "../../../../components/common/Card";
import Skeleton from "../../../../components/ui/Skeleton";

export function KPISkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card
          key={i}
          className="p-5 sm:p-6"

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

export function ChartSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm dark:shadow-lg h-[350px] flex flex-col animate-pulse">

      <div className="mb-4">
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex-1 flex items-end justify-between gap-2 pt-10">
        {[...Array(12)].map((_, i) => (
          <Skeleton
            key={i}
            className="w-full rounded-t-sm"
            style={{ height: `${Math.max(20, Math.random() * 100)}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm dark:shadow-lg h-[350px] flex flex-col animate-pulse">

      <div className="mb-4">
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex-1 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="flex flex-col items-end">
              <Skeleton className="h-4 w-12 mb-2" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

