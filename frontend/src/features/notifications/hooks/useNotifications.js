import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';

export function useNotifications(currentUser) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Notification Preferences State (persisted in localStorage)
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('deployx_notification_settings');
      return saved
        ? JSON.parse(saved)
        : {
            deployment: true,
            domain: true,
            github: true,
            email: true,
          };
    } catch {
      return {
        deployment: true,
        domain: true,
        github: true,
        email: true,
      };
    }
  });

  const fetchNotifications = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = await notificationService.getNotificationsData();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
    notificationService.updateSettings(newSettings);
  };

  return {
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount,
    isLoading,
    setIsLoading,
    error,
    refetch: fetchNotifications,
    settings,
    setSettings: handleUpdateSettings,
  };
}
