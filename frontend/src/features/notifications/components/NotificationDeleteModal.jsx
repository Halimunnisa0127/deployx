import React from 'react';
import { Trash2 } from 'lucide-react';
import Modal from '../../../components/ui/Modal/index';
import Button from '../../../components/ui/Button';

export default function NotificationDeleteModal({
  isOpen,
  itemToDelete,
  onClose,
  onConfirm,
  isClearAll = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isClearAll ? "Clear All Notifications?" : "Delete Notification?"}
      maxWidth="460px"
    >
      <div className="space-y-4 pt-1">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isClearAll ? (
            "Are you sure you want to clear all notifications? This action cannot be undone."
          ) : (
            <>
              Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-slate-100">"{itemToDelete?.title}"</span>? This action cannot be undone.
            </>
          )}
        </p>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            iconLeft={<Trash2 className="w-4 h-4" />}
          >
            {isClearAll ? "Clear All" : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
