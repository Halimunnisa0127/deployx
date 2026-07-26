import React from 'react';
import { Layers, RotateCcw, Search, Plus } from 'lucide-react';
import EmptyState from '../../../components/common/EmptyState';
import { useNavigate } from 'react-router-dom';

export default function DeploymentsEmptyState({ onResetFilter, hasFilter }) {
  const navigate = useNavigate();

  if (hasFilter) {
    return (
      <EmptyState
        card={true}
        icon={<Search className="w-6 h-6 text-indigo-400" />}
        title="No Deployments Found"
        description="No deployment records match your active search or status filter parameters."
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
      icon={<Layers className="w-6 h-6 text-indigo-400" />}
      title="No Deployments"
      description="Deploy your first application to see deployment history."
      primaryAction={{
        label: 'Create Deployment',
        onClick: () => navigate('/dashboard/projects'),
        icon: <Plus className="w-4 h-4" />,
        variant: 'primary',
      }}
    />
  );
}
