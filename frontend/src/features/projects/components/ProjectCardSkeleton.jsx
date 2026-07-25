import Card from '../../../components/ui/Card';
import Skeleton from '../../../components/ui/Skeleton';

export default function ProjectCardSkeleton() {
  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Skeleton variant="circular" width="28px" height="28px" />
          <Skeleton width="120px" height="18px" />
        </div>
        <Skeleton width="64px" height="22px" borderRadius="999px" />
      </div>

      {/* Middle row: URL */}
      <Skeleton width="180px" height="14px" />

      {/* Bottom row: Branch & time */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
        <Skeleton width="80px" height="14px" />
        <Skeleton width="90px" height="14px" />
      </div>
    </Card>
  );
}
