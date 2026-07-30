import React, { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import AuthLayout from "../layouts/AuthLayout";
import { Login, Signup, ForgotPassword } from "../features/auth";
import Dashboard from "../features/dashboard/pages/Dashboard";
import { ProjectsList, ProjectDetails } from "../features/projects";
import { SettingsLayout, Profile, Security, Preferences, Billing, DangerZone, UpgradePro } from "../features/settings";
import { Notifications } from "../features/notifications";
import { DeploymentsPage, DeploymentDetailsPage } from "../features/deployments";
import { Domains, DomainDetails } from "../features/domains";
import { Logs } from "../features/logs";
import { Github, RepositoryDetails } from "../features/github";
import PrivateRoute from "../routes/PrivateRoute";
import PageLoader from "../components/ui/PageLoader";
import AdminLayout from "../layouts/AdminLayout";
import AdminRoute from "../routes/AdminRoute";
import AdminLogin from "../features/admin/auth/AdminLogin";

// Lazy-loaded Admin Modules
const AdminDashboardPage = lazy(() => import("../features/admin/pages/AdminDashboardPage"));
const UsersPage = lazy(() => import("../features/admin/users/pages/UsersPage"));
const ProjectsPage = lazy(() => import("../features/admin/projects/pages/ProjectsPage"));
const AdminDeploymentsPage = lazy(() => import("../features/admin/deployments/pages/DeploymentsPage"));
const AdminDomainsPage = lazy(() => import("../features/admin/domains/pages/DomainsPage"));
const AdminPlatformLogsPage = lazy(() => import("../features/admin/logs/pages/PlatformLogsPage"));
const AnalyticsDashboardPage = lazy(() => import("../features/admin/analytics/pages/AnalyticsDashboardPage"));
const SystemHealthPage = lazy(() => import("../features/admin/system-health/pages/SystemHealthPage"));
const PlatformSettingsPage = lazy(() => import("../features/admin/platform-settings/pages/PlatformSettingsPage"));

// Suspense Wrapper Helper
const LazyElement = ({ children }) => (
  <Suspense fallback={<PageLoader />}>
    {children}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },
  
  /* --- Dedicated Admin Auth Portal --- */
  {
    path: "/admin/login",
    element: <AdminLogin />
  },

  /* --- Separate Admin Space --- */
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <LazyElement><AdminDashboardPage /></LazyElement>
      },
      {
        path: "users",
        element: <LazyElement><UsersPage /></LazyElement>
      },
      {
        path: "projects",
        element: <LazyElement><ProjectsPage /></LazyElement>
      },
      {
        path: "deployments",
        element: <LazyElement><AdminDeploymentsPage /></LazyElement>
      },
      {
        path: "domains",
        element: <LazyElement><AdminDomainsPage /></LazyElement>
      },
      {
        path: "logs",
        element: <LazyElement><AdminPlatformLogsPage /></LazyElement>
      },
      {
        path: "analytics",
        element: <LazyElement><AnalyticsDashboardPage /></LazyElement>
      },
      {
        path: "system-health",
        element: <LazyElement><SystemHealthPage /></LazyElement>
      },
      {
        path: "settings",
        element: <LazyElement><PlatformSettingsPage /></LazyElement>
      }
    ]
  },

  /* --- Normal User Dashboard --- */
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/projects",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <ProjectsList />
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/projects/:id",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <ProjectDetails />
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/deployments",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <DeploymentsPage />
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
  
  /* Remove the old /dashboard/admin routing from here entirely! */

  /* --- Normal Routes --- */
  {
    path: "/dashboard/account",
    element: <Navigate to="/dashboard/account/profile" replace />,
  },
  {
    path: "/dashboard/account/profile",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <SettingsLayout>
            <Profile />
          </SettingsLayout>
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/account/security",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <SettingsLayout>
            <Security />
          </SettingsLayout>
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/account/preferences",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <SettingsLayout>
            <Preferences />
          </SettingsLayout>
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/account/billing",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <SettingsLayout>
            <Billing />
          </SettingsLayout>
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/account/danger-zone",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <SettingsLayout>
            <DangerZone />
          </SettingsLayout>
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/settings",
    element: <Navigate to="/dashboard/account/profile" replace />,
  },
  {
    path: "/dashboard/settings/*",
    element: <Navigate to="/dashboard/account/profile" replace />,
  },
  {
    path: "/dashboard/upgrade",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <UpgradePro />
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/notifications",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <Notifications />
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/logs",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <Logs />
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/github",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <Github />
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/github/:id",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <RepositoryDetails />
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/domains",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <Domains />
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/domains/:id",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <DomainDetails />
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/deployments/:id",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <DeploymentDetailsPage />
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
]);

export default router;