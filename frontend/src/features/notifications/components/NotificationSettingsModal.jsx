import React from 'react';
import { ShieldCheck, Globe, GitBranch, Mail } from 'lucide-react';
import Modal from '../../../components/ui/Modal/index';
import Button from '../../../components/ui/Button';

export default function NotificationSettingsModal({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  onSave,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notification Preferences"
      maxWidth="500px"
    >
      <div className="space-y-4 pt-1">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Configure which events trigger real-time workspace notifications.
        </p>

        <div className="space-y-3">
          {/* Deployment Notifications */}
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-border">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              <div>
                <div className="text-xs font-bold text-foreground">Deployment Notifications</div>
                <div className="text-sm text-muted-foreground">Build success, failures, and triggers.</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.deployment}
              onChange={(e) => onSettingsChange({ ...settings, deployment: e.target.checked })}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500/40 cursor-pointer"
            />
          </div>

          {/* Domain Notifications */}
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-border">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-sky-500 dark:text-sky-400" />
              <div>
                <div className="text-xs font-bold text-foreground">Domain Notifications</div>
                <div className="text-sm text-muted-foreground">SSL certificates and DNS updates.</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.domain}
              onChange={(e) => onSettingsChange({ ...settings, domain: e.target.checked })}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500/40 cursor-pointer"
            />
          </div>

          {/* GitHub Notifications */}
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-border">
            <div className="flex items-center gap-3">
              <GitBranch className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-foreground">GitHub Notifications</div>
                <div className="text-sm text-muted-foreground">Repository sync & branch commits.</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.github}
              onChange={(e) => onSettingsChange({ ...settings, github: e.target.checked })}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500/40 cursor-pointer"
            />
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-border">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-purple-500 dark:text-purple-400" />
              <div>
                <div className="text-xs font-bold text-foreground">Email Notifications</div>
                <div className="text-sm text-muted-foreground">Digest emails for critical alerts.</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.email}
              onChange={(e) => onSettingsChange({ ...settings, email: e.target.checked })}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500/40 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <Button
            variant="primary"
            size="sm"
            onClick={onSave}
          >
            Save Preferences
          </Button>
        </div>
      </div>
    </Modal>
  );
}
