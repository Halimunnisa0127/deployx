import React from 'react';
import { cn } from '../../../lib/utils';
import { Card } from '../Card';
import { Typography } from '../Typography';
import { Badge } from '../Badge';

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendDirection = 'neutral',
  status,
  badge,
  footer,
  loading = false,
  tooltip,
  onClick,
  className,
  ...props
}) {
  const trendClasses = {
    up: 'text-emerald-600 dark:text-emerald-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-slate-500 dark:text-slate-400',
  };

  return (
    <Card 
      className={cn('relative', className)} 
      padding="md" 
      loading={loading}
      clickable={!!onClick}
      onClick={onClick}
      title={tooltip} // Simple native tooltip, can be replaced with real Tooltip component
      {...props}
    >
      <div className="flex justify-between items-start mb-2">
        <Typography variant="muted" className="font-medium">
          {title}
        </Typography>
        {Icon && <Icon className="w-5 h-5 text-slate-400 dark:text-slate-500" aria-hidden="true" />}
      </div>
      
      <div className="flex items-baseline gap-2">
        <Typography variant="h2">{value}</Typography>
        {badge && <Badge variant={status || 'default'} size="sm">{badge}</Badge>}
      </div>
      
      {(description || trend) && (
        <div className="mt-2 flex items-center gap-2">
          {trend && (
            <Typography variant="small" className={trendClasses[trendDirection]}>
              {trendDirection === 'up' && '↑ '}
              {trendDirection === 'down' && '↓ '}
              {trend}
            </Typography>
          )}
          {description && (
            <Typography variant="caption" className="text-slate-500 dark:text-slate-400">
              {description}
            </Typography>
          )}
        </div>
      )}

      {footer && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {footer}
        </div>
      )}
    </Card>
  );
}
