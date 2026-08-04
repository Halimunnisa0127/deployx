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
    // Real API call
    await notificationService.markAllAsRead();
  };

  const confirmClearAll = async () => {
    setNotifications([]);
    setIsClearAllModalOpen(false);
    await notificationService.clearNotifications();
  };

  // Single Item Actions
  const toggleReadStatus = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
    await notificationService.markAsRead(id);
  };

  const confirmDeleteSingle = async () => {
    if (itemToDelete) {
      setNotifications((prev) => prev.filter((n) => n.id !== itemToDelete.id));
      if (selectedNotification?.id === itemToDelete.id) {
        setSelectedNotification(null);
      }
      const idToDelete = itemToDelete.id;
      setItemToDelete(null);
      await notificationService.deleteNotification(idToDelete);
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
