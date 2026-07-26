import React from 'react';
import { Globe, RotateCcw, Search, Plus } from 'lucide-react';
import EmptyState from '../../../components/common/EmptyState';
import { useNavigate } from 'react-router-dom';

export default function DomainsEmptyState({ onResetFilter, hasFilter, onAddDomain }) {
  const navigate = useNavigate();

  if (hasFilter) {
    return (
      <EmptyState
        card={true}
        icon={<Search className="w-6 h-6 text-indigo-400" />}
        title="No Domains Found"
        description="No domains match your active search or status filter parameters."
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
      icon={<Globe className="w-6 h-6 text-indigo-400" />}
      title="No Domains"
      description="Add a custom domain to start routing traffic to your projects."
      primaryAction={{
        label: 'Add Domain',
        onClick: onAddDomain,
        icon: <Plus className="w-4 h-4" />,
        variant: 'primary',
      }}
    />
  );
}
