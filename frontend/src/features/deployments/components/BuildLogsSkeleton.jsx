import React from 'react';
import Skeleton from '../../../components/ui/Skeleton';

export default function BuildLogsSkeleton({ count = 6 }) {
  return (
    <div className="p-5 space-y-2.5 font-mono">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton width="60px" height="14px" />
          <Skeleton 
            width={`${40 + (index % 4) * 15}%`} 
            height="14px" 
          />
        </div>
      ))}
    </div>
  );
}
