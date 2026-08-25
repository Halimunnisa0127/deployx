import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DashboardSidebar, DashboardHeader } from '../features/dashboard';
import DeployXAIAssistant from '../features/deployments/components/DeployXAIAssistant';
import FloatingAIAssistant from '../components/ui/FloatingAIAssistant/FloatingAIAssistant';
import { setAIAssistantOpen } from '../store/slices/uiSlice';

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
  const isAIAssistantOpen = useSelector((state) => state.ui.isAIAssistantOpen);

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
