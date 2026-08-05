import React from 'react';
import { cn } from '../../../lib/utils';
import { Typography } from '../Typography';
import { Stack } from '../Stack';

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  className,
  children,
  ...props
}) {
  return (
    <header className={cn('mb-6 sm:mb-8', className)} {...props}>
      <Stack spacing="sm">
        {breadcrumbs && (
          <div className="mb-2 text-sm text-muted-foreground">
            {breadcrumbs}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Typography variant="h1">{title}</Typography>
            {subtitle && (
              <Typography variant="lead" className="mt-1">
                {subtitle}
              </Typography>
            )}
          </div>
          
          {actions && (
            <div className="flex shrink-0 items-center gap-2">
              {actions}
            </div>
          )}
        </div>

        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </Stack>
    </header>
  );
}
