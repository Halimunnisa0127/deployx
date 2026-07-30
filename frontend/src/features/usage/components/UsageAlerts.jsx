import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellRing,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  CheckCheck,
  Eye,
  Lightbulb,
  Clock,
  X,
  Shield,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const SEVERITY_CONFIG = {
  critical: {
    label: 'Critical',
    icon: AlertCircle,
    iconColor: 'text-rose-500',
    bgColor: 'bg-rose-500/5 dark:bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    badgeVariant: 'danger',
    pillColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  },
  warning: {
    label: 'Warning',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-500/5 dark:bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    badgeVariant: 'warning',
    pillColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  healthy: {
    label: 'Healthy',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    bgColor: 'bg-emerald-500/5 dark:bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    badgeVariant: 'success',
    pillColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  information: {
    label: 'Information',
    icon: Info,
    iconColor: 'text-blue-500 dark:text-blue-400',
    bgColor: 'bg-blue-500/5 dark:bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    badgeVariant: 'info',
    pillColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
};

export default function UsageAlerts({ alerts: initialAlerts = [] }) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [activeDetailAlert, setActiveDetailAlert] = useState(null);
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [expandedAlerts, setExpandedAlerts] = useState({});

  // Fallback map normal severity to information
  const normalizedAlerts = alerts.map((a) => ({
    ...a,
    severityKey: a.severity === 'normal' ? 'information' : a.severity,
  }));

  const filteredAlerts = normalizedAlerts.filter((item) => {
    if (selectedSeverity === 'all') return true;
    return item.severityKey === selectedSeverity;
  });

  const displayedAlerts = showAllAlerts ? filteredAlerts : filteredAlerts.slice(0, 5);

  const handleDismiss = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleToggleRead = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isRead: !a.isRead } : a))
    );
  };

  const handleMarkAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  };

  const toggleExpand = (id) => {
    setExpandedAlerts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div className="space-y-4">
      {/* Section Header & Group Category Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 shadow-sm">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Usage Notifications & Alerts
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Categorized insights, quota notifications & automated recommendations
            </p>
          </div>
        </div>

        {/* Group Filter Tabs (All, Critical, Warning, Healthy, Information) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none shrink-0">
          {[
            { id: 'all', label: 'All' },
            { id: 'critical', label: 'Critical' },
            { id: 'warning', label: 'Warning' },
            { id: 'healthy', label: 'Healthy' },
            { id: 'information', label: 'Information' },
          ].map((cat) => {
            const count =
              cat.id === 'all'
                ? alerts.length
                : normalizedAlerts.filter((a) => a.severityKey === cat.id).length;
            const isActive = selectedSeverity === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => { setSelectedSeverity(cat.id); setShowAllAlerts(false); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.2 text-xs rounded-full font-mono ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline px-2 cursor-pointer"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Notifications Grid / List */}
      {filteredAlerts.length === 0 ? (
        <Card className="p-8 text-center border-slate-200/80 dark:border-white/10">
          <div className="flex flex-col items-center justify-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No notifications in this category
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              All infrastructure metrics are operating smoothly.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          <AnimatePresence mode="popLayout">
            {displayedAlerts.map((item) => {
              const style = SEVERITY_CONFIG[item.severityKey] || SEVERITY_CONFIG.information;
              const SeverityIcon = style.icon;
              const isCollapsed = item.isRead && !expandedAlerts[item.id];

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    style={{ maxWidth: '100%', padding: '20px' }}
                    className={`relative overflow-hidden border ${style.borderColor} ${
                      style.bgColor
                    } rounded-2xl backdrop-blur-xl shadow-sm dark:shadow-xl transition-all duration-300 group ${
                      !item.isRead ? 'ring-1 ring-indigo-500/30 hover:-translate-y-1' : ''
                    }`}
                  >
                    {/* Top Bar: Severity Icon, Title, Affected Resource & Status Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`p-2 rounded-xl border bg-white dark:bg-slate-900 ${style.borderColor} shrink-0`}>
                          <SeverityIcon className={`w-4 h-4 ${style.iconColor}`} />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold border ${style.pillColor}`}>
                              {style.label}
                            </span>
                            {item.affectedResource && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                <Layers className="w-3 h-3 text-slate-400" />
                                {item.affectedResource}
                              </span>
                            )}
                            {!item.isRead && (
                              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            )}
                          </div>
                          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-snug pt-1">
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      {/* Timestamp & Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 mr-2">
                          <Clock className="w-3 h-3" />
                          {item.timestamp}
                        </span>
                        
                        {item.isRead && (
                          <button
                            type="button"
                            onClick={() => toggleExpand(item.id)}
                            title={isCollapsed ? "Expand" : "Collapse"}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDismiss(item.id)}
                          title="Dismiss notification"
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3.5 mt-4 pt-1"
                      >
                        {/* Short Description */}
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Suggested Action Box */}
                        {item.suggestedAction && (
                          <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 flex items-start gap-2 text-xs">
                            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                Suggested Action:
                              </span>{' '}
                              <span className="text-slate-600 dark:text-slate-400">
                                {item.suggestedAction}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons Row */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
                          <div className="flex items-center gap-2">
                            {item.actionLabel && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setActiveDetailAlert(item)}
                              >
                                {item.actionLabel}
                              </Button>
                            )}
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setActiveDetailAlert(item)}
                              iconLeft={<Eye className="w-3.5 h-3.5" />}
                            >
                              View Details
                            </Button>
                          </div>

                          {/* Mark as Read Toggle */}
                          <button
                            type="button"
                            onClick={() => handleToggleRead(item.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                          >
                            <CheckCheck
                              className={`w-4 h-4 ${
                                item.isRead ? 'text-indigo-500' : 'text-slate-400'
                              }`}
                            />
                            <span>{item.isRead ? 'Read' : 'Mark as read'}</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* View All Alerts Button */}
      {filteredAlerts.length > 5 && (
        <div className="flex justify-center pt-2">
          <Button
            variant="secondary"
            onClick={() => setShowAllAlerts(!showAllAlerts)}
          >
            {showAllAlerts ? 'Show Less' : `View All Alerts (${filteredAlerts.length})`}
          </Button>
        </div>
      )}

      {/* Details View Modal */}
      {activeDetailAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Alert Diagnostic Details
                  </h3>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    ID: {activeDetailAlert.id}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveDetailAlert(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                  {activeDetailAlert.title}
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  {activeDetailAlert.description}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <span className="block text-[10px] text-slate-400 uppercase">Severity</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">
                    {activeDetailAlert.severity}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <span className="block text-[10px] text-slate-400 uppercase">Resource</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {activeDetailAlert.affectedResource || 'N/A'}
                  </span>
                </div>
              </div>

              {activeDetailAlert.suggestedAction && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-800 dark:text-slate-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                    <Lightbulb className="w-4 h-4" />
                    Recommended Remediation:
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    {activeDetailAlert.suggestedAction}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
               <Button
                 variant="secondary"
                 size="sm"
                 onClick={() => setActiveDetailAlert(null)}
               >
                 Close
               </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

