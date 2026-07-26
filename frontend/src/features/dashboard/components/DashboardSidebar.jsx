import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderGit2,
  Rocket,
  Globe,
  Terminal,
  Settings,
  ChevronsUpDown,
  Check,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  User,
  Shield,
  Search,
  Zap,
  Menu,
  X,
} from 'lucide-react';

import useAuth from '../../../hooks/useAuth';
import { logout } from '../../auth/slice/authSlice';

import Avatar from '../../../components/common/Avatar';
import SearchBar from '../../../components/common/SearchBar';
import Button from '../../../components/ui/Button';
import Dropdown from '../../../components/ui/Dropdown';
import Input from '../../../components/ui/Input';
import ScrollArea from '../../../components/ui/ScrollArea';
import Tooltip from '../../../components/ui/Tooltip';
import SidebarItem from './SidebarItem';
import UserProfileDropdown from './UserProfileDropdown';

const GithubIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// Mock Workspaces list
const INITIAL_WORKSPACES = [
  { id: 'ws-1', name: 'Personal Workspace', plan: 'Hobby', role: 'Owner' },
  { id: 'ws-2', name: 'DeployX Production', plan: 'Pro', role: 'Admin' },
  { id: 'ws-3', name: 'Acme Corp', plan: 'Enterprise', role: 'Member' },
];

// Navigation configuration
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', href: '/dashboard/projects', icon: FolderGit2, badge: '12' },
  { id: 'deployments', label: 'Deployments', href: '/dashboard/deployments', icon: Rocket, badge: 'Live' },
  { id: 'domains', label: 'Domains', href: '/dashboard/domains', icon: Globe },
  { id: 'logs', label: 'Logs', href: '/dashboard/logs', icon: Terminal },
  { id: 'github', label: 'GitHub', href: '/dashboard/github', icon: GithubIcon },
  { id: 'settings', label: 'Settings', href: '/dashboard/settings/profile', icon: Settings },
];

