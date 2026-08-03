import React from 'react';
import NotificationGroup from './NotificationGroup';
import NotificationEmptyState from './NotificationEmptyState';

export default function NotificationList({
  isLoading,
  hasNotifications,
  groupedData,
  searchQuery,
  activeFilter,
  onClearFilters,
  onToggleRead,
  onViewDetails,
  onDeleteClick,
}) {
  return (
    <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-xl overflow-hidden">
      {isLoading ? (
        <NotificationEmptyState isLoading={true} />
      ) : !hasNotifications ? (
        <NotificationEmptyState
          isLoading={false}
          searchQuery={searchQuery}
          activeFilter={activeFilter}
          onClearFilters={onClearFilters}
        />
      ) : (
        <div className="divide-y divide-slate-200 dark:divide-slate-800/80">
          {Object.entries(groupedData).map(([groupTitle, items]) => (
            <NotificationGroup
              key={groupTitle}
              groupTitle={groupTitle}
              items={items}
              onToggleRead={onToggleRead}
              onViewDetails={onViewDetails}
              onDeleteClick={onDeleteClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
