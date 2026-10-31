import { describe, it, expect, beforeEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { StrictMode } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SEO from '../src/components/common/SEO';
import AuthLayout from '../src/layouts/AuthLayout';
import DashboardLayout from '../src/layouts/DashboardLayout';
import AdminLayout from '../src/layouts/AdminLayout';
import OAuthSuccess from '../src/features/auth/pages/OAuthSuccess';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Minimal mock store for layouts
const createMockStore = (initialAuthState = {}) => {
  return configureStore({
    reducer: {
      auth: (state = { user: null, token: null, status: 'idle', ...initialAuthState }) => state,
      ui: (state = { isAIAssistantOpen: false }) => state,
      projects: (state = {}) => state,
      notifications: (state = { items: [] }) => state,
    },
  });
};

describe('SEO Component and Route-Level SEO Tests', () => {
  beforeEach(() => {
    cleanup();
    document.title = 'Default Title';
    // Clean up head tags
    document.querySelectorAll('meta[name="robots"], meta[name="description"], link[rel="canonical"]').forEach((el) => el.remove());
  });

  it('updates title, description, robots, and canonical for public route', () => {
    render(
      <SEO
        title="DeployX – GitHub Deployment Platform"
        description="Deploy GitHub projects with automated builds, deployment monitoring, live logs, rollback workflows and AI-powered build diagnostics using DeployX."
        robots="index,follow"
        canonical="https://deployx-dun.vercel.app/"
      />
    );

    expect(document.title).toBe('DeployX – GitHub Deployment Platform');

    const robotsMeta = document.querySelector('meta[name="robots"]');
    expect(robotsMeta).not.toBeNull();
    expect(robotsMeta?.getAttribute('content')).toBe('index,follow');

    const descMeta = document.querySelector('meta[name="description"]');
    expect(descMeta).not.toBeNull();
    expect(descMeta?.getAttribute('content')).toContain('Deploy GitHub projects');

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).not.toBeNull();
    expect(canonicalLink?.getAttribute('href')).toBe('https://deployx-dun.vercel.app/');
  });

  it('removes canonical link when route does not specify one (auth/dashboard/admin)', () => {
    // Pre-populate canonical as if index.html was served
    const initialCanonical = document.createElement('link');
    initialCanonical.setAttribute('rel', 'canonical');
    initialCanonical.setAttribute('href', 'https://deployx-dun.vercel.app/');
    document.head.appendChild(initialCanonical);

    expect(document.querySelector('link[rel="canonical"]')).not.toBeNull();

    // Render an auth SEO component without canonical
    render(
      <SEO
        title="Sign In – DeployX"
        description="Sign in to your DeployX account."
        robots="noindex,nofollow"
      />
    );

    expect(document.title).toBe('Sign In – DeployX');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex,nofollow');
    // Crucial check: canonical link must be removed so private/auth routes do not inherit it
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });

  it('applies noindex,nofollow and specific metadata via AuthLayout on /login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<div>Login Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(document.title).toBe('Sign In – DeployX');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex,nofollow');
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });

  it('applies noindex,nofollow and specific metadata via AuthLayout on /forgot-password', () => {
    render(
      <MemoryRouter initialEntries={['/forgot-password']}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/forgot-password" element={<div>Forgot Password Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(document.title).toBe('Reset Password – DeployX');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex,nofollow');
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });

  it('applies noindex,nofollow via AuthLayout on /signup and /register', () => {
    render(
      <MemoryRouter initialEntries={['/signup']}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/signup" element={<div>Signup Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(document.title).toBe('Create Account – DeployX');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex,nofollow');
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });

  it('applies noindex,nofollow on OAuthSuccess component', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/oauth/success']}>
          <OAuthSuccess />
        </MemoryRouter>
      </Provider>
    );

    expect(document.title).toBe('Connecting Account – DeployX');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex,nofollow');
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });

  it('applies noindex,nofollow via DashboardLayout on /dashboard routes', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <DashboardLayout>
            <div>Dashboard Content</div>
          </DashboardLayout>
        </MemoryRouter>
      </Provider>
    );

    expect(document.title).toBe('Dashboard – DeployX');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex,nofollow');
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });

  it('applies noindex,nofollow via AdminLayout on /admin routes', () => {
    const store = createMockStore({ user: { role: 'admin' } });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/admin']}>
          <AdminLayout>
            <div>Admin Content</div>
          </AdminLayout>
        </MemoryRouter>
      </Provider>
    );

    expect(document.title).toBe('Admin Dashboard – DeployX');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex,nofollow');
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });

  it('avoids duplicate meta tags when rendered in React StrictMode', () => {
    render(
      <StrictMode>
        <SEO
          title="Strict Mode Test – DeployX"
          description="Testing React StrictMode behavior"
          robots="index,follow"
          canonical="https://deployx-dun.vercel.app/"
        />
      </StrictMode>
    );

    expect(document.title).toBe('Strict Mode Test – DeployX');

    const robotsMetas = document.querySelectorAll('meta[name="robots"]');
    expect(robotsMetas.length).toBe(1);

    const descMetas = document.querySelectorAll('meta[name="description"]');
    expect(descMetas.length).toBe(1);

    const canonicalLinks = document.querySelectorAll('link[rel="canonical"]');
    expect(canonicalLinks.length).toBe(1);
  });
});
