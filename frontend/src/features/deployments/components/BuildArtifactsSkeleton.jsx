import Skeleton from '../../../components/ui/Skeleton';

export default function BuildArtifactsSkeleton({ count = 3 }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-6 text-left animate-pulse">
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
        <Skeleton width="160px" height="20px" />
        <Skeleton width="120px" height="20px" borderRadius="6px" />
      </div>

      <div className="divide-y divide-slate-800/60 border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/40">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Skeleton variant="circular" width="40px" height="40px" borderRadius="12px" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton width="120px" height="16px" />
                  <Skeleton width="40px" height="16px" borderRadius="4px" />
                  <Skeleton width="60px" height="16px" borderRadius="4px" />
                </div>
                <Skeleton width="140px" height="12px" />
              </div>
            </div>
            <Skeleton width="90px" height="32px" borderRadius="8px" />
          </div>
        ))}
      </div>
    </div>
  );
}
