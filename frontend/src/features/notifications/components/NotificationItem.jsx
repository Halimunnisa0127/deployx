import React from 'react';
import { Bell, Clock, Layers, MailOpen, Mail, Eye, Trash2 } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import { NOTIFICATION_ICONS, BADGE_VARIANTS } from '../utils/constants';
import { formatTime } from '../utils/helpers';

export default function NotificationItem({
  notification,
  onToggleRead,
  onViewDetails,
  onDeleteClick,
}) {
  const typeBadge = BADGE_VARIANTS[notification.type] || 'neutral';

  return (
    <div
      className={`group relative flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        notification.unread
          ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-500/30 hover:border-indigo-300 dark:hover:border-indigo-500/50'
          : 'bg-white/40 dark:bg-slate-900/40 border-border hover:border-slate-300 dark:hover:border-slate-700/80'
      }`}
    >
      {/* Unread Indicator Pill */}
      {notification.unread && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-md shadow-lg shadow-indigo-500/50" />
      )}

      {/* Left: Icon & Text Content */}
      <div className="flex items-start gap-3.5 min-w-0 flex-1">
        {/* Type Icon */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border shrink-0 group-hover:border-indigo-300 dark:group-hover:border-indigo-500/30 transition-colors">
          {NOTIFICATION_ICONS[notification.type] || <Bell className="w-5 h-5 text-muted-foreground" />}
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`text-sm font-bold truncate transition-colors ${
              notification.unread ? 'text-slate-900 dark:text-slate-100' : 'text-foreground'
            }`}>
              {notification.title}
            </h3>

            <Badge variant={typeBadge}>
              {notification.type.toUpperCase()}
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {notification.message}
          </p>

          <div className="flex items-center gap-3 pt-1 text-sm text-muted-foreground font-mono flex-wrap">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3 text-muted-foreground" />
              {formatTime(notification.timestamp)}
            </span>

            {notification.projectName && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Layers className="w-3 h-3 text-muted-foreground" />
                {notification.projectName}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:self-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-border">
        {/* Toggle Read/Unread */}
        <button
          type="button"
          onClick={() => onToggleRead(notification.id)}
          title={notification.unread ? 'Mark as read' : 'Mark as unread'}
          aria-label={notification.unread ? 'Mark as read' : 'Mark as unread'}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-slate-900 dark:hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          {notification.unread ? <MailOpen className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> : <Mail className="w-4 h-4" />}
        </button>

        {/* View Details */}
        <button
          type="button"
          onClick={() => onViewDetails(notification)}
          title="View Details"
          aria-label="View Details"
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Delete Notification with Confirmation Modal */}
        <button
          type="button"
          onClick={() => onDeleteClick(notification)}
          title="Delete notification"
          aria-label="Delete notification"
          className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
