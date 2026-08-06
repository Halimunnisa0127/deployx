import React from 'react';
import { cn } from '../../../lib/utils';
import { Typography } from '../Typography';
import Badge from '../Badge';

export default function KeyValue({
  label,
  value,
  copyable = false,
  badge,
  icon: Icon,
  className,
  ...props
}) {
  const handleCopy = () => {
    if (copyable && value) {
      navigator.clipboard.writeText(value.toString());
      // Optional: add a toast notification here in real implementation
    }
  };

  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center py-2 gap-1 sm:gap-4', className)} {...props}>
      <Typography variant="muted" className="sm:w-1/3 shrink-0 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </Typography>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {badge ? (
          <Badge variant={badge}>{value}</Badge>
        ) : (
          <Typography 
            variant="body" 
            className={cn("font-medium truncate", copyable && "cursor-pointer hover:text-blue-600 dark:hover:text-blue-400")}
            onClick={copyable ? handleCopy : undefined}
            title={copyable ? "Click to copy" : undefined}
          >
            {value}
          </Typography>
        )}
      </div>
    </div>
  );
}
