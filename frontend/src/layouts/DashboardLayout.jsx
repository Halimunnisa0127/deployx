import { Outlet } from 'react-router-dom';
import { DashboardSidebar, DashboardHeader } from '../features/dashboard';

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
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0a0a0a] dark:text-slate-100 font-sans antialiased transition-colors duration-300">
      {/* Sidebar placement */}
      <DashboardSidebar />

      {/* Main content layout & responsive spacing */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Shared Application Header */}
        <DashboardHeader />

        {/* Dynamic page content */}
        <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