export default function DashboardSidebar({ onToggleMobileExternal }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState(INITIAL_WORKSPACES);
  const [activeWorkspace, setActiveWorkspace] = useState(INITIAL_WORKSPACES[1]);
  const [workspaceSearch, setWorkspaceSearch] = useState('');
  const [navSearchQuery, setNavSearchQuery] = useState('');

  const filteredWorkspaces = useMemo(() => {
    return workspaces.filter((ws) =>
      ws.name.toLowerCase().includes(workspaceSearch.toLowerCase())
    );
  }, [workspaces, workspaceSearch]);

  // Filter NAV_ITEMS in real time based on navSearchQuery
  const filteredNavItems = useMemo(() => {
    if (!navSearchQuery.trim()) return NAV_ITEMS;
    const query = navSearchQuery.toLowerCase().trim();
    return NAV_ITEMS.filter((item) => item.label.toLowerCase().includes(query));
  }, [navSearchQuery]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);
  const toggleMobile = () => {
    setIsMobileOpen((prev) => !prev);
    if (onToggleMobileExternal) onToggleMobileExternal();
  };

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800/80 shadow-2xl relative select-none transition-colors duration-300">
      {/* ── 1. Top Section: Brand Logo & Workspace Switcher ─────────────── */}
      <div className="p-4 flex flex-col gap-3.5 border-b border-slate-200 dark:border-slate-800/60 transition-colors duration-300">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20 flex-shrink-0">
              <Zap className="w-5 h-5 text-white fill-white/20" />
            </div>

            {!isCollapsed && (
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent truncate">
                  DeployX
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  PRO
                </span>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              onClick={toggleMobile}
              aria-label="Close mobile menu"
            >
              <X className="w-5 h-5 text-slate-400" />
            </Button>
          </div>
        </div>

        {/* Workspace Switcher */}
        {!isCollapsed ? (
          <Dropdown
            width="w-64"
            align="left"
            trigger={
              <div className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700/80 transition-all group cursor-pointer shadow-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar name={activeWorkspace.name} size="xs" variant="rounded" />
                  <div className="flex flex-col text-left min-w-0">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {activeWorkspace.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium transition-colors">
                      {activeWorkspace.plan} Plan
                    </span>
                  </div>
                </div>
                <ChevronsUpDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 flex-shrink-0 transition-colors" />
              </div>
            }
          >
            {({ close }) => (
              <div className="p-2 space-y-2">
                <div className="px-1 pt-1 pb-1">
                  <Input
                    placeholder="Filter workspaces..."
                    value={workspaceSearch}
                    onChange={(e) => setWorkspaceSearch(e.target.value)}
                    style={{ marginBottom: 0, padding: '8px 10px', fontSize: '12px' }}
                  />
                </div>

                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pt-1">
                  Workspaces
                </div>

                <ScrollArea maxHeight="160px" className="space-y-1 pr-1">
                  {filteredWorkspaces.map((ws) => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        setActiveWorkspace(ws);
                        close();
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                        activeWorkspace.id === ws.id
                          ? 'bg-indigo-50 dark:bg-indigo-600/15 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-500/20'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar name={ws.name} size="xs" />
                        <span className="truncate">{ws.name}</span>
                      </div>
                      {activeWorkspace.id === ws.id && (
                        <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </ScrollArea>

                <div className="pt-1.5 border-t border-slate-800">
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    iconLeft={<Plus className="w-3.5 h-3.5" />}
                    onClick={() => {
                      close();
                    }}
                    style={{ justifyContent: 'flex-start', fontSize: '12px', padding: '6px 10px' }}
                  >
                    Create Workspace
                  </Button>
                </div>
              </div>
            )}
          </Dropdown>
        ) : (
          <Tooltip content={`Workspace: ${activeWorkspace.name}`} position="right">
            <div className="flex justify-center">
              <Avatar name={activeWorkspace.name} size="sm" variant="rounded" />
            </div>
          </Tooltip>
        )}

        {/* ── Sidebar Navigation Search Bar (Below Workspace Switcher) ───── */}
        {!isCollapsed && (
          <div className="mt-1">
            <SearchBar
              placeholder="Search navigation..."
              value={navSearchQuery}
              onChange={(e) => setNavSearchQuery(e.target.value)}
              onClear={() => setNavSearchQuery('')}
              fullWidth
              size="sm"
            />
          </div>
        )}
      </div>

      {/* ── 2. Main Navigation Items ───────────────────────────────────── */}
      <div className="flex-1 p-3 min-h-0 overflow-hidden">
        <ScrollArea className="h-full space-y-1">
          {!isCollapsed && (
            <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 transition-colors">
              Overview
            </div>
          )}

          {filteredNavItems.length > 0 ? (
            filteredNavItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                href={item.href}
                badge={item.badge}
                isActive={location.pathname === item.href}
                isCollapsed={isCollapsed}
                onClick={() => setIsMobileOpen(false)}
              />
            ))
          ) : (
            <div className="px-3 py-6 text-center text-xs text-slate-400 font-medium">
              No navigation items found
            </div>
          )}
        </ScrollArea>
      </div>

      {/* ── 3. Bottom Section: Collapse Toggle & User Profile ────────────── */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-950/40 space-y-2 transition-colors duration-300">
        {/* Desktop Collapse Toggle */}
        <div className={`hidden md:flex ${isCollapsed ? 'justify-center' : 'justify-end'}`}>
          <Tooltip content={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} position="right">
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              onClick={toggleCollapse}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-slate-400 hover:text-slate-200" />
              ) : (
                <PanelLeftClose className="w-4 h-4 text-slate-400 hover:text-slate-200" />
              )}
            </Button>
          </Tooltip>
        </div>

        {/* User Profile & Account Dropdown */}
        <div>
          {!isCollapsed ? (
            <Dropdown
              width="w-[280px]"
              align="left"
              position="top"
              trigger={
                <div className="w-full flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700/80 transition-all group shadow-sm">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar
                      name={user?.name || user?.email || 'User'}
                      size="sm"
                      status="online"
                    />
                    <div className="flex flex-col text-left min-w-0">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {user?.name || 'Developer'}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate transition-colors">
                        {user?.email || 'user@deployx.dev'}
                      </span>
                    </div>
                  </div>
                  <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 flex-shrink-0 transition-colors" />
                </div>
              }
            >
              {({ close }) => (
                <UserProfileDropdown user={user} close={close} />
              )}
            </Dropdown>
          ) : (
            <Dropdown
              width="w-[280px]"
              align="left"
              position="top"
              trigger={
                <div className="flex justify-center py-1">
                  <Avatar
                    name={user?.name || user?.email || 'User'}
                    size="sm"
                    status="online"
                  />
                </div>
              }
            >
              {({ close }) => (
                <UserProfileDropdown user={user} close={close} />
              )}
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden md:block sticky top-0 h-screen transition-all duration-300 ease-in-out ${sidebarWidth} z-30 flex-shrink-0`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobile}
              className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden fixed top-0 bottom-0 left-0 w-72 z-50"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
