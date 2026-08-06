import Modal from '../../../components/ui/Modal/index';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { BADGE_VARIANTS } from '../utils/constants';

export default function NotificationDetailsModal({
  isOpen,
  notification,
  onClose,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={notification?.title || 'Notification Details'}
      maxWidth="520px"
    >
      {notification && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-border">
            <Badge variant={BADGE_VARIANTS[notification.type] || 'neutral'}>
              {notification.type.toUpperCase()}
            </Badge>

            <span className="text-xs font-mono text-muted-foreground">
              {new Date(notification.timestamp).toLocaleString()}
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Message Overview
            </h4>
            <p className="text-sm text-foreground leading-relaxed bg-slate-100/50 dark:bg-slate-900/80 p-3.5 rounded-xl border border-border">
              {notification.message}
            </p>
          </div>

          {notification.details && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Technical Details
              </h4>
              <p className="text-xs font-mono text-foreground bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-border leading-relaxed whitespace-pre-wrap">
                {notification.details}
              </p>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
