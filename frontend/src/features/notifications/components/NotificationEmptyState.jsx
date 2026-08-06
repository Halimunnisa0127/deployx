import { Bell } from 'lucide-react';
import EmptyState from '../../../components/common/EmptyState';
import Skeleton from '../../../components/ui/Skeleton';

export default function NotificationEmptyState({
  isLoading,
  searchQuery,
  activeFilter,
  onClearFilters,
}) {
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="flex items-start gap-4">
            <Skeleton variant="circular" width="40px" height="40px" />
            <div className="space-y-2 flex-1">
              <Skeleton width="40%" height="18px" />
              <Skeleton width="80%" height="14px" />
              <Skeleton width="20%" height="12px" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <EmptyState
      card={false}
      icon={<Bell className="w-8 h-8 text-indigo-400" />}
      title="No notifications found"
      description={
        searchQuery.trim() || activeFilter !== 'all'
          ? `No notifications match your active filter "${activeFilter}" or query "${searchQuery}".`
          : 'All caught up! You have no notifications to display.'
      }
      primaryAction={
        searchQuery.trim() || activeFilter !== 'all'
          ? {
              label: 'Clear Filters',
              onClick: onClearFilters,
            }
          : null
      }
    />
  );
}
