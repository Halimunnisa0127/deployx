import { Bell, Check, Trash2, Settings } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function NotificationHeader({
  unreadCount,
  notificationsLength,
  onMarkAllAsRead,
  onClearAllClick,
  onSettingsClick,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 dark:bg-slate-900/60 p-6 rounded-2xl border border-border shadow-xl backdrop-blur-xl transition-all">
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/10">
          <Bell className="w-6 h-6 text-indigo-400" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-indigo-500 text-white text-xs font-bold font-mono shadow-md">
              {unreadCount}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Notifications
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            You have <span className="font-semibold text-indigo-500 dark:text-indigo-400 font-mono">{unreadCount} unread</span> notification{unreadCount === 1 ? '' : 's'}
          </p>
        </div>
      </div>
      
      {/* Header Actions */}
      <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
        {unreadCount > 0 && (
          <Button 
            variant="secondary" 
            size="sm"
            onClick={onMarkAllAsRead} 
            iconLeft={<Check className="w-4 h-4" />}
          >
            Mark all as read
          </Button>
        )}

        {notificationsLength > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onClearAllClick}
            iconLeft={<Trash2 className="w-4 h-4 text-rose-400" />}
            className="hover:border-rose-500/40 hover:text-rose-300"
          >
            Clear All
          </Button>
        )}

        {/* Notification Settings Button */}
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          onClick={onSettingsClick}
          aria-label="Notification Preferences"
          className="text-muted-foreground hover:text-slate-900 dark:hover:text-slate-200 border border-border bg-white/60 dark:bg-slate-900/60"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
