import { useState, useEffect, useMemo } from 'react';
import { 
  User, 
  Save, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  Globe, 
  Clock, 
  AtSign, 
  AlertTriangle, 
  CheckCircle2, 
  X,
  Palette,
  RotateCcw
} from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Avatar from '../../../components/common/Avatar';
import Skeleton from '../../../components/ui/Skeleton';
import EmptyState from '../../../components/common/EmptyState';
import Modal from '../../../components/ui/Modal';
import { COUNTRY_CODES } from '../../../constants/countryCodes';

const INITIAL_PROFILE = {
  fullName: 'Jane Doe',
  username: 'janedoe',
  email: 'jane@deployx.dev',
  countryCode: '+1',
  phone: '(555) 234-5678',
  companyName: 'DeployX Cloud Technologies',
  jobTitle: 'Senior Infrastructure Engineer',
  timezone: 'Asia/Singapore (UTC+08:00)',
  language: 'English (US)',
  avatarPreset: 'Jane Doe',
};

const AVATAR_PRESETS = [
  { name: 'Jane Doe', label: 'Default' },
  { name: 'Alex Rivera', label: 'Indigo' },
  { name: 'Marcus Chen', label: 'Emerald' },
  { name: 'Sophia Patel', label: 'Rose' },
  { name: 'David Kim', label: 'Sky' },
];

const TIMEZONE_OPTIONS = [
  'Asia/Singapore (UTC+08:00)',
  'America/New_York (UTC-05:00)',
  'America/Los_Angeles (UTC-08:00)',
  'Europe/London (UTC+00:00)',
  'Europe/Berlin (UTC+01:00)',
  'Asia/Tokyo (UTC+09:00)',
];

const LANGUAGE_OPTIONS = [
  'English (US)',
  'Spanish (Español)',
  'French (Français)',
  'German (Deutsch)',
  'Japanese (日本語)',
];

