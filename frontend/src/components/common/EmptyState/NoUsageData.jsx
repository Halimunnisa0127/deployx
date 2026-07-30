import EmptyState from './index';
import EmptyIllustration from './EmptyIllustration';
import { BarChart3 } from 'lucide-react';

export default function NoUsageData({ className = '', style }) {
  return (
    <EmptyState
      icon={<EmptyIllustration icon={BarChart3} color="indigo" />}
      title="No Usage Data"
      description="There is no usage data available yet. Metrics will appear here once activity starts."
      className={className}
      style={style}
    />
  );
}
