import { lazy, Suspense } from "react";
import PageLoader from "../components/ui/PageLoader";

export const AdminDashboardPage = lazy(() => import("../features/admin/pages/AdminDashboardPage"));
export const UsersPage = lazy(() => import("../features/admin/users/pages/UsersPage"));
export const ProjectsPage = lazy(() => import("../features/admin/projects/pages/ProjectsPage"));
export const AdminDeploymentsPage = lazy(() => import("../features/admin/deployments/pages/DeploymentsPage"));
export const AdminDomainsPage = lazy(() => import("../features/admin/domains/pages/DomainsPage"));
export const AdminPlatformLogsPage = lazy(() => import("../features/admin/logs/pages/PlatformLogsPage"));
export const AnalyticsDashboardPage = lazy(() => import("../features/admin/analytics/pages/AnalyticsDashboardPage"));
export const SystemHealthPage = lazy(() => import("../features/admin/system-health/pages/SystemHealthPage"));
export const PlatformSettingsPage = lazy(() => import("../features/admin/platform-settings/pages/PlatformSettingsPage"));

export const LazyElement = ({ children }) => (
  <Suspense fallback={<PageLoader />}>
    {children}
  </Suspense>
);
