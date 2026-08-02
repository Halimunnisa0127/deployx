import React from "react";
import Card from "../../../components/ui/Card";
import Skeleton from "../../../components/ui/Skeleton";

export function StatisticsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-3 w-20 mb-4" />
          <Skeleton className="h-1 w-full rounded-full" />
        </Card>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <Card className="p-5 sm:p-6">
      <Skeleton className="h-6 w-40 mb-2" />
      <Skeleton className="h-4 w-24 mb-6" />
      <Skeleton className="h-[250px] w-full rounded-lg" />
    </Card>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <Card className=" overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-slate-900">
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="p-5 space-y-4">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-5 w-1/4" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function PlatformHealthSkeleton() {
  return (
    <Card className="h-full p-5 sm:p-6">
      <div className="flex justify-between mb-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-800/50"
          >
            <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-6 w-16 rounded shrink-0" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ActivitySkeleton() {
  return (
    <Card className="h-full p-5 sm:p-6">
      <Skeleton className="h-6 w-40 mb-6" />
      <div className="space-y-6 ml-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="pl-6">
            <div className="p-3.5 rounded-xl bg-slate-800/20">
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-3 w-full max-w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function QuickActionSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5"
        >
          <Skeleton className="w-10 h-10 rounded-xl mb-3" />
          <Skeleton className="h-5 w-24 mb-2" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
}

