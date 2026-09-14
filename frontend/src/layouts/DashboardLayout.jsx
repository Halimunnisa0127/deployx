import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DashboardSidebar, DashboardHeader } from '../features/dashboard';
import DeployXAIAssistant from '../features/deployments/components/DeployXAIAssistant';
import FloatingAIAssistant from '../components/ui/FloatingAIAssistant/FloatingAIAssistant';
import { setAIAssistantOpen } from '../store/slices/uiSlice';
import useAuth from '../hooks/useAuth';

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

  // Automatically route admin users to the Admin Plane instead of empty tenant pages
  useEffect(() => {
    if (user?.role === 'admin') {
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.get('view') !== 'developer') {
        const pathMap = {
          '/dashboard': '/admin',
          '/dashboard/projects': '/admin/projects',
          '/dashboard/deployments': '/admin/deployments',
          '/dashboard/domains': '/admin/domains',
          '/dashboard/logs': '/admin/logs',
        };
        const target = pathMap[location.pathname];
        if (target) {
          navigate(target, { replace: true });
        }
      }
    }
  }, [user, location.pathname, location.search, navigate]);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0a0a0a] dark:text-slate-100 font-sans antialiased transition-colors duration-300">
      {/* Sidebar placement */}
      <DashboardSidebar />

      {/* Main content layout & responsive spacing */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Shared Application Header */}
        <DashboardHeader />

        {/* Dynamic page content */}
        <div className="flex-1 p-4 md:py-8 md:px-6 w-full mx-auto">
          {children || <Outlet />}
        </div>
      </main>

      {/* Floating AI Assistant Mascot Trigger */}
      <FloatingAIAssistant />

      {/* Global AI Assistant Drawer */}
      <DeployXAIAssistant 
        isOpen={isAIAssistantOpen} 
        onClose={() => dispatch(setAIAssistantOpen(false))} 
      />
    </div>
  );
}
