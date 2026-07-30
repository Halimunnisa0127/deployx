import Card from '../Card';
import Skeleton from './index';

export default function SkeletonCard({ className = '', style }) {
  return (
    <Card className={`w-full max-w-full ${className}`} style={{ padding: '24px', ...style }}>
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton variant="circular" width="48px" height="48px" />
        <div className="flex flex-col space-y-2 flex-1">
          <Skeleton width="40%" height="16px" />
          <Skeleton width="20%" height="12px" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton width="100%" height="14px" />
        <Skeleton width="90%" height="14px" />
        <Skeleton width="80%" height="14px" />
      </div>
    </Card>
  );
}
