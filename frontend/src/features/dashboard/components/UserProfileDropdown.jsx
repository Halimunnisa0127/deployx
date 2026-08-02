import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  User,
  Bell,
  Monitor,
  Sun,
  Moon,
  LifeBuoy,
  LogOut,
} from 'lucide-react';
import { logout } from '../../auth/slice/authSlice';
import { setTheme } from '../../../store/slices/uiSlice';
import { useSelector } from 'react-redux';

export default function UserProfileDropdown({ user, close }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const theme = useSelector((state) => state.ui.theme);

  const handleSetTheme = (newTheme) => {
    dispatch(setTheme(newTheme));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    if (close) close();
  };

  const navItemClass =
    'w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors text-left select-none text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white group cursor-pointer';

  const iconClass = 'text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-200 flex-shrink-0 w-4 h-4 transition-colors';

  return (
    <div className="flex flex-col w-full py-1.5">
      {/* Header */}
      <div className="flex flex-col px-3.5 pt-2 pb-2.5 min-w-0">
        <span className="text-xs font-bold text-slate-900 dark:text-white tracking-wide truncate transition-colors">
          {user?.name || 'GANAPATHI RAJESH GUMMALLLA'}
        </span>
        <span className="text-sm text-slate-600 dark:text-slate-400 truncate transition-colors mt-0.5 font-mono">
          {user?.email || 'nanigummalla418@gmail.com'}
        </span>
      </div>

      <div className="h-px bg-slate-200 dark:bg-white/5 my-1 mx-2 transition-colors" />

      {/* List Items */}
      <div className="px-1 space-y-0.5">
        {/* 1. Account */}
        <div
          className={navItemClass}
          onClick={() => {
            navigate('/dashboard/account/profile');
            if (close) close();
          }}
        >
          <span>Account</span>
          <User className={iconClass} />
        </div>

        {/* 2. Notifications */}
        <div
          className={navItemClass}
          onClick={() => {
            navigate('/dashboard/notifications');
            if (close) close();
          }}
        >
          <span>Notifications</span>
          <Bell className={iconClass} />
        </div>

        {/* 4. Theme */}
        <div className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left select-none text-slate-700 dark:text-slate-300">
          <span>Theme</span>
          {/* Theme Toggle */}
          <div className="flex items-center gap-1.5 p-1 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/50 transition-colors">
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); handleSetTheme('system'); }}
              className={`p-1 rounded-full cursor-pointer transition-all ${theme === 'system' ? 'bg-white dark:bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
              title="System Theme"
              aria-label="System Theme"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); handleSetTheme('light'); }}
              className={`p-1 rounded-full cursor-pointer transition-all ${theme === 'light' ? 'bg-white dark:bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
              title="Light Theme"
              aria-label="Light Theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); handleSetTheme('dark'); }}
              className={`p-1 rounded-full cursor-pointer transition-all ${theme === 'dark' ? 'bg-white dark:bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
              title="Dark Theme"
              aria-label="Dark Theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5. Help */}
        <div
          className={navItemClass}
          onClick={() => {
            navigate('/dashboard/account/preferences');
            if (close) close();
          }}
        >
          <span>Help</span>
          <LifeBuoy className={iconClass} />
        </div>

        {/* 6. Log Out */}
        <div className={navItemClass} onClick={handleLogout}>
          <span>Log Out</span>
          <LogOut className={iconClass} />
        </div>
      </div>
    </div>
  );
}
