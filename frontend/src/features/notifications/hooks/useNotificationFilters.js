import { useState, useMemo } from 'react';
import { groupNotifications } from '../utils/helpers';

export function useNotificationFilters(notifications) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // 1. Category / Status Filter
      if (activeFilter !== 'all') {
        if (activeFilter === 'unread') {
          if (!item.unread) return false;
        } else if (['success', 'warning', 'error', 'failed', 'critical', 'info'].includes(activeFilter)) {
          if (activeFilter === 'failed' && item.type !== 'error' && item.type !== 'failed' && item.type !== 'critical') return false;
          if (activeFilter !== 'failed' && item.type !== activeFilter) return false;
        } else {
          // Domain/Category filter
          if (item.category?.toLowerCase() !== activeFilter) return false;
        }
      }

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

  return {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    unreadCount,
    filteredNotifications,
    groupedData,
    hasNotifications,
  };
}
