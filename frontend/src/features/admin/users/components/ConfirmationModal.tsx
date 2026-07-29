import React from 'react';
import Modal from '../../../../components/ui/Modal';
import Button from '../../../../components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', isDanger = true }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center">
        {isDanger && (
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>
        )}
        <p className="text-slate-300 mb-8">{message}</p>
        
        <div className="flex gap-3 w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant={isDanger ? 'primary' : 'primary'} 
            onClick={onConfirm} 
            className={`flex-1 ${isDanger ? 'bg-rose-600 hover:bg-rose-700 text-white border-transparent' : ''}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
