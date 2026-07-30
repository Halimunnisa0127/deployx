import { useState, useMemo, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Check, 
  Bell, 
  Trash2, 
  Eye, 
  MailOpen, 
  Mail, 
  Clock, 
  Calendar,
  Layers,
  Settings,
  ShieldCheck,
  Globe,
  GitBranch
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import SearchBar from '../../../components/common/SearchBar';
import EmptyState from '../../../components/common/EmptyState';
import Skeleton from '../../../components/ui/Skeleton';
import Modal from '../../../components/ui/Modal';

// Standardized Mock Data with Timestamps & Extended Details
const INITIAL_MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'success',
    title: 'Deployment Successful',
    message: 'Your project "deployx-frontend" was successfully deployed to production.',
    projectName: 'deployx-frontend',
    commitHash: '7a8f3b2',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // Today (15 mins ago)
    unread: true,
    details: 'Build completed in 1m 24s. All 42 unit tests passed. SSL certificates automatically renewed for deployx.dev domain.',
  },
  {
    id: 'notif-2',
    type: 'warning',
    title: 'High CPU Usage Detected',
    message: 'Your project "analytics-service" is experiencing higher than normal CPU usage (>85%).',
    projectName: 'analytics-service',
    commitHash: 'e49c10d',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // Today (3 hours ago)
    unread: true,
    details: 'Worker node us-east-1a CPU spiked to 88.4%. Consider scaling up instance capacity or checking memory allocation.',
  },
  {
    id: 'notif-3',
    type: 'error',
    title: 'Build Failed on Main Branch',
    message: 'The build for "backend-api" failed during step npm run build with exit code 1.',
    projectName: 'backend-api',
    commitHash: '2c7104e',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // Yesterday (26 hours ago)
    unread: false,
    details: 'SyntaxError: Unexpected token in src/auth/jwt.js at line 42. Check build logs in Deployment Details dashboard.',
  },
  {
    id: 'notif-4',
    type: 'info',
    title: 'New Team Member Joined',
    message: 'Jane Doe (jane@deployx.dev) accepted your organization invitation.',
    projectName: 'Workspace',
    commitHash: 'N/A',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), // Yesterday (30 hours ago)
    unread: false,
    details: 'Jane Doe was assigned Developer permissions for all production and preview projects.',
  },
  {
    id: 'notif-5',
    type: 'success',
    title: 'Custom Domain Connected',
    message: 'Domain "api.deployx.dev" successfully routed with active TLS/SSL certificate.',
    projectName: 'deployx-api-service',
    commitHash: '9b3f81a',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // Earlier (3 days ago)
    unread: false,
    details: 'DNS CNAME records verified via Cloudflare DNS resolver. Automated Let\'s Encrypt SSL provisioning active.',
  },
  {
    id: 'notif-6',
    type: 'info',
    title: 'Environment Variable Updated',
    message: 'DATABASE_URL environment key updated for project "analytics-worker".',
    projectName: 'analytics-worker',
    commitHash: 'f812d90',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // Earlier (5 days ago)
    unread: false,
    details: 'Updated by Alex Rivera. Secret value masked in runtime environment configs.',
  },
];

const NOTIFICATION_ICONS = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
  error: <XCircle className="w-5 h-5 text-rose-400" />,
  failed: <XCircle className="w-5 h-5 text-rose-400" />,
  info: <Info className="w-5 h-5 text-indigo-400" />,
};

const BADGE_VARIANTS = {
  success: 'success',
  warning: 'warning',
  error: 'danger',
  failed: 'danger',
  info: 'info',
};

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'success', label: 'Success' },
  { id: 'warning', label: 'Warning' },
  { id: 'failed', label: 'Failed' },
  { id: 'info', label: 'Info' },
];

function formatTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Group notifications into Today, Yesterday, Earlier
function groupNotifications(items) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

  const groups = {
    Today: [],
    Yesterday: [],
    Earlier: [],
  };

  items.forEach((item) => {
    const itemTime = new Date(item.timestamp).getTime();
    if (itemTime >= todayStart) {
      groups.Today.push(item);
    } else if (itemTime >= yesterdayStart) {
      groups.Yesterday.push(item);
    } else {
      groups.Earlier.push(item);
    }
  });

  return groups;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_MOCK_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Notification Preferences State
  const [settings, setSettings] = useState({
    deployment: true,
    domain: true,
    github: true,
    email: true,
  });

  // Simulate skeleton loading on initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, [notifications]);

  // Bulk Actions
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const confirmClearAll = () => {
    setNotifications([]);
    setIsClearAllModalOpen(false);
  };

  // Single Item Actions
  const toggleReadStatus = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const confirmDeleteSingle = () => {
    if (itemToDelete) {
      setNotifications((prev) => prev.filter((n) => n.id !== itemToDelete.id));
      if (selectedNotification?.id === itemToDelete.id) {
        setSelectedNotification(null);
      }
      setItemToDelete(null);
    }
  };

  const handleViewDetails = (notification) => {
    if (notification.unread) {
      toggleReadStatus(notification.id);
    }
    setSelectedNotification(notification);
  };

  // Filter and Search Logic
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // 1. Category / Status Filter
      if (activeFilter === 'unread' && !item.unread) return false;
      if (activeFilter === 'success' && item.type !== 'success') return false;
      if (activeFilter === 'warning' && item.type !== 'warning') return false;
      if (activeFilter === 'failed' && item.type !== 'error' && item.type !== 'failed') return false;
      if (activeFilter === 'info' && item.type !== 'info') return false;

      // 2. Text Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesMessage = item.message.toLowerCase().includes(query);
        const matchesProject = item.projectName?.toLowerCase().includes(query);
        return matchesTitle || matchesMessage || matchesProject;
      }

      return true;
    });
  }, [notifications, activeFilter, searchQuery]);

  // Grouped Notifications Object
  const groupedData = useMemo(() => groupNotifications(filteredNotifications), [filteredNotifications]);
  const hasNotifications = filteredNotifications.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 shadow-xl backdrop-blur-xl transition-all">
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
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-100">
              Notifications
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              You have <span className="font-semibold text-indigo-400 font-mono">{unreadCount} unread</span> notification{unreadCount === 1 ? '' : 's'}
            </p>
          </div>
        </div>
        
        {/* Header Actions */}
        <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
          {unreadCount > 0 && (
            <Button 
              variant="secondary" 
              size="sm"
              onClick={markAllAsRead} 
              iconLeft={<Check className="w-4 h-4" />}
            >
              Mark all as read
            </Button>
          )}

          {notifications.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsClearAllModalOpen(true)}
              iconLeft={<Trash2 className="w-4 h-4 text-rose-400" />}
              className="hover:border-rose-500/40 hover:text-rose-300"
            >
              Clear All
            </Button>
          )}

          {/* 2. Notification Settings Button (⚙️) */}
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            onClick={() => setIsSettingsModalOpen(true)}
            aria-label="Notification Preferences"
            className="text-slate-400 hover:text-slate-200 border border-slate-800/80 bg-slate-900/60"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ── Controls: Search Bar & Filters ─────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/60 backdrop-blur-lg">
        {/* Reusable Search Bar */}
        <SearchBar
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          className="w-full md:w-80"
        />

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  isActive
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Notifications Content Container ───────────────────────── */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-xl overflow-hidden">
        {isLoading ? (
          /* 4. Skeleton Loading State */
          <div className="p-6 space-y-6">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="flex items-start gap-4">
                <Skeleton variant="circular" width="40px" height="40px" />
                <div className="space-y-2 flex-1">
                  <Skeleton width="40%" height="18px" />
                  <Skeleton width="80%" height="14px" />
                  <Skeleton width="20%" height="12px" />
                </div>
              </div>
            ))}
          </div>
        ) : !hasNotifications ? (
          /* 3. Empty State with "Clear Filters" Button */
          <EmptyState
            card={false}
            icon={<Bell className="w-8 h-8 text-indigo-400" />}
            title="No notifications found"
            description={
              searchQuery.trim() || activeFilter !== 'all'
                ? `No notifications match your active filter "${activeFilter}" or query "${searchQuery}".`
                : 'All caught up! You have no notifications to display.'
            }
            primaryAction={
              searchQuery.trim() || activeFilter !== 'all'
                ? {
                    label: 'Clear Filters',
                    onClick: () => {
                      setSearchQuery('');
                      setActiveFilter('all');
                    },
                  }
                : null
            }
          />
        ) : (
          /* Grouped Timeline List (Today, Yesterday, Earlier) */
          <div className="divide-y divide-slate-800/80">
            {Object.entries(groupedData).map(([groupTitle, items]) => {
              if (items.length === 0) return null;

              return (
                <div key={groupTitle} className="p-4 sm:p-6 space-y-3">
                  {/* Timeline Group Header */}
                  <div className="flex items-center gap-2 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{groupTitle}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal">
                      {items.length}
                    </span>
                  </div>

                  {/* Notification Items */}
                  <div className="space-y-2.5">
                    {items.map((notification) => {
                      const typeBadge = BADGE_VARIANTS[notification.type] || 'neutral';

                      return (
                        <div
                          key={notification.id}
                          className={`group relative flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                            notification.unread
                              ? 'bg-indigo-950/20 border-indigo-500/30 hover:border-indigo-500/50'
                              : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700/80'
                          }`}
                        >
                          {/* Unread Indicator Pill */}
                          {notification.unread && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-md shadow-lg shadow-indigo-500/50" />
                          )}

                          {/* Left: Icon & Text Content */}
                          <div className="flex items-start gap-3.5 min-w-0 flex-1">
                            {/* Type Icon */}
                            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0 group-hover:border-indigo-500/30 transition-colors">
                              {NOTIFICATION_ICONS[notification.type] || <Bell className="w-5 h-5 text-slate-400" />}
                            </div>

                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className={`text-sm font-bold truncate transition-colors ${
                                  notification.unread ? 'text-slate-100' : 'text-slate-300'
                                }`}>
                                  {notification.title}
                                </h3>

                                <Badge variant={typeBadge}>
                                  {notification.type.toUpperCase()}
                                </Badge>
                              </div>

                              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                                {notification.message}
                              </p>

                              <div className="flex items-center gap-3 pt-1 text-sm text-slate-400 font-mono flex-wrap">
                                <span className="flex items-center gap-1 text-slate-400">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  {formatTime(notification.timestamp)}
                                </span>

                                {notification.projectName && (
                                  <span className="flex items-center gap-1 text-slate-400">
                                    <Layers className="w-3 h-3 text-slate-400" />
                                    {notification.projectName}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex items-center gap-1 sm:self-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/80">
                            {/* Toggle Read/Unread */}
                            <button
                              type="button"
                              onClick={() => toggleReadStatus(notification.id)}
                              title={notification.unread ? 'Mark as read' : 'Mark as unread'}
                              aria-label={notification.unread ? 'Mark as read' : 'Mark as unread'}
                              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            >
                              {notification.unread ? <MailOpen className="w-4 h-4 text-indigo-400" /> : <Mail className="w-4 h-4" />}
                            </button>

                            {/* View Details */}
                            <button
                              type="button"
                              onClick={() => handleViewDetails(notification)}
                              title="View Details"
                              aria-label="View Details"
                              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-indigo-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Delete Notification with Confirmation Modal */}
                            <button
                              type="button"
                              onClick={() => setItemToDelete(notification)}
                              title="Delete notification"
                              aria-label="Delete notification"
                              className="p-2 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 1. Clear All Confirmation Modal ───────────────────────── */}
      <Modal
        isOpen={isClearAllModalOpen}
        onClose={() => setIsClearAllModalOpen(false)}
        title="Clear All Notifications?"
        maxWidth="460px"
      >
        <div className="space-y-4 pt-1">
          <p className="text-sm text-slate-300 leading-relaxed">
            Are you sure you want to clear all notifications? This action cannot be undone.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsClearAllModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={confirmClearAll}
              iconLeft={<Trash2 className="w-4 h-4" />}
            >
              Clear All
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── 5. Delete Item Confirmation Modal ─────────────────────── */}
      <Modal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        title="Delete Notification?"
        maxWidth="460px"
      >
        {itemToDelete && (
          <div className="space-y-4 pt-1">
            <p className="text-sm text-slate-300 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-slate-100">"{itemToDelete.title}"</span>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setItemToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={confirmDeleteSingle}
                iconLeft={<Trash2 className="w-4 h-4" />}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── 2. Notification Settings Preference Modal (⚙️) ─────────── */}
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Notification Preferences"
        maxWidth="500px"
      >
        <div className="space-y-4 pt-1">
          <p className="text-xs text-slate-400 leading-relaxed">
            Configure which events trigger real-time workspace notifications.
          </p>

          <div className="space-y-3">
            {/* Deployment Notifications */}
            <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Deployment Notifications</div>
                  <div className="text-sm text-slate-400">Build success, failures, and triggers.</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.deployment}
                onChange={(e) => setSettings({ ...settings, deployment: e.target.checked })}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500/40 cursor-pointer"
              />
            </div>

            {/* Domain Notifications */}
            <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-sky-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Domain Notifications</div>
                  <div className="text-sm text-slate-400">SSL certificates and DNS updates.</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.domain}
                onChange={(e) => setSettings({ ...settings, domain: e.target.checked })}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500/40 cursor-pointer"
              />
            </div>

            {/* GitHub Notifications */}
            <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-3">
                <GitBranch className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200">GitHub Notifications</div>
                  <div className="text-sm text-slate-400">Repository sync & branch commits.</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.github}
                onChange={(e) => setSettings({ ...settings, github: e.target.checked })}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500/40 cursor-pointer"
              />
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Email Notifications</div>
                  <div className="text-sm text-slate-400">Digest emails for critical alerts.</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.checked })}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500/40 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsSettingsModalOpen(false)}
            >
              Save Preferences
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── View Details Modal ───────────────────────────────────────── */}
      <Modal
        isOpen={Boolean(selectedNotification)}
        onClose={() => setSelectedNotification(null)}
        title={selectedNotification?.title || 'Notification Details'}
        maxWidth="520px"
      >
        {selectedNotification && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <Badge variant={BADGE_VARIANTS[selectedNotification.type] || 'neutral'}>
                {selectedNotification.type.toUpperCase()}
              </Badge>

              <span className="text-xs font-mono text-slate-400">
                {new Date(selectedNotification.timestamp).toLocaleString()}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Message Overview
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                {selectedNotification.message}
              </p>
            </div>

            {selectedNotification.details && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Technical Details
                </h4>
                <p className="text-xs font-mono text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed whitespace-pre-wrap">
                  {selectedNotification.details}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedNotification(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
