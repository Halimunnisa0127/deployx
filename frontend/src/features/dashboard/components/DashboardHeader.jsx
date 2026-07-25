import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Bell,
  ChevronRight,
  Home,
  Menu,
} from 'lucide-react';

import SearchBar from '../../../components/common/SearchBar';
import Button from '../../../components/ui/Button';

// Helper to format breadcrumb segment names
function formatBreadcrumbLabel(segment) {
  if (!segment) return '';
  if (segment === 'dashboard') return 'Dashboard';
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export default function DashboardHeader({ onToggleMobile }) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Generate breadcrumb segments from current pathname
  const pathSegments = location.pathname
    .split('/')
    .filter(Boolean);

  const currentPageTitle = pathSegments.length > 1
    ? formatBreadcrumbLabel(pathSegments[pathSegments.length - 1])
    : 'Dashboard';

  return (
    <header className="sticky top-0 z-20 h-16 w-full bg-white/85 dark:bg-[#0a0a0a]/85 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 px-4 md:px-8 flex items-center justify-between gap-4 select-none transition-colors duration-300">
      {/* ── Left: Mobile Toggle, Breadcrumbs & Page Title ──────────────── */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Sidebar Toggle Button */}
        {onToggleMobile && (
          <div className="md:hidden flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              onClick={onToggleMobile}
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300 transition-colors" />
            </Button>
          </div>
        )}

        <div className="flex flex-col min-w-0">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400">
            <Link
              to="/dashboard"
              className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            {pathSegments.map((segment, index) => {
              const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
              const isLast = index === pathSegments.length - 1;
              const label = formatBreadcrumbLabel(segment);

              return (
                <div key={url} className="flex items-center gap-1.5 min-w-0">
                  <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  {isLast ? (
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate transition-colors" aria-current="page">
                      {label}
                    </span>
                  ) : (
                    <Link
                      to={url}
                      className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors truncate"
                    >
                      {label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Page Title */}
          <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight hidden sm:block truncate mt-0.5 transition-colors">
            {currentPageTitle}
          </h1>
        </div>
      </div>

      {/* ── Right: Global Search & Notifications ───────────── */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Global Search Input (Reusable Component) */}
        <SearchBar
          placeholder="Search dashboard..."
          shortcut="⌘K"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          className="hidden md:flex"
        />

        {/* Notifications Button */}
        <Link
          to="/dashboard/notifications"
          className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-[#0a0a0a]" />
        </Link>
      </div>
    </header>
  );
}

