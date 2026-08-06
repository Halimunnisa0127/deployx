import { useState } from 'react';
import { 
  AlertTriangle, 
  Trash2, 
  UserCheck, 
  ArrowRight, 
  ShieldAlert,
  X
} from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';

export default function DangerZone() {
  const [transferEmail, setTransferEmail] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [toast, setToast] = useState(null);

  const handleTransfer = (e) => {
    e.preventDefault();
    if (!transferEmail.trim()) {
      setToast({ type: 'error', message: 'Please enter a valid team member email.' });
      return;
    }

    setToast({ type: 'success', message: `Ownership transfer request sent to ${transferEmail}.` });
    setTransferEmail('');
    setTimeout(() => setToast(null), 4000);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmationText !== 'DELETE') return;

    setIsDeleteModalOpen(false);
    setToast({ type: 'error', message: 'Account deletion process initiated.' });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Toast Alert */}
      {toast && (
        <div
          className={`flex items-center justify-between gap-3 p-4 rounded-xl border text-xs font-semibold shadow-lg transition-all animate-in fade-in duration-300 ${
            toast.type === 'success'
              ? 'bg-emerald-50/80 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-50/80 dark:bg-rose-950/80 border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>{toast.message}</span>
          </div>
          <button type="button" onClick={() => setToast(null)} className="text-muted-foreground hover:text-slate-900 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white/60 dark:bg-slate-900/60 border border-rose-200 dark:border-rose-500/30 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-2 pb-2 border-b border-rose-200 dark:border-rose-500/20">
          <AlertTriangle className="w-5 h-5 text-rose-500 dark:text-rose-400" />
          <div>
            <h3 className="text-base font-bold text-rose-700 dark:text-rose-300">
              Danger Zone
            </h3>
            <p className="text-xs text-muted-foreground">
              Irreversible and destructive account operations. Please proceed with caution.
            </p>
          </div>
        </div>

        {/* 1. Transfer Workspace Ownership (UI only) */}
        <form onSubmit={handleTransfer} className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-950/60 border border-border space-y-4">
          <div className="flex items-start gap-3">
            <UserCheck className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Transfer Workspace Ownership
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Transfer full administrator rights and billing responsibility of this workspace to another team member.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <div className="w-full flex-1">
              <Input
                type="email"
                placeholder="colleague@deployx.dev"
                value={transferEmail}
                onChange={(e) => setTransferEmail(e.target.value)}
                style={{ marginBottom: 0 }}
              />
            </div>

            <Button
              variant="secondary"
              type="submit"
              iconRight={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto shrink-0"
            >
              Transfer Ownership
            </Button>
          </div>
        </form>

        <hr className="border-rose-200 dark:border-rose-500/20" />

        {/* 2. Delete Account Section */}
        <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30 space-y-4">
          <div className="flex items-start gap-3">
            <Trash2 className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-rose-700 dark:text-rose-300">
                Delete DeployX Account & Workspace
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Permanently delete your account, associated projects, active deployments, custom domains, and build history. This action <span className="font-bold text-rose-600 dark:text-rose-400">cannot be undone</span>.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="danger"
              onClick={() => setIsDeleteModalOpen(true)}
              iconLeft={<Trash2 className="w-4 h-4" />}
            >
              Delete Account
            </Button>
          </div>
        </div>

      </div>

      {/* 3. Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteConfirmationText('');
        }}
        title="Delete DeployX Account?"
        maxWidth="480px"
      >
        <div className="space-y-4 pt-1">
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 text-xs text-rose-700 dark:text-rose-200 leading-relaxed space-y-1">
            <div className="font-bold flex items-center gap-1 text-rose-800 dark:text-rose-300">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Warning: Permanently Destructive Action
            </div>
            <div>
              All active hosting projects, environments, and custom domains will be immediately terminated.
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-foreground font-medium">
              To confirm, type <span className="font-mono font-bold text-rose-600 dark:text-rose-400">DELETE</span> below:
            </label>
            <Input
              placeholder="DELETE"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeleteConfirmationText('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={deleteConfirmationText !== 'DELETE'}
              onClick={handleDeleteAccount}
              iconLeft={<Trash2 className="w-4 h-4" />}
            >
              Confirm Permanent Deletion
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
