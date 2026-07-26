import { User, Save, Mail, Phone } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Avatar from '../../../components/common/Avatar';
import { COUNTRY_CODES } from '../../../constants/countryCodes';

export default function Profile() {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col gap-6 p-6 md:p-10 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col gap-1 mb-4">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors">
            Your Profile
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
            Manage your personal information and profile picture.
          </p>
        </div>

        {/* Content Area */}
        <div className="bg-white/60 dark:bg-[#0f172a]/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-sm dark:shadow-none transition-colors">
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <Avatar name="User" size="xl" variant="rounded" />
              <div className="flex flex-col gap-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white transition-colors">Profile Picture</h3>
                <div className="flex items-center gap-3">
                  <Button variant="secondary" size="sm">
                    Upload new image
                  </Button>
                  <Button variant="ghost" size="sm" className="text-rose-400 hover:text-rose-300">
                    Remove
                  </Button>
                </div>
                <p className="text-xs text-slate-500 transition-colors">
                  Recommended: Square image, at least 400x400px.
                </p>
              </div>
            </div>

            <hr className="border-slate-200 dark:border-slate-800/60 transition-colors" />

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors">Full Name</label>
                <Input
                  placeholder="e.g. Jane Doe"
                  defaultValue="Jane Doe"
                  iconLeft={<User className="w-4 h-4" />}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors">Email Address</label>
                <Input
                  type="email"
                  placeholder="jane@deployx.dev"
                  defaultValue="jane@deployx.dev"
                  iconLeft={<Mail className="w-4 h-4" />}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors">Mobile Number</label>
                <div className="flex gap-3">
                  <select
                    className="bg-white dark:bg-[#0f172a]/50 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 text-sm rounded-lg px-3 outline-none focus:border-indigo-400 focus:ring-[3px] focus:ring-indigo-500/15 transition-all w-32 shrink-0"
                    defaultValue="+1"
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
                      iconLeft={<Phone className="w-4 h-4" />}
                      style={{ marginBottom: 0 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button variant="primary" iconLeft={<Save className="w-4 h-4" />}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
