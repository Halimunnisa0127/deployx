import { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Mail, 
  BellRing, 
  Clock, 
  Calendar, 
  Save, 
  CheckCircle2, 
  Sliders
} from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function Preferences() {
  const [preferences, setPreferences] = useState({
    theme: 'dark', // 'light' | 'dark' | 'system'
    emailNotifications: true,
    browserNotifications: true,
    timeFormat: '12h', // '12h' | '24h'
    dateFormat: 'MM/DD/YYYY', // 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
  });
  const [toast, setToast] = useState(null);

  const handleSave = () => {
    setToast({ type: 'success', message: 'Workspace preferences updated successfully.' });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Toast Alert */}
      {toast && (
        <div className="flex items-center justify-between gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-950/80 dark:text-emerald-300 text-xs font-semibold shadow-lg transition-all animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800/80">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Workspace Preferences
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize your interface theme, notification delivery, and regional datetime formatting.
            </p>
          </div>
        </div>

        {/* 1. Theme Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block font-mono">
            Interface Theme
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light Theme', icon: Sun },
              { id: 'dark', label: 'Dark Theme', icon: Moon },
              { id: 'system', label: 'System Default', icon: Monitor },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = preferences.theme === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPreferences({ ...preferences, theme: item.id })}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-500/20 border-indigo-200 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300 shadow-sm'
                      : 'bg-slate-50/60 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-800/80" />

        {/* 2. Notifications Controls */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block font-mono">
            Notification Delivery
          </label>

          <div className="space-y-3">
            {/* Email Notifications */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50/60 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Email Notifications</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Receive build logs and deployment failure reports via email.</div>
                </div>
              </div>

              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 bg-white text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-indigo-500 focus:ring-indigo-500/40 cursor-pointer"
              />
            </div>

            {/* Browser Push Notifications */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50/60 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <BellRing className="w-5 h-5 text-sky-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Browser Push Notifications</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Receive real-time desktop popups when builds succeed or fail.</div>
                </div>
              </div>

              <input
                type="checkbox"
                checked={preferences.browserNotifications}
                onChange={(e) => setPreferences({ ...preferences, browserNotifications: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 bg-white text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-indigo-500 focus:ring-indigo-500/40 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-800/80" />

        {/* 3. DateTime Formatting */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Time Format */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Time Format</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: '12h', label: '12-Hour (AM/PM)' },
                { id: '24h', label: '24-Hour (14:30)' },
              ].map((tf) => (
                <button
                  key={tf.id}
                  type="button"
                  onClick={() => setPreferences({ ...preferences, timeFormat: tf.id })}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                    preferences.timeFormat === tf.id
                      ? 'bg-indigo-50/80 dark:bg-indigo-500/20 border-indigo-200 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300'
                      : 'bg-slate-50/60 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Format */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Date Format</span>
            </label>

            <select
              value={preferences.dateFormat}
              onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2026)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2026-12-31)</option>
            </select>
          </div>
        </div>

        {/* Save Actions */}
        <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800/80">
          <Button
            variant="primary"
            onClick={handleSave}
            iconLeft={<Save className="w-4 h-4" />}
          >
            Save Preferences
          </Button>
        </div>

      </div>

    </div>
  );
}
