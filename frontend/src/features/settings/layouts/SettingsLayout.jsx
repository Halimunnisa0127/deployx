import { Link, useLocation, Outlet } from 'react-router-dom';
import { User, ShieldCheck, Sliders, CreditCard, AlertTriangle } from 'lucide-react';

const SETTINGS_NAV_ITEMS = [
  { id: 'profile', label: 'Profile', href: '/dashboard/account/profile', icon: User },
  { id: 'security', label: 'Security', href: '/dashboard/account/security', icon: ShieldCheck },
  { id: 'preferences', label: 'Preferences', href: '/dashboard/account/preferences', icon: Sliders },
  { id: 'billing', label: 'Billing', href: '/dashboard/account/billing', icon: CreditCard },
  { id: 'danger-zone', label: 'Danger Zone', href: '/dashboard/account/danger-zone', icon: AlertTriangle, variant: 'danger' },
];

export default function SettingsLayout({ children }) {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-12">
      <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-10 max-w-6xl mx-auto w-full">
        {/* Module Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground transition-colors">
            Account
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground transition-colors">
            Manage your account credentials, security preferences, team access, and billing information.
          </p>
        </div>

        {/* Settings Module 2-Column Grid (Sidebar Navigation + Sub-page Content) */}
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Inner Settings Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 bg-card/60 border border-border rounded-2xl p-3 backdrop-blur-xl shadow-sm">
            <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0">
              {SETTINGS_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                const isDanger = item.variant === 'danger';

                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                      isActive
                        ? isDanger
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-sm'
                          : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                        : isDanger
                        ? 'text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? isDanger ? 'text-rose-400' : 'text-indigo-400'
                        : isDanger ? 'text-rose-400/80' : 'text-slate-400'
                    }`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Sub-page Content Outlet */}
          <main className="flex-1 w-full min-w-0">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </div>
  );
}
