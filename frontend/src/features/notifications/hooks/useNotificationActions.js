import { useState } from 'react';
import { notificationService } from '../services/notificationService';

export function useNotificationActions(setNotifications) {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Bulk Actions
  const markAllAsRead = async () => {
    // Optimistic UI update
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    try {
      await notificationService.markAllAsRead();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const confirmClearAll = async () => {
    setNotifications([]);
    setIsClearAllModalOpen(false);
    try {
      await notificationService.clearNotifications();
    } catch (err) {
      console.error('Failed to clear notifications:', err);
    }
  };

  // Single Item Actions
  const toggleReadStatus = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
    try {
      await notificationService.markAsRead(id);
    } catch (err) {
      console.error('Failed to update notification read status:', err);
    }
  };

  const confirmDeleteSingle = async () => {
    if (itemToDelete) {
      const idToDelete = itemToDelete.id;
      setNotifications((prev) => prev.filter((n) => n.id !== idToDelete));
      if (selectedNotification?.id === idToDelete) {
        setSelectedNotification(null);
      }
      setItemToDelete(null);
      try {
        await notificationService.deleteNotification(idToDelete);
      } catch (err) {
        console.error('Failed to delete notification:', err);
      }
    }
  };

  const handleViewDetails = (notification) => {
    if (notification.unread) {
      toggleReadStatus(notification.id);
    }
    setSelectedNotification(notification);
  };

  return {
    selectedNotification,
    setSelectedNotification,
    itemToDelete,
    setItemToDelete,
    isClearAllModalOpen,
    setIsClearAllModalOpen,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    markAllAsRead,
    confirmClearAll,
    toggleReadStatus,
    confirmDeleteSingle,
    handleViewDetails,
  };
}
