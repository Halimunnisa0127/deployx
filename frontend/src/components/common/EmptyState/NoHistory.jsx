import EmptyState from './index';
import EmptyIllustration from './EmptyIllustration';
import { History } from 'lucide-react';

export default function NoHistory({ className = '', style }) {
  return (
    <EmptyState
      icon={<EmptyIllustration icon={History} color="slate" />}
      title="No History"
      description="No past deployments or activities found. Your history will be recorded here."
      className={className}
      style={style}
    />
  );
}
