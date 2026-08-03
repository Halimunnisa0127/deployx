import React, { useId } from 'react';
import { cn } from '../../../lib/utils';
import { Typography } from '../Typography';
import { Stack } from '../Stack';

export default function FieldGroup({
  label,
  description,
  helperText,
  required = false,
  optional = false,
  error,
  orientation = 'vertical',
  className,
  children,
  ...props
}) {
  const defaultId = useId();
  const descriptionId = `${defaultId}-description`;
  const errorId = `${defaultId}-error`;

  const childWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        id: child.props.id || defaultId,
        'aria-describedby': cn(
          child.props['aria-describedby'],
          (description || helperText) && descriptionId,
          error && errorId
        ),
        'aria-invalid': !!error,
      });
    }
    return child;
  });

  const content = (
    <Stack spacing="xs" className={orientation === 'horizontal' ? 'flex-1' : 'w-full'}>
      {label && (
        <div className="flex justify-between items-center">
          <Typography variant="label" as="label" htmlFor={defaultId}>
            {label}
            {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </Typography>
          {optional && !required && (
            <Typography variant="caption" className="text-slate-400">Optional</Typography>
          )}
        </div>
      )}
      
      {description && (
        <Typography variant="muted" id={descriptionId} className="mb-1">
          {description}
        </Typography>
      )}

      {childWithProps}

      {helperText && !error && (
        <Typography variant="caption" className="text-slate-500 mt-1" id={descriptionId}>
          {helperText}
        </Typography>
      )}

      {error && (
        <Typography variant="caption" className="text-red-500 mt-1" id={errorId} role="alert">
          {error}
        </Typography>
      )}
    </Stack>
  );

  return (
    <div
      className={cn(
        orientation === 'horizontal' && 'sm:flex sm:items-start sm:gap-4',
        className
      )}
      {...props}
    >
      {content}
    </div>
  );
}
