import React from 'react';
import { cn } from '../../../lib/utils';

const variantMapping = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  lead: 'p',
  body: 'p',
  small: 'small',
  caption: 'span',
  label: 'label',
  muted: 'p',
  overline: 'span',
  code: 'code',
};

const variantClasses = {
  display: 'text-4xl sm:text-5xl font-extrabold tracking-tight',
  h1: 'text-3xl sm:text-4xl font-bold tracking-tight',
  h2: 'text-2xl sm:text-3xl font-semibold tracking-tight',
  h3: 'text-xl sm:text-2xl font-semibold tracking-tight',
  h4: 'text-lg sm:text-xl font-semibold tracking-tight',
  lead: 'text-lg sm:text-xl text-muted-foreground',
  body: 'text-base',
  small: 'text-sm font-medium leading-none',
  caption: 'text-xs',
  label: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  muted: 'text-sm text-muted-foreground',
  overline: 'text-xs font-semibold uppercase tracking-wider text-muted-foreground',
  code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-slate-900 dark:text-slate-100',
};

export default function Typography({
  variant = 'body',
  as,
  truncate = false,
  className,
  children,
  ...props
}) {
  const Component = as || variantMapping[variant] || 'span';

  return (
    <Component
      className={cn(
        variantClasses[variant],
        truncate && 'truncate',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
