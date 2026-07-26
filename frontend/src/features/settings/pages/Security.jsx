import { Save, Lock, Smartphone } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

export default function Security() {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col gap-6 p-6 md:p-10 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col gap-1 mb-4">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors">
            Security & Access
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
            Manage your password and security preferences.
          </p>
        </div>

        {/* Content Area */}
        <div className="bg-white/60 dark:bg-[#0f172a]/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-sm dark:shadow-none transition-colors">
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Password Section */}
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white transition-colors">Change Password</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 transition-colors">
                  Update your password associated with your account.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors">Current Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    iconLeft={<Lock className="w-4 h-4" />}
                  />
                </div>
                <div className="hidden md:block"></div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors">New Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    iconLeft={<Lock className="w-4 h-4" />}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors">Confirm New Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    iconLeft={<Lock className="w-4 h-4" />}
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button variant="secondary" iconLeft={<Save className="w-4 h-4" />}>
                  Update Password
                </Button>
              </div>
            </div>

            <hr className="border-slate-200 dark:border-slate-800/60 transition-colors" />

            {/* 2FA Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 transition-colors">
                  <Smartphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400 transition-colors" />
                  Two-Factor Authentication
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 transition-colors">
                  Add an extra layer of security to your account.
                </p>
              </div>
              <Button variant="primary">Enable 2FA</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
