import { Card } from "../../../../components/common/Card";
import Skeleton from "../../../../components/ui/Skeleton";

export function DeploymentsTableSkeleton({ rows = 5 }) {
  return (
    <Card className="overflow-hidden p-0 animate-in fade-in duration-300">
      <div className="p-5 border-b border-border">
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="p-5 space-y-4">
        {[...Array(rows)].map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center py-3 border-b border-border last:border-0"
          >
            <div className="flex items-center gap-3 w-1/4">
              <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-1.5" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <Skeleton className="h-5 w-24 rounded" />
            <Skeleton className="h-5 w-20 rounded" />
            <Skeleton className="h-5 w-24 rounded" />
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-6 w-6 rounded shrink-0" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function DeploymentsStatisticsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {[1, 2, 3, 4].map((i) => (
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
