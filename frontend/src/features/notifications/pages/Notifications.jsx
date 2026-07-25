import { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Check, 
  Bell 
} from 'lucide-react';
import Button from '../../../components/ui/Button';

// Mock Data
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'success',
    title: 'Deployment Successful',
    message: 'Your project "deployx-frontend" was successfully deployed to production.',
    timestamp: new Date().toISOString(),
    unread: true,
  },
  {
    id: 2,
    type: 'warning',
    title: 'High CPU Usage',
    message: 'Your project "analytics-service" is experiencing higher than normal CPU usage.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    unread: true,
  },
  {
    id: 3,
    type: 'error',
    title: 'Build Failed',
    message: 'The build for "backend-api" failed on the main branch.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    unread: false,
  },
  {
    id: 4,
    type: 'info',
    title: 'New Team Member',
    message: 'Jane Doe has joined the DeployX team.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    unread: false,
  },
];

const NOTIFICATION_ICONS = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  error: <XCircle className="w-5 h-5 text-rose-500" />,
  info: <Info className="w-5 h-5 text-indigo-500" />,
};

function formatTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/60 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-sm transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center shrink-0 transition-colors">
            <Bell className="w-6 h-6 text-indigo-600 dark:text-indigo-400 transition-colors" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">Notifications</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
              You have <span className="font-semibold text-indigo-600 dark:text-indigo-400">{unreadCount} unread</span> messages
            </p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            onClick={markAllAsRead} 
            iconLeft={<Check className="w-4 h-4" />}
            className="text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white/60 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm backdrop-blur-sm overflow-hidden transition-colors">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            No notifications to display.
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800/80">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                onClick={() => notification.unread && markAsRead(notification.id)}
                className={`relative flex items-start gap-4 p-5 transition-all duration-200 cursor-default hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                  notification.unread ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''
                }`}
              >
                {/* Unread Indicator */}
                {notification.unread && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-indigo-500 rounded-r-md"></div>
                )}
                
                {/* Icon */}
                <div className="mt-1 flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-colors">
                    {NOTIFICATION_ICONS[notification.type]}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className={`text-sm font-semibold truncate transition-colors ${
                      notification.unread ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap transition-colors">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
                    {notification.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