export default function Profile() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [formData, setFormData] = useState(INITIAL_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Detect unsaved changes
  const isDirty = useMemo(() => {
    return JSON.stringify(profile) !== JSON.stringify(formData);
  }, [profile, formData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setToast({ type: 'error', message: 'Full Name and Email Address are required fields.' });
      return;
    }

    setProfile(formData);
    setToast({ type: 'success', message: 'Your profile information has been saved successfully.' });

    setTimeout(() => setToast(null), 4000);
  };

  const handleDiscard = () => {
    setFormData(profile);
    setToast({ type: 'info', message: 'Unsaved changes have been discarded.' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRemoveAvatar = () => {
    handleChange('avatarPreset', 'User');
    setToast({ type: 'info', message: 'Profile image reset to default initial.' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleClearProfile = () => {
    setFormData({
      fullName: '',
      username: '',
      email: '',
      countryCode: '+1',
      phone: '',
      companyName: '',
      jobTitle: '',
      timezone: 'Asia/Singapore (UTC+08:00)',
      language: 'English (US)',
      avatarPreset: 'User',
    });
  };

  const isProfileEmpty = !formData.fullName && !formData.email && !formData.username;

  if (isLoading) {
    return (
      <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl space-y-6">
        <div className="flex items-center gap-6">
          <Skeleton variant="circular" width="80px" height="80px" />
          <div className="space-y-2">
            <Skeleton width="160px" height="20px" />
            <Skeleton width="220px" height="14px" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="space-y-2">
              <Skeleton width="100px" height="14px" />
              <Skeleton width="100%" height="40px" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`flex items-center justify-between gap-3 p-4 rounded-xl border text-xs font-semibold shadow-lg transition-all animate-in fade-in duration-300 ${
            toast.type === 'success'
              ? 'bg-emerald-50/80 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
              : toast.type === 'error'
              ? 'bg-rose-50/80 dark:bg-rose-950/80 border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-300'
              : 'bg-indigo-50/80 dark:bg-indigo-950/80 border-indigo-200 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : toast.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            ) : (
              <User className="w-4 h-4 text-indigo-400" />
            )}
            <span>{toast.message}</span>
          </div>

          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Form Container */}
      <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-8">
        
        {isProfileEmpty ? (
          /* Empty State */
          <EmptyState
            card={false}
            icon={<User className="w-8 h-8 text-indigo-400" />}
            title="No profile information found"
            description="Your profile details are currently empty. Click below to restore default profile settings."
            primaryAction={{
              label: 'Restore Default Profile',
              onClick: () => {
                setFormData(INITIAL_PROFILE);
                setProfile(INITIAL_PROFILE);
              },
            }}
          />
        ) : (
          <>
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center gap-5">
                <Avatar name={formData.avatarPreset} size="xl" variant="rounded" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Profile Picture
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Square image recommended (JPG, PNG, max 2MB).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setIsAvatarModalOpen(true)}
                  iconLeft={<Palette className="w-3.5 h-3.5" />}
                >
                  Change Avatar
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleRemoveAvatar}
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                >
                  Remove
                </Button>
              </div>
            </div>

            {/* Profile Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <Input
                  placeholder="e.g. Jane Doe"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  iconLeft={<User className="w-4 h-4" />}
                />
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Username
                </label>
                <Input
                  placeholder="janedoe"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  iconLeft={<AtSign className="w-4 h-4" />}
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="jane@deployx.dev"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  iconLeft={<Mail className="w-4 h-4" />}
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.countryCode}
                    onChange={(e) => handleChange('countryCode', e.target.value)}
                    className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl px-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 w-28 shrink-0"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.country} value={c.code}>
                        {c.code} {c.country}
                      </option>
                    ))}
                  </select>
                  <div className="flex-1">
                    <Input
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      iconLeft={<Phone className="w-4 h-4" />}
                      style={{ marginBottom: 0 }}
                    />
                  </div>
                </div>
              </div>

              {/* Company Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Company Name
                </label>
                <Input
                  placeholder="DeployX Cloud Technologies"
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  iconLeft={<Building2 className="w-4 h-4" />}
                />
              </div>

              {/* Job Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Job Title
                </label>
                <Input
                  placeholder="Senior Infrastructure Engineer"
                  value={formData.jobTitle}
                  onChange={(e) => handleChange('jobTitle', e.target.value)}
                  iconLeft={<Briefcase className="w-4 h-4" />}
                />
              </div>

              {/* Timezone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Timezone
                </label>
                <div className="relative">
                  <select
                    value={formData.timezone}
                    onChange={(e) => handleChange('timezone', e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none"
                  >
                    {TIMEZONE_OPTIONS.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                  <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Language */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Preferred Language
                </label>
                <div className="relative">
                  <select
                    value={formData.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none"
                  >
                    {LANGUAGE_OPTIONS.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                  <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800/80">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearProfile}
                iconLeft={<RotateCcw className="w-3.5 h-3.5" />}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                Clear Fields
              </Button>

              <Button
                variant="primary"
                onClick={handleSave}
                iconLeft={<Save className="w-4 h-4" />}
              >
                Save Changes
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Floating Unsaved Changes Warning Banner */}
      {isDirty && (
        <div className="sticky bottom-4 z-40 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/90 border border-indigo-200 dark:border-indigo-500/40 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-bottom-6 duration-300">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0" />
            <div className="text-xs text-indigo-900 dark:text-indigo-100">
              <span className="font-bold">You have unsaved changes.</span> Make sure to save before navigating away.
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="secondary" size="sm" onClick={handleDiscard}>
              Discard
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} iconLeft={<Save className="w-3.5 h-3.5" />}>
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* Avatar Picker Modal */}
      <Modal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        title="Select Avatar Preset"
        maxWidth="460px"
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choose an avatar style to personalize your DeployX profile.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {AVATAR_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  handleChange('avatarPreset', preset.name);
                  setIsAvatarModalOpen(false);
                }}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                  formData.avatarPreset === preset.name
                    ? 'bg-indigo-50 dark:bg-indigo-500/20 border-indigo-300 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300'
                    : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Avatar name={preset.name} size="md" variant="rounded" />
                <span className="text-xs font-semibold">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      </Modal>

    </div>
  );
}
