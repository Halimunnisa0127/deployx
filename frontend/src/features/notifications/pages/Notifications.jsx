import { 
  NotificationHeader, 
  NotificationControls, 
  NotificationList, 
  NotificationSettingsModal, 
  NotificationDeleteModal, 
  NotificationDetailsModal 
} from '../components';
import { 
  useNotifications, 
  useNotificationFilters, 
  useNotificationActions 
} from '../hooks';
import useAuth from '../../../hooks/useAuth';

export default function Notifications() {
  const { user: currentUser } = useAuth();

  // Core state & fetching
  const { 
    notifications, 
    setNotifications, 
    isLoading, 

    settings, 
    setSettings 
  } = useNotifications(currentUser);

  // Filters, search, grouping
  const {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    unreadCount,
    groupedData,
    hasNotifications,
  } = useNotificationFilters(notifications);

  // Actions
  const {
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
  } = useNotificationActions(setNotifications);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <NotificationHeader
        unreadCount={unreadCount}
        notificationsLength={notifications.length}
        onMarkAllAsRead={markAllAsRead}
        onClearAllClick={() => setIsClearAllModalOpen(true)}
        onSettingsClick={() => setIsSettingsModalOpen(true)}
      />


      <NotificationControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      <NotificationList
        isLoading={isLoading}
        hasNotifications={hasNotifications}
        groupedData={groupedData}
        searchQuery={searchQuery}
        activeFilter={activeFilter}
        onClearFilters={() => {
          setSearchQuery('');
          setActiveFilter('all');
        }}
        onToggleRead={toggleReadStatus}
        onViewDetails={handleViewDetails}
        onDeleteClick={setItemToDelete}
      />

      <NotificationDeleteModal
        isOpen={isClearAllModalOpen}
        onClose={() => setIsClearAllModalOpen(false)}
        onConfirm={confirmClearAll}
        isClearAll={true}
      />

      <NotificationDeleteModal

        isOpen={Boolean(itemToDelete)}
        itemToDelete={itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDeleteSingle}
        isClearAll={false}
      />

      <NotificationSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
        onSave={() => setIsSettingsModalOpen(false)}
      />

      <NotificationDetailsModal

        isOpen={Boolean(selectedNotification)}
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
      />

    </div>
  );
}
