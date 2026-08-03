import React from 'react';
import { Calendar } from 'lucide-react';
import NotificationItem from './NotificationItem';

export default function NotificationGroup({
  groupTitle,
  items,
  onToggleRead,
  onViewDetails,
  onDeleteClick,
}) {
  if (items.length === 0) return null;

  return (
    <div className="p-4 sm:p-6 space-y-3">
      {/* Timeline Group Header */}
      <div className="flex items-center gap-2 pb-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
        <Calendar className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
        <span>{groupTitle}</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-normal">
          {items.length}
        </span>
      </div>

      {/* Notification Items */}
      <div className="space-y-2.5">
        {items.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onToggleRead={onToggleRead}
            onViewDetails={onViewDetails}
            onDeleteClick={onDeleteClick}
          />
        ))}
      </div>
    </div>
  );
}
