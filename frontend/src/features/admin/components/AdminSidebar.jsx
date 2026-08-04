import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FolderGit2,
  Rocket,
  Globe,
  Terminal,
  Activity,
  Settings,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  ChevronsUpDown,
} from "lucide-react";

import useAuth from "../../../hooks/useAuth";
import Avatar from "../../../components/common/Avatar";
import SearchBar from "../../../components/common/SearchBar";
import Button from "../../../components/ui/Button";
import Dropdown from "../../../components/ui/Dropdown";
import ScrollArea from "../../../components/ui/ScrollArea";
import Tooltip from "../../../components/ui/Tooltip";
import SidebarItem from "../../dashboard/components/SidebarItem";
import UserProfileDropdown from "../../dashboard/components/UserProfileDropdown";

const ADMIN_NAV_ITEMS = [
  { id: "dashboard", label: "Overview", href: "/admin", icon: LayoutDashboard },
  { id: "users", label: "Users", href: "/admin/users", icon: Users },
  {
    id: "projects",
    label: "Projects",
    href: "/admin/projects",
    icon: FolderGit2,
  },
  {
    id: "deployments",
    label: "Deployments",
    href: "/admin/deployments",
    icon: Rocket,
  },
  { id: "domains", label: "Domains", href: "/admin/domains", icon: Globe },
  { id: "logs", label: "Platform Logs", href: "/admin/logs", icon: Terminal },
  {
    id: "analytics",
    label: "Analytics",
    href: "/admin/analytics",
    icon: Activity,
  },
  {
    id: "system-health",
    label: "System Health",
    href: "/admin/system-health",
    icon: ShieldCheck,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar({ onToggleMobileExternal }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState("");

  const filteredNavItems = useMemo(() => {
    if (!navSearchQuery.trim()) return ADMIN_NAV_ITEMS;
    const query = navSearchQuery.toLowerCase().trim();
    return ADMIN_NAV_ITEMS.filter((item) =>
      item.label.toLowerCase().includes(query),
    );
  }, [navSearchQuery]);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);
  const toggleMobile = () => {
    setIsMobileOpen((prev) => !prev);
    if (onToggleMobileExternal) onToggleMobileExternal();
  };

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";

  const sidebarContent = (
    <div className="flex flex-col h-full bg-card text-card-foreground border-r border-border shadow-2xl relative select-none transition-colors duration-300">
      {/* Top Section */}
      <div className="p-4 flex flex-col gap-3.5 border-b border-slate-200 dark:border-slate-800/60 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white truncate">
                  DeployX
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-rose-400">
                  Admin Portal
                </span>
              </div>
            )}
          </div>

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

        {!isCollapsed && (
          <div className="mt-2">
            <SearchBar
              placeholder="Search admin modules..."
              value={navSearchQuery}
              onChange={(e) => setNavSearchQuery(e.target.value)}
              onClear={() => setNavSearchQuery("")}
              fullWidth
              size="sm"
            />
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 p-3 min-h-0 overflow-hidden">
        <ScrollArea className="h-full space-y-1">
          {!isCollapsed && (
            <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 transition-colors">
              Management
            </div>
          )}

          {filteredNavItems.length > 0 ? (
            filteredNavItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={location.pathname === item.href}
                isCollapsed={isCollapsed}
                onClick={() => setIsMobileOpen(false)}
              />
            ))
          ) : (
            <div className="px-3 py-6 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
              No modules found
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Bottom Section */}
      <div className="p-3.5 border-t border-border bg-muted/50 space-y-3 transition-colors duration-300">
        <div
          className={`hidden md:flex ${isCollapsed ? "justify-center" : "justify-end"}`}
        >
          <Tooltip
            content={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            position="right"
          >
            <Button variant="ghost" size="sm" iconOnly onClick={toggleCollapse}>
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-slate-400" />
              ) : (
                <PanelLeftClose className="w-4 h-4 text-slate-400" />
              )}
            </Button>
          </Tooltip>
        </div>

        <div>
          {!isCollapsed ? (
            <Dropdown
              width="w-[280px]"
              align="left"
              position="top"
              trigger={
                <div className="w-full flex items-center justify-between p-2.5 rounded-xl bg-background hover:bg-muted border border-border transition-all duration-200 group shadow-sm cursor-pointer">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar
                      name={user?.name || "Admin"}
                      size="sm"
                      status="online"
                    />
                    <div className="flex flex-col text-left min-w-0 space-y-0.5">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {user?.name || "Administrator"}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate transition-colors">
                        admin@deployx.dev
                      </span>
                    </div>
                  </div>
                  <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
                </div>
              }
            >
              {({ close }) => <UserProfileDropdown user={user} close={close} />}
            </Dropdown>
          ) : (
            <Dropdown
              width="w-[280px]"
              align="left"
              position="top"
              trigger={
                <div className="flex justify-center py-1 cursor-pointer">
                  <Avatar
                    name={user?.name || "Admin"}
                    size="sm"
                    status="online"
                  />
                </div>
              }
            >
              {({ close }) => <UserProfileDropdown user={user} close={close} />}
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden md:block sticky top-0 h-screen transition-all duration-300 ease-in-out ${sidebarWidth} z-30 flex-shrink-0`}
      >
        {sidebarContent}
      </aside>

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
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
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

