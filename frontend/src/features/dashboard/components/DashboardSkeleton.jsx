import Card from '../../../components/ui/Card';
import Skeleton from '../../../components/ui/Skeleton';

export function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {[1, 2, 3, 4].map((idx) => (
        <Card key={idx} className="max-w-full py-5 px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <Skeleton width="60%" height="14px" />
              <Skeleton width="40%" height="28px" />
              <Skeleton width="80%" height="12px" />
            </div>
            <Skeleton variant="circular" width="44px" height="44px" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function RecentDeploymentsSkeleton() {
  return (
    <Card className="max-w-full p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
        <Skeleton width="180px" height="20px" />
        <Skeleton width="60px" height="14px" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="flex items-center justify-between gap-3 py-2">
            <div className="flex items-center gap-3 flex-1">
              <Skeleton variant="circular" width="36px" height="36px" />
              <div className="space-y-1.5 flex-1">
                <Skeleton width="40%" height="16px" />
                <Skeleton width="60%" height="12px" />
              </div>
            </div>
            <Skeleton width="80px" height="28px" borderRadius="8px" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function SystemStatusSkeleton() {
  return (
    <Card className="max-w-full p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800/80 mb-4">
        <Skeleton width="140px" height="20px" />
        <Skeleton width="100px" height="18px" borderRadius="999px" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((idx) => (
          <div key={idx} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-100/60 dark:bg-slate-900/40">
            <div className="flex items-center gap-2.5 flex-1">
              <Skeleton variant="circular" width="32px" height="32px" />
              <div className="space-y-1 flex-1">
                <Skeleton width="50%" height="14px" />
                <Skeleton width="30%" height="10px" />
              </div>
            </div>
            <Skeleton width="60px" height="16px" borderRadius="999px" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ActivityTimelineSkeleton() {
  return (
    <Card className="max-w-full p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800/80 mb-4">
        <Skeleton width="150px" height="20px" />
        <Skeleton width="50px" height="14px" />
      </div>

      <div className="space-y-4 pl-2">
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="flex items-start gap-3">
            <Skeleton variant="circular" width="24px" height="24px" />
            <div className="space-y-1.5 flex-1">
              <Skeleton width="80%" height="14px" />
              <Skeleton width="40%" height="10px" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function UsageSummarySkeleton() {
  return (
    <Card className="max-w-full p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800/80 mb-4">
        <Skeleton width="160px" height="20px" />
        <Skeleton width="80px" height="14px" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-slate-100/60 dark:bg-slate-900/40 space-y-2.5">
            <div className="flex justify-between">
              <Skeleton width="40%" height="14px" />
              <Skeleton width="30%" height="14px" />
            </div>
            <Skeleton width="100%" height="8px" borderRadius="999px" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 md:space-y-8 pb-8 animate-pulse">
      <Skeleton height="120px" borderRadius="16px" />
      <StatCardsSkeleton />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <RecentDeploymentsSkeleton />
          <UsageSummarySkeleton />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <SystemStatusSkeleton />
          <ActivityTimelineSkeleton />
        </div>
      </div>
    </div>
  );
}
