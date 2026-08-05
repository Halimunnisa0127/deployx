import { useState } from 'react';
import { 
  Lock, 
  Save, 
  Smartphone, 
  ShieldCheck, 
  Laptop, 
  Globe, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle,
  Key,
  Shield
} from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';

const MOCK_ACTIVE_SESSIONS = [
  {
    id: 'sess-1',
    device: 'Chrome on macOS (Sonoma)',
    location: 'Singapore (103.252.200.12)',
    isCurrent: true,
    lastActive: 'Active now',
    icon: Laptop,
  },
  {
    id: 'sess-2',
    device: 'Firefox on Windows 11',
    location: 'Tokyo, Japan (210.140.10.45)',
    isCurrent: false,
    lastActive: '2 hours ago',
    icon: Laptop,
  },
  {
    id: 'sess-3',
    device: 'Safari on iPhone 15 Pro',
    location: 'New York, US (172.56.88.90)',
    isCurrent: false,
    lastActive: '1 day ago',
    icon: Smartphone,
  },
];

export default function Security() {
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirmPass: '',
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessions, setSessions] = useState(MOCK_ACTIVE_SESSIONS);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.newPass || !passwords.confirmPass) {
      setToast({ type: 'error', message: 'Please fill in all password fields.' });
      return;
    }
    if (passwords.newPass !== passwords.confirmPass) {
      setToast({ type: 'error', message: 'New password and confirmation password do not match.' });
      return;
    }
    if (passwords.newPass.length < 8) {
      setToast({ type: 'error', message: 'Password must be at least 8 characters long.' });
      return;
    }

    setToast({ type: 'success', message: 'Password updated successfully.' });
    setPasswords({ current: '', newPass: '', confirmPass: '' });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogoutOtherDevices = () => {
    setSessions(sessions.filter((s) => s.isCurrent));
    setIsLogoutModalOpen(false);
    setToast({ type: 'success', message: 'Successfully logged out all other active sessions.' });
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
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white/60 dark:bg-slate-900/60 border border-border rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-8">
        
        {/* 1. Change Password Section */}
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Key className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Change Password
              </h3>
              <p className="text-xs text-muted-foreground">
                Update your account password to maintain maximum workspace security.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Current Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                iconLeft={<Lock className="w-4 h-4" />}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">New Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={passwords.newPass}
                onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                iconLeft={<Lock className="w-4 h-4" />}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Confirm New Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={passwords.confirmPass}
                onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
                iconLeft={<Lock className="w-4 h-4" />}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="secondary" type="submit" iconLeft={<Save className="w-4 h-4" />}>
              Update Password
            </Button>
          </div>
        </form>

        <hr className="border-border" />

        {/* 2. Two-Factor Authentication Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-50/60 dark:bg-slate-950/60 border border-border">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-500 dark:text-indigo-400 shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Two-Factor Authentication (2FA)
                </h3>
                <Badge variant={twoFactorEnabled ? 'success' : 'neutral'}>
                  {twoFactorEnabled ? 'ENABLED' : 'DISABLED'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Protect your DeployX account with TOTP authenticator app verification (1Password, Google Authenticator).
              </p>
            </div>
          </div>

          <Button
            variant={twoFactorEnabled ? 'outline' : 'primary'}
            size="sm"
            onClick={() => {
              setTwoFactorEnabled(!twoFactorEnabled);
              setToast({
                type: 'success',
                message: !twoFactorEnabled ? 'Two-Factor Authentication enabled.' : 'Two-Factor Authentication disabled.',
              });
              setTimeout(() => setToast(null), 3000);
            }}
          >
            {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
          </Button>
        </div>

        <hr className="border-border" />

        {/* 3. Active Sessions Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Active Sessions
                </h3>
                <p className="text-xs text-muted-foreground">
                  Devices currently authenticated with your DeployX access credentials.
                </p>
              </div>
            </div>

            {sessions.length > 1 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsLogoutModalOpen(true)}
                iconLeft={<LogOut className="w-3.5 h-3.5 text-rose-400" />}
                className="hover:border-rose-500/40 hover:text-rose-300"
              >
                Logout Other Devices
              </Button>
            )}
          </div>

          <div className="space-y-2.5">
            {sessions.map((sess) => {
              const DeviceIcon = sess.icon;
              return (
                <div
                  key={sess.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50/40 dark:bg-slate-950/40 border border-border"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="p-2.5 rounded-xl bg-card border border-border text-muted-foreground shrink-0">
                      <DeviceIcon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground truncate">
                          {sess.device}
                        </span>
                        {sess.isCurrent && (
                          <Badge variant="success">Current Session</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground font-mono">
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3 text-slate-400" />
                          {sess.location}
                        </span>
                        <span>• {sess.lastActive}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Logout All Other Devices?"
        maxWidth="460px"
      >
        <div className="space-y-4 pt-1">
          <p className="text-sm text-foreground leading-relaxed">
            Are you sure you want to log out of all other active browser sessions and devices? You will remain signed in on this current browser.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsLogoutModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleLogoutOtherDevices}
              iconLeft={<LogOut className="w-4 h-4" />}
            >
              Logout Other Devices
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
