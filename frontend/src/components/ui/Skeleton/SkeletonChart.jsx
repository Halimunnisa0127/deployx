import Card from '../Card';
import Skeleton from './index';

export default function SkeletonChart({ className = '', style }) {
  return (
    <Card className={`w-full max-w-full ${className}`} style={{ padding: '24px', ...style }}>
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Skeleton width="120px" height="20px" />
          <Skeleton variant="circular" width="32px" height="32px" />
        </div>
        {/* Chart Area */}
        <div className="flex items-end space-x-2 h-48 pt-4 border-b border-slate-200 dark:border-white/5">
          {Array.from({ length: 8 }).map((_, i) => {
            const heights = ['40%', '60%', '30%', '80%', '50%', '70%', '45%', '90%'];
            return (
              <div key={i} className="flex-1 flex justify-center items-end h-full">
                <Skeleton width="80%" height={heights[i]} borderRadius="4px 4px 0 0" />
              </div>
            );
          })}
        </div>
        {/* X Axis Labels */}
        <div className="flex items-center justify-between pt-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} width="8%" height="10px" />
          ))}
        </div>
      </div>
    </Card>
  );
}
