import React from 'react';
import LogsSkeleton from './LogsSkeleton';

export default function BuildLogsSkeleton({ count = 6 }) {
  return <LogsSkeleton count={count} />;
}
