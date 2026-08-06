import Skeleton from "../../../../components/ui/Skeleton";

export function OverviewSkeleton() {
  return (
    <div className="p-6 bg-card border border-border rounded-2xl mb-8 flex flex-col md:flex-row justify-between gap-6 animate-pulse">
      <div className="flex items-center gap-6">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
      <div className="flex gap-4 md:gap-8 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-border">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-6 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function InfraSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-card rounded-2xl border border-border p-5 animate-pulse"
        >
          <div className="flex items-start gap-3 mb-4">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="flex-1">
              <Skeleton className="h-5 w-2/3 mb-2" />
              <Skeleton className="h-4 w-20 rounded-full" />
            </div>
            <Skeleton className="w-6 h-6 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <Skeleton className="h-3 w-12 mb-1" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MetricSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-card rounded-2xl border border-border p-5 h-[250px] flex flex-col animate-pulse"
        >
          <Skeleton className="h-5 w-24 mb-2" />
          <Skeleton className="h-8 w-16" />
          <div className="flex-1 flex items-end justify-between gap-2 pt-10">
            {[...Array(12)].map((_, j) => (
              <Skeleton
                key={j}
                className="w-full rounded-t-sm"
                style={{ height: `${Math.max(20, Math.random() * 100)}%` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
