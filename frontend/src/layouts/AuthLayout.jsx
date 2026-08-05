import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-10">
      <div className="w-full flex justify-center">
        <Outlet />
      </div>
    </div>
  );
}

/* ── Styles removed in favor of global CSS variables ── */
