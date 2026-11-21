import { useEffect, useState, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DashboardSidebar, DashboardHeader } from '../features/dashboard';
import DeployXAIAssistant from '../features/deployments/components/DeployXAIAssistant';
import FloatingAIAssistant from '../components/ui/FloatingAIAssistant/FloatingAIAssistant';
import { setAIAssistantOpen } from '../store/slices/uiSlice';
import useAuth from '../hooks/useAuth';
import SEO from '../components/common/SEO';

/**
 * DashboardLayout
 * Responsible solely for:
 *  - Sidebar placement
 *  - Application Header placement
 *  - Main content layout
 *  - Responsive structure
 *  - Layout spacing
 */
export default function DashboardLayout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isAIAssistantOpen = useSelector((state) => state.ui.isAIAssistantOpen);

  // Mobile sidebar state lifted here so both Header and Sidebar can share it
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const toggleMobileSidebar = useCallback(() => setIsMobileSidebarOpen((prev) => !prev), []);

  // Automatically route admin users to the Admin Console instead of empty user dashboard
  useEffect(() => {
    if (user?.role === 'admin') {
      const pathMap = {
        '/dashboard': '/admin',
        '/dashboard/projects': '/admin/projects',
        '/dashboard/deployments': '/admin/deployments',
        '/dashboard/domains': '/admin/domains',
        '/dashboard/logs': '/admin/logs',
      };
      const target = pathMap[location.pathname] || '/admin';
      navigate(target, { replace: true });
    }
  }, [user, location.pathname, navigate]);


  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#0a0a0a] dark:text-slate-100 font-sans antialiased transition-colors duration-300">
      {/* Sidebar placement — receives mobile open state from layout */}
      <DashboardSidebar
        isMobileOpenExternal={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main content layout & responsive spacing */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Shared Application Header — receives toggle so hamburger works */}
        <DashboardHeader onToggleMobile={toggleMobileSidebar} />

        {/* Dynamic page content — scrollable area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:py-8 md:px-6 w-full mx-auto">
            {children || <Outlet />}
          </div>
        </div>
      </main>

      {/* Floating AI Assistant Mascot Trigger */}
      <FloatingAIAssistant />

      {/* Global AI Assistant Drawer */}
      <DeployXAIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => dispatch(setAIAssistantOpen(false))}
      />
      <SEO
        title="Dashboard – DeployX"
        description="Manage your DeployX projects and deployments."
        robots="noindex,nofollow"
      />
    </div>
  );
}
