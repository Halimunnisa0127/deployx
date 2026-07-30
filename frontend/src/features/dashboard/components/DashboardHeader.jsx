import { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronRight,
  Home,
  Menu,
  FolderPlus,
  Rocket,
  Globe,
  Search,
  ArrowRight,
  Users,
  Terminal,
} from 'lucide-react';

import SearchBar from '../../../components/common/SearchBar';
import Button from '../../../components/ui/Button';
import GithubIcon from '../../../components/ui/GithubIcon';
import { MOCK_GLOBAL_SEARCH_ITEMS } from '../data/mockDashboardData';

// Helper to format breadcrumb segment names
function formatBreadcrumbLabel(segment) {
  if (!segment) return '';
  if (segment === 'dashboard') return 'Dashboard';
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

const CATEGORY_ICON_MAP = {
  Projects: <FolderPlus className="w-3.5 h-3.5 text-indigo-400" />,
  Deployments: <Rocket className="w-3.5 h-3.5 text-purple-400" />,
  Domains: <Globe className="w-3.5 h-3.5 text-sky-400" />,
  Repositories: <GithubIcon className="w-3.5 h-3.5 text-emerald-400" />,
  Teams: <Users className="w-3.5 h-3.5 text-rose-400" />,
  Logs: <Terminal className="w-3.5 h-3.5 text-amber-400" />,
};

export default function DashboardHeader({ onToggleMobile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  // Filter search items based on query
  const filteredSearchItems = searchQuery.trim()
    ? MOCK_GLOBAL_SEARCH_ITEMS.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Group filtered results by category
  const groupedResults = filteredSearchItems.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Close search results when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsSearchFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Generate breadcrumb segments from current pathname
  const pathSegments = location.pathname
    .split('/')
    .filter(Boolean);

  const currentPageTitle = pathSegments.length > 1
    ? formatBreadcrumbLabel(pathSegments[pathSegments.length - 1])
    : 'Dashboard';

  const handleSelectSearchItem = (link) => {
    setIsSearchFocused(false);
    setSearchQuery('');
    navigate(link);
  };

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


        </div>
      </div>

      {/* ── Right: Global Search & Notifications ───────────── */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Global Search Container */}
        <div ref={searchContainerRef} className="relative hidden md:block">
          <SearchBar
            placeholder="Search anything..."
            shortcut="⌘K"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchFocused(true);
            }}
            onFocus={() => setIsSearchFocused(true)}
            onClear={() => setSearchQuery('')}
            className="w-72 lg:w-80"
          />

          {/* Global Search Interactive Results Dropdown */}
          {isSearchFocused && searchQuery.trim() !== '' && (
            <div className="absolute right-0 top-12 w-80 lg:w-96 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl p-3 z-50 max-h-96 overflow-y-auto space-y-3">
              {Object.keys(groupedResults).length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                  <Search className="w-5 h-5 text-slate-400" />
                  <span>No results matching "{searchQuery}"</span>
                </div>
              ) : (
                Object.entries(groupedResults).map(([category, items]) => (
                  <div key={category} className="space-y-1">
                    <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                      {CATEGORY_ICON_MAP[category] || <Search className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{category}</span>
                    </div>

                    <div className="space-y-0.5">
                      {items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectSearchItem(item.link)}
                          className="w-full flex items-center justify-between p-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors text-left group"
                        >
                          <span className="font-semibold truncate">{item.name}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Notifications Button with Unread Counter */}
        <Link
          to="/dashboard/notifications"
          className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="View notifications (2 unread)"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-indigo-500 text-white text-xs font-bold font-mono ring-2 ring-white dark:ring-[#0a0a0a] shadow-sm">
            2
          </span>
        </Link>
      </div>
    </header>
  );
}


