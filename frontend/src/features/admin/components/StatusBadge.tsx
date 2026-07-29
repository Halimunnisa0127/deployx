import React from 'react';
import Badge from '../../../components/ui/Badge';

export default function StatusBadge({ status, type = 'deployment' }) {
  let variant = 'neutral';
  let label = status;

  if (type === 'deployment') {
    const STATUS_MAP = {
      success: { variant: 'success', label: 'Success' },
      building: { variant: 'warning', label: 'Building' },
      failed: { variant: 'danger', label: 'Failed' },
      queued: { variant: 'neutral', label: 'Queued' },
    };
    variant = STATUS_MAP[status]?.variant || 'neutral';
    label = STATUS_MAP[status]?.label || status;
  } else if (type === 'user') {
    const STATUS_MAP = {
      active: { variant: 'success', label: 'Active' },
      suspended: { variant: 'danger', label: 'Suspended' },
      pending: { variant: 'warning', label: 'Pending' },
    };
    variant = STATUS_MAP[status]?.variant || 'neutral';
    label = STATUS_MAP[status]?.label || status;
  } else if (type === 'health') {
    const STATUS_MAP = {
      healthy: { variant: 'success', label: 'Healthy' },
      warning: { variant: 'warning', label: 'Warning' },
      offline: { variant: 'danger', label: 'Offline' },
    };
    variant = STATUS_MAP[status]?.variant || 'neutral';
    label = STATUS_MAP[status]?.label || status;
  } else if (type === 'project') {
    const STATUS_MAP = {
      active: { variant: 'success', label: 'Active' },
      archived: { variant: 'neutral', label: 'Archived' },
      failed: { variant: 'danger', label: 'Failed' },
      pending: { variant: 'warning', label: 'Pending' },
    };
    variant = STATUS_MAP[status]?.variant || 'neutral';
    label = STATUS_MAP[status]?.label || status;
  }

  return (
    <Badge variant={variant}>
      {label}
    </Badge>
  );
}
