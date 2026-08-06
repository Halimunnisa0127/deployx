import Skeleton from '../../../components/ui/Skeleton';

export default function DeploymentOverviewSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-6 animate-pulse">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
        <Skeleton width="180px" height="20px" />
        <Skeleton width="90px" height="20px" borderRadius="999px" />
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <Skeleton width="60px" height="12px" />
          <Skeleton width="100px" height="24px" borderRadius="999px" />
        </div>
        <div className="space-y-2">
          <Skeleton width="110px" height="12px" />
          <div className="flex gap-2">
            <Skeleton width="70px" height="22px" borderRadius="4px" />
            <Skeleton width="60px" height="22px" borderRadius="4px" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton width="140px" height="12px" />
          <div className="flex gap-2">
            <Skeleton width="80px" height="22px" borderRadius="999px" />
            <Skeleton width="90px" height="22px" borderRadius="4px" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton width="90px" height="12px" />
          <Skeleton width="80px" height="22px" />
        </div>
      </div>

      {/* Commit Box */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-2">
        <Skeleton width="100px" height="12px" />
        <Skeleton width="90%" height="16px" />
      </div>
    </div>
  );
}
