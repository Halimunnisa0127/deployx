import { Outlet, useLocation } from 'react-router-dom';
import SEO from '../components/common/SEO';

export default function AuthLayout() {
  const location = useLocation();

  const getPageMeta = (pathname) => {
    switch (pathname) {
      case '/login':
        return {
          title: 'Sign In – DeployX',
          description: 'Sign in to your DeployX account to manage projects and deployments.',
        };
      case '/forgot-password':
        return {
          title: 'Reset Password – DeployX',
          description: 'Reset your DeployX account password.',
        };
      case '/signup':
      case '/register':
      default:
        return {
          title: 'Create Account – DeployX',
          description: 'Create your DeployX account to deploy GitHub projects.',
        };
    }
  };

  const meta = getPageMeta(location.pathname);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-10">
      <div className="w-full flex justify-center">
        <Outlet />
        <SEO
          title={meta.title}
          description={meta.description}
          robots="noindex,nofollow"
        />
      </div>
    </div>
  );
}

/* ── Styles removed in favor of global CSS variables ── */
