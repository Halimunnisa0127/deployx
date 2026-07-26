import Card from '../../ui/Card';
import Button from '../../ui/Button';

/**
 * Reusable EmptyState component for DeployX
 *
 * Props:
 *  - icon:           ReactNode — icon element (e.g. <Key className="w-6 h-6 text-indigo-400" />)
 *  - title:          string    — main heading
 *  - description:    string    — descriptive helper text
 *  - primaryAction:  ReactNode — custom primary action button or element
 *  - actionLabel:    string    — text for default primary button if primaryAction not passed
 *  - onActionClick:  function  — click handler for default primary button
 *  - actionIcon:     ReactNode — left icon for default primary button
 *  - card:           boolean   — wrap inside glassmorphic Card container (default: true)
 *  - style:          object    — extra inline style overrides
 *  - className:      string    — extra CSS classes
 */

export default function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  actionLabel,
  onActionClick,
  actionIcon,
  card = true,
  style: extraStyle,
  className = '',
}) {
  const content = (
    <div
      className={`flex flex-col items-center justify-center text-center py-10 px-4 select-none font-sans ${className}`}
    >
      <div className="max-w-md mx-auto space-y-4">
        {/* Icon Circle */}
        {icon && (
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
            {icon}
          </div>
        )}

        {/* Title & Description */}
        <div className="space-y-1.5">
          {title && (
            <h3 className="text-base font-bold text-slate-100 tracking-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Primary Action Button */}
        {(primaryAction || actionLabel) && (
          <div className="pt-2 flex items-center justify-center gap-3">
            {primaryAction ? (
              primaryAction
            ) : (
              <Button
                variant="primary"
                size="sm"
                iconLeft={actionIcon}
                onClick={onActionClick}
              >
                {actionLabel}
              </Button>
            )}
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
