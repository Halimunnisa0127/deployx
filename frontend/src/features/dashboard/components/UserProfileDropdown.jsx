import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  Settings,
  Smile,
  Monitor,
  Sun,
  Moon,
  Home,
  PenLine,
  LifeBuoy,
  BookOpen,
  LogOut,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { logout } from '../../auth/slice/authSlice';

export default function UserProfileDropdown({ user, close }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [theme, setThemeState] = useState(() => localStorage.getItem('theme') || 'system');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    if (close) close();
  };

  const navItemClass =
    'w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-lg transition-colors text-left select-none text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white group cursor-pointer';

  const iconClass = 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 flex-shrink-0 w-4 h-4 transition-colors';

  return (
    <div className="flex flex-col w-full py-1">
      {/* Header */}
      <div className="flex items-start justify-between px-3 pt-2 pb-3">
        <div className="flex flex-col min-w-0 pr-2">
          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide truncate transition-colors">
            {user?.name || 'GANAPATHI RAJESH GUMMALLLA'}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate transition-colors">
            {user?.email || 'nanigummalla418@gmail.com'}
          </span>
        </div>
        <button
          onClick={() => {
            navigate('/dashboard/settings/profile');
            if (close) close();
          }}
          className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mt-0.5 outline-none flex-shrink-0"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div className="h-px bg-slate-200 dark:bg-slate-800 my-1 mx-1 transition-colors" />

      {/* List Items */}
      <div className="px-1 space-y-0.5">
        <div className={navItemClass}>
          <span>Feedback</span>
          <Smile className={iconClass} />
        </div>

        <div className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left select-none text-slate-700 dark:text-slate-300">
          <span>Theme</span>
          {/* Theme Toggle */}
          <div className="flex items-center gap-1.5 p-1 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/50 transition-colors">
            <div 
              onClick={(e) => { e.stopPropagation(); setThemeState('system'); }}
              className={`p-1 rounded-full cursor-pointer transition-all ${theme === 'system' ? 'bg-white dark:bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </div>
            <div 
              onClick={(e) => { e.stopPropagation(); setThemeState('light'); }}
              className={`p-1 rounded-full cursor-pointer transition-all ${theme === 'light' ? 'bg-white dark:bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              <Sun className="w-3.5 h-3.5" />
            </div>
            <div 
              onClick={(e) => { e.stopPropagation(); setThemeState('dark'); }}
              className={`p-1 rounded-full cursor-pointer transition-all ${theme === 'dark' ? 'bg-white dark:bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              <Moon className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        <div className={navItemClass} onClick={() => { navigate('/dashboard'); if (close) close(); }}>
          <span>Home Page</span>
          <Home className={iconClass} />
        </div>

        <div className={navItemClass}>
          <span>Changelog</span>
          <PenLine className={iconClass} />
        </div>

        <div className={navItemClass}>
          <span>Help</span>
          <LifeBuoy className={iconClass} />
        </div>

        <div className={navItemClass}>
          <span>Docs</span>
          <BookOpen className={iconClass} />
        </div>

        <div className={navItemClass} onClick={handleLogout}>
          <span>Log Out</span>
          <LogOut className={iconClass} />
        </div>
      </div>

      {/* Footer / Upgrade Button */}
      <div className="px-2 pt-3 pb-1">
        <Button
          variant="secondary"
          fullWidth
          className="bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 border-none font-semibold text-xs py-2 shadow-sm transition-colors"
          onClick={() => {
            navigate('/dashboard/upgrade');
            if (close) close();
          }}
        >
          Upgrade to Pro
        </Button>
      </div>
    </div>
  );
}
