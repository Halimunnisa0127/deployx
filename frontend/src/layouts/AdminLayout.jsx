import { Outlet } from "react-router-dom";
import AdminSidebar from "../features/admin/components/AdminSidebar";
import { DashboardHeader } from "../features/dashboard";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#050505] text-slate-100 font-sans antialiased transition-colors duration-300">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <DashboardHeader />
        <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
