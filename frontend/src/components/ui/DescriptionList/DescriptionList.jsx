import React from 'react';
import { cn } from '../../../lib/utils';
import { KeyValue } from '../KeyValue';

export default function DescriptionList({
  items = [],
  columns = 1,
  className,
  ...props
}) {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', columnClasses[columns], className)} {...props}>
      {items.map((item, index) => (
        <KeyValue
          key={item.id || index}
          label={item.label}
          value={item.value}
          copyable={item.copyable}
          badge={item.badge}
          icon={item.icon}
        />
      ))}
    </div>
  );
}
