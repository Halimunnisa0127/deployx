import React from 'react';
import { cn } from '../../../lib/utils';
import { Typography } from '../Typography';
import { Divider } from '../Divider';
import { Stack } from '../Stack';

export default function Section({
  title,
  subtitle,
  actions,
  divider = false,
  variant = 'default',
  size = 'md',
  padding = 'none',
  layout = 'stacked',
  className,
  children,
  ...props
}) {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const headerContent = (title || subtitle || actions) && (
    <div className={cn('flex justify-between items-start mb-4', layout === 'sidebar' && 'flex-col sm:w-1/3 sm:mb-0 shrink-0')}>
      <div>
        {title && <Typography variant="h3" as="h2">{title}</Typography>}
        {subtitle && <Typography variant="muted" className="mt-1">{subtitle}</Typography>}
      </div>
      {actions && (
        <div className={cn("mt-4", layout === 'sidebar' ? 'mt-4' : 'mt-0 ml-4')}>
          {actions}
        </div>
      )}
    </div>
  );

  return (
    <section className={cn(paddingClasses[padding], className)} aria-labelledby={title ? 'section-title' : undefined} {...props}>
      {layout === 'sidebar' ? (
        <div className="flex flex-col sm:flex-row gap-6 lg:gap-12">
          {headerContent}
          <div className="flex-1">
            {children}
          </div>
        </div>
      ) : (
        <>
          {headerContent}
          <div className="w-full">
            {children}
          </div>
        </>
      )}
      {divider && <Divider spacing="lg" />}
    </section>
  );
}
