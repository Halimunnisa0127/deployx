import Skeleton from '../../../components/ui/Skeleton';

export default function DomainCardSkeleton() {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4 animate-pulse">
      {/* Top Row: Icon, Project Name, Status */}
      <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-slate-800/70">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width="40px" height="40px" borderRadius="12px" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton width="140px" height="18px" />
              <Skeleton width="60px" height="16px" borderRadius="4px" />
              <Skeleton width="70px" height="16px" borderRadius="999px" />
            </div>
            <Skeleton width="180px" height="12px" />
          </div>
        </div>
        <Skeleton width="75px" height="22px" borderRadius="999px" />
      </div>

      {/* Middle Row: Verification, SSL, DNS */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton width="110px" height="20px" borderRadius="4px" />
          <Skeleton width="110px" height="20px" borderRadius="4px" />
          <Skeleton width="110px" height="20px" borderRadius="4px" />
        </div>
      </div>

      {/* Bottom Row: Connected Project, Created By, Last Updated */}
      <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-800/50">
        <div className="flex items-center gap-4">
          <Skeleton width="140px" height="12px" />
          <Skeleton width="120px" height="12px" />
          <Skeleton width="120px" height="12px" />
        </div>
      </div>
    </div>
  );
}
