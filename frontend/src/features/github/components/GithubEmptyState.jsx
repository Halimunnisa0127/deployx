import { RotateCcw, Search, Plus } from 'lucide-react';
import Github from '../../../components/ui/GithubIcon';
import EmptyState from '../../../components/common/EmptyState';

export default function GithubEmptyState({ onResetFilter, hasFilter, onConnect }) {
  if (hasFilter) {
    return (
      <EmptyState
        card={true}
        icon={<Search className="w-6 h-6 text-indigo-400" />}
        title="No Repositories Found"
        description="No GitHub repositories match your active search parameters."
        primaryAction={{
          label: 'Clear Filters & Search',
          onClick: onResetFilter,
          icon: <RotateCcw className="w-3.5 h-3.5" />,
          variant: 'secondary',
        }}
      />
    );
  }

  return (
    <EmptyState
      card={true}
      icon={<Github className="w-6 h-6 text-indigo-400" />}
      title="No Repositories Connected"
      description="Connect your GitHub account to start syncing repositories and deploying projects."
      primaryAction={{
        label: 'Connect Repository',
        onClick: onConnect,
        icon: <Plus className="w-4 h-4" />,
        variant: 'primary',
      }}
    />
  );
}
