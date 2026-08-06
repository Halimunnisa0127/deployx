import Skeleton from '../../../components/ui/Skeleton';

export default function LogsSkeleton({ count = 8 }) {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-[#050608] overflow-hidden text-left font-mono animate-pulse">
      {/* Terminal Toolbar Skeleton */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#0b0d12]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-800" />
            <span className="w-3 h-3 rounded-full bg-slate-800" />
            <span className="w-3 h-3 rounded-full bg-slate-800" />
          </div>
          <Skeleton width="160px" height="16px" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton width="120px" height="28px" borderRadius="8px" />
          <Skeleton width="60px" height="28px" borderRadius="8px" />
          <Skeleton width="60px" height="28px" borderRadius="8px" />
        </div>
      </div>

      {/* Terminal Rows Skeleton */}
      <div className="p-5 space-y-2">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-3 py-1">
            <Skeleton width="65px" height="12px" />
            <Skeleton width={`${Math.floor(Math.random() * 40) + 50}%`} height="14px" />
          </div>
        ))}
      </div>

      {/* Terminal Footer Skeleton */}
      <div className="px-5 py-3 border-t border-slate-800/80 bg-[#08090d] flex items-center justify-between">
        <Skeleton width="120px" height="14px" />
        <div className="flex items-center gap-3">
          <Skeleton width="60px" height="18px" borderRadius="4px" />
          <Skeleton width="70px" height="18px" borderRadius="4px" />
          <Skeleton width="90px" height="18px" borderRadius="4px" />
        </div>
      </div>
    </div>
  );
}
