import Card from '../../../components/ui/Card';
import Skeleton from '../../../components/ui/Skeleton';

export default function ProjectCardSkeleton() {
  return (
    <Card className="flex flex-col gap-4 p-6 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl shadow-sm dark:shadow-[0_4px_12px_0_rgba(0,0,0,0.3)]">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Skeleton variant="circular" width="28px" height="28px" />
          <Skeleton width="120px" height="18px" />
        </div>
        <Skeleton width="64px" height="22px" borderRadius="999px" />
      </div>

      {/* Middle row: URL */}
      <Skeleton width="180px" height="14px" />

      {/* Bottom row: Branch & time */}
      <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-200 dark:border-white/5 transition-colors">
        <Skeleton width="80px" height="14px" />
        <Skeleton width="90px" height="14px" />
      </div>
    </Card>
  );
}
