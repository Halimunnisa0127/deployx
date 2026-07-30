import EmptyState from './index';
import EmptyIllustration from './EmptyIllustration';
import { BellRing } from 'lucide-react';

export default function NoAlerts({ className = '', style }) {
  return (
    <EmptyState
      icon={<EmptyIllustration icon={BellRing} color="emerald" />}
      title="All Clear"
      description="You have no new alerts or notifications. Everything is running smoothly."
      className={className}
      style={style}
    />
  );
}
