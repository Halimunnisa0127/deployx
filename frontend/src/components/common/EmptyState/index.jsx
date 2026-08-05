import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

/**
 * Reusable EmptyState component for DeployX
 *
 * Props:
 *  - icon:            ReactNode — icon element (e.g. <Layers className="w-6 h-6 text-indigo-400" />)
 *  - title:           string    — main heading
 *  - description:     string    — descriptive helper text
 *  - primaryAction:   object | ReactNode — { label, onClick, icon } or custom button element
 *  - secondaryAction: object | ReactNode — { label, onClick, icon } or custom button element
 *  - card:            boolean   — wrap inside glassmorphic Card container (default: true)
 *  - className:       string    — extra CSS classes
 */

export default function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  actionLabel,
  onActionClick,
  actionIcon,
  card = true,
  style: extraStyle,
  className = '',
}) {
  const renderAction = (action, defaultVariant = 'primary') => {
    if (!action) return null;
    if (React.isValidElement(action)) return action;

    if (typeof action === 'object' && action.label) {
      return (
        <Button
          variant={action.variant || defaultVariant}
          size="sm"
          iconLeft={action.icon}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      );
    }
    return null;
  };

  const content = (
    <div
      className={`flex flex-col items-center justify-center text-center py-10 px-4 select-none font-sans ${className}`}
    >
      <div className="max-w-md mx-auto space-y-4">
        {/* Icon Container */}
        {icon && (
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
            {icon}
          </div>
        )}

        {/* Title & Description */}
        <div className="space-y-1.5">
          {title && (
            <h3 className="text-base font-bold text-foreground tracking-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {(primaryAction || secondaryAction || actionLabel) && (
          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
            {renderAction(primaryAction, 'primary') || (
              actionLabel && (
                <Button
                  variant="primary"
                  size="sm"
                  iconLeft={actionIcon}
                  onClick={onActionClick}
                >
                  {actionLabel}
                </Button>
              )
            )}

            {renderAction(secondaryAction, 'secondary')}
          </div>
        )}
      </div>
    </div>
  );

  if (card) {
    return (
      <Card style={{ padding: '24px', maxWidth: '100%', ...extraStyle }}>
        {content}
      </Card>
    );
  }

  return content;
}

export { default as EmptyIllustration } from './EmptyIllustration';
export { default as NoUsageData } from './NoUsageData';
export { default as NoAlerts } from './NoAlerts';
export { default as NoHistory } from './NoHistory';
