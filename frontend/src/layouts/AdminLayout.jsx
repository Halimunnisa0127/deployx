import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../features/admin/components/AdminSidebar";
import { DashboardHeader } from "../features/dashboard";

export default function AdminLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans antialiased transition-colors duration-300">
      <AdminSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <DashboardHeader onToggleMobile={() => setIsMobileOpen((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto p-4 md:py-8 md:px-8">
          <div className="max-w-7xl w-full mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
