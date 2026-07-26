import React from 'react';
import DeploymentCardSkeleton from './DeploymentCardSkeleton';

export default function DeploymentSkeleton({ count = 4 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <DeploymentCardSkeleton key={index} />
      ))}
    </div>
  );
}
